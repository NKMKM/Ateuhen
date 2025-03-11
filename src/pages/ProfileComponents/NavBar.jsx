import React from "react";
import {
  UserIcon,
  SettingsIcon,
  BellIcon,
  MessageSquareIcon,
  BookmarkIcon,
  HelpCircleIcon,
  LogOutIcon,
} from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: "profile", icon: <UserIcon size={20} /> },
    { id: "notifications", icon: <BellIcon size={20} /> },
    { id: "messages", icon: <MessageSquareIcon size={20} /> },
    { id: "saved", icon: <BookmarkIcon size={20} /> },
    { id: "settings", icon: <SettingsIcon size={20} /> },
    { id: "help", icon: <HelpCircleIcon size={20} /> },
  ];

  return (
    <aside className="w-20 min-h-screen bg-black border-r border-white/10 flex flex-col items-center py-8">
      <nav className="flex-1">
        <ul className="space-y-6">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`p-3 rounded transition-all ${
                  activeTab === item.id
                    ? "bg-white text-black"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
                title={item.id.charAt(0).toUpperCase() + item.id.slice(1)}
              >
                {item.icon}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <button
        className="p-3 text-white/40 hover:text-white hover:bg-white/5 rounded transition-all"
        title="Logout"
      >
        <LogOutIcon size={20} />
      </button>
    </aside>
  );
};

export default Sidebar;
