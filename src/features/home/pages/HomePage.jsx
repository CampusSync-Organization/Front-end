import { useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams, Outlet } from "react-router-dom";
import WelcomeHeader from "../components/WelcomeHeader";
import Sidebar from "../components/Sidebar";
import FirstWelcomeOverlay from "../components/FirstWelcomeOverlay";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const authUser = useSelector((state) => state.auth?.user);
  const firstName = authUser?.name?.split(" ")[0] ?? "there";

  const [showWelcome, setShowWelcome] = useState(searchParams.get("welcome") === "1");

  const handleDismiss = () => {
    setShowWelcome(false);
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      {showWelcome && <FirstWelcomeOverlay name={firstName} onDismiss={handleDismiss} />}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <WelcomeHeader />
            <Outlet />
          </div>
          <div className="hidden lg:block lg:col-span-4">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
