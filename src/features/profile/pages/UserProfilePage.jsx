import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ProfileHeader } from "../components/ProfileHeader";
import { ProfileAbout } from "../components/ProfileAbout";
import { ProfileInfo } from "../components/ProfileInfo";
import { ProfileAnnouncements } from "../components/ProfileAnnouncements";
import { UserProjects } from "../components/UserProjects";
import { UserReviews } from "../components/UserReviews";
import { UserProfileSidebar } from "../components/UserProfileSidebar";
import {
  fetchProfileByUserId,
  resetViewedProfile,
  selectViewedProfile,
  selectViewedProfileStatus,
  selectViewedProfileError,
} from "../store/profileSlice";
import { API_BASE_URL } from "../../../services/api";

const FALLBACK_AVATAR = "/campussync-icon.png";

const resolveAvatarUrl = (avatarUrl) => {
  if (!avatarUrl) return FALLBACK_AVATAR;
  if (/^https?:\/\//i.test(avatarUrl)) return avatarUrl;
  return `${API_BASE_URL}${avatarUrl.startsWith("/") ? "" : "/"}${avatarUrl}`;
};

const splitName = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "Student",
    lastName: parts.slice(1).join(" "),
  };
};

const mapProfileToUser = (profile) => {
  const { firstName, lastName } = splitName(profile?.name);
  return {
    id: profile.id,
    userId: profile.user_id,
    firstName,
    lastName,
    avatar: resolveAvatarUrl(profile.avatar_url),
    college: "",
    faculty: "",
    gpa: profile.cgpa,
    gender: "",
    bio: profile.bio || "",
    tags: Array.isArray(profile.tags) ? profile.tags : [],
    goals: "",
    reviews: [],
  };
};

const mapProjects = (projects = []) =>
  projects.map((project, index) => ({
    id: `${index}-${project}`,
    title: project,
    description: "No project details added yet.",
    techStack: [],
    featured: false,
  }));

const UserProfilePage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const profile = useSelector(selectViewedProfile);
    const status = useSelector(selectViewedProfileStatus);
    const error = useSelector(selectViewedProfileError);

    useEffect(() => {
        if (id) {
            dispatch(fetchProfileByUserId(id));
        }

        return () => {
            dispatch(resetViewedProfile());
        };
    }, [dispatch, id]);

    if (status === "loading" || status === "idle") {
        return (
            <div className="min-h-screen bg-background-light p-4 md:p-8 flex items-center justify-center">
                <div className="text-slate-500 font-medium">Loading profile...</div>
            </div>
        );
    }

    if (status === "failed") {
        return (
            <div className="min-h-screen bg-background-light p-4 md:p-8 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
                    <p className="text-slate-500 mb-4">{error || "Could not load profile."}</p>
                    <button
                        onClick={() => dispatch(fetchProfileByUserId(id))}
                        className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-background-light p-4 md:p-8 flex items-center justify-center">
                <div className="text-slate-500 font-medium text-lg">Profile not found.</div>
            </div>
        );
    }

    const user = mapProfileToUser(profile);
    const projects = mapProjects(Array.isArray(profile.projects) ? profile.projects : []);

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
                            announcements={[]}
                            isOwnProfile={false}
                        />
                        <UserProjects projects={projects} />
                        <UserReviews reviews={[]} />
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
