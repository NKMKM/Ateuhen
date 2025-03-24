import React, { useState, useEffect } from "react";
import {
  UserPlusIcon,
  MessageSquareIcon,
  EditIcon,
  TwitterIcon,
  TwitchIcon,
  YoutubeIcon,
  ThumbsUpIcon,
  ShieldCheckIcon,
  AlertCircleIcon,
  PencilIcon,
  UsersIcon,
  TrophyIcon,
  ClockIcon,
  PlayIcon,
  CircleIcon,
  CrownIcon,
  SwordIcon,
  CrosshairIcon,
} from "lucide-react";

const ProfileContent = ({ activeTab, nickname, profileUser }) => {
  const [avatar, setAvatar] = useState(profileUser.avatar || "");
  const [stats, setStats] = useState({
    totalMatches: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
  });
  const [friends, setFriends] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [activity, setActivity] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [socialMedia, setSocialMedia] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);

  // Загрузка статистики
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user/${nickname}/stats`);
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [nickname]);
  const fetchAvatar = async (nickname) => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/${nickname}/avatar`);
      if (response.ok) {
        const avatarUrl = `http://localhost:5000/api/user/${nickname}/avatar?${Date.now()}`;
        setAvatar(avatarUrl);
      } else {
        console.error("Avatar not found");
        setAvatar("default-avatar.png"); // Fallback to a default avatar
      }
    } catch (error) {
      console.error("Error fetching avatar:", error);
      setAvatar("default-avatar.png"); // Fallback to a default avatar
    }
  };
  
  // Используйте fetchAvatar при загрузке профиля
  useEffect(() => {
    fetchAvatar(nickname);
  }, [nickname]);
  // Загрузка друзей
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user/${nickname}/friends`);
        if (!response.ok) throw new Error("Failed to fetch friends");
        const data = await response.json();
        setFriends(data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, [nickname]);

  // Загрузка турниров
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user/${nickname}/tournaments`);
        if (!response.ok) throw new Error("Failed to fetch tournaments");
        const data = await response.json();
        setTournaments(data);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      }
    };

    fetchTournaments();
  }, [nickname]);

  // Загрузка активности
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user/${nickname}/activity`);
        if (!response.ok) throw new Error("Failed to fetch activity");
        const data = await response.json();
        setActivity(data);
      } catch (error) {
        console.error("Error fetching activity:", error);
      }
    };

    fetchActivity();
  }, [nickname]);

  // Загрузка хайлайтов
  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user/${nickname}/highlights`);
        if (!response.ok) throw new Error("Failed to fetch highlights");
        const data = await response.json();
        setHighlights(data);
      } catch (error) {
        console.error("Error fetching highlights:", error);
      }
    };

    fetchHighlights();
  }, [nickname]);

  // Загрузка социальных сетей
  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user/${nickname}/social-media`);
        if (!response.ok) throw new Error("Failed to fetch social media");
        const data = await response.json();
        setSocialMedia(data);
      } catch (error) {
        console.error("Error fetching social media:", error);
      }
    };

    fetchSocialMedia();
  }, [nickname]);

  // Обработка загрузки нового аватара
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch(`http://localhost:5000/api/user/${nickname}/avatar`, {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        const blob = await response.blob();
        setAvatar(URL.createObjectURL(blob));
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  if (activeTab === "profile") {
    return (
      <div className="ml-20">
        <div className="px-8 py-6 bg-gradient-to-b from-transparent to-black text-white min-h-screen">
          <div className="flex gap-8">
            <div className="flex-1 space-y-6">
              {/* Аватар и основная информация */}
              <div className="relative">
                <div className="flex gap-6">
                  <div className="top-3 relative group">
                    <img
                      src={avatar || "default-avatar.png"}
                      alt="Profile Avatar"
                      className="w-32 h-32 rounded border-4 border-black object-cover grayscale"
                    />
                    <label className="absolute bottom-7 right-0 bg-black/80 text-white p-3 cursor-pointer hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 z-10">
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleAvatarChange}
                        accept="image/*"
                      />
                      <PencilIcon size={16} />
                    </label>
                    {isStreaming && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 px-2 py-1 rounded">
                        <CircleIcon size={8} className="text-red-500 fill-red-500" />
                        <span className="text-xs">LIVE</span>
                      </div>
                    )}
                  </div>
                  <div className="pt-4 backdrop-blur-sm bg-black/30 p-4 rounded-lg flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold tracking-tight">
                          {profileUser.nickname}
                        </h1>
                        <CrownIcon size={20} className="text-white/60" />
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="bg-black/80 text-white p-2 hover:bg-white hover:text-black transition-all rounded flex items-center gap-2">
                          <PencilIcon size={18} />
                          <span className="text-sm">Edit Profile</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-white/60 mt-1">
                      {profileUser.bio || "No bio available"}
                    </p>
                    <div className="flex gap-3 mt-4">
                      <button className="bg-white text-black px-4 py-2 flex items-center gap-2 hover:bg-gray-200 transition-colors">
                        <UserPlusIcon size={18} />
                        Add Friend
                      </button>
                      <button className="border border-white/20 px-4 py-2 flex items-center gap-2 hover:bg-white/5 transition-colors">
                        <MessageSquareIcon size={18} />
                        Message
                      </button>
                    </div>
                  </div>
                  <div className="pt-4 backdrop-blur-sm bg-black/30 p-4 rounded-lg">
                    <div className="text-4xl font-bold">{profileUser.elo || 0}</div>
                    <div className="text-sm text-white/60 uppercase tracking-wider mt-1">
                      ELO Rating
                    </div>
                  </div>
                </div>
              </div>

              {/* Статистика */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  {
                    icon: TrophyIcon,
                    label: "Total Matches",
                    value: stats.totalMatches,
                  },
                  {
                    icon: SwordIcon,
                    label: "Wins",
                    value: stats.wins,
                  },
                  {
                    icon: CrosshairIcon,
                    label: "Losses",
                    value: stats.losses,
                  },
                  {
                    icon: UsersIcon,
                    label: "Win Rate",
                    value: `${stats.winRate}%`,
                  },
                ].map((stat, index) => (
                  <div key={index} className="border border-white/10 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon size={20} className="text-white/80" />
                      <span className="font-medium">{stat.label}</span>
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* О пользователе */}
              <div className="border border-white/10 p-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold">About</h2>
                  <button className="text-white/60 hover:text-white transition-colors">
                    <EditIcon size={16} />
                  </button>
                </div>
                <p className="text-white/80 leading-relaxed">
                  {profileUser.bio || "No bio available"}
                </p>
              </div>

              {/* Социальные сети */}
              <div className="border border-white/10 p-6">
                <h2 className="text-xl font-bold mb-4">Social Media</h2>
                <div className="flex gap-4">
                  {socialMedia.length > 0 ? (
                    socialMedia.map((social, index) => (
                      <button
                        key={index}
                        className="flex-1 border border-white/10 p-4 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {social.platform === "Twitter" && <TwitterIcon size={18} />}
                          {social.platform === "Twitch" && <TwitchIcon size={18} />}
                          {social.platform === "YouTube" && <YoutubeIcon size={18} />}
                          <span>{social.username}</span>
                        </div>
                        <div className="text-white/60 text-sm">
                          {social.followers} followers
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-white/60">No social media available</p>
                  )}
                </div>
              </div>

              {/* Лучшие карты */}
              <div className="border border-white/10 p-6">
                <h2 className="text-xl font-bold mb-4">Top Performing Maps</h2>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    {
                      name: "Dust II",
                      winRate: "89%",
                      matches: 234,
                    },
                    {
                      name: "Mirage",
                      winRate: "82%",
                      matches: 198,
                    },
                    {
                      name: "Inferno",
                      winRate: "78%",
                      matches: 167,
                    },
                  ].map((map, index) => (
                    <div key={index} className="border border-white/10 p-4">
                      <div className="font-bold mb-2">{map.name}</div>
                      <div className="text-white/60 text-sm">
                        Win Rate: {map.winRate}
                      </div>
                      <div className="text-white/40 text-sm">
                        {map.matches} matches
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Репутация */}
              <div className="border border-white/10 p-6">
                <h2 className="text-xl font-bold mb-4">Player Reputation</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border border-white/10 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ThumbsUpIcon size={20} className="text-white/80" />
                      <span className="font-medium">Behavior Score</span>
                    </div>
                    <div className="text-2xl font-bold">98/100</div>
                    <div className="text-white/60 text-sm mt-1">
                      Excellent Standing
                    </div>
                  </div>
                  <div className="border border-white/10 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheckIcon size={20} className="text-white/80" />
                      <span className="font-medium">Trust Factor</span>
                    </div>
                    <div className="text-2xl font-bold">High</div>
                    <div className="text-white/60 text-sm mt-1">
                      Verified Player
                    </div>
                  </div>
                  <div className="border border-white/10 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircleIcon size={20} className="text-white/80" />
                      <span className="font-medium">Reports</span>
                    </div>
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-white/60 text-sm mt-1">Last 30 Days</div>
                  </div>
                </div>
              </div>

              {/* Недавние турниры */}
              <div className="border border-white/10 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Recent Tournament Matches</h2>
                  <button className="text-white/60 hover:text-white transition-colors">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {tournaments.length > 0 ? (
                    tournaments.map((tournament, index) => (
                      <div
                        key={index}
                        className="border-b border-white/10 last:border-0 pb-4 last:pb-0"
                      >
                        <div className="text-sm text-white/60">{tournament.name}</div>
                        <div className="font-bold mt-1">Position: {tournament.position}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/60">No tournaments available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Правая колонка */}
            <div className="w-80 space-y-6">
              {/* Лента активности */}
              <div className="border border-white/10 p-6">
                <h2 className="text-xl font-bold mb-4">Activity Feed</h2>
                <div className="space-y-4">
                  {activity.length > 0 ? (
                    activity.map((activity, index) => (
                      <div
                        key={index}
                        className="border-b border-white/10 last:border-0 pb-4 last:pb-0"
                      >
                        <div className="flex items-center gap-2">
                          {activity.activity_type === "Achievement" && <TrophyIcon size={16} className="text-white/60" />}
                          {activity.activity_type === "Match" && <SwordIcon size={16} className="text-white/60" />}
                          {activity.activity_type === "Tournament" && <ClockIcon size={16} className="text-white/60" />}
                          {activity.activity_type === "Team" && <UsersIcon size={16} className="text-white/60" />}
                          <p className="text-white/80">{activity.description}</p>
                        </div>
                        <p className="text-white/40 text-sm mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/60">No activity available</p>
                  )}
                </div>
              </div>

              {/* Друзья */}
              <div className="border border-white/10 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Friends</h2>
                  <span className="text-white/60 text-sm">245 online</span>
                </div>
                <div className="space-y-3">
                  {friends.length > 0 ? (
                    friends.map((friend, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/10 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-medium">{friend.nickname}</div>
                          <div className="text-white/40 text-sm">In Game</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/60">No friends available</p>
                  )}
                  <button className="w-full text-white/60 hover:text-white text-sm transition-colors">
                    View All Friends
                  </button>
                </div>
              </div>

              {/* Хайлайты */}
              <div className="border border-white/10 p-6">
                <h2 className="text-xl font-bold mb-4">Recent Highlights</h2>
                <div className="space-y-4">
                  {highlights.length > 0 ? (
                    highlights.map((highlight, index) => (
                      <div key={index} className="group cursor-pointer">
                        <div className="aspect-video bg-white/5 rounded relative overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <PlayIcon className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-all" />
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="font-medium">{highlight.title}</div>
                          <div className="text-white/40 text-sm">{highlight.views} views</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/60">No highlights available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
      </h1>
      <p className="text-white/60">
        Content for this section will be displayed here.
      </p>
    </div>
  );
};

export default ProfileContent;