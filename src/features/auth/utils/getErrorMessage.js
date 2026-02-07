/**
 * Get a user-facing error message from an API error (e.g. axios).
 * Never returns status-code text like "Request failed with status code 400".
 * @param {unknown} err
 * @param {string} fallback
 * @returns {string}
 */
export function getErrorMessage(err, fallback = "Something went wrong") {
  const data = err?.response?.data;
  if (data == null) {
    return fallback;
  }

  // Backend may return a plain string body
  if (typeof data === "string") {
    return data.trim() || fallback;
  }

  // Try common response shapes: message, detail, error, msg
  let msg = data.message ?? data.detail ?? data.error ?? data.msg;

  if (msg == null) {
    return fallback;
  }

  // Array of strings
  if (Array.isArray(msg)) {
    const parts = msg
      .map((d) => (typeof d === "string" ? d : d?.msg ?? ""))
      .filter(Boolean);
    return parts.length ? parts.join(". ") : fallback;
  }

  // Single string
  if (typeof msg === "string") {
    return msg;
  }

  return fallback;
}
