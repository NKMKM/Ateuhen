import React, { useState } from "react";
import ProfileHeader from './ProfileComponents/ProfileHeader';
import NavBar from './ProfileComponents/NavBar';
import ProfileContent from './ProfileComponents/ProfileContent';
import DefaultAvatar from '../assets/DefaultAvatar.png'
function ProfilePage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [avatar, setAvatar] = useState(DefaultAvatar);
  return (
    <div className="flex w-full min-h-screen bg-black text-white">
      <NavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        avatar={avatar}
      />
      <main className="flex-1 min-h-screen relative">
        <ProfileHeader />
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