export function mapEvent(api, { isAttending = false } = {}) {
  const rawAttendees = Array.isArray(api.attendees) ? api.attendees : [];
  const attendees = rawAttendees.map((a) =>
    typeof a === "object" && a !== null ? a : { id: a }
  );

  return {
    id: api.id,
    type: "event",
    title: api.name ?? "",
    name: api.name ?? "",
    description: api.description ?? "",
    eventDate: api.date,
    eventTime: api.time ?? "",
    location: api.place ?? "",
    place: api.place ?? "",
    maxParticipants: api.capacity ?? null,
    currentParticipants: api.current_attendees ?? 0,
    organizerId: api.organizer_id,
    organizerName: api.organizer_name ?? "Unknown",
    communityId: api.community_id ?? null,
    attendees,
    community: api.community ?? null,
    organizer: api.organizer ?? null,
    imageUrl: api.image_url ?? api.image ?? null,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
    isAttending,
    tags: api.tags ?? [],
    club: api.community?.name ?? null,
  };
}

export function mapEvents(list, options = {}) {
  if (!Array.isArray(list)) return [];
  return list.map((item) => mapEvent(item, options));
}
