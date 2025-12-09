import { readQuery, writeQuery } from '@/lib/neo4j';
import { Movie } from '@/types/profile';

// --- FUNÇÃO AUXILIAR DE LIMPEZA ---
const normalizeNeo4jData = (data: any): any => {
  if (data === null || data === undefined) return data;
  if (typeof data === 'object' && data.low !== undefined && data.high !== undefined) {
    return data.low;
  }
  if (Array.isArray(data)) {
    return data.map(normalizeNeo4jData);
  }
  if (typeof data === 'object') {
    const newObj: any = {};
    for (const key in data) {
      newObj[key] = normalizeNeo4jData(data[key]);
    }
    return newObj;
  }
  return data;
};

export const getRecommendedMovies = async (userId: string): Promise<Movie[]> => {
  const cypher = `
    MATCH (u:User {id: $userId})
    
    // 1. Encontra filmes candidatos (exclui os já favoritados)
    MATCH (t:Title)
    WHERE NOT (u)-[:FAVORITED]->(t)

    // 2. Calcula peso do Gênero
    OPTIONAL MATCH (t)-[:HAS_GENRE]->(g:Genre)
    OPTIONAL MATCH (u)-[rg:LIKES_GENRE]->(g)
    WITH u, t, COALESCE(rg.score, 0.0) as genreWeight

    // 3. Calcula peso do Ator (Soma dos scores)
    OPTIONAL MATCH (t)<-[:ACTED_IN]-(a:Person)
    OPTIONAL MATCH (u)-[ra:LIKES_ACTOR]->(a)
    WITH t, genreWeight, sum(COALESCE(ra.score, 0.0)) as actorWeight

    // 4. Score Final + Fator Aleatório
    // O rand() varia de 0.0 a 1.0. 
    // Somar ele ao peso faz com que a lista varie a cada refresh, 
    // mas mantenha a tendência dos favoritos no topo.
    WITH t, (genreWeight + actorWeight) as baseScore
    WITH t, (baseScore + (rand() * 0.5)) as probabilisticScore 
    
    RETURN t { .* } as movie, probabilisticScore
    ORDER BY probabilisticScore DESC
    LIMIT 20
  `;

  const result = await readQuery(cypher, { userId });
  return normalizeNeo4jData(result.map((row: any) => row.movie));
};

export const getMoviesByGenre = async (genre: string): Promise<Movie[]> => {
  const cypher = `
    MATCH (t:Title)-[:HAS_GENRE]->(g:Genre)
    WHERE g.name = $genre
    RETURN t { .* } as movie
    ORDER BY rand() 
    LIMIT 10
  `;
  const result = await readQuery(cypher, { genre });
  return normalizeNeo4jData(result.map((row: any) => row.movie));
};

export const getMovieById = async (movieId: string): Promise<any | null> => {
  const cypher = `
    MATCH (t:Title {id: $movieId})
    OPTIONAL MATCH (t)<-[:ACTED_IN]-(p:Person)
    RETURN t { .* } as movie, collect(p.name) as cast
  `;
  const result = await readQuery(cypher, { movieId });
  if (result.length === 0) return null;
  
  const cleanMovie = normalizeNeo4jData(result[0].movie);
  cleanMovie.cast = result[0].cast; 
  return cleanMovie;
};

export const toggleUserFavorite = async (userId: string, movieId: string, isFavoriting: boolean) => {
  if (isFavoriting) {
    // --- FAVORITAR
    const cypher = `
      MERGE (u:User {id: $userId})
      MERGE (t:Title {id: $movieId})
      MERGE (u)-[:FAVORITED]->(t)
      
      // Boost Gênero
      WITH u, t
      MATCH (t)-[:HAS_GENRE]->(g:Genre)
      MERGE (u)-[rg:LIKES_GENRE]->(g)
      // Começa com 0.4. Máximo 1.0. Incremento 0.2.
      ON CREATE SET rg.score = 0.4
      ON MATCH SET rg.score = CASE WHEN rg.score + 0.2 >= 1.0 THEN 1.0 ELSE rg.score + 0.2 END

      // Boost Ator
      WITH u, t
      MATCH (t)<-[:ACTED_IN]-(a:Person)
      MERGE (u)-[ra:LIKES_ACTOR]->(a)
      // Começa com 0.4. Máximo 2.0. Incremento 0.2.
      ON CREATE SET ra.score = 0.4
      ON MATCH SET ra.score = CASE WHEN ra.score + 0.2 >= 2.0 THEN 2.0 ELSE ra.score + 0.2 END
    `;
    await writeQuery(cypher, { userId, movieId });
  } else {
    // --- DESFAVORITAR
    const cypher = `
      MATCH (u:User {id: $userId})
      MATCH (t:Title {id: $movieId})
      MATCH (u)-[f:FAVORITED]->(t)

      // 1. Reduzir Gênero
      WITH u, t, f
      OPTIONAL MATCH (t)-[:HAS_GENRE]->(g:Genre)
      OPTIONAL MATCH (u)-[rg:LIKES_GENRE]->(g)
      FOREACH (_ IN CASE WHEN rg IS NOT NULL THEN [1] ELSE [] END |
        SET rg.score = CASE 
          WHEN rg.score - 0.3 < 0 THEN 0 
          ELSE rg.score - 0.3 
        END
      )

      // 2. Reduzir Ator
      WITH u, t, f
      OPTIONAL MATCH (t)<-[:ACTED_IN]-(a:Person)
      OPTIONAL MATCH (u)-[ra:LIKES_ACTOR]->(a)
      FOREACH (_ IN CASE WHEN ra IS NOT NULL THEN [1] ELSE [] END |
        SET ra.score = CASE 
          WHEN ra.score - 0.3 < 0 THEN 0 
          ELSE ra.score - 0.3 
        END
      )

      // 3. LIMPEZA DE LIXO
      // Deleta qualquer relação que tenha ficado irrelevante (<= 0.1 ou 0)
      WITH u, f
      MATCH (u)-[r:LIKES_GENRE|LIKES_ACTOR]->()
      WHERE r.score <= 0.1
      DELETE r

      // 4. Remove o Favorito
      WITH f
      DELETE f
    `;
    await writeQuery(cypher, { userId, movieId });
  }
};

export const ensureUserInDB = async (profile: any) => {
  const cypher = `
    MERGE (u:User {id: $id})
    ON CREATE SET u.name = $name, u.email = $email
  `;
  await writeQuery(cypher, { id: profile.id, name: profile.name, email: profile.email || '' });
  
  if (profile.favoriteGenre) {
    const prefCypher = `
      MATCH (u:User {id: $id})
      MATCH (g:Genre {name: $genre})
      MERGE (u)-[r:LIKES_GENRE]->(g)
      // Peso inicial moderado (0.3)
      ON CREATE SET r.score = 0.3 
    `;
    await writeQuery(prefCypher, { id: profile.id, genre: profile.favoriteGenre });
  }
};

export const deleteUserFromDB = async (userId: string) => {
  const cypher = `
    MATCH (u:User {id: $userId})
    DETACH DELETE u
  `;
  await writeQuery(cypher, { userId });
};