import { Check, Search, X } from "lucide-react";
import { useState } from "react";

const contacts = [
  { id: 1, name: "Sarah Chen", avatar: "https://placehold.co/80x80/14213D/FCA311?text=SC", status: "active" },
  { id: 2, name: "Alex Rivera", avatar: "https://placehold.co/80x80/14213D/FCA311?text=AR", status: "offline" },
  { id: 3, name: "Marcus Johnson", avatar: "https://placehold.co/80x80/14213D/FCA311?text=MJ", status: "offline" },
  { id: 4, name: "Floyd Miles", avatar: "https://placehold.co/80x80/14213D/FCA311?text=FM", status: "active" },
  { id: 5, name: "Devon Lane", avatar: "https://placehold.co/80x80/14213D/FCA311?text=DL", status: "offline" },
];

const CreateGroupModal = ({ isOpen, onClose }) => {
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const toggleContact = (id) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl w-full max-w-[440px] max-h-[560px] flex flex-col shadow-soft-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 pb-4 border-b border-neutral-light">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-xl text-primary tracking-tight">
              Create Group
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-neutral-light transition-colors text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            Add participants to start your group chat.
          </p>
        </div>

        <div className="p-4 border-b border-neutral-light">
          <div className="relative">
            <Search
              className="w-4 h-4 text-muted-gray absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts..."
              className="w-full pl-10 pr-4 py-3 bg-neutral-light rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-secondary/30 placeholder:text-muted-gray transition-all"
            />
          </div>
        </div>

        {selectedContacts.length > 0 && (
          <div className="px-4 pt-3 pb-1 flex items-center gap-2 flex-wrap">
            {selectedContacts.map((id) => {
              const contact = contacts.find((c) => c.id === id);
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold"
                >
                  {contact?.name.split(" ")[0]}
                  <button
                    onClick={() => toggleContact(id)}
                    className="hover:bg-secondary/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredContacts.map((contact) => {
            const isSelected = selectedContacts.includes(contact.id);
            return (
              <div
                key={contact.id}
                onClick={() => toggleContact(contact.id)}
                className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all ${
                  isSelected
                    ? "bg-secondary/10"
                    : "hover:bg-neutral-light"
                }`}
              >
                <div className="relative w-12 h-12 rounded-full bg-neutral-light overflow-hidden flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {contact.name.split(" ").map((n) => n[0]).join("")}
                  {contact.status === "active" && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-primary text-sm truncate">
                    {contact.name}
                  </p>
                  <p className="text-xs text-muted-gray font-medium capitalize">
                    {contact.status}
                  </p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                    isSelected
                      ? "bg-secondary border-secondary"
                      : "border-outline bg-transparent"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
              </div>
            );
          })}

          {filteredContacts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <p className="text-sm font-medium">No contacts found</p>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-neutral-light bg-neutral-light">
          <button
            className="w-full py-3.5 bg-primary hover:bg-secondary text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-soft"
            disabled={selectedContacts.length === 0}
            onClick={onClose}
          >
            Create group
            <span className="text-sm opacity-70">
              {selectedContacts.length > 0 && `(${selectedContacts.length})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
