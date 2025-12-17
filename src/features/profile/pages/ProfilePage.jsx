import React from "react";
import { MOCK_USER, MOCK_ANNOUNCEMENTS } from "../api/mockData";
import { ProfileHeader } from "../components/ProfileHeader";
import { ProfileAbout } from "../components/ProfileAbout";
import { ProfileInfo } from "../components/ProfileInfo";
import { ProfileAnnouncements } from "../components/ProfileAnnouncements";
import { ProfileSecurity } from "../components/ProfileSecurity";

const ProfilePage = () => {
  // In a real app, these would come from Redux or an API hook
  const user = MOCK_USER;
  const announcements = MOCK_ANNOUNCEMENTS;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-[1000px] mx-auto space-y-6">
        <ProfileHeader user={user} />
        <ProfileAbout user={user} />
        <ProfileInfo user={user} />
        <ProfileSecurity user={user} />
        <ProfileAnnouncements announcements={announcements} />
      </div>
    </div>
  );
};

export default ProfilePage;
