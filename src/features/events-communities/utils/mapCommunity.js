/**
 * Maps API community shape to UI model used by cards/details pages.
 * @param {Record<string, unknown>} api
 * @param {{ joinedIds?: number[], userId?: number | string | null }} [options]
 */
export function mapCommunity(api, options = {}) {
  const { joinedIds = [], userId = null } = options;
  const id = api.id;
  const moderatorId = api.moderator_id;
  const numericUserId = userId != null ? Number(userId) : null;
  const isJoined =
    joinedIds.includes(id) ||
    (numericUserId != null && Number(moderatorId) === numericUserId);

  const membersFromApi = Array.isArray(api.members)
    ? api.members.map((m) => (typeof m === "object" ? m.id : m))
    : [];

  return {
    id,
    type: "community",
    name: api.name ?? "",
    description: api.description ?? "",
    category: api.category ?? "Community",
    moderatorId,
    organizerId: moderatorId,
    organizerName: api.organizer_name ?? api.moderator_name ?? "Unknown",
    memberCount: api.member_count ?? membersFromApi.length ?? 0,
    members:
      membersFromApi.length > 0
        ? membersFromApi
        : isJoined && numericUserId != null
          ? [numericUserId]
          : [],
    membersList: Array.isArray(api.members) ? api.members : [],
    posts: Array.isArray(api.posts) ? api.posts : [],
    events: Array.isArray(api.events) ? api.events : [],
    createdAt: api.created_at,
    updatedAt: api.updated_at,
    tags: api.tags ?? [],
    privacy: api.privacy ?? "public",
    meetingSchedule: api.meeting_schedule,
    isJoined,
    roomId: api.room_id ?? null,
  };
}

export function mapCommunities(list, options = {}) {
  if (!Array.isArray(list)) return [];
  return list.map((item) => mapCommunity(item, options));
}
