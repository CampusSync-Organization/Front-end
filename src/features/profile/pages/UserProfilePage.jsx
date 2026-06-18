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
import { toast } from "sonner";
import {
  acceptConnectionRequest,
  dismissPendingConnectionRequest,
  fetchConnections,
  fetchPendingConnectionRequests,
  addConnection,
  selectDeclinedRequesterIds,
  selectConnectedUserIds,
  selectConnectionsAcceptStatus,
  selectConnectionsCreateStatus,
  selectPendingRequesterIds,
  selectSentRequestUserIds,
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

const UserProfilePage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const profile = useSelector(selectViewedProfile);
    const status = useSelector(selectViewedProfileStatus);
    const error = useSelector(selectViewedProfileError);

    // Retrieve current logged-in user from auth state
    const currentUser = useSelector((state) => state.auth?.user);
    const currentUserId = currentUser?.id || currentUser?.userID;

    // Retrieve connections state
    const connectedUserIds = useSelector(selectConnectedUserIds);
    const pendingRequesterIds = useSelector(selectPendingRequesterIds);
    const declinedRequesterIds = useSelector(selectDeclinedRequesterIds);
    const sentRequestUserIds = useSelector(selectSentRequestUserIds);
    const createStatus = useSelector(selectConnectionsCreateStatus);
    const acceptStatus = useSelector(selectConnectionsAcceptStatus);

    const isConnected = profile && connectedUserIds.includes(profile.user_id);
    const isRequestPending = profile && sentRequestUserIds.includes(profile.user_id);
    const isRequestDeclined = profile && declinedRequesterIds.includes(profile.user_id);
    const isIncomingRequest = profile && pendingRequesterIds.includes(profile.user_id);
    const isConnecting = createStatus === "loading";
    const isAccepting = acceptStatus === "loading";

    useEffect(() => {
        if (id) {
            dispatch(fetchProfileByUserId(id));
        }

        return () => {
            dispatch(resetViewedProfile());
        };
    }, [dispatch, id]);

    useEffect(() => {
        if (currentUserId) {
            dispatch(fetchConnections());
            dispatch(fetchPendingConnectionRequests());
        }
    }, [dispatch, currentUserId]);

    const handleConnect = () => {
        if (!profile?.user_id) return;
        dispatch(addConnection(profile.user_id))
            .unwrap()
            .then(() => {
                toast.success("Connection request sent");
            })
            .catch((err) => {
                toast.error(err || "Failed to send connection request");
            });
    };

    const handleAcceptConnection = () => {
        if (!profile?.user_id) return;
        dispatch(acceptConnectionRequest(profile.user_id))
            .unwrap()
            .then(() => {
                toast.success("Connection request accepted");
            })
            .catch((err) => {
                toast.error(err || "Failed to accept connection request");
            });
    };

    const handleDeclineConnection = () => {
        if (!profile?.user_id) return;
        dispatch(dismissPendingConnectionRequest(profile.user_id));
        toast.success("Connection request declined");
    };

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
                        <ProfileHeader
                            user={user}
                            isOwnProfile={false}
                            isConnected={isConnected}
                            isConnecting={isConnecting}
                            isRequestPending={isRequestPending}
                            isRequestDeclined={isRequestDeclined}
                            isIncomingRequest={isIncomingRequest}
                            isAccepting={isAccepting}
                            onConnect={handleConnect}
                            onAcceptConnection={handleAcceptConnection}
                            onDeclineConnection={handleDeclineConnection}
                        />
                        <ProfileAbout user={user} isOwnProfile={false} />
                        <ProfileInfo user={user} isOwnProfile={false} />
                        <ProfileAnnouncements
                            user={user}
                            announcements={[]}
                            isOwnProfile={false}
                        />
                        <UserProjects projects={projects} isOwnProfile={false} />
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
