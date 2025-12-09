import React, { createContext, useContext, useState, useEffect } from "react";
import { Profile, ThemeColor } from "@/types/profile";
import { toggleUserFavorite, deleteUserFromDB  } from "@/data/movieService"; // Importação do serviço

interface ProfileContextType {
  profiles: Profile[];
  currentProfile: Profile | null;
  addProfile: (profile: Omit<Profile, "id" | "favoriteMovies">) => void;
  selectProfile: (profileId: string) => void;
  deleteProfile: (profileId: string) => void;
  toggleFavorite: (movieId: string) => void;
  setThemeColor: (color: ThemeColor) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem("neoflix-profiles");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(() => {
    const saved = localStorage.getItem("neoflix-current-profile");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem("neoflix-profiles", JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    if (currentProfile) {
      localStorage.setItem("neoflix-current-profile", JSON.stringify(currentProfile));
      document.body.className = `theme-${currentProfile.themeColor}`;
    }
  }, [currentProfile]);

  const addProfile = (profileData: Omit<Profile, "id" | "favoriteMovies">) => {
    const newProfile: Profile = {
      ...profileData,
      id: Date.now().toString(),
      favoriteMovies: [],
    };
    setProfiles([...profiles, newProfile]);
    setCurrentProfile(newProfile);
  };

  const selectProfile = (profileId: string) => {
    const profile = profiles.find((p) => p.id === profileId);
    if (profile) {
      setCurrentProfile(profile);
    }
  };

  const deleteProfile = (profileId: string) => {
    const updatedProfiles = profiles.filter((p) => p.id !== profileId);
    setProfiles(updatedProfiles);
    
    if (currentProfile?.id === profileId) {
      setCurrentProfile(null);
      localStorage.removeItem("neoflix-current-profile");
    }

    deleteUserFromDB(profileId)
      .then(() => console.log(`User ${profileId} deleted from DB`))
      .catch((err) => console.error("Failed to delete user from DB", err));
  };

  // --- FUNÇÃO ATUALIZADA COM LÓGICA DO NEO4J ---
  const toggleFavorite = (movieId: string) => {
    if (!currentProfile) return;

    const isFavoriting = !currentProfile.favoriteMovies.includes(movieId);

    // 1. Atualização
    const updatedProfile = {
      ...currentProfile,
      favoriteMovies: isFavoriting
        ? [...currentProfile.favoriteMovies, movieId]
        : currentProfile.favoriteMovies.filter((id) => id !== movieId),
    };

    setCurrentProfile(updatedProfile);
    setProfiles(profiles.map((p) => (p.id === updatedProfile.id ? updatedProfile : p)));

    // 2. Chamada ao Neo4j (Background)
    toggleUserFavorite(currentProfile.id, movieId, isFavoriting)
      .then(() => console.log("Neo4j graph updated"))
      .catch((err) => console.error("Neo4j update failed", err));
  };

  const setThemeColor = (color: ThemeColor) => {
    if (!currentProfile) return;

    const updatedProfile = {
      ...currentProfile,
      themeColor: color,
    };

    setCurrentProfile(updatedProfile);
    setProfiles(profiles.map((p) => (p.id === updatedProfile.id ? updatedProfile : p)));
  };

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        currentProfile,
        addProfile,
        selectProfile,
        deleteProfile,
        toggleFavorite,
        setThemeColor,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }
  return context;
};