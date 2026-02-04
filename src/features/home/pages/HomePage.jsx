import WelcomeHeader from "../components/WelcomeHeader";
import ActivityFeed from "../components/ActivityFeed";
import Sidebar from "../components/Sidebar";
import AppFooter from "../../../components/AppFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <main className="flex-1 max-w-2xl mx-auto px-4 md:px-6">
          <WelcomeHeader />
          <ActivityFeed />
        </main>

        <aside className="hidden lg:block w-80 px-6 py-8 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <Sidebar />
        </aside>
      </div>

      <AppFooter />
    </div>
  );
}
