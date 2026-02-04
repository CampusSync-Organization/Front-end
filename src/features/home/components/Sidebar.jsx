import { Link } from "react-router-dom";
import { FileText, Plus } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-bold text-lg text-primary mb-4 flex items-center gap-2">
          <FileText size={20} />
          Create Announcement
        </h3>
        <div className="space-y-3">
          <textarea
            placeholder="Share something with the campus community..."
            className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-secondary text-foreground text-sm resize-none"
            rows={4}
          />
          <div className="flex flex-col gap-3">
            <select className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary w-full">
              <option>Select Type</option>
              <option>Event Announcement</option>
              <option>Project Announcement</option>
              <option>Community Post</option>
            </select>
            <button
              type="button"
              className="bg-secondary hover:bg-secondary/90 text-primary font-semibold flex items-center gap-2 w-full justify-center py-2.5 rounded-lg transition-colors"
            >
              <Plus size={16} />
              Post
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-bold text-lg text-primary mb-4">Quick Access</h3>
        <div className="space-y-2">
          <Link
            to="/home"
            className="block w-full text-left px-4 py-2 rounded-lg hover:bg-muted transition-colors text-foreground/70 hover:text-foreground"
          >
            My Communities
          </Link>
          <Link
            to="/home"
            className="block w-full text-left px-4 py-2 rounded-lg hover:bg-muted transition-colors text-foreground/70 hover:text-foreground"
          >
            My Projects
          </Link>
          <Link
            to="/home"
            className="block w-full text-left px-4 py-2 rounded-lg hover:bg-muted transition-colors text-foreground/70 hover:text-foreground"
          >
            Saved Posts
          </Link>
          <Link
            to="/home"
            className="block w-full text-left px-4 py-2 rounded-lg hover:bg-muted transition-colors text-foreground/70 hover:text-foreground"
          >
            Campus Map
          </Link>
        </div>
      </div>
    </div>
  );
}
