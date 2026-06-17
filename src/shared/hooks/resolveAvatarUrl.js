import { API_BASE_URL } from "../../services/api";
const FALLBACK_AVATAR = "/campussync-icon.png";
export const resolveAvatarUrl = (avatarUrl) => {
  if (!avatarUrl) {
    return FALLBACK_AVATAR;
  }

  if (/^https?:\/\//i.test(avatarUrl)) {
    return avatarUrl;
  }

  return `${API_BASE_URL}${avatarUrl.startsWith("/") ? "" : "/"}${avatarUrl}`;
};
