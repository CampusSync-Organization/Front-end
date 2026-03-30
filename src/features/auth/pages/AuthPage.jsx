import { useState } from "react";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";

export default function AuthPage() {
  const [currentpage, setcurrentpage] = usestate("login");

  return (
    <>
      {currentpage === "login" ? (
        <loginpage onnavigatetosignup={() => setcurrentpage("signup")} />
      ) : (
        <signuppage onnavigatetologin={() => setcurrentpage("login")} />
      )}
    </>
  );
}
