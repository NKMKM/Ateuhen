import React, { useEffect, useState } from "react";
import { CameraIcon } from "lucide-react";

const ProfileHeader = ({ id, currentUserId }) => {
  console.log(`ProfileHeader rendered with id: ${id}, currentUserId: ${currentUserId}`); // Логируем id и currentUserId

  const [banner, setBanner] = useState(
    "https://images.unsplash.com/photo-1533747122906-9626d027083e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  );
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const [showBannerButton, setShowBannerButton] = useState(true);

  const isOwner = id === currentUserId;

  // Загрузка баннера
  const fetchBanner = async () => {
    if (!id) {
      console.error("User ID is undefined. Cannot fetch banner."); // Логируем ошибку, если id отсутствует
      return;
    }

    console.log(`Fetching banner for user ID: ${id}`); // Логируем запрос
    try {
      const response = await fetch(`http://localhost:5000/api/user/${id}/banner?${Date.now()}`, {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log("Banner not found, using default banner"); // Логируем ошибку 404
          return;
        }
        throw new Error("Failed to fetch banner");
      }

      const blob = await response.blob();
      const newBannerUrl = URL.createObjectURL(blob);
      console.log("New banner URL:", newBannerUrl); // Логируем новый URL
      setBanner(newBannerUrl);
    } catch (error) {
      console.error("Error fetching banner:", error); // Логируем ошибку
    }
  };

  // Обновление баннера
  const handleBannerChange = async (e) => {
    if (!isOwner) {
      alert("You are not allowed to update this banner.");
      return;
    }

    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5 MB limit.");
        return;
      }

      console.log(`Uploading new banner for user ID: ${id}`); // Логируем запрос
      const formData = new FormData();
      formData.append("banner", file);

      try {
        const response = await fetch(`http://localhost:5000/api/user/${id}/banner`, {
          method: "PUT",
          body: formData,
          credentials: "include",
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to update banner: ${errorText}`);
        }

        const blob = await response.blob();
        const newBannerUrl = URL.createObjectURL(blob);
        console.log("Updated banner URL:", newBannerUrl); // Логируем новый URL
        setBanner(newBannerUrl);
        alert("Banner updated successfully!");
      } catch (error) {
        console.error("Error updating banner:", error); // Логируем ошибку
        alert("Failed to update banner. Please try again.");
      }
    }
  };

  // Обработка прокрутки
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

  // Загрузка баннера при монтировании компонента
  useEffect(() => {
    if (id) {
      console.log("Fetching banner for user ID:", id); // Логируем начало загрузки
      fetchBanner();
    } else {
      console.error("User ID is undefined. Cannot fetch banner."); // Логируем ошибку, если id отсутствует
    }
  }, [id]); // Зависимость от id

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
        {isOwner && showBannerButton && (
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
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;