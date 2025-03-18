import React, { useState, useEffect } from "react";
import { useAuth } from '../AuthContext'; // Импортируем хук
import ProfileHeader from './ProfileComponents/ProfileHeader';
import NavBar from './ProfileComponents/NavBar';
import ProfileContent from './ProfileComponents/ProfileContent';
import DefaultAvatar from '../assets/DefaultAvatar.png';

function ProfilePage({ user }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [avatar, setAvatar] = useState(DefaultAvatar);
  const id = user?.id;
  const { currentUserId } = useAuth(); // Получаем currentUserId из контекста

  // Логируем user и id при изменении
  useEffect(() => {
    console.log("ProfilePage user updated:", user);
    console.log("ProfilePage id updated:", id);
  }, [user, id]);

  return (
    <div className="flex w-full min-h-screen bg-black text-white">
      <NavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        avatar={avatar}
      />
      <main className="flex-1 min-h-screen relative">
        {/* Используем key для принудительного обновления ProfileHeader */}
        <ProfileHeader key={id} id={id} currentUserId={currentUserId} />
        <div className="relative z-10 -mt-[20vh]">
          <ProfileContent
            activeTab={activeTab}
            setAvatar={setAvatar}
            avatar={avatar}
          />
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;