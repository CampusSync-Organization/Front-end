import { MessageSquare, Users, Rocket } from "lucide-react";

const NAV_ITEMS = [
  { key: "messages", ICON: MessageSquare, label: "Messages" },
  { key: "communities", ICON: Users, label: "Communities" },
  { key: "projects", ICON: Rocket, label: "Projects" },
];

export default function SideNavBar({ activeSection, onSectionChange }) {
  return (
    <aside className="hidden md:flex flex-col h-full py-6 px-4 bg-white border-r border-outline-variant/20 w-[240px] shrink-0">
      {/* Nav items */}
      <div className="h-16"></div>
      <nav className="flex-1 space-y-8">
        {NAV_ITEMS.map(({ key, ICON, label }) => (
          <button
            key={key}
            onClick={() => onSectionChange(key)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-semibold text-sm text-left ${
              activeSection === key
                ? "bg-primary text-white shadow-soft"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <ICON
              className="w-5 h-5 shrink-0"
              fill={activeSection === key ? "currentColor" : "none"}
              strokeWidth={activeSection === key ? 0 : 2}
            />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
