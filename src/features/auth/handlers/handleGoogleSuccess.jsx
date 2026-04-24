import { googleLoginUser } from "../store/authSlice";

export const handleGoogleSuccess = async (
  credential,
  dispatch,
  navigate,
  toast,
) => {
  const result = await dispatch(googleLoginUser({ credential }));
  if (googleLoginUser.fulfilled.match(result)) {
    const { token, user } = result.payload;
    if (user.assessment_completed) {
      navigate("/home", { replace: true });
    } else {
      navigate("/assessment", { replace: true });
    }
  } else {
    toast.error(result.payload ?? "Google sign in failed");
  }
};
