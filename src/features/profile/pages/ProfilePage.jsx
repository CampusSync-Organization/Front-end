import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ProfileHeader } from "../components/ProfileHeader";
import { ProfileAbout } from "../components/ProfileAbout";
import { ProfileInfo } from "../components/ProfileInfo";
import { ProfileAnnouncements } from "../components/ProfileAnnouncements";
import { ProfileSecurity } from "../components/ProfileSecurity";
import { UserProjects } from "../components/UserProjects";
import { UserReviews } from "../components/UserReviews";
import {
  fetchMyProfile,
  selectMyProfile,
  selectProfileError,
  selectProfileStatus,
} from "../store/profileSlice";
import {
  fetchConnections,
  fetchPendingConnectionRequests,
  selectConnectedUserIds,
  selectPendingRequesterIds,
} from "../../../services/connections/store/connectionsSlice";

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
    avatar: profile.avatar_url,
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
  projects.map((project, index) => {
    if (typeof project === "string") {
      try {
        const parsed = JSON.parse(project);
        if (parsed && typeof parsed === "object") {
          return {
            id: `${index}-${parsed.title || project}`,
            title: parsed.title || project,
            description: parsed.description || "No project details added yet.",
            image: parsed.image || parsed.image_path || null,
            techStack: parsed.techStack || [],
            featured: false,
          };
        }
      } catch {
        // Ignore invalid serialized project data and fall back to the raw title.
      }
      return {
        id: `${index}-${project}`,
        title: project,
        description: "No project details added yet.",
        image: null,
        techStack: [],
        featured: false,
      };
    }
    return {
      id: `${index}-${project.title || "Project"}`,
      title: project.title || "Project",
      description: project.description || "No project details added yet.",
      image: project.image || project.image_url || project.image_path || null,
      techStack: project.techStack || [],
      featured: project.featured || false,
    };
  });

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasRequestedProfile = useRef(false);
  const profile = useSelector(selectMyProfile);
  const status = useSelector(selectProfileStatus);
  const error = useSelector(selectProfileError);
  const connectedUserIds = useSelector(selectConnectedUserIds);
  const pendingRequesterIds = useSelector(selectPendingRequesterIds);

  useEffect(() => {
    if (!hasRequestedProfile.current && !profile && status !== "loading") {
      hasRequestedProfile.current = true;
      dispatch(fetchMyProfile());
    }
  }, [dispatch, profile, status]);

  useEffect(() => {
    dispatch(fetchConnections());
    dispatch(fetchPendingConnectionRequests());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(fetchMyProfile());
  };

  if (status === "loading" || (status === "idle" && !profile)) {
    return (
      <div className="min-h-screen bg-background-light p-4 md:p-8">
        <div className="max-w-4xl mx-auto rounded-xl border border-border-light bg-card-light p-8 shadow-sm">
          <p className="text-slate-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-background-light p-4 md:p-8">
        <div className="max-w-4xl mx-auto rounded-xl border border-border-light bg-card-light p-8 shadow-sm">
          <h1 className="mb-2 text-xl font-bold text-primary">
            Could not load profile
          </h1>
          <p className="mb-6 text-slate-500">
            {error || "Something went wrong while loading your profile."}
          </p>
          <button
            onClick={handleRetry}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background-light p-4 md:p-8">
        <div className="max-w-4xl mx-auto rounded-xl border border-border-light bg-card-light p-8 shadow-sm">
          <h1 className="text-xl font-bold text-primary">Profile not found</h1>
          <p className="mt-2 text-slate-500">
            No profile data is available for this account.
          </p>
        </div>
      </div>
    );
  }

  const user = mapProfileToUser(profile);
  const projects = mapProjects(
    Array.isArray(profile.projects) ? profile.projects : [],
  );

  return (
    <div className="min-h-screen bg-background-light p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <ProfileHeader
          user={user}
          connectionSummary={{
            count: connectedUserIds.length,
            pendingCount: pendingRequesterIds.length,
            onClick: () => navigate("/profile/connections"),
          }}
        />
        <ProfileAbout user={user} />
        <ProfileInfo user={user} />
        <ProfileAnnouncements />
        <UserProjects projects={projects} />
        <UserReviews reviews={[]} />
        <ProfileSecurity user={user} />
      </div>
    </div>
  );
};

export default ProfilePage;
