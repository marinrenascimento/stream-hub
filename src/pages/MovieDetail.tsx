import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"; 
import { ArrowLeft, Star, Play } from "lucide-react";
// import { movies } from "@/data/movies";
import { getMovieById } from "@/data/movieService";
import { useProfile } from "@/contexts/ProfileContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Movie } from "@/types/profile";


const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProfile, toggleFavorite } = useProfile();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
        setLoading(true);
        getMovieById(id).then((fetchedMovie) => {
            setMovie(fetchedMovie);
            setLoading(false);
        });
    }
  }, [id]);
  
  if (loading) return <div className="min-h-screen bg-background text-white p-12">Carregando detalhes...</div>;

  if (!movie || !currentProfile) {
    navigate("/browse");
    return null;
  }

  const isFavorite = currentProfile.favoriteMovies.includes(movie.id);

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[70vh]">
        <img
          src={movie.imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <Button
          variant="ghost"
          onClick={() => navigate("/browse")}
          className="absolute top-6 left-6 text-white hover:text-primary z-10"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Voltar
        </Button>

        <div className="absolute bottom-0 left-0 right-0 p-12">
          <div className="max-w-4xl">
            <h1 className="text-6xl font-bold text-white mb-4">{movie.title}</h1>
            <div className="flex items-center gap-4 text-lg text-gray-300 mb-6">
              <span>{movie.year}</span>
              <span>•</span>
              <span>{movie.duration}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                {movie.rating}
              </span>
              <span>•</span>
              <span className="px-3 py-1 rounded bg-primary/20 text-primary border border-primary/30">
                {movie.genre}
              </span>
            </div>

            <div className="flex gap-4 mb-6">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Play className="mr-2 h-5 w-5" />
                Assistir
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => toggleFavorite(movie.id)}
                className={cn(
                  "border-border hover:bg-secondary",
                  isFavorite && "bg-secondary"
                )}
              >
                <Star
                  className={cn(
                    "mr-2 h-5 w-5",
                    isFavorite && "fill-yellow-400 text-yellow-400"
                  )}
                />
                {isFavorite ? "Favoritado" : "Favoritar"}
              </Button>
            </div>

            <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
              {movie.description}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-12 py-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Sobre o Filme</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Sinopse</h3>
            <p className="text-muted-foreground leading-relaxed">{movie.description}</p>
              {movie.cast && movie.cast.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Elenco</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.cast.map((actor) => (
                      <span key={actor} className="px-3 py-1 bg-secondary rounded-full text-sm text-secondary-foreground border border-border">
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Informações</h3>
              <dl className="space-y-2">
                <div className="flex">
                  <dt className="text-muted-foreground w-32">Gênero:</dt>
                  <dd className="text-foreground">{movie.genre}</dd>
                </div>
                <div className="flex">
                  <dt className="text-muted-foreground w-32">Ano:</dt>
                  <dd className="text-foreground">{movie.year}</dd>
                </div>
                <div className="flex">
                  <dt className="text-muted-foreground w-32">Duração:</dt>
                  <dd className="text-foreground">{movie.duration}</dd>
                </div>
                <div className="flex">
                  <dt className="text-muted-foreground w-32">Avaliação:</dt>
                  <dd className="text-foreground flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {movie.rating}/10
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
