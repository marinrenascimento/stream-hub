import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, User, Film, Star } from "lucide-react";
import { useProfile } from "@/contexts/ProfileContext";
import { MovieCard } from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { Genre, Movie } from "@/types/profile";
import { cn } from "@/lib/utils";
import { getRecommendedMovies, getMoviesByGenre, ensureUserInDB } from "@/data/movieService";

const Browse = () => {
  const navigate = useNavigate();
  const { currentProfile, toggleFavorite } = useProfile();
  const [selectedSection, setSelectedSection] = useState<Genre | "all" | "favorites">("all");
  
  // Estado dos dados
  const [recommended, setRecommended] = useState<Movie[]>([]);
  const [genreLists, setGenreLists] = useState<Record<string, Movie[]>>({});
  const [loading, setLoading] = useState(true);

  const genres: Genre[] = ["Action", "Animation", "Comedy", "Horror"];

  const genreLabels: Record<Genre, string> = {
    Action: "Ação",
    Animation: "Animação",
    Comedy: "Comédia",
    Horror: "Terror",
  };

  // Carregar dados do Neo4j
  useEffect(() => {
    if (!currentProfile) {
      navigate("/");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        await ensureUserInDB(currentProfile);
        
        // Busca paralela
        const [recs, ...genreResults] = await Promise.all([
          getRecommendedMovies(currentProfile.id),
          ...genres.map(g => getMoviesByGenre(g))
        ]);

        setRecommended(recs);
        
        const lists: Record<string, Movie[]> = {};
        genres.forEach((g, index) => {
          lists[g] = genreResults[index];
        });
        setGenreLists(lists);

      } catch (error) {
        console.error("Neo4j Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentProfile]);

  const handleRefresh = async () => {
    if (currentProfile) {
      setLoading(true);
      try {
        const [recs, ...genreResults] = await Promise.all([
          getRecommendedMovies(currentProfile.id),
          ...genres.map(g => getMoviesByGenre(g))
        ]);

        setRecommended(recs);

        const lists: Record<string, Movie[]> = {};
        genres.forEach((g, index) => {
          lists[g] = genreResults[index];
        });
        setGenreLists(lists);
        
      } catch (error) {
        console.error("Refresh failed:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!currentProfile) return null;
  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-white">Carregando...</div>;

  // 1. Top 4 Recomendados
  const topMovies = recommended.slice(0, 4);

  // 2. Um filme de cada gênero para a seção "Seleção por Gênero"
  const bottomMovies = genres
    .map(genre => genreLists[genre]?.[0])
    .filter(Boolean);

  // Lógica para filtrar quando o usuário clica no menu lateral
  const getDisplayList = () => {
    if (selectedSection === 'favorites') {
      const allMovies = [...recommended, ...Object.values(genreLists).flat()];
      // Remove duplicatas pelo ID
      const uniqueMovies = Array.from(new Map(allMovies.map(m => [m.id, m])).values());
      return uniqueMovies.filter(m => currentProfile.favoriteMovies.includes(m.id));
    }
    return genreLists[selectedSection] || [];
  };

  const listForSection = getDisplayList();

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">NEOFLIX</h1>
          <div className="flex items-center gap-4">
            {selectedSection === "all" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                className="text-foreground hover:text-primary"
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/profile-settings")}
              className="text-foreground hover:text-primary"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex pt-20">
        <aside className="fixed left-0 top-20 bottom-0 w-64 bg-card border-r border-border p-6 overflow-y-auto">
          <nav className="space-y-2">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-foreground hover:text-primary hover:bg-secondary",
                selectedSection === "all" && "bg-secondary text-primary"
              )}
              onClick={() => setSelectedSection("all")}
            >
              <Film className="mr-2 h-4 w-4" />
              Filmes
            </Button>

            {genres.map((genre) => (
              <Button
                key={genre}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-foreground hover:text-primary hover:bg-secondary",
                  selectedSection === genre && "bg-secondary text-primary"
                )}
                onClick={() => setSelectedSection(genre)}
              >
                {genreLabels[genre]}
              </Button>
            ))}

            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-foreground hover:text-primary hover:bg-secondary",
                selectedSection === "favorites" && "bg-secondary text-primary"
              )}
              onClick={() => setSelectedSection("favorites")}
            >
              <Star className="mr-2 h-4 w-4" />
              Favoritos
            </Button>
          </nav>
        </aside>

        <main className="ml-64 flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {selectedSection === "all"
                ? "Filmes"
                : selectedSection === "favorites"
                ? "Favoritos"
                : genreLabels[selectedSection]}
            </h2>
          </div>

          {/* VISÃO GERAL (HOME) */}
          {selectedSection === "all" && (
            <>
              {/* SEÇÃO 1: RECOMENDADOS (MÁX 4) */}
              <h3 className="text-xl font-semibold mb-3 text-primary">Recomendados para {currentProfile.name}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                {topMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isFavorite={currentProfile.favoriteMovies.includes(movie.id)}
                    onToggleFavorite={() => toggleFavorite(movie.id)}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  />
                ))}
              </div>

              {/* SEÇÃO 2: UM DE CADA GÊNERO (MÁX 4) */}
              <h3 className="text-xl font-semibold mb-3 text-primary">Seleção por Gênero</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {bottomMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isFavorite={currentProfile.favoriteMovies.includes(movie.id)}
                    onToggleFavorite={() => toggleFavorite(movie.id)}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  />
                ))}
              </div>
            </>
          )}

          {/* VISÃO FILTRADA (MENU LATERAL) */}
          {selectedSection !== "all" && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {listForSection.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isFavorite={currentProfile.favoriteMovies.includes(movie.id)}
                  onToggleFavorite={() => toggleFavorite(movie.id)}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Browse;