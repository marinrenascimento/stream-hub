import { User } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ProfileCardProps {
  name: string;
  onClick: () => void;
}

export const ProfileCard = ({ name, onClick }: ProfileCardProps) => {
  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer bg-secondary hover:bg-accent border-border hover:border-primary transition-all duration-300 overflow-hidden"
    >
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
