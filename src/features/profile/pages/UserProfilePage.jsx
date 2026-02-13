import React from "react";
import { MOCK_OTHER_USER } from "../api/mockData";
import { ProfileHeader } from "../components/ProfileHeader";
import { ProfileAbout } from "../components/ProfileAbout";
import { ProfileInfo } from "../components/ProfileInfo";
import { ProfileAnnouncements } from "../components/ProfileAnnouncements";
import { UserProjects } from "../components/UserProjects";
import { UserReviews } from "../components/UserReviews";
import { UserProfileSidebar } from "../components/UserProfileSidebar";

const UserProfilePage = () => {
    const user = MOCK_OTHER_USER;

    return (
        <div className="min-h-screen bg-background-light p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content Column */}
                    <div className="lg:col-span-8 space-y-6">
                        <ProfileHeader user={user} isOwnProfile={false} />
                        <ProfileAbout user={user} isOwnProfile={false} />
                        <ProfileInfo user={user} isOwnProfile={false} />
                        <ProfileAnnouncements
                            user={user}
                            announcements={user.announcements || []}
                            isOwnProfile={false}
                        />
                        <UserProjects projects={user.projects} />
                        <UserReviews reviews={user.reviews} />
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <UserProfileSidebar />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
