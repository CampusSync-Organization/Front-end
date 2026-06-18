import { MessageSquare, Users, Users2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { key: "messages", ICON: MessageSquare, label: "Messages", path: null },
  { key: "communities", ICON: Users, label: "Communities", path: null },
  { key: "teams", ICON: Users2, label: "Teams", path: "/teams" },
];

export default function SideNavBar({ activeSection, onSectionChange }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (item) => {
    if (item.path) {
      navigate(item.path);
    } else if (onSectionChange) {
      onSectionChange(item.key);
    }
  };

  const getActive = (item) => {
    if (item.path) {
      return location.pathname === item.path || location.pathname.startsWith(item.path + "/");
    }
    return activeSection === item.key;
  };

  return (
    <aside className="hidden md:flex flex-col h-full py-6 px-4 bg-white border-r border-outline-variant/20 w-[240px] shrink-0">
      <div className="h-16"></div>
      <nav className="flex-1 space-y-8">
        {NAV_ITEMS.map(({ key, ICON, label, path }) => {
          const isActive = getActive({ key, path });
          return (
            <button
              key={key}
              onClick={() => handleClick({ key, path })}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-semibold text-sm text-left ${
                isActive
                  ? "bg-primary text-white shadow-soft"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <ICON
                className="w-5 h-5 shrink-0"
                fill={isActive ? "currentColor" : "none"}
                strokeWidth={isActive ? 0 : 2}
              />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
