import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Movie } from "@/types/profile";

interface MovieCardProps {
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClick: () => void;
}

export const MovieCard = ({ movie, isFavorite, onToggleFavorite, onClick }: MovieCardProps) => {
  return (
    <Card className="group relative overflow-hidden bg-card border-border hover:border-primary transition-all duration-300 cursor-pointer">
      <div onClick={onClick} className="aspect-[2/3] relative">
        <img
          src={movie.imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-lg font-semibold text-white mb-1">{movie.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span>{movie.year}</span>
            <span>•</span>
            <span>{movie.duration}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {movie.rating}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-all duration-200"
      >
        <Star
          className={cn(
            "w-5 h-5 transition-all",
            isFavorite ? "fill-yellow-400 text-yellow-400" : "text-white"
          )}
        />
      </button>
    </Card>
  );
};
