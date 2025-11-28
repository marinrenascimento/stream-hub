import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useProfile } from "@/contexts/ProfileContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ThemeColor } from "@/types/profile";
import { cn } from "@/lib/utils";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { currentProfile, setThemeColor } = useProfile();

  if (!currentProfile) {
    navigate("/");
    return null;
  }

  const themeOptions: { color: ThemeColor; label: string; class: string }[] = [
    { color: "blue", label: "Azul", class: "bg-blue-500" },
    { color: "green", label: "Verde", class: "bg-green-500" },
    { color: "pink", label: "Rosa", class: "bg-pink-300" },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/browse")}
          className="mb-8 text-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Card className="p-8 bg-card border-border">
          <h1 className="text-3xl font-bold mb-8 text-foreground">Configurações do Perfil</h1>

          <div className="space-y-6">
            <div>
              <Label className="text-lg font-semibold mb-4 block">Informações</Label>
              <dl className="space-y-3">
                <div>
                  <dt className="text-muted-foreground">Nome:</dt>
                  <dd className="text-foreground font-medium">{currentProfile.name}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Usuário:</dt>
                  <dd className="text-foreground font-medium">{currentProfile.username}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">E-mail:</dt>
                  <dd className="text-foreground font-medium">{currentProfile.email}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Gênero Favorito:</dt>
                  <dd className="text-foreground font-medium">{currentProfile.favoriteGenre}</dd>
                </div>
              </dl>
            </div>

            <div className="pt-6 border-t border-border">
              <Label className="text-lg font-semibold mb-4 block">Cor do Tema</Label>
              <div className="grid grid-cols-3 gap-4">
                {themeOptions.map((option) => (
                  <button
                    key={option.color}
                    onClick={() => setThemeColor(option.color)}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all",
                      currentProfile.themeColor === option.color
                        ? "border-primary bg-secondary"
                        : "border-border hover:border-muted-foreground"
                    )}
                  >
                    <div className={cn("w-full h-12 rounded mb-2", option.class)} />
                    <p className="text-sm font-medium text-foreground">{option.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <Label className="text-lg font-semibold mb-2 block">Filmes Favoritos</Label>
              <p className="text-muted-foreground">
                {currentProfile.favoriteMovies.length} filmes favoritados
              </p>
            </div>
          </div>

          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="w-full mt-8 border-border hover:bg-secondary"
          >
            Trocar de Perfil
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSettings;
