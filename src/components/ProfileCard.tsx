import { User, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProfileCardProps {
  name: string;
  onClick: () => void;
  onDelete?: () => void;
}

export const ProfileCard = ({ name, onClick, onDelete }: ProfileCardProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer bg-secondary hover:bg-accent border-border hover:border-primary transition-all duration-300 overflow-hidden relative"
    >
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 bg-destructive/80 hover:bg-destructive text-destructive-foreground"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
      <div className="aspect-square flex flex-col items-center justify-center p-6">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <User className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>
      </div>
    </Card>
  );
};
