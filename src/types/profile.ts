export type Genre = "Documentary" | "Action" | "War" | "Drama";
export type ThemeColor = "blue" | "green" | "pink";

export interface Profile {
  id: string;
  name: string;
  username: string;
  email: string;
  favoriteGenre: Genre;
  themeColor: ThemeColor;
  favoriteMovies: string[];
}

export interface Movie {
  id: string;
  title: string;
  genre: Genre;
  imageUrl: string;
  description: string;
  year: number;
  duration: string;
  rating: number;
}
