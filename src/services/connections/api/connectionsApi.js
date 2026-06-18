import api from "../../api";

const throwIfApiError = (data) => {
  if (data && data.error) {
    throw new Error(data.error);
  }
};

/**
 * Send a pending connection request from the current user to a target user.
 *
 * Note: The API returns 200 OK even on some errors, so we manually check for
 * the presence of the "error" key in the response body.
 *
 * @param {number} connectedUserId The ID of the user to connect to.
 * @returns {Promise<object>} The pending connection record or throws an Error.
 */
export async function createConnection(connectedUserId) {
  const { data } = await api.post("/connections", {
    connected_user_id: connectedUserId,
  });

  throwIfApiError(data);

  return data;
}

/**
 * Get accepted/mutual connection IDs for the authenticated user.
 *
 * @returns {Promise<{ connected_user_ids: number[] }>}
 */
export async function getConnections() {
  const { data } = await api.get("/connections");
  throwIfApiError(data);
  return data;
}

/**
 * Get incoming pending connection requester IDs for the authenticated user.
 *
 * @returns {Promise<{ pending_requester_ids: number[] }>}
 */
export async function getPendingConnectionRequests() {
  const { data } = await api.get("/connections/pending");
  throwIfApiError(data);
  return data;
}

/**
 * Accept an incoming pending connection request.
 *
 * @param {number} requesterId The ID of the user whose request is being accepted.
 * @returns {Promise<object>} The accepted connection record or throws an Error.
 */
export async function acceptConnection(requesterId) {
  const { data } = await api.post("/connections/accept", {
    requester_id: requesterId,
  });

  throwIfApiError(data);
  return data;
}
