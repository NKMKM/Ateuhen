import React, { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
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
  Loader2Icon,
  ChevronRightIcon,
  MoreHorizontalIcon
} from 'lucide-react';

const ProfileContent = ({ activeTab, nickname, profileUser: initialProfileUser }) => {
  // States
  const [profileUser, setProfileUser] = useState(initialProfileUser);
  const [avatar, setAvatar] = useState(initialProfileUser.avatar || '/default-avatar.png');
  const [stats, setStats] = useState({
    totalMatches: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    topMaps: []
  });
  const [friends, setFriends] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [activity, setActivity] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [socialMedia, setSocialMedia] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingBio, setEditingBio] = useState(false);
  const [newBio, setNewBio] = useState(initialProfileUser.bio || '');
  const [friendsLoading, setFriendsLoading] = useState(false);

  // Fetch friends data with avatars
  const fetchFriendsData = useCallback(async () => {
    try {
      setFriendsLoading(true);
      const response = await fetch(`http://localhost:5000/api/user/${nickname}/friends`);
      if (response.ok) {
        const friendsData = await response.json();
        
        // Fetch avatars for each friend
        const friendsWithAvatars = await Promise.all(
          friendsData.map(async (friend) => {
            try {
              const avatarRes = await fetch(
                `http://localhost:5000/api/user/${friend.nickname}/avatar`, 
                { cache: 'no-store' }
              );
              return {
                ...friend,
                avatar: avatarRes.ok ? URL.createObjectURL(await avatarRes.blob()) : '/default-avatar.png'
              };
            } catch (error) {
              console.error(`Error fetching avatar for ${friend.nickname}:`, error);
              return {
                ...friend,
                avatar: '/default-avatar.png'
              };
            }
          })
        );
        
        setFriends(friendsWithAvatars);
      }
    } catch (error) {
      console.error('Error loading friends data:', error);
    } finally {
      setFriendsLoading(false);
    }
  }, [nickname]);

  // Main profile data fetch
  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [
        userRes,
        statsRes,
        tournamentsRes,
        activityRes,
        highlightsRes,
        socialRes,
        avatarRes
      ] = await Promise.all([
        fetch(`http://localhost:5000/api/user/${nickname}`),
        fetch(`http://localhost:5000/api/user/${nickname}/stats`),
        fetch(`http://localhost:5000/api/user/${nickname}/tournaments`),
        fetch(`http://localhost:5000/api/user/${nickname}/activity`),
        fetch(`http://localhost:5000/api/user/${nickname}/highlights`),
        fetch(`http://localhost:5000/api/user/${nickname}/social-media`),
        fetch(`http://localhost:5000/api/user/${nickname}/avatar`, { cache: 'no-store' })
      ]);

      // Process responses
      if (userRes.ok) {
        const userData = await userRes.json();
        setProfileUser(userData);
        setNewBio(userData.bio || '');
      }
      if (statsRes.ok) setStats(await statsRes.json());
      if (tournamentsRes.ok) setTournaments(await tournamentsRes.json());
      if (activityRes.ok) setActivity(await activityRes.json());
      if (highlightsRes.ok) setHighlights(await highlightsRes.json());
      if (socialRes.ok) setSocialMedia(await socialRes.json());
      
      // Handle avatar
      if (avatarRes.ok) {
        const avatarBlob = await avatarRes.blob();
        setAvatar(URL.createObjectURL(avatarBlob));
      } else {
        setAvatar('/default-avatar.png');
      }

    } catch (error) {
      console.error('Error loading profile data:', error);
      setAvatar('/default-avatar.png');
    } finally {
      setLoading(false);
    }
  }, [nickname]);

  // Initialize WebSocket
  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    setSocket(newSocket);

    // Check streaming status
    const checkStreaming = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user/${nickname}/streaming`);
        if (response.ok) {
          const data = await response.json();
          setIsStreaming(data.isStreaming);
        }
      } catch (error) {
        console.error('Error checking streaming status:', error);
      }
    };
    
    checkStreaming();

    return () => {
      newSocket.disconnect();
    };
  }, [nickname]);

  // WebSocket subscriptions
  useEffect(() => {
    if (!socket) return;

    const handleProfileUpdate = (updatedUser) => {
      setProfileUser(updatedUser);
      setNewBio(updatedUser.bio || '');
    };

    const handleAvatarUpdate = (newAvatarPath) => {
      setAvatar(`${newAvatarPath}?${Date.now()}`);
    };

    const handleStreamingStatus = ({ isStreaming }) => {
      setIsStreaming(isStreaming);
    };

    socket.on('profileUpdated', handleProfileUpdate);
    socket.on('avatarUpdated', handleAvatarUpdate);
    socket.on('streamingStatus', handleStreamingStatus);

    return () => {
      socket.off('profileUpdated', handleProfileUpdate);
      socket.off('avatarUpdated', handleAvatarUpdate);
      socket.off('streamingStatus', handleStreamingStatus);
    };
  }, [socket]);

  // Initial data load
  useEffect(() => {
    fetchProfileData();
    fetchFriendsData();
  }, [fetchProfileData, fetchFriendsData]);

  // Handle avatar change
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(
        `http://localhost:5000/api/user/${nickname}/avatar`,
        {
          method: 'PUT',
          body: formData,
        }
      );

      if (response.ok) {
        const { avatarPath } = await response.json();
        const newAvatarUrl = `http://localhost:5000/${avatarPath}?${Date.now()}`;
        setAvatar(newAvatarUrl);
        
        if (socket) {
          socket.emit('updateAvatar', { nickname, avatarPath });
        }
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  // Update profile field
  const updateProfileField = async (field, value) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/user/${nickname}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ [field]: value }),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setProfileUser(updatedUser);
        
        if (socket) {
          socket.emit('profileUpdate', { updatedUser });
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  // Handle bio edit
  const handleBioEdit = async () => {
    if (editingBio) {
      const success = await updateProfileField('bio', newBio);
      if (success) {
        setEditingBio(false);
      }
    } else {
      setEditingBio(true);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2Icon className="animate-spin h-12 w-12 text-white" />
      </div>
    );
  }

  // Profile tab content
  if (activeTab === "profile") {
    return (
      <div className="ml-20">
        <div className="px-8 py-6 bg-gradient-to-b from-transparent to-black text-white min-h-screen">
          <div className="flex gap-8">
            {/* Main content */}
            <div className="flex-1 space-y-6">
              {/* Avatar and basic info */}
              <div className="relative">
                <div className="flex gap-6">
                  <div className="top-3 relative group">
                    <img
                      src={avatar}
                      alt="Profile Avatar"
                      className="w-32 h-32  border-4 border-black object-cover hover:grayscale-0 grayscale transition-all"
                    />
                    <label className="absolute bottom-2 right-0 bg-black/80 text-white p-2 rounded-full cursor-pointer hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 z-10">
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleAvatarChange}
                        accept="image/*"
                      />
                      <PencilIcon size={16} />
                    </label>
                    {isStreaming && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-600 px-2 py-1 rounded-full text-xs">
                        <CircleIcon size={8} className="text-white fill-white animate-pulse" />
                        <span>LIVE</span>
                      </div>
                    )}
                  </div>
                  <div className="pt-4 backdrop-blur-sm bg-black/30 p-4 rounded-lg flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold tracking-tight">
                          {profileUser.nickname}
                        </h1>
                        {profileUser.isPremium && (
                          <CrownIcon size={20} className="text-yellow-400 fill-yellow-400/20" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          className="bg-black/80 text-white p-2 hover:bg-white hover:text-black transition-all rounded flex items-center gap-2"
                          onClick={() => setEditingBio(!editingBio)}
                        >
                          <PencilIcon size={18} />
                          <span className="text-sm">Edit Profile</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-white/60 mt-1">
                      {profileUser.title || "Competitive Player"}
                    </p>
                    <div className="flex gap-3 mt-4">
                      <button className="bg-white text-black px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-200 transition-colors">
                        <UserPlusIcon size={18} />
                        Add Friend
                      </button>
                      <button className="border border-white/20 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-white/5 transition-colors">
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
                    <div className="mt-2 text-xs text-white/40">
                      Rank: {profileUser.rank || "Unranked"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  {
                    icon: TrophyIcon,
                    label: "Total Matches",
                    value: stats.totalMatches,
                    change: "+12%",
                  },
                  {
                    icon: SwordIcon,
                    label: "Wins",
                    value: stats.wins,
                    change: "+5%",
                  },
                  {
                    icon: CrosshairIcon,
                    label: "Losses",
                    value: stats.losses,
                    change: "-3%",
                  },
                  {
                    icon: UsersIcon,
                    label: "Win Rate",
                    value: `${stats.winRate}%`,
                    change: stats.winRate > 50 ? "+2%" : "-2%",
                  },
                ].map((stat, index) => (
                  <div key={index} className="border border-white/10 p-4 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon size={20} className="text-white/80" />
                      <span className="font-medium">{stat.label}</span>
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className={`text-xs mt-1 ${
                      stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {stat.change} this month
                    </div>
                  </div>
                ))}
              </div>

              {/* About */}
              <div className="border border-white/10 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold">About</h2>
                  <button 
                    className="text-white/60 hover:text-white transition-colors"
                    onClick={handleBioEdit}
                  >
                    {editingBio ? 'Save' : <EditIcon size={16} />}
                  </button>
                </div>
                {editingBio ? (
                  <div className="space-y-3">
                    <textarea
                      value={newBio}
                      onChange={(e) => setNewBio(e.target.value)}
                      className="w-full bg-black/30 border border-white/20 rounded p-3 text-white focus:outline-none focus:ring-1 focus:ring-white/50"
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                    <div className="flex gap-2">
                      <button 
                        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors"
                        onClick={handleBioEdit}
                      >
                        Save
                      </button>
                      <button 
                        className="border border-white/20 px-4 py-2 rounded hover:bg-white/5 transition-colors"
                        onClick={() => {
                          setEditingBio(false);
                          setNewBio(profileUser.bio || '');
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-white/80 leading-relaxed whitespace-pre-line">
                    {profileUser.bio || "No bio available. Click the edit button to add one."}
                  </p>
                )}
              </div>

              {/* Social Media */}
              <div className="border border-white/10 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Social Media</h2>
                <div className="flex gap-4">
                  {socialMedia.length > 0 ? (
                    socialMedia.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 border border-white/10 p-4 rounded hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {social.platform === "Twitter" && <TwitterIcon size={18} className="text-blue-400" />}
                          {social.platform === "Twitch" && <TwitchIcon size={18} className="text-purple-400" />}
                          {social.platform === "YouTube" && <YoutubeIcon size={18} className="text-red-400" />}
                          <span className="font-medium">{social.platform}</span>
                        </div>
                        <div className="text-white/60 text-sm">
                          {social.followers} followers
                        </div>
                      </a>
                    ))
                  ) : (
                    <div className="w-full text-center py-8">
                      <p className="text-white/60 mb-4">No social media connected</p>
                      <button className="border border-white/20 px-4 py-2 rounded-md hover:bg-white/5 transition-colors">
                        Connect Accounts
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Top Maps */}
              <div className="border border-white/10 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Top Performing Maps</h2>
                <div className="grid grid-cols-3 gap-4">
                  {stats.topMaps && stats.topMaps.length > 0 ? (
                    stats.topMaps.slice(0, 3).map((map, index) => (
                      <div key={index} className="border border-white/10 p-4 rounded hover:bg-white/5 transition-colors">
                        <div className="font-bold mb-2">{map.name}</div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                          <div 
                            className="h-full bg-green-500" 
                            style={{ width: `${map.winRate}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Win Rate</span>
                          <span className="font-medium">{map.winRate}%</span>
                        </div>
                        <div className="text-white/40 text-xs mt-2">
                          {map.matches} matches played
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-8">
                      <p className="text-white/60">Not enough map data available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Reputation */}
              <div className="border border-white/10 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Player Reputation</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border border-white/10 p-4 rounded hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <ThumbsUpIcon size={20} className="text-white/80" />
                      <span className="font-medium">Behavior Score</span>
                    </div>
                    <div className="text-2xl font-bold">98/100</div>
                    <div className="text-white/60 text-sm mt-1">
                      Excellent Standing
                    </div>
                  </div>
                  <div className="border border-white/10 p-4 rounded hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheckIcon size={20} className="text-white/80" />
                      <span className="font-medium">Trust Factor</span>
                    </div>
                    <div className="text-2xl font-bold">High</div>
                    <div className="text-white/60 text-sm mt-1">
                      Verified Player
                    </div>
                  </div>
                  <div className="border border-white/10 p-4 rounded hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircleIcon size={20} className="text-white/80" />
                      <span className="font-medium">Reports</span>
                    </div>
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-white/60 text-sm mt-1">Last 30 Days</div>
                  </div>
                </div>
              </div>

              {/* Tournaments */}
              <div className="border border-white/10 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Recent Tournament Matches</h2>
                  <button className="text-white/60 hover:text-white transition-colors flex items-center gap-1">
                    View All <ChevronRightIcon size={16} />
                  </button>
                </div>
                <div className="space-y-4">
                  {tournaments.length > 0 ? (
                    tournaments.slice(0, 3).map((tournament, index) => (
                      <div
                        key={index}
                        className="border-b border-white/10 last:border-0 pb-4 last:pb-0 hover:bg-white/5 px-2 py-1 rounded transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-sm text-white/60">{tournament.name}</div>
                            <div className="font-bold mt-1">
                              {tournament.position === 1 ? (
                                <span className="text-yellow-400">1st Place</span>
                              ) : tournament.position === 2 ? (
                                <span className="text-gray-300">2nd Place</span>
                              ) : tournament.position === 3 ? (
                                <span className="text-amber-600">3rd Place</span>
                              ) : (
                                `${tournament.position}th Place`
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-white/40">
                              {new Date(tournament.date).toLocaleDateString()}
                            </div>
                            <div className="text-sm mt-1">
                              Prize: ${tournament.prize.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-white/60">No tournament history available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="w-80 space-y-6">
              {/* Activity feed */}
              <div className="border border-white/10 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Activity Feed</h2>
                <div className="space-y-4">
                  {activity.length > 0 ? (
                    activity.slice(0, 5).map((item, index) => (
                      <div
                        key={index}
                        className="border-b border-white/10 last:border-0 pb-4 last:pb-0 hover:bg-white/5 px-2 py-1 rounded transition-colors"
                      >
                        <div className="flex items-start gap-2">
                          {item.activity_type === "Achievement" && (
                            <TrophyIcon size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                          )}
                          {item.activity_type === "Match" && (
                            <SwordIcon size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                          )}
                          {item.activity_type === "Tournament" && (
                            <ClockIcon size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                          )}
                          {item.activity_type === "Team" && (
                            <UsersIcon size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                          )}
                          <div>
                            <p className="text-white/80">{item.description}</p>
                            <p className="text-white/40 text-xs mt-1">
                              {new Date(item.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-white/60">No recent activity</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Friends */}
              <div className="border border-white/10 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Friends</h2>
                  <span className="text-white/60 text-sm">
                    {friends.filter(f => f.isOnline).length} online
                  </span>
                </div>
                <div className="space-y-3">
                  {friendsLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2Icon className="animate-spin h-5 w-5 text-white" />
                    </div>
                  ) : friends.length > 0 ? (
                    <>
                      {friends.slice(0, 5).map((friend, index) => (
                        <div key={index} className="flex items-center gap-3 hover:bg-white/5 p-2 rounded transition-colors">
                          <div className="relative">
                            <img
                              src={friend.avatar}
                              alt={friend.nickname}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            {friend.isOnline && (
                              <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-black"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{friend.nickname}</div>
                            <div className="text-white/40 text-xs truncate">
                              {friend.isOnline ? 
                                friend.isInGame ? 
                                  `Playing ${friend.game || 'a game'}` : 
                                  'Online' : 
                                'Offline'}
                            </div>
                          </div>
                          <button className="text-white/40 hover:text-white">
                            <MoreHorizontalIcon size={16} />
                          </button>
                        </div>
                      ))}
                      <button className="w-full text-white/60 hover:text-white text-sm transition-colors flex items-center justify-center gap-1 mt-2">
                        View All Friends <ChevronRightIcon size={14} />
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-white/60 mb-4">No friends yet</p>
                      <button className="border border-white/20 px-4 py-2 rounded-md text-sm hover:bg-white/5 transition-colors">
                        Find Friends
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Highlights */}
              <div className="border border-white/10 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Recent Highlights</h2>
                <div className="space-y-4">
                  {highlights.length > 0 ? (
                    highlights.slice(0, 2).map((highlight, index) => (
                      <div key={index} className="group cursor-pointer">
                        <div className="aspect-video bg-white/5 rounded-lg relative overflow-hidden">
                          <img 
                            src={highlight.thumbnail} 
                            alt={highlight.title}
                            className="w-full h-full object-cover group-hover:opacity-70 transition-opacity"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-black/50 rounded-full p-3">
                              <PlayIcon className="w-6 h-6" />
                            </div>
                          </div>
                          <div className="absolute bottom-2 left-2 bg-black/70 px-1.5 py-0.5 rounded text-xs">
                            {highlight.duration}
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="font-medium line-clamp-1">{highlight.title}</div>
                          <div className="text-white/40 text-xs flex justify-between">
                            <span>{highlight.views.toLocaleString()} views</span>
                            <span>{new Date(highlight.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-white/60 mb-4">No highlights yet</p>
                      <button className="border border-white/20 px-4 py-2 rounded-md text-sm hover:bg-white/5 transition-colors">
                        Upload Highlight
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Other tabs content
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