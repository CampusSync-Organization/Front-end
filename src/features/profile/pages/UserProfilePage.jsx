import React from "react";
import { MOCK_OTHER_USER } from "../api/mockData";
import { UserSidebar } from "../components/UserSidebar";
import { UserAnnouncements } from "../components/UserAnnouncements";
import { UserProjects } from "../components/UserProjects";
import { UserReviews } from "../components/UserReviews";

const UserProfilePage = () => {
  const user = MOCK_OTHER_USER;

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12 font-['Inter']">
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* Top Section: Sidebar + Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Reduced width relative to content if needed, fitting content */}
          <div className="lg:col-span-4 xl:col-span-3">
            <UserSidebar user={user} />
          </div>

          {/* Right Column - Announcements & Projects */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-8">
            <UserAnnouncements announcements={user.announcements} />
            <UserProjects projects={user.projects} />
          </div>
        </div>

        {/* Bottom Section: Reviews - Full Width */}
        <div className="w-full">
          <UserReviews reviews={user.reviews} />
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
