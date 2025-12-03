// src/data/movies.ts
import { Movie } from "@/types/profile";

export const movies: Movie[] = [
  // ACTION (8)
  { id: "1", title: "John Wick", genre: "Action", imageUrl: "/movies/johnwick.jpg", description: "Um assassino aposentado volta ao jogo em busca de vingança.", year: 2014, duration: "1h 41m", rating: 7.4 },
  { id: "2", title: "Mad Max: Fury Road", genre: "Action", imageUrl: "/movies/madmax.jpg", description: "Max e Furiosa tentam escapar de um tirano em um deserto pós-apocalíptico.", year: 2015, duration: "2h 0m", rating: 8.1 },
  { id: "3", title: "Mission: Impossible – Fallout", genre: "Action", imageUrl: "/movies/missaoimpossivel.jpg", description: "Ethan Hunt enfrenta sua missão mais perigosa.", year: 2018, duration: "2h 27m", rating: 7.7 },
  { id: "4", title: "The Dark Knight", genre: "Action", imageUrl: "/movies/thedarkknight.jpg", description: "Batman enfrenta o caos instaurado pelo Coringa.", year: 2008, duration: "2h 32m", rating: 9.0 },
  { id: "5", title: "Gladiator", genre: "Action", imageUrl: "/movies/gladiador.jpg", description: "Um general romano busca vingança contra o imperador corrupto.", year: 2000, duration: "2h 35m", rating: 8.5 },
  { id: "6", title: "Inception", genre: "Action", imageUrl: "/movies/aorigem.jpg", description: "Um ladrão entra nos sonhos das pessoas para roubar segredos.", year: 2010, duration: "2h 28m", rating: 8.8 },
  { id: "7", title: "The Matrix", genre: "Action", imageUrl: "/movies/matrix.jpg", description: "Neo descobre a verdade sobre a realidade.", year: 1999, duration: "2h 16m", rating: 8.7 },
  { id: "8", title: "Dune: Part Two", genre: "Action", imageUrl: "/movies/duna2.jpg", description: "Paul Atreides busca vingança enquanto inicia uma revolução.", year: 2024, duration: "2h 46m", rating: 8.9 },

  // ANIMATION (8)
  { id: "9", title: "Spider-Man: Into the Spider-Verse", genre: "Animation", imageUrl: "/movies/spiderman.jpg", description: "Miles Morales descobre o multiverso dos Homens-Aranha.", year: 2018, duration: "1h 57m", rating: 8.4 },
  { id: "10", title: "Shrek", genre: "Animation", imageUrl: "/movies/shrek.jpg", description: "O ogro Shrek parte em uma jornada inesperada para resgatar uma princesa.", year: 2001, duration: "1h 30m", rating: 7.9 },
  { id: "11", title: "Toy Story", genre: "Animation", imageUrl: "/movies/toystory.jpg", description: "Woody e Buzz vivem aventuras quando os brinquedos ganham vida.", year: 1995, duration: "1h 21m", rating: 8.3 },
  { id: "12", title: "Finding Nemo", genre: "Animation", imageUrl: "/movies/nemo.jpg", description: "Um peixe-palhaço cruza o oceano para resgatar seu filho.", year: 2003, duration: "1h 40m", rating: 8.2 },
  { id: "13", title: "Zootopia", genre: "Animation", imageUrl: "/movies/zootopia.jpg", description: "Uma coelha policial e uma raposa vigarista investigam uma conspiração.", year: 2016, duration: "1h 48m", rating: 8.0 },
  { id: "14", title: "Kung Fu Panda", genre: "Animation", imageUrl: "/movies/kungfu.jpg", description: "Po tenta se tornar o lendário Guerreiro Dragão.", year: 2008, duration: "1h 32m", rating: 7.6 },
  { id: "15", title: "How to Train Your Dragon", genre: "Animation", imageUrl: "/movies/comotreinar.jpg", description: "Um jovem viking cria amizade com um dragão raro.", year: 2010, duration: "1h 38m", rating: 8.1 },
  { id: "16", title: "The Lion King", genre: "Animation", imageUrl: "/movies/reileao.jpg", description: "Simba precisa aceitar seu destino como rei.", year: 1994, duration: "1h 28m", rating: 8.5 },

  // COMEDY (8)
  { id: "17", title: "The Hangover", genre: "Comedy", imageUrl: "/movies/sebebernaocase.jpg", description: "Um grupo de amigos tenta lembrar o que aconteceu após uma noite caótica.", year: 2009, duration: "1h 40m", rating: 7.7 },
  { id: "18", title: "Superbad", genre: "Comedy", imageUrl: "/movies/superbad.jpg", description: "Dois amigos vivem situações absurdas antes da formatura.", year: 2007, duration: "1h 59m", rating: 7.6 },
  { id: "19", title: "21 Jump Street", genre: "Comedy", imageUrl: "/movies/anjosdalei.jpg", description: "Dois policiais vão para o colégio disfarçados.", year: 2012, duration: "1h 49m", rating: 7.2 },
  { id: "20", title: "Yes Man", genre: "Comedy", imageUrl: "/movies/yesman.jpg", description: "Um homem muda sua vida dizendo 'sim' para tudo.", year: 2008, duration: "1h 44m", rating: 6.8 },
  { id: "21", title: "Click", genre: "Comedy", imageUrl: "/movies/click.jpg", description: "Um controle remoto mágico permite controlar a própria vida.", year: 2006, duration: "1h 47m", rating: 6.4 },
  { id: "22", title: "Deadpool", genre: "Comedy", imageUrl: "/movies/deadpool.jpg", description: "Um anti-herói irreverente busca vingança.", year: 2016, duration: "1h 48m", rating: 8.0 },
  { id: "23", title: "Night at the Museum", genre: "Comedy", imageUrl: "/movies/umanoitenomuseu.jpg", description: "O museu ganha vida durante a noite.", year: 2006, duration: "1h 48m", rating: 6.5 },
  { id: "24", title: "The Mask", genre: "Comedy", imageUrl: "/movies/maskara.jpg", description: "Um homem encontra uma máscara que lhe concede poderes.", year: 1994, duration: "1h 41m", rating: 6.9 },

  // HORROR (8)
  { id: "25", title: "The Conjuring", genre: "Horror", imageUrl: "/movies/invocacao.jpg", description: "Os Warren investigam uma presença demoníaca em uma casa isolada.", year: 2013, duration: "1h 52m", rating: 7.5 },
  { id: "26", title: "Hereditary", genre: "Horror", imageUrl: "/movies/hereditario.jpg", description: "Uma família é atormentada por um legado sombrio.", year: 2018, duration: "2h 7m", rating: 7.3 },
  { id: "27", title: "It", genre: "Horror", imageUrl: "/movies/it.jpg", description: "Um palhaço demoníaco aterroriza crianças em uma pequena cidade.", year: 2017, duration: "2h 15m", rating: 7.3 },
  { id: "28", title: "The Ring", genre: "Horror", imageUrl: "/movies/ochamado.jpg", description: "Uma fita amaldiçoada mata quem a assiste em sete dias.", year: 2002, duration: "1h 55m", rating: 7.1 },
  { id: "29", title: "A Quiet Place", genre: "Horror", imageUrl: "/movies/umlugarsilencioso.jpg", description: "Uma família deve sobreviver sem fazer qualquer barulho.", year: 2018, duration: "1h 30m", rating: 7.5 },
  { id: "30", title: "Annabelle", genre: "Horror", imageUrl: "/movies/annabelle.jpg", description: "Uma boneca amaldiçoada causa eventos aterrorizantes.", year: 2014, duration: "1h 39m", rating: 5.4 },
  { id: "31", title: "The Exorcist", genre: "Horror", imageUrl: "/movies/oexorcista.jpg", description: "Uma jovem é possuída por uma entidade maligna.", year: 1973, duration: "2h 2m", rating: 8.1 },
  { id: "32", title: "The Nun", genre: "Horror", imageUrl: "/movies/afreira.jpg", description: "Uma freira enfrenta um demônio aterrorizante.", year: 2018, duration: "1h 36m", rating: 5.3 }
];
