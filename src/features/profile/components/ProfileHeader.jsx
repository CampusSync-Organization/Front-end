import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Camera, Bell, UsersRound, UserCheck, UserRoundPlus, Clock, X, GraduationCap, Loader2,
} from "lucide-react";
import StartDirectChatButton from "../../chat/components/StartDirectChatButton";
import { useEditableSection } from "../hooks/useEditableSection";
import { resolveAvatarUrl } from "../../../shared/hooks/resolveAvatarUrl";
import { UserAvatar } from "../../../shared/ui/UserAvatar";

/* ── Connection action button ───────────────────────────────────────── */
const ConnectionBtn = ({
  isConnected, isConnecting, isRequestPending, isRequestDeclined,
  isIncomingRequest, isAccepting, onConnect, onAcceptConnection, onDeclineConnection,
}) => {
  if (isIncomingRequest && !isConnected && !isRequestDeclined) {
    return (
      <div className="flex gap-2">
        <button
          onClick={onAcceptConnection}
          disabled={isAccepting}
          className="flex items-center gap-2 px-5 py-2 bg-secondary text-primary font-bold rounded-xl text-sm hover:bg-secondary/90 transition-all disabled:opacity-50"
        >
          {isAccepting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
          {isAccepting ? "Confirming…" : "Confirm"}
        </button>
        <button
          onClick={onDeclineConnection}
          disabled={isAccepting}
          className="flex items-center gap-2 px-5 py-2 bg-white/10 text-white font-bold rounded-xl text-sm hover:bg-white/20 transition-all disabled:opacity-50"
        >
          <X className="w-4 h-4" /> Decline
        </button>
      </div>
    );
  }

  const label = isAccepting ? "Accepting…" : isConnected ? "Connected"
    : isConnecting ? "Sending…" : isRequestPending ? "Pending"
    : isRequestDeclined ? "Declined" : "Connect";

  const Icon = isConnected ? UserCheck : isRequestPending ? Clock
    : isRequestDeclined ? X : UserRoundPlus;

  const cls = isConnected
    ? "bg-emerald-500/90 text-white cursor-default"
    : isRequestPending || isRequestDeclined
    ? "bg-white/10 text-white/70 cursor-default"
    : "bg-secondary text-primary hover:bg-secondary/90 disabled:opacity-50";

  return (
    <button
      onClick={isConnected || isRequestPending || isRequestDeclined ? undefined : onConnect}
      disabled={isConnecting || isAccepting}
      className={`flex items-center gap-2 px-5 py-2 font-bold rounded-xl text-sm transition-all ${cls}`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
};

/* ── Main ProfileHeader ─────────────────────────────────────────────── */
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
  const buildPayload = useCallback((draft) => draft.avatar ? { avatar: draft.avatar } : {}, []);
  const { updateDraft, isEditing, startEdit, cancelEdit, save, isSaving, error } =
    useEditableSection(initialValues, { buildPayload });

  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const avatar = previewUrl || user.avatar;
  const resolvedAvatar = resolveAvatarUrl(avatar);
  const fullName = `${user.firstName} ${user.lastName}`.trim();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(file); });
    updateDraft({ avatar: file });
    startEdit();
  };

  const handleSaveAvatar = async () => {
    const updated = await save();
    if (updated) { setPreviewUrl(null); if (fileInputRef.current) fileInputRef.current.value = ""; }
  };

  const handleCancelAvatar = () => {
    cancelEdit(); setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg">
      {/* Cover */}
      <div
        className="h-40 sm:h-52 w-full"
        style={{ background: "linear-gradient(135deg, #14213D 0%, #1e3a5f 60%, #14213D 100%)" }}
      >
        {/* Subtle dot grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, #FCA311 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
      </div>

      {/* White card underneath */}
      <div className="bg-white px-6 sm:px-8 pb-6">
        {/* Avatar row — overlaps the cover */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14 sm:-mt-16 mb-5">
          {/* Avatar */}
          <div className="relative shrink-0 self-start sm:self-auto">
            <div
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl ring-4 ring-white shadow-lg overflow-hidden bg-slate-200 ${isOwnProfile ? "cursor-pointer group" : ""}`}
              onClick={isOwnProfile ? () => fileInputRef.current?.click() : undefined}
            >
              {resolvedAvatar ? (
                <img src={resolvedAvatar} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                <UserAvatar name={fullName} className="w-full h-full text-4xl" />
              )}
              {isOwnProfile && (
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="text-white" size={22} />
                </div>
              )}
            </div>
            {isOwnProfile && (
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            )}
          </div>

          {/* Name + meta — pushed to the right, aligned to bottom of cover */}
          <div className="flex-1 min-w-0 pb-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight leading-tight">
              {fullName || "Student"}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/8 text-primary rounded-full text-sm font-bold">
                <GraduationCap className="w-3.5 h-3.5" />
                GPA {user.gpa ? Number(user.gpa).toFixed(1) : "N/A"}
              </span>
              {isOwnProfile && connectionSummary && (
                <button
                  onClick={connectionSummary.onClick}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-low border border-outline-variant/20 text-on-surface-variant rounded-full text-sm font-semibold hover:border-primary/30 hover:text-primary transition-colors"
                >
                  <UsersRound className="w-3.5 h-3.5" />
                  {connectionSummary.count} {connectionSummary.count === 1 ? "Connection" : "Connections"}
                  {connectionSummary.pendingCount > 0 && (
                    <span className="ml-1 flex items-center gap-0.5 text-secondary font-bold">
                      <Bell className="w-3 h-3" />
                      {connectionSummary.pendingCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Actions — own profile: save avatar; other profile: connect + message */}
          <div className="shrink-0 flex items-center gap-2 pb-1">
            {isOwnProfile && isEditing ? (
              <div className="flex flex-col gap-1.5">
                {error && <p className="text-xs text-red-500">{error}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelAvatar}
                    disabled={isSaving}
                    className="px-4 py-1.5 rounded-xl border border-outline-variant/20 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAvatar}
                    disabled={isSaving}
                    className="px-4 py-1.5 rounded-xl bg-secondary text-primary text-sm font-bold hover:bg-secondary/90 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? "Saving…" : "Save Photo"}
                  </button>
                </div>
              </div>
            ) : !isOwnProfile ? (
              <div className="flex items-center gap-2">
                <ConnectionBtn
                  isConnected={isConnected}
                  isConnecting={isConnecting}
                  isRequestPending={isRequestPending}
                  isRequestDeclined={isRequestDeclined}
                  isIncomingRequest={isIncomingRequest}
                  isAccepting={isAccepting}
                  onConnect={onConnect}
                  onAcceptConnection={onAcceptConnection}
                  onDeclineConnection={onDeclineConnection}
                />
                {isConnected && (
                  <StartDirectChatButton
                    userId={user.userId}
                    userName={user.firstName}
                    className="px-5 py-2 font-bold rounded-xl text-sm"
                  />
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
