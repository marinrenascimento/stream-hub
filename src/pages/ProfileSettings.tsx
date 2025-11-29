import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useProfile } from "@/contexts/ProfileContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { currentProfile } = useProfile();

  if (!currentProfile) {
    navigate("/");
    return null;
  }


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
