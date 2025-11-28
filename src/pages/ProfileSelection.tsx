import { useNavigate } from "react-router-dom";
import { useProfile } from "@/contexts/ProfileContext";
import { ProfileCard } from "@/components/ProfileCard";
import { AddProfileCard } from "@/components/AddProfileCard";

const ProfileSelection = () => {
  const navigate = useNavigate();
  const { profiles, selectProfile } = useProfile();

  const handleProfileClick = (profileId: string) => {
    selectProfile(profileId);
    navigate("/browse");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8">
      <div className="max-w-6xl w-full">
        <h1 className="text-5xl font-bold text-center mb-12 text-foreground">
          Quem está assistindo?
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              name={profile.name}
              onClick={() => handleProfileClick(profile.id)}
            />
          ))}
          <AddProfileCard onClick={() => navigate("/add-profile")} />
        </div>
      </div>
    </div>
  );
};

export default ProfileSelection;
