import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Bell,
  Camera,
  Clock,
  UserCheck,
  UserRoundPlus,
  UsersRound,
  X,
} from "lucide-react";
import StartDirectChatButton from "../../chat/components/StartDirectChatButton";
import { useEditableSection } from "../hooks/useEditableSection";
import { resolveAvatarUrl } from "../../../shared/hooks/resolveAvatarUrl";
import { UserAvatar } from "../../../shared/ui/UserAvatar";

const ImageModal = ({ isOpen, onClose, imgSrc, name, onUpload }) => {
  if (!isOpen) return null;

  const resolvedImgSrc = resolveAvatarUrl(imgSrc);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <span className="material-icons-outlined text-2xl">close</span>
        </button>

        {resolvedImgSrc ? (
          <img
            src={resolvedImgSrc}
            alt="Profile Full Screen"
            className="max-h-[70vh] w-auto object-contain rounded-lg shadow-2xl mb-6"
          />
        ) : (
          <UserAvatar
            name={name}
            className="mb-6 h-48 w-48 rounded-2xl text-5xl"
            fallbackClassName="bg-secondary/10 text-secondary"
          />
        )}

        <div className="flex gap-4">
          <button
            onClick={onUpload}
            className="flex items-center gap-2 px-6 py-3 bg-secondary/90 text-card font-bold rounded-lg hover:bg-secondary/90 transition-colors shadow-lg"
          >
            <Camera size={20} />
            Update Photo
          </button>
        </div>
      </div>
    </div>
  );
};

const ConnectionsSummary = ({ count = 0, pendingCount = 0, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-3 rounded-lg border border-border-light bg-white px-4 py-2 text-left shadow-sm transition-colors hover:border-secondary/60 hover:bg-secondary/10"
  >
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
      <UsersRound size={18} />
    </span>
    <span>
      <span className="block text-sm font-bold text-primary">
        {count} {count === 1 ? "Connection" : "Connections"}
      </span>
      <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
        <Bell size={13} />
        {pendingCount > 0
          ? `${pendingCount} new ${pendingCount === 1 ? "request" : "requests"}`
          : "No new requests"}
      </span>
    </span>
  </button>
);

export const ProfileHeader = ({
  user,
  isOwnProfile = true,
  isConnected = false,
  isConnecting = false,
  isRequestPending = false,
  isRequestDeclined = false,
  isIncomingRequest = false,
  isAccepting = false,
  onConnect,
  onAcceptConnection,
  onDeclineConnection,
  connectionSummary,
}) => {
  const initialValues = useMemo(() => ({ avatar: null }), []);
  const buildPayload = useCallback((draft) => {
    if (!draft.avatar) {
      return {};
    }

    return { avatar: draft.avatar };
  }, []);
  const {
    updateDraft,
    isEditing,
    startEdit,
    cancelEdit,
    save,
    isSaving,
    error,
  } = useEditableSection(initialValues, { buildPayload });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const avatar = previewUrl || user.avatar;

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl);
        }
        return imageUrl;
      });
      updateDraft({ avatar: file });
      startEdit();
      setIsModalOpen(false);
    }
  };

  const handleCancelAvatar = () => {
    cancelEdit();
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveAvatar = async () => {
    const updatedProfile = await save();

    if (updatedProfile && fileInputRef.current) {
      fileInputRef.current.value = "";
      setPreviewUrl(null);
    }
  };

  const connectionButtonDisabled =
    isConnecting || isAccepting || isConnected || isRequestPending || isRequestDeclined;
  const connectionButtonLabel = isAccepting
    ? "Accepting..."
    : isIncomingRequest
      ? "Accept Request"
      : isRequestDeclined
        ? "Declined"
      : isConnecting
        ? "Sending..."
        : isConnected
          ? "Connected"
          : isRequestPending
            ? "Pending"
            : "Connect";
  const ConnectionButtonIcon = isConnected
    ? UserCheck
    : isIncomingRequest
      ? UserCheck
      : isRequestDeclined
        ? X
      : isRequestPending
      ? Clock
      : UserRoundPlus;
  const connectionButtonClass = isConnected
    ? "bg-emerald-600 text-white cursor-default"
    : isRequestDeclined
      ? "bg-slate-200 text-slate-600 cursor-default"
    : isRequestPending
      ? "bg-slate-200 text-slate-600 cursor-default"
      : isIncomingRequest
        ? "bg-primary text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        : "bg-secondary/90 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <>
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imgSrc={avatar}
        name={`${user.firstName} ${user.lastName}`}
        onUpload={handleUploadClick}
      />

      <section className="bg-card-light p-6 sm:p-8 rounded-xl shadow-sm border border-border-light w-full">
        {/* Two-row layout for better responsiveness */}
        <div className="flex flex-col gap-6">
          {/* Row 1: Avatar + User Info */}
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar Section */}
            <div className="relative flex-shrink-0">
              <div
                className={`w-32 h-32 rounded-2xl bg-slate-200 flex items-center justify-center overflow-hidden ${
                  isOwnProfile ? "cursor-pointer group" : ""
                }`}
                onClick={isOwnProfile ? handleImageClick : undefined}
              >
                <UserAvatar
                  src={avatar}
                  name={`${user.firstName} ${user.lastName}`}
                  className={`w-full h-full object-cover text-4xl ${
                    isOwnProfile
                      ? "transition-opacity group-hover:opacity-90"
                      : ""
                  }`}
                />
                {isOwnProfile && (
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="text-white drop-shadow-md" size={32} />
                  </div>
                )}
              </div>
              {isOwnProfile && (
                <>
                  <button
                    onClick={handleUploadClick}
                    className="absolute -bottom-2 -right-2 bg-secondary text-primary p-2 rounded-full shadow-lg hover:scale-105 transition-transform"
                  >
                    <Camera size={16} />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </>
              )}
            </div>
              {isOwnProfile && isEditing && (
                <div className="mt-3 flex flex-col gap-2">
                  {error && (
                    <p className="text-xs font-medium text-red-500">{error}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelAvatar}
                      disabled={isSaving}
                      className="rounded-lg border border-border-light bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAvatar}
                      disabled={isSaving}
                      className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSaving ? "Saving..." : "Save Photo"}
                    </button>
                  </div>
                </div>
              )}

            {/* User Info Section */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                {user.firstName} {user.lastName}
              </h1>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                {isOwnProfile && connectionSummary && (
                  <ConnectionsSummary
                    count={connectionSummary.count}
                    pendingCount={connectionSummary.pendingCount}
                    onClick={connectionSummary.onClick}
                  />
                )}
                <div className="inline-flex items-center px-4 py-1.5 bg-slate-100 rounded-full text-sm font-semibold text-primary border border-border-light">
                  GPA: {user.gpa ? user.gpa.toFixed(1) : "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Action Buttons (full width on their own row) */}
          {!isOwnProfile && (
            <div className="flex flex-col sm:flex-row sm:justify-center  gap-3 w-full sm:w-auto">
              {isIncomingRequest && !isConnected && !isRequestDeclined ? (
                <>
                  <button
                    onClick={onAcceptConnection}
                    disabled={isAccepting}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-primary text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <UserCheck size={18} />
                    {isAccepting ? "Confirming..." : "Confirm"}
                  </button>
                  <button
                    onClick={onDeclineConnection}
                    disabled={isAccepting}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-slate-200 text-slate-700 font-bold rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X size={18} />
                    Decline
                  </button>
                </>
              ) : (
                <button
                  onClick={connectionButtonDisabled ? undefined : onConnect}
                  disabled={connectionButtonDisabled}
                  className={`flex-1 sm:flex-none px-6 py-2.5 font-bold rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap ${connectionButtonClass}`}
                >
                  <ConnectionButtonIcon size={18} />
                  {connectionButtonLabel}
                </button>
              )}
              {isConnected && (
                <StartDirectChatButton
                  userId={user.userId}
                  userName={user.firstName}
                  className="flex-1 sm:flex-none px-6 py-2.5 font-bold rounded-lg whitespace-nowrap justify-center"
                />
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
