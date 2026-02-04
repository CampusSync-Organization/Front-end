import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
    </div>
  );
}
