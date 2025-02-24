import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import WestIcon from '@mui/icons-material/West';
import axios from "axios";
import io from "socket.io-client";
import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  UserPlus,
  X,
  Users,
  Ban,
  Volume2,
  VolumeX,
  Clock,
  UserMinus,
  AlertCircle,
} from "lucide-react";

const socket = io("http://localhost:5000", { withCredentials: true });

const ChatLayout = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showFriendModal, setShowFriendModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [friendRequests, setFriendRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const messagesEndRef = useRef(null);
  const dropdownRef = useRef(null);

  // Запрос данных пользователя при монтировании компонента
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/auth/check", { withCredentials: true });
        if (res.data.user) {
          console.log("Текущий пользователь:", res.data.user); // Добавьте лог для проверки
          setCurrentUser(res.data.user);
        } else {
          console.error("Пользователь не авторизован");
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Ошибка загрузки данных пользователя:", error);
        window.location.href = "/login";
      }
    };
  
    fetchCurrentUser();
  }, []);

  // Загрузка чатов и заявок в друзья
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
  
      try {
        const friendsRes = await axios.get("http://localhost:5000/friends/list", { withCredentials: true });
        const chatsWithMessages = await Promise.all(friendsRes.data.map(async (friend) => {
          const messagesRes = await axios.get(`http://localhost:5000/chat/messages?receiverId=${friend.id}`, { withCredentials: true });
          return {
            id: friend.id,
            name: friend.nickname,
            lastMessage: messagesRes.data.length > 0 ? messagesRes.data[messagesRes.data.length - 1].message : "Say hi! 👋",
            time: messagesRes.data.length > 0 ? new Date(messagesRes.data[messagesRes.data.length - 1].timestamp).toLocaleTimeString() : "now",
            unread: messagesRes.data.filter(msg => !msg.isRead && msg.senderId !== currentUser.id).length,
            online: true,
            messages: messagesRes.data,
            status: {
              blocked: false,
              muted: false,
            },
          };
        }));
        console.log("Чаты и сообщения:", chatsWithMessages); // Добавьте лог для проверки
        setChats(chatsWithMessages);
  
        const requestsRes = await axios.get("http://localhost:5000/friends/requests", { withCredentials: true });
        setFriendRequests(requestsRes.data);
      } catch (error) {
        console.error("Ошибка загрузки друзей/заявок:", error);
      }
    };
  
    fetchData();
  }, [currentUser]);

  // Поиск друзей
  const handleSearchFriends = async (query) => {
    if (!query || !currentUser) {
      setSearchResults([]);
      return;
    }

    try {
      const result = await axios.get(`http://localhost:5000/friends/search?nickname=${query}`, { withCredentials: true });
      setSearchResults(result.data);
    } catch (error) {
      console.error("Ошибка поиска друзей:", error);
    }
  };

  // Добавление друга
  const handleAddFriend = async (friendId) => {
    if (!currentUser) return;

    try {
      await axios.post(
        "http://localhost:5000/friends/request",
        { senderId: currentUser.id, receiverId: friendId },
        { withCredentials: true }
      );
      alert("Запрос в друзья отправен");

      setSearchResults(prevResults => prevResults.filter(user => user.id !== friendId));
    } catch (error) {
      console.error("Ошибка отправки запроса в друзья:", error);
      alert("Не удалось отправить запрос в друзья");
    }
  };

  // Загрузка сообщений для активного чата
  useEffect(() => {
    if (activeChat) {
      axios.get(`http://localhost:5000/chat/messages?receiverId=${activeChat.id}`, { withCredentials: true })
        .then((res) => {
          console.log("Сообщения с сервера:", res.data); // Добавьте лог для проверки
          setChats(prevChats => prevChats.map(chat => 
            chat.id === activeChat.id ? { ...chat, messages: res.data } : chat
          ));
        })
        .catch((err) => {
          console.error("Ошибка загрузки сообщений:", err);
          alert("Не удалось загрузить сообщения");
        });
    }
  }, [activeChat]);

  // Обработка получения новых сообщений через сокеты
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      setChats(prevChats => prevChats.map(chat => 
        chat.id === message.receiverId || chat.id === message.senderId
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      ));
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []);

  // Прокрутка к последнему сообщению
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats, activeChat]);

  // Отправка сообщения
  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!newMessage.trim() || !activeChat || !currentUser) return;
  
    const messageData = {
      senderId: currentUser.id,
      receiverId: activeChat.id,
      message: newMessage,
    };
  
    console.log("Отправка сообщения:", messageData); // Добавьте лог для проверки
    socket.emit("sendMessage", messageData);
    setNewMessage("");
  };
  // Обработка действий с пользователем (блокировка, отключение звука и т.д.)
  const handleUserAction = (action) => {
    if (!activeChat) return;

    setActionType(action);
    setShowActionModal(true);
    setShowDropdown(false);
  };

  // Выполнение действия (блокировка, отключение звука и т.д.)
  const executeAction = () => {
    if (!activeChat) return;

    const updatedChats = chats.map(chat => {
      if (chat.id === activeChat.id) {
        switch (actionType) {
          case "block":
            return { ...chat, status: { ...chat.status, blocked: true } };
          case "unblock":
            return { ...chat, status: { ...chat.status, blocked: false } };
          case "mute":
            return { ...chat, status: { ...chat.status, muted: true } };
          case "unmute":
            return { ...chat, status: { ...chat.status, muted: false } };
          case "tempMute":
            return { ...chat, status: { ...chat.status, muted: true, temporarilyMuted: { until: new Date(Date.now() + 24 * 60 * 60 * 1000) } } };
          case "remove":
            return null;
          default:
            return chat;
        }
      }
      return chat;
    }).filter(Boolean);

    setChats(updatedChats);
    if (actionType === "remove") {
      setActiveChat(updatedChats[0]?.id || null);
    }
    setShowActionModal(false);
    setActionType(null);
  };

  const handleAcceptRequest = async (senderId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/friends/accept",
        { senderId },
        { withCredentials: true }
      );
  
      if (response.data.message === "Friend request accepted") {
        setFriendRequests((prevRequests) =>
          prevRequests.filter((req) => req.id !== senderId)
        );
        alert("Запрос в друзья принят");
      } else {
        alert("Ошибка: " + response.data.message);
      }
    } catch (error) {
      console.error("Ошибка принятия запроса в друзья:", error);
      alert("Не удалось принять запрос в друзья: " + error.message);
    }
  };
  
  const handleDeclineRequest = async (senderId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/friends/reject",
        { senderId },
        { withCredentials: true }
      );
  
      if (response.data.message === "Friend request rejected") {
        setFriendRequests((prevRequests) =>
          prevRequests.filter((req) => req.id !== senderId)
        );
        alert("Запрос в друзья отклонен");
      } else {
        alert("Ошибка: " + response.data.message);
      }
    } catch (error) {
      console.error("Ошибка отклонения запроса в друзья:", error);
      alert("Не удалось отклонить запрос в друзья: " + error.message);
    }
  };

  const activeConversation = activeChat ? chats.find((chat) => chat.id === activeChat.id) : null;

  return (
    <div className="w-full max-h-screen bg-black p-4 sm:p-6">
      <Link to="/" className="w-[100px] h-[50px] border-2  rounded-lg flex items-center justify-center text-center fixed top-6 left-5 button-violet-hover"> <WestIcon fontSize="small"/> <p className="block w-[5px]"></p>Back</Link>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-6">
        {/* Список чатов */}
        <div className="backdrop-blur-xl bg-black border-2 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearchFriends(e.target.value);
                }}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-black border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFriendModal(true)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <UserPlus size={20} />
            </button>
          </div>
          {friendRequests.length > 0 && (
            <button
              onClick={() => setShowRequestsModal(true)}
              className="w-full mb-4 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Users size={20} className="text-white" />
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">
                        {friendRequests.length}
                      </span>
                    </div>
                  </div>
                  <span className="text-white">Friend Requests</span>
                </div>
                <span className="text-sm text-gray-400">View all</span>
              </div>
            </button>
          )}
          <div className="space-y-2">
            {chats.map((chat) => (
              <ChatItem
                key={chat.id}
                name={chat.name}
                message={chat.lastMessage}
                time={chat.time}
                unread={chat.unread}
                active={activeChat?.id === chat.id}
                online={chat.online}
                onClick={() => setActiveChat(chat)}
              />
            ))}
          </div>
        </div>

        {/* Активный чат */}
        {activeConversation ? (
          <div className="backdrop-blur-xl bg-black border-2 border-[#AB70FD] rounded-2xl flex flex-col h-[920px] scroll-block">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={`https://ui-avatars.com/api/?name=${activeConversation.name.replace(" ", "+")}&background=random`}
                    alt={activeConversation.name}
                    className="w-10 h-10 rounded-full"
                  />
                  {activeConversation.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                  )}
                </div>
                <div>
                  <h2 className="text-white font-medium">{activeConversation.name}</h2>
                  <p className="text-sm text-gray-400">{activeConversation.online ? "Online" : "Offline"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => alert("Starting voice call...")}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Phone size={20} />
                </button>
                <button
                  onClick={() => alert("Starting video call...")}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Video size={20} />
                </button>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-black border border-white/10 rounded-xl py-2 shadow-xl">
                      {!activeConversation.status?.blocked ? (
                        <button
                          onClick={() => handleUserAction("block")}
                          className="w-full px-4 py-2 text-left text-red-400 hover:bg-white/5 flex items-center gap-2"
                        >
                          <Ban size={16} />
                          Block User
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUserAction("unblock")}
                          className="w-full px-4 py-2 text-left text-green-400 hover:bg-white/5 flex items-center gap-2"
                        >
                          <Ban size={16} />
                          Unblock User
                        </button>
                      )}
                      {!activeConversation.status?.muted ? (
                        <>
                          <button
                            onClick={() => handleUserAction("mute")}
                            className="w-full px-4 py-2 text-left text-white hover:bg-white/5 flex items-center gap-2"
                          >
                            <VolumeX size={16} />
                            Mute Forever
                          </button>
                          <button
                            onClick={() => handleUserAction("tempMute")}
                            className="w-full px-4 py-2 text-left text-white hover:bg-white/5 flex items-center gap-2"
                          >
                            <Clock size={16} />
                            Mute for 24 hours
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleUserAction("unmute")}
                          className="w-full px-4 py-2 text-left text-white hover:bg-white/5 flex items-center gap-2"
                        >
                          <Volume2 size={16} />
                          Unmute
                        </button>
                      )}
                      <div className="my-2 border-t border-white/10"></div>
                      <button
                        onClick={() => handleUserAction("remove")}
                        className="w-full px-4 py-2 text-left text-red-400 hover:bg-white/5 flex items-center gap-2"
                      >
                        <UserMinus size={16} />
                        Remove from Friends
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 space-y-4">
              {activeConversation.messages.map((message) => (
                <Message
                key={message.id || message.createdAt}
                content={message.message}
                time={new Date(message.timestamp).toLocaleTimeString()}
                received={message.sender_id !== currentUser.id} // Исправлено
                avatar={`https://ui-avatars.com/api/?name=${message.sender_id === currentUser.id ? (currentUser.nickname || "Me") : (activeConversation.name || "User")}&background=random`}
                isRead={message.isRead}
              />
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-white/10">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => alert("Opening file picker...")}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Paperclip size={20} />
                </button>
                <div className="flex-1">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => alert("Opening emoji picker...")}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Smile size={20} />
                </button>
                <button
                  type="submit"
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="backdrop-blur-xl bg-black border border-white/10 rounded-2xl flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p className="select-none">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно добавления друга */}
      {showFriendModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-black border border-white/10 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Add New Friend</h2>
              <button
                onClick={() => setShowFriendModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearchFriends(e.target.value);
                }}
                placeholder="Search for friends..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
              />
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {searchResults.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={`https://ui-avatars.com/api/?name=${friend.nickname.replace(" ", "+")}&background=random`}
                        alt={friend.nickname}
                        className="w-10 h-10 rounded-full"
                      />
                      {friend.online && (
                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-white">{friend.nickname}</span>
                  </div>
                  <button
                    onClick={() => handleAddFriend(friend.id)}
                    className="px-3 py-1 text-sm text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно подтверждения действий */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-black border border-white/10 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/5 rounded-full">
                <AlertCircle className="text-yellow-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {actionType === "block" && "Block User"}
                  {actionType === "unblock" && "Unblock User"}
                  {actionType === "mute" && "Mute User Forever"}
                  {actionType === "unmute" && "Unmute User"}
                  {actionType === "tempMute" && "Mute User Temporarily"}
                  {actionType === "remove" && "Remove Friend"}
                </h3>
                <p className="text-gray-400 mb-4">
                  {actionType === "block" &&
                    "This user won't be able to send you messages. Are you sure?"}
                  {actionType === "unblock" &&
                    "This will allow the user to send you messages again. Continue?"}
                  {actionType === "mute" &&
                    "You won't receive any notifications from this user. Continue?"}
                  {actionType === "unmute" &&
                    "You will start receiving notifications from this user again. Continue?"}
                  {actionType === "tempMute" &&
                    "You won't receive notifications from this user for 24 hours. Continue?"}
                  {actionType === "remove" &&
                    "This will remove the user from your friends list. Are you sure?"}
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowActionModal(false)}
                    className="px-4 py-2 text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeAction}
                    className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно запросов в друзья */}
      {showRequestsModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-black border border-white/10 rounded-2xl p-6 max-w-md w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users size={24} className="text-white" />
          <h2 className="text-xl font-semibold text-white">
            Friend Requests
          </h2>
        </div>
        <button
          onClick={() => setShowRequestsModal(false)}
          className="text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {friendRequests.map((request) => {
          const name = request.nickname || request.username || "Unknown User";
          const mutualFriends = request.mutualFriends || 0;
          const time = request.time || "Just now";

          return (
            <div
              key={request.id}
              className="bg-white/5 border border-white/10 rounded-xl p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={`https://ui-avatars.com/api/?name=${name.replace(" ", "+")}&background=random`}
                      alt={name}
                      className="w-12 h-12 rounded-full"
                    />
                    {request.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{name}</h3>
                    <p className="text-sm text-gray-400">
                      {mutualFriends} mutual friends • {time}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => handleAcceptRequest(request.id)}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDeclineRequest(request.id)}
                  className="flex-1 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>
          );
        })}
        {friendRequests.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Users size={48} className="mx-auto mb-4 opacity-50" />
            <p>No pending friend requests</p>
          </div>
        )}
      </div>
    </div>
  </div>
)}
    </div>
  );
};

// Компонент элемента чата
const ChatItem = ({ name, message, time, unread, active, online, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-start gap-3 p-3 rounded-xl transition-colors
    ${active ? "bg-white/20" : "hover:bg-white/10"}`}
  >
    <div className="relative">
      <img
        src={`https://ui-avatars.com/api/?name=${name.replace(" ", "+")}&background=random`}
        alt={name}
        className="w-12 h-12 rounded-full"
      />
      {online && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
      )}
    </div>
    <div className="flex-1 text-left">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">{name}</h3>
        <span className="text-xs text-gray-400">{time}</span>
      </div>
      <p className="text-sm text-gray-400 truncate">{message}</p>
    </div>
    {unread > 0 && (
      <div className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
        {unread}
      </div>
    )}
  </button>
);

// Компонент сообщения
const Message = ({ content, time, received, avatar, isRead }) => {
  return (
    <div className={`flex ${received ? "justify-start" : "justify-end"} items-end gap-2`}>
      {received && (
        <img
          src={avatar}
          alt="User Avatar"
          className="w-8 h-8 rounded-full"
        />
      )}
      <div
        className={`max-w-[70%] ${received ? "bg-gray-200" : "bg-blue-500"} 
        rounded-2xl px-4 py-2 space-y-1`}
      >
        <p className={received ? "text-black" : "text-white"}>{content}</p>
        <p className={`text-xs ${received ? "text-gray-600" : "text-gray-300"}`}>{time}</p>
      </div>
      {!received && (
        <img
          src={avatar}
          alt="User Avatar"
          className="w-8 h-8 rounded-full"
        />
      )}
    </div>
  );
};


export default ChatLayout;