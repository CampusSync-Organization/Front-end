import { useState } from "react";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";

export default function AuthPage() {
  const [currentPage, setCurrentPage] = useState("login");

  return (
    <>
      {currentPage === "login" ? (
        <LoginPage onNavigateToSignUp={() => setCurrentPage("signup")} />
      ) : (
        <SignUpPage onNavigateToLogin={() => setCurrentPage("login")} />
      )}
    </>
  );
}
