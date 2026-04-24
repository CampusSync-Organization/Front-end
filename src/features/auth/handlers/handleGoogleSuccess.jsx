import { googleLoginUser } from "../store/authSlice";

export const handleGoogleSuccess = async (
  credential,
  dispatch,
  navigate,
  toast,
) => {
  const result = await dispatch(googleLoginUser({ credential }));
  console.log("GOOGLE LOGIN RESULT PAYLOAD:", result.payload);
  if (googleLoginUser.fulfilled.match(result)) {
    const token = result.payload.token || result.payload.access_token;
    const user = result.payload.user;
    if (user?.assessment_completed) {
      navigate("/home", { replace: true });
    } else {
      navigate("/assessment", { replace: true });
    }
  } else {
    toast.error(result.payload ?? "Google sign in failed");
  }
};
