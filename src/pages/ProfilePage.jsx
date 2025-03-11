import React, { useState } from "react";
import ProfileHeader from './ProfileComponents/ProfileHeader';
import NavBar from './ProfileComponents/NavBar';
import ProfileContent from './ProfileComponents/ProfileContent';

function ProfilePage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [avatar, setAvatar] = useState(
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80",
    );
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