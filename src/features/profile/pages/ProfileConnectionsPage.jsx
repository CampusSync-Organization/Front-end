import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  ArrowLeft,
  Clock,
  Eye,
  UserCheck,
  UsersRound,
} from "lucide-react";
import { UserAvatar } from "../../../shared/ui/UserAvatar";
import {
  acceptConnectionRequest,
  fetchConnectionsWithHydration,
  fetchPendingConnectionRequestsWithHydration,
  selectConnectionsAcceptStatus,
  selectConnectionsError,
  selectConnectionsStatus,
  selectHydratedConnections,
  selectHydratedPendingRequesters,
  selectPendingConnectionsError,
  selectPendingConnectionsStatus,
  selectPendingRequesterIds,
} from "../../../services/connections/store/connectionsSlice";

const TABS = {
  connections: "connections",
  pending: "pending",
};

const getProfileUserId = (profile) => profile?.user_id || profile?.id;

const ProfileListItem = ({ profile, action }) => {
  const userId = getProfileUserId(profile);

  return (
    <article className="flex flex-col gap-4 rounded-lg border border-border-light bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <UserAvatar
          src={profile?.avatar_url}
          name={profile?.name || `Student ${userId}`}
          className="h-14 w-14 flex-shrink-0 rounded-xl object-cover text-lg"
        />
        <div className="min-w-0">
          <h2 className="truncate text-base font-bold text-primary">
            {profile?.name || `Student ${userId}`}
          </h2>
          <p className="text-sm font-medium text-slate-500">
            GPA: {profile?.cgpa ? profile.cgpa.toFixed(1) : "N/A"}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 sm:flex-nowrap">
        <Link
          to={`/user-profile/${userId}`}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-light px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-slate-50"
        >
          <Eye size={16} />
          View
        </Link>
        {action}
      </div>
    </article>
  );
};

const EmptyState = ({ icon: Icon, title, message }) => (
  <div className="rounded-lg border border-dashed border-border-light bg-white p-8 text-center">
    <Icon className="mx-auto mb-3 text-slate-400" size={32} />
    <h2 className="text-base font-bold text-primary">{title}</h2>
    <p className="mt-1 text-sm text-slate-500">{message}</p>
  </div>
);

const ProfileConnectionsPage = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(TABS.connections);
  const connections = useSelector(selectHydratedConnections);
  const pendingRequesters = useSelector(selectHydratedPendingRequesters);
  const pendingRequesterIds = useSelector(selectPendingRequesterIds);
  const connectionsStatus = useSelector(selectConnectionsStatus);
  const pendingStatus = useSelector(selectPendingConnectionsStatus);
  const connectionsError = useSelector(selectConnectionsError);
  const pendingError = useSelector(selectPendingConnectionsError);
  const acceptStatus = useSelector(selectConnectionsAcceptStatus);

  useEffect(() => {
    dispatch(fetchConnectionsWithHydration());
    dispatch(fetchPendingConnectionRequestsWithHydration());
  }, [dispatch]);

  const handleAccept = (requesterId) => {
    dispatch(acceptConnectionRequest(requesterId))
      .unwrap()
      .then(() => {
        toast.success("Connection request accepted");
      })
      .catch((err) => {
        toast.error(err || "Failed to accept connection request");
      });
  };

  const isLoading =
    activeTab === TABS.connections
      ? connectionsStatus === "loading"
      : pendingStatus === "loading";
  const activeError =
    activeTab === TABS.connections ? connectionsError : pendingError;

  return (
    <div className="min-h-screen bg-background-light p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/profile"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-primary"
            >
              <ArrowLeft size={16} />
              Back to profile
            </Link>
            <h1 className="text-2xl font-bold text-primary">Connections</h1>
          </div>
          <div className="inline-flex rounded-lg border border-border-light bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab(TABS.connections)}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold transition-colors ${
                activeTab === TABS.connections
                  ? "bg-primary text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <UsersRound size={16} />
              Connections
            </button>
            <button
              type="button"
              onClick={() => setActiveTab(TABS.pending)}
              className={`relative inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold transition-colors ${
                activeTab === TABS.pending
                  ? "bg-primary text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Clock size={16} />
              Requests
              {pendingRequesterIds.length > 0 && (
                <span className="ml-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-bold text-primary">
                  {pendingRequesterIds.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {activeError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
            {activeError}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-lg border border-border-light bg-white p-8 text-center text-sm font-semibold text-slate-500 shadow-sm">
            Loading...
          </div>
        ) : activeTab === TABS.connections ? (
          <div className="space-y-3">
            {connections.length > 0 ? (
              connections.map((profile) => (
                <ProfileListItem
                  key={getProfileUserId(profile)}
                  profile={profile}
                  action={
                    <span className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                      <UserCheck size={16} />
                      Connected
                    </span>
                  }
                />
              ))
            ) : (
              <EmptyState
                icon={UsersRound}
                title="No connections yet"
                message="Accepted connections will appear here."
              />
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequesters.length > 0 ? (
              pendingRequesters.map((profile) => {
                const requesterId = getProfileUserId(profile);
                const isAccepting = acceptStatus === "loading";

                return (
                  <ProfileListItem
                    key={requesterId}
                    profile={profile}
                    action={
                      <button
                        type="button"
                        onClick={() => handleAccept(requesterId)}
                        disabled={isAccepting}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <UserCheck size={16} />
                        {isAccepting ? "Accepting..." : "Accept"}
                      </button>
                    }
                  />
                );
              })
            ) : (
              <EmptyState
                icon={Clock}
                title="No pending requests"
                message="Incoming connection requests will appear here."
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileConnectionsPage;
