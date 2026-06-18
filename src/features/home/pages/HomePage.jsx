import { useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams, Outlet } from "react-router-dom";
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";
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
    <div className="min-h-screen" style={{ background: "#f0f2f5" }}>
      {showWelcome && <FirstWelcomeOverlay name={firstName} onDismiss={handleDismiss} />}

      <div className="max-w-[1100px] mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-5">

          {/* Left panel */}
          <div className="hidden lg:block col-span-3">
            <div className="sticky top-6">
              <LeftPanel />
            </div>
          </div>

          {/* Center feed */}
          <div className="col-span-12 lg:col-span-6">
            <Outlet />
          </div>

          {/* Right panel */}
          <div className="hidden lg:block col-span-3">
            <div className="sticky top-6">
              <RightPanel />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
