const API_BASE =
  process.env.CAMPUSSYNC_API_BASE ||
  "https://back-end-production-7229.up.railway.app";
const token = process.env.CAMPUSSYNC_TOKEN;
const updateJson = process.env.PROFILE_UPDATE_JSON;
const userId = process.env.PROFILE_USER_ID;

if (!token) {
  console.error("Missing CAMPUSSYNC_TOKEN.");
  console.error(
    "Example: CAMPUSSYNC_TOKEN=your_jwt npm run smoke:profile-api",
  );
  process.exit(1);
}

async function request(label, path, options = {}) {
  console.log(`\n${label}`);
  console.log(`${options.method || "GET"} ${API_BASE}${path}`);

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const text = await response.text();
  let body = text;

  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    // Keep non-JSON responses readable.
  }

  console.log("Status:", response.status, response.statusText);
  console.log("Body:", JSON.stringify(body, null, 2));

  if (!response.ok) {
    throw new Error(`${label} failed with status ${response.status}`);
  }

  return body;
}

try {
  const myProfile = await request("Get my profile", "/me/profile");

  if (updateJson) {
    await request("Update my profile", "/me/profile", {
      method: "PUT",
      body: updateJson,
    });
  } else {
    console.log(
      "\nSkipping update. Set PROFILE_UPDATE_JSON to test PUT /me/profile.",
    );
  }

  const targetUserId = userId || myProfile?.user_id;

  if (targetUserId) {
    await request("Get profile by user ID", `/profiles/${targetUserId}`);
  } else {
    console.log(
      "\nSkipping user lookup. Set PROFILE_USER_ID or use a token with a profile.",
    );
  }
} catch (err) {
  console.error("\nSmoke test failed:", err.message);
  process.exit(1);
}
