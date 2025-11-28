import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, User, Film, Tv, Music, Image, Radio } from "lucide-react";
import { useProfile } from "@/contexts/ProfileContext";
import { movies } from "@/data/movies";
import { MovieCard } from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { Genre } from "@/types/profile";
import { cn } from "@/lib/utils";

const Browse = () => {
  const navigate = useNavigate();
  const { currentProfile, toggleFavorite } = useProfile();
  const [selectedGenre, setSelectedGenre] = useState<Genre | "all">("all");
  const [refreshKey, setRefreshKey] = useState(0);

  const genres: (Genre | "all")[] = ["all", "Documentary", "Action", "War", "Drama"];
  
  const genreLabels: Record<Genre | "all", string> = {
    all: "Todos",
    Documentary: "Documentário",
    Action: "Ação",
    War: "Guerra",
    Drama: "Drama",
  };

  const getMoviesByGenre = (genre: Genre) => {
    return movies.filter((m) => m.genre === genre);
  };

  const getRecommendedMovies = useMemo(() => {
    if (!currentProfile) return [];
    
    const favoriteMovies = movies.filter((m) => 
      currentProfile.favoriteMovies.includes(m.id)
    );
    
    if (favoriteMovies.length > 0) {
      const genreCounts = favoriteMovies.reduce((acc, movie) => {
        acc[movie.genre] = (acc[movie.genre] || 0) + 1;
        return acc;
      }, {} as Record<Genre, number>);
      
      const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0][0] as Genre;
      return getMoviesByGenre(topGenre).slice(0, 4);
    }
    
    return getMoviesByGenre(currentProfile.favoriteGenre).slice(0, 4);
  }, [currentProfile, refreshKey]);

  const fixedMovies = useMemo(() => {
    const genreList: Genre[] = ["Documentary", "Action", "War", "Drama"];
    return genreList.map((genre) => getMoviesByGenre(genre)[0]);
  }, []);

  const displayedMovies = useMemo(() => {
    if (selectedGenre === "all") {
      return [...getRecommendedMovies, ...fixedMovies];
    }
    return getMoviesByGenre(selectedGenre);
  }, [selectedGenre, getRecommendedMovies, fixedMovies]);

  if (!currentProfile) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">NEOFLIX</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setRefreshKey(k => k + 1)}
              className="text-foreground hover:text-primary"
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
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
        {/* Sidebar */}
        <aside className="fixed left-0 top-20 bottom-0 w-64 bg-card border-r border-border p-6 overflow-y-auto">
          <nav className="space-y-2">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-foreground hover:text-primary hover:bg-secondary",
                selectedGenre === "all" && "bg-secondary text-primary"
              )}
              onClick={() => setSelectedGenre("all")}
            >
              <Film className="mr-2 h-4 w-4" />
              Filmes
            </Button>
            {genres.filter(g => g !== "all").map((genre) => (
              <Button
                key={genre}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-foreground hover:text-primary hover:bg-secondary",
                  selectedGenre === genre && "bg-secondary text-primary"
                )}
                onClick={() => setSelectedGenre(genre as Genre)}
              >
                {genreLabels[genre]}
              </Button>
            ))}
            <div className="pt-4 border-t border-border mt-4">
              <Button variant="ghost" className="w-full justify-start text-muted-foreground" disabled>
                <Tv className="mr-2 h-4 w-4" />
                Séries
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground" disabled>
                <Music className="mr-2 h-4 w-4" />
                Música
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground" disabled>
                <Image className="mr-2 h-4 w-4" />
                Fotos
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground" disabled>
                <Radio className="mr-2 h-4 w-4" />
                Rádio
              </Button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {selectedGenre === "all" ? "Filmes" : genreLabels[selectedGenre]}
            </h2>
            {selectedGenre === "all" && (
              <p className="text-muted-foreground">
                Recomendados para você e seleção de cada gênero
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavorite={currentProfile.favoriteMovies.includes(movie.id)}
                onToggleFavorite={() => toggleFavorite(movie.id)}
                onClick={() => navigate(`/movie/${movie.id}`)}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Browse;
