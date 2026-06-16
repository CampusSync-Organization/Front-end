import api from "../../../services/api";

const isFile = (value) => typeof File !== "undefined" && value instanceof File;

const buildProfileFormData = (updates) => {
  const formData = new FormData();

  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (key === "avatar_url") {
      return;
    }

    if (isFile(value)) {
      formData.append(key, value);
      return;
    }

    if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, value);
  });

  return formData;
};

export async function getMyProfile() {
  const { data } = await api.get("/me/profile");
  return data;
}

export async function updateMyProfile(updates) {
  const payload = buildProfileFormData(updates);
  const { data } = await api.put("/me/profile", payload);

  return data;
}

export async function getProfileByUserId(userId) {
  const { data } = await api.get(`/profiles/${userId}`);
  return data;
}
