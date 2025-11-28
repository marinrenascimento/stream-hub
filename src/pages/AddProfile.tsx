import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useProfile } from "@/contexts/ProfileContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Genre, ThemeColor } from "@/types/profile";
import { toast } from "sonner";

const AddProfile = () => {
  const navigate = useNavigate();
  const { addProfile } = useProfile();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [favoriteGenre, setFavoriteGenre] = useState<Genre | "">("");
  const [themeColor] = useState<ThemeColor>("blue");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !username || !email || !favoriteGenre) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    addProfile({
      name,
      username,
      email,
      favoriteGenre: favoriteGenre as Genre,
      themeColor,
    });

    toast.success("Perfil criado com sucesso!");
    navigate("/browse");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="max-w-2xl w-full">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8 text-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Card className="p-8 bg-card border-border">
          <h1 className="text-3xl font-bold mb-8 text-foreground">Criar Perfil</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome"
                className="bg-secondary border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Nome de Usuário</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu nome de usuário"
                className="bg-secondary border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                className="bg-secondary border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Gênero Favorito</Label>
              <Select value={favoriteGenre} onValueChange={(value) => setFavoriteGenre(value as Genre)}>
                <SelectTrigger className="bg-secondary border-border text-foreground">
                  <SelectValue placeholder="Selecione um gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Documentary">Documentário</SelectItem>
                  <SelectItem value="Action">Ação</SelectItem>
                  <SelectItem value="War">Guerra</SelectItem>
                  <SelectItem value="Drama">Drama</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Salvar Perfil
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddProfile;
