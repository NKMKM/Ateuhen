import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import WestIcon from '@mui/icons-material/West';
import axios from "axios";
import io from "socket.io-client";
import {
  Search,
  Settings,
  Send,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  UserPlus,
  X,
  Check,
  Users,
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
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/auth/check", { withCredentials: true });
        if (res.data.user) {
          setCurrentUser(res.data.user);
          localStorage.setItem("currentUser", JSON.stringify(res.data.user));
        } else {
          console.error("Пользователь не авторизован");
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Ошибка загрузки данных пользователя:", error);
        window.location.href = "/login";
      }
    };

    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      fetchCurrentUser();
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const friendsRes = await axios.get("http://localhost:5000/friends/list", { withCredentials: true });
        setChats(friendsRes.data.map(friend => ({
          id: friend.id,
          name: friend.nickname,
          lastMessage: "Say hi! 👋",
          time: "now",
          unread: 0,
          online: true,
          messages: [],
        })));

        const requestsRes = await axios.get("http://localhost:5000/friends/requests", { withCredentials: true });
        setFriendRequests(requestsRes.data);
      } catch (error) {
        console.error("Ошибка загрузки друзей/заявок:", error);
      }
    };

    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  useEffect(() => {
    if (activeChat) {
      axios.get(`http://localhost:5000/chat/messages?receiverId=${activeChat.id}`, { withCredentials: true })
        .then((res) => {
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

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setChats(prevChats => prevChats.map(chat => 
        chat.id === message.receiverId || chat.id === message.senderId
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      ));
    });

    return () => socket.off("receiveMessage");
  }, []);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!newMessage.trim() || !activeChat || !currentUser) return;

    socket.emit("sendMessage", {
      senderId: currentUser.id,
      receiverId: activeChat.id,
      message: newMessage,
    });

    setNewMessage("");
  };

  const handleAddFriend = async (friendId) => {
    try {
      await axios.post(
        "http://localhost:5000/friends/request",
        { senderId: currentUser.id, receiverId: friendId },
        { withCredentials: true }
      );
      alert("Запрос в друзья отправлен");
    } catch (error) {
      console.error("Ошибка отправки запроса в друзья:", error);
      alert("Не удалось отправить запрос в друзья");
    }
    setShowFriendModal(false);
  };

  const filteredFriends = friendRequests.filter(
    (friend) =>
      friend.nickname.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !chats.some((chat) => chat.id === friend.id),
  );

  const activeConversation = chats.find((chat) => chat.id === activeChat?.id);

  return (
    <div className="w-full min-h-screen bg-black p-4 sm:p-6">
      <Link to="/" className="w-[100px] h-[50px] border-2 border-gray-400 rounded-lg flex items-center justify-center text-center fixed top-6 left-5 button-violet-hover"> <WestIcon fontSize="small"/> <p className="block w-[5px]"></p>Back</Link>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-6">
        <div className="backdrop-blur-xl bg-black border-2 border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border  rounded-lg 
                text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-white/20 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFriendModal(true)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <UserPlus size={20} />
            </button>
          </div>
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
        {activeConversation ? (
          <div className="backdrop-blur-xl bg-black border-2 border-[#AB70FD] rounded-2xl flex flex-col">
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
                  <h2 className="text-white font-medium">
                    {activeConversation.name}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {activeConversation.online ? "Online" : "Offline"}
                  </p>
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
                <button
                  onClick={() => alert("Opening settings...")}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeConversation.messages.map((message) => (
                <Message
                  key={message.id}
                  content={message.message}
                  time={new Date(message.createdAt).toLocaleTimeString()}
                  received={message.sender_id !== currentUser.id}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-white/10">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-3"
              >
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
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                    text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-white/20 transition-all"
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
      {showFriendModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-black border border-white/10 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Add New Friend
              </h2>
              <button
                onClick={() => setShowFriendModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="relative mb-6">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for friends..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-white/20 transition-all"
              />
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {filteredFriends.map((friend) => (
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
    </div>
  );
};

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

const Message = ({ content, time, received = false }) => (
  <div className={`flex ${received ? "justify-start" : "justify-end"}`}>
    <div
      className={`max-w-[70%] ${received ? "bg-white/10" : "bg-white/20"} 
      rounded-2xl px-4 py-2 space-y-1`}
    >
      <p className="text-white">{content}</p>
      <p className="text-xs text-gray-400">{time}</p>
    </div>
  </div>
);

export default ChatLayout;