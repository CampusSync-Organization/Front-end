import { API_BASE_URL } from "../../services/api";

export const resolveAvatarUrl = (avatarUrl) => {
  if (!avatarUrl) {
    return null;
  }

  if (/^(https?:|blob:|data:)/i.test(avatarUrl)) {
    return avatarUrl;
  }

  return `${API_BASE_URL}${avatarUrl.startsWith("/") ? "" : "/"}${avatarUrl}`;
};
