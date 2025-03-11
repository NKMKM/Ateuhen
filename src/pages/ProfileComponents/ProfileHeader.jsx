import React, { useEffect, useState } from "react";
import { CameraIcon } from "lucide-react";

const ProfileHeader = () => {
  const [banner, setBanner] = useState(
    "https://images.unsplash.com/photo-1533747122906-9626d027083e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  );
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const [showBannerButton, setShowBannerButton] = useState(true);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const opacity = Math.min(scrollPosition / 400, 0.85);
      setScrollOpacity(opacity);
      setShowBannerButton(scrollPosition < 100);
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setBanner(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="sticky top-0 z-0">
      <div
        className="h-[40vh] w-full bg-cover bg-center relative grayscale"
        style={{
          backgroundImage: `url(${banner})`,
        }}
      >
        <div
          className="absolute inset-0 bg-black transition-opacity duration-300"
          style={{
            opacity: scrollOpacity,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black" />
        <label className="absolute right-6 top-6 bg-black/80 text-white p-3 cursor-pointer hover:bg-white hover:text-black transition-all z-10 rounded flex items-center gap-2">
          <input
            type="file"
            className="hidden"
            onChange={handleBannerChange}
            accept="image/*"
          />
          <CameraIcon size={20} />
          <span className="text-sm">Change Banner</span>
        </label>
      </div>
    </div>
  );
};

export default ProfileHeader;