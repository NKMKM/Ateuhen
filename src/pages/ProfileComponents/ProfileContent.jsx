import React, { useState } from "react";
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
  LinkIcon,
  MapPinIcon,
  UsersIcon,
  TrophyIcon,
  ClockIcon,
  PlayIcon,
  ChevronRightIcon,
  CircleIcon,
  CrownIcon,
  SwordIcon,
  CrosshairIcon,
  CameraIcon,
} from "lucide-react";

const ProfileContent = ({ activeTab, setAvatar, avatar }) => {
  const [isStreaming, setIsStreaming] = useState(false); // Стримит человек или нет 

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatar(e.target.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  if (activeTab === "profile") {
    return (
      <div className="ml-20">
      <div className="px-8 py-6 bg-gradient-to-b from-transparent to-black text-white min-h-screen">
        <div className="flex gap-8">
          <div className="flex-1 space-y-6">
            <div className="relative">
              <div className="flex gap-6">
                <div className=" top-3 relative group">
                  <img
                    src={avatar}
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
                      <CircleIcon
                        size={8}
                        className="text-red-500 fill-red-500"
                      />
                      <span className="text-xs">LIVE</span>
                    </div>
                  )}
                </div>
                <div className="pt-4 backdrop-blur-sm bg-black/30 p-4 rounded-lg flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h1 className="text-3xl font-bold tracking-tight">
                        SHADOWBLADE
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
                    Professional CS:GO Player
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
                  <div className="text-4xl font-bold">2456</div>
                  <div className="text-sm text-white/60 uppercase tracking-wider mt-1">
                    ELO Rating
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                {
                  icon: TrophyIcon,
                  label: "Tournaments Won",
                  value: "24",
                },
                {
                  icon: SwordIcon,
                  label: "Win Rate",
                  value: "76%",
                },
                {
                  icon: CrosshairIcon,
                  label: "Accuracy",
                  value: "92%",
                },
                {
                  icon: UsersIcon,
                  label: "Team Matches",
                  value: "1.2K",
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
            <div className="border border-white/10 p-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold">About</h2>
                <button className="text-white/60 hover:text-white transition-colors">
                  <EditIcon size={16} />
                </button>
              </div>
              <p className="text-white/80 leading-relaxed">
                Professional CS:GO player with 5 years of competitive
                experience. Specializing in entry fragging and clutch
                situations. Currently playing for Phantom Squad as team captain.
              </p>
            </div>
            <div className="border border-white/10 p-6">
              <h2 className="text-xl font-bold mb-4">Social Media</h2>
              <div className="flex gap-4">
                {[
                  {
                    icon: TwitterIcon,
                    username: "@shadowblade",
                    followers: "45.2K",
                  },
                  {
                    icon: TwitchIcon,
                    username: "shadowblade_pro",
                    followers: "102K",
                  },
                  {
                    icon: YoutubeIcon,
                    username: "ShadowBlade Official",
                    followers: "250K",
                  },
                ].map((social, index) => (
                  <button
                    key={index}
                    className="flex-1 border border-white/10 p-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <social.icon size={18} />
                      <span>{social.username}</span>
                    </div>
                    <div className="text-white/60 text-sm">
                      {social.followers} followers
                    </div>
                  </button>
                ))}
              </div>
            </div>
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
            <div className="border border-white/10 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Recent Tournament Matches</h2>
                <button className="text-white/60 hover:text-white transition-colors">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {[
                  {
                    event: "ESL Pro League",
                    opponent: "Team Liquid",
                    result: "WIN",
                    score: "16-12",
                    mvp: true,
                  },
                  {
                    event: "BLAST Premier",
                    opponent: "Natus Vincere",
                    result: "WIN",
                    score: "16-14",
                    mvp: false,
                  },
                  {
                    event: "IEM Katowice",
                    opponent: "FaZe Clan",
                    result: "LOSS",
                    score: "13-16",
                    mvp: false,
                  },
                ].map((match, index) => (
                  <div
                    key={index}
                    className="border border-white/10 p-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm text-white/60">{match.event}</div>
                      <div className="font-bold mt-1">vs {match.opponent}</div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-bold ${match.result === "WIN" ? "text-white" : "text-white/40"}`}
                      >
                        {match.score}
                      </div>
                      {match.mvp && (
                        <div className="text-sm text-white/60 mt-1">
                          Match MVP
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-80 space-y-6">
            <div className="border border-white/10 p-6">
              <h2 className="text-xl font-bold mb-4">Activity Feed</h2>
              <div className="space-y-4">
                {[
                  {
                    text: "Earned 'Clutch Master' achievement",
                    time: "2 hours ago",
                    icon: TrophyIcon,
                  },
                  {
                    text: "Won match on Inferno",
                    time: "5 hours ago",
                    icon: SwordIcon,
                  },
                  {
                    text: "Registered for ESL Pro League",
                    time: "1 day ago",
                    icon: ClockIcon,
                  },
                  {
                    text: "Joined Phantom Squad",
                    time: "2 days ago",
                    icon: UsersIcon,
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="border-b border-white/10 last:border-0 pb-4 last:pb-0"
                  >
                    <div className="flex items-center gap-2">
                      <activity.icon size={16} className="text-white/60" />
                      <p className="text-white/80">{activity.text}</p>
                    </div>
                    <p className="text-white/40 text-sm mt-1">
                      {activity.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-white/10 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Friends</h2>
                <span className="text-white/60 text-sm">245 online</span>
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((friend) => (
                  <div key={friend} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium">Player {friend}</div>
                      <div className="text-white/40 text-sm">In Game</div>
                    </div>
                  </div>
                ))}
                <button className="w-full text-white/60 hover:text-white text-sm transition-colors">
                  View All Friends
                </button>
              </div>
            </div>
            <div className="border border-white/10 p-6">
              <h2 className="text-xl font-bold mb-4">Recent Highlights</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((highlight) => (
                  <div key={highlight} className="group cursor-pointer">
                    <div className="aspect-video bg-white/5 rounded relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlayIcon className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="font-medium">Ace Clutch #{highlight}</div>
                      <div className="text-white/40 text-sm">2.1K views</div>
                    </div>
                  </div>
                ))}
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