import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";
import ProfileHeader from "./ProfileComponents/ProfileHeader";
import NavBar from "./ProfileComponents/NavBar";
import ProfileContent from "./ProfileComponents/ProfileContent";

function ProfilePage({ user }) {
  const { nickname } = useParams();
  const { currentUserId } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Загрузка данных пользователя
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user/${encodeURIComponent(nickname)}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setProfileUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [nickname]);

  if (loading) return <div>Loading...</div>;
  if (!profileUser) return <div>User not found</div>;

  return (
    <div className="flex w-full min-h-screen bg-black text-white">
      <NavBar />
      <main className="flex-1 min-h-screen relative">
        <ProfileHeader key={profileUser.id} id={profileUser.id} currentUserId={currentUserId} />
        <div className="relative z-10 -mt-[20vh]">
          <ProfileContent activeTab="profile" />
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;