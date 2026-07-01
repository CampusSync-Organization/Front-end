import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion as Motion } from "framer-motion";
import {
  Loader2,
  Inbox,
  SlidersHorizontal,
} from "lucide-react";
import AnnouncementCard from "./AnnouncementCard";
import ComposeBox from "./ComposeBox";

import {
  fetchAnnouncements,
  fetchMyAnnouncements,
  silentRefreshAnnouncements,
  silentRefreshMyAnnouncements,
  selectAllAnnouncements,
  selectAnnouncementStatus,
  selectMyAnnouncements,
  selectMyAnnouncementStatus,
} from "../store/announcementSlice";
import { announcementApi } from "../api/announcementApi";
import useChatStore from "../../chat/store/useChatStore";

export default function AnnouncementFeed() {
  const dispatch = useDispatch();
  const globalPosts = useSelector(selectAllAnnouncements);
  const globalStatus = useSelector(selectAnnouncementStatus);
  const myPosts = useSelector(selectMyAnnouncements);
  const myStatus = useSelector(selectMyAnnouncementStatus);
  const currentUser = useSelector((s) => s.auth.user);
  const incomingJoinRequests = useChatStore((s) => s.incomingJoinRequests);
  const fetchIncomingJoinRequests = useChatStore(
    (s) => s.fetchIncomingJoinRequests,
  );

  const [feedScope, setFeedScope] = useState("all");
  const [announcementType, setAnnouncementType] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filters = useMemo(
    () => (announcementType === "all" ? {} : { type: announcementType }),
    [announcementType],
  );
  const isMyFeed = feedScope === "mine";
  const posts = isMyFeed ? myPosts : globalPosts;
  const status = isMyFeed ? myStatus : globalStatus;

  useEffect(() => {
    fetchIncomingJoinRequests();

    if (isMyFeed) {
      dispatch(fetchMyAnnouncements(filters));
      return;
    }

    dispatch(fetchAnnouncements(filters));
  }, [dispatch, fetchIncomingJoinRequests, filters, isMyFeed]);

  // Poll for new join requests and announcements every 10 seconds (silent — no loading flash)
  useEffect(() => {
    const poll = async () => {
      fetchIncomingJoinRequests();
      try {
        if (isMyFeed) {
          const data = await announcementApi.getMyAnnouncements(filters);
          dispatch(silentRefreshMyAnnouncements(data));
        } else {
          const data = await announcementApi.getGlobalFeed(filters);
          dispatch(silentRefreshAnnouncements(data));
        }
      } catch {
        // silently ignore poll errors
      }
    };
    const interval = setInterval(poll, 10000);
    return () => clearInterval(interval);
  }, [fetchIncomingJoinRequests, dispatch, filters, isMyFeed]);

  const pendingJoinRequests = incomingJoinRequests.filter(
    (request) => request && !request.approved,
  );

  const requestsByTeamId = pendingJoinRequests.reduce((acc, request) => {
    if (!request.team_id) return acc;
    const key = String(request.team_id);
    acc[key] = [...(acc[key] ?? []), request];
    return acc;
  }, {});

  const getAnnouncementTeamId = (post) =>
    post?.team_id ?? post?.teamId ?? post?.team?.id ?? post?.team?.team_id;

  const getRequestsForPost = (post) => {
    const teamId = getAnnouncementTeamId(post);
    if (teamId) return requestsByTeamId[String(teamId)] ?? [];

    // Fallback for announcement payloads that omit team_id but expose the team name.
    const title = post?.team_name ?? post?.project_name;
    if (!title) return [];

    return pendingJoinRequests.filter(
      (request) =>
        request.team_name &&
        request.team_name.toLowerCase() === String(title).toLowerCase(),
    );
  };

  const filterLabel = `${feedScope === "mine" ? "My" : "All"} / ${
    announcementType === "project-announcement"
      ? "Projects"
      : announcementType === "connection-update"
        ? "Connections"
        : "All types"
  }`;

  return (
    <div className="space-y-4 pb-10">
      {/* Compose box */}
      <ComposeBox />

      <div className="flex justify-end">
        <div className="relative">
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-bold text-gray-700 shadow-sm hover:border-gray-300 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            {filterLabel}
          </button>

          {filtersOpen && (
            <div className="absolute right-0 z-30 mt-2 w-64 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl">
              <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                Feed
              </p>
              {[
                ["all", "All announcements"],
                ["mine", "My announcements"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setFeedScope(value);
                    setFiltersOpen(false);
                  }}
                  className={`w-full rounded-xl px-3 py-2 text-left text-[13px] font-semibold transition-colors ${
                    feedScope === value
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </button>
              ))}

              <p className="px-2 pb-2 pt-3 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                Type
              </p>
              {[
                ["all", "All types"],
                ["project-announcement", "Project announcements"],
                ["connection-update", "Connection updates"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setAnnouncementType(value);
                    setFiltersOpen(false);
                  }}
                  className={`w-full rounded-xl px-3 py-2 text-left text-[13px] font-semibold transition-colors ${
                    announcementType === value
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Posts */}
      {status === "loading" && posts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm flex items-center justify-center py-20">
          <Loader2 className="w-5 h-5 animate-spin text-gray-300" />
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <Inbox className="w-8 h-8 text-gray-200 mb-3" />
          <p className="text-[14px] font-semibold text-gray-400">
            No posts yet
          </p>
          <p className="text-[12px] text-gray-300 mt-1">
            Be the first to share something.
          </p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {posts.map((post) => (
            <Motion.div
              key={post.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              layout
            >
              <AnnouncementCard
                post={post}
                isOwner={
                  currentUser &&
                  (post.user_id == currentUser.userID ||
                    post.user_id == currentUser.id)
                }
                joinRequests={
                  currentUser &&
                  (post.user_id == currentUser.userID ||
                    post.user_id == currentUser.id)
                    ? getRequestsForPost(post)
                    : []
                }
              />
            </Motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}
