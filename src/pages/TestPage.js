import React, { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Palette,
  HelpCircle,
  Settings as SettingsIcon,
  ChevronLeft,
  Globe,
  Laptop,
  Clock,
  Smartphone,
} from "lucide-react";

const Test = () => {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="w-full min-h-screen bg-black p-4 sm:p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6">
        <button
          onClick={() => window.history.back()}
          className="lg:hidden flex items-center gap-2 text-white mb-4 hover:text-gray-300 transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Back</span>
        </button>
        <div className="backdrop-blur-xl bg-black border border-white/10 rounded-2xl p-4">
          <button
            onClick={() => window.history.back()}
            className="hidden lg:flex items-center gap-2 text-white mb-6 hover:text-gray-300 transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>
          <div className="space-y-2">
            <SidebarItem
              icon={<User />}
              label="Profile"
              active={activeSection === "profile"}
              onClick={() => setActiveSection("profile")}
            />
            <SidebarItem
              icon={<Bell />}
              label="Notifications"
              active={activeSection === "notifications"}
              onClick={() => setActiveSection("notifications")}
            />
            <SidebarItem
              icon={<Shield />}
              label="Privacy"
              active={activeSection === "privacy"}
              onClick={() => setActiveSection("privacy")}
            />
            <SidebarItem
              icon={<Palette />}
              label="Appearance"
              active={activeSection === "appearance"}
              onClick={() => setActiveSection("appearance")}
            />
            <SidebarItem
              icon={<SettingsIcon />}
              label="General"
              active={activeSection === "general"}
              onClick={() => setActiveSection("general")}
            />
            <SidebarItem
              icon={<HelpCircle />}
              label="Help"
              active={activeSection === "help"}
              onClick={() => setActiveSection("help")}
            />
          </div>
        </div>
        <div className="backdrop-blur-xl bg-black border border-white/10 rounded-2xl p-6 space-y-6">
          {activeSection === "profile" && <ProfileSection />}
          {activeSection === "notifications" && <NotificationsSection />}
          {activeSection === "privacy" && <PrivacySection />}
          {activeSection === "appearance" && <AppearanceSection />}
          {activeSection === "general" && <GeneralSection />}
          {activeSection === "help" && <HelpSection />}
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
    ${active ? "bg-white/20 text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const SettingsSection = ({ title, children }) => (
  <div className="space-y-4">
    <h2 className="text-lg font-medium text-white">{title}</h2>
    {children}
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-200">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
      text-white placeholder-gray-400 focus:outline-none focus:ring-2 
      focus:ring-white/20 transition-all"
    />
  </div>
);

const Toggle = ({ label, defaultChecked = false }) => (
  <label className="flex items-center justify-between cursor-pointer">
    <span className="text-gray-200">{label}</span>
    <div className="relative">
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-white/30 transition-colors"></div>
      <div className="absolute left-1 top-1 bg-gray-300 w-4 h-4 rounded-full transition-all peer-checked:bg-white peer-checked:translate-x-5"></div>
    </div>
  </label>
);

const SessionCard = ({ device, location, lastActive, isCurrentSession }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {device.includes("Mobile") ? (
          <Smartphone className="text-white/60" />
        ) : (
          <Laptop className="text-white/60" />
        )}
        <div>
          <p className="text-white font-medium">{device}</p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Globe size={14} />
            <span>{location}</span>
          </div>
        </div>
      </div>
      {isCurrentSession && (
        <span className="text-xs bg-white/10 text-white px-2 py-1 rounded-full">
          Current Session
        </span>
      )}
    </div>
    <div className="flex items-center gap-2 text-sm text-gray-400">
      <Clock size={14} />
      <span>Last active: {lastActive}</span>
    </div>
  </div>
);

const ProfileSection = () => (
  <>
    <h1 className="text-2xl font-semibold text-white">Profile Settings</h1>
    <div className="space-y-8">
      <SettingsSection title="Personal Information">
        <div className="grid gap-4">
          <Input label="Full Name" placeholder="John Doe" />
          <Input label="Email" placeholder="john@example.com" type="email" />
          <Input label="Phone" placeholder="+1 (555) 000-0000" type="tel" />
          <Input
            label="Bio"
            placeholder="Tell us about yourself"
            as="textarea"
          />
        </div>
      </SettingsSection>
      <SettingsSection title="Active Sessions">
        <div className="space-y-4">
          <SessionCard
            device="MacBook Pro"
            location="New York, USA"
            lastActive="Just now"
            isCurrentSession={true}
          />
          <SessionCard
            device="Mobile iPhone 13"
            location="Los Angeles, USA"
            lastActive="2 hours ago"
            isCurrentSession={false}
          />
          <SessionCard
            device="Windows PC"
            location="London, UK"
            lastActive="1 day ago"
            isCurrentSession={false}
          />
        </div>
      </SettingsSection>
      <SettingsSection title="Profile Preferences">
        <div className="space-y-4">
          <Toggle label="Public Profile" />
          <Toggle label="Show Email" />
          <Toggle label="Show Phone Number" />
          <Toggle label="Available for Hire" />
          <Toggle label="Show Online Status" defaultChecked />
        </div>
      </SettingsSection>
    </div>
  </>
);

const NotificationsSection = () => (
  <>
    <h1 className="text-2xl font-semibold text-white">Notifications</h1>
    <div className="space-y-8">
      <SettingsSection title="Email Notifications">
        <div className="space-y-4">
          <Toggle label="New Messages" defaultChecked />
          <Toggle label="Account Updates" defaultChecked />
          <Toggle label="Newsletter" />
          <Toggle label="Product Updates" />
          <Toggle label="Security Alerts" defaultChecked />
        </div>
      </SettingsSection>
      <SettingsSection title="Push Notifications">
        <div className="space-y-4">
          <Toggle label="Desktop Notifications" defaultChecked />
          <Toggle label="Mobile Notifications" defaultChecked />
          <Toggle label="Browser Notifications" />
          <Toggle label="Sound" />
          <Toggle label="Notification Preview" defaultChecked />
        </div>
      </SettingsSection>
      <SettingsSection title="Notification Schedule">
        <div className="space-y-4">
          <Toggle label="Do Not Disturb" />
          <Input label="Quiet Hours Start" type="time" />
          <Input label="Quiet Hours End" type="time" />
        </div>
      </SettingsSection>
    </div>
  </>
);

const PrivacySection = () => (
  <>
    <h1 className="text-2xl font-semibold text-white">Privacy</h1>
    <div className="space-y-8">
      <SettingsSection title="Security">
        <div className="space-y-4">
          <Toggle label="Two-Factor Authentication" />
          <Toggle label="Biometric Login" />
          <Toggle label="Login Alerts" defaultChecked />
          <Toggle label="Remember Devices" />
        </div>
      </SettingsSection>
      <SettingsSection title="Data & Privacy">
        <div className="space-y-4">
          <Toggle label="Data Collection" />
          <Toggle label="Cookie Preferences" />
          <Toggle label="Location Services" />
          <Toggle label="Personalized Ads" />
        </div>
      </SettingsSection>
      <SettingsSection title="Account Access">
        <div className="space-y-4">
          <button className="w-full px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors">
            Delete Account
          </button>
        </div>
      </SettingsSection>
    </div>
  </>
);

const AppearanceSection = () => (
  <>
    <h1 className="text-2xl font-semibold text-white">Appearance</h1>
    <div className="space-y-6">
      <SettingsSection title="Theme">
        <div className="space-y-4">
          <Toggle label="Dark Mode" defaultChecked />
          <Toggle label="High Contrast" />
          <Toggle label="Reduce Animations" />
        </div>
      </SettingsSection>
    </div>
  </>
);

const GeneralSection = () => (
  <>
    <h1 className="text-2xl font-semibold text-white">General Settings</h1>
    <div className="space-y-6">
      <SettingsSection title="Language">
        <Input label="Preferred Language" placeholder="English" />
      </SettingsSection>
      <SettingsSection title="Time Zone">
        <Input label="Time Zone" placeholder="UTC+0" />
      </SettingsSection>
    </div>
  </>
);

const HelpSection = () => (
  <>
    <h1 className="text-2xl font-semibold text-white">Help & Support</h1>
    <div className="space-y-6">
      <SettingsSection title="Support">
        <div className="space-y-4 text-gray-200">
          <p>Need help? Contact our support team:</p>
          <p className="text-gray-400">support@example.com</p>
        </div>
      </SettingsSection>
      <SettingsSection title="Documentation">
        <div className="space-y-4 text-gray-200">
          <p>
            View our documentation for detailed information about using the
            platform.
          </p>
        </div>
      </SettingsSection>
    </div>
  </>
);
export default Test;