import { API_BASE_URL } from "../../services/api";

export const resolveAvatarUrl = (avatarUrl) => {
  if (!avatarUrl) return null;

  // Already absolute URL (http/https/blob/data)
  if (/^(https?:|blob:|data:)/i.test(avatarUrl)) return avatarUrl;

  // Has a path prefix already (e.g. /uploads/..., /static/...)
  if (avatarUrl.startsWith("/")) {
    return `${API_BASE_URL}${avatarUrl}`;
  }

  // Bare filename — try /uploads/ which is the standard FastAPI StaticFiles mount
  return `${API_BASE_URL}/uploads/${avatarUrl}`;
};
