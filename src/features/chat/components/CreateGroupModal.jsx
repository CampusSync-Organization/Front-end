import { Check, Search, X } from "lucide-react";
import { useState } from "react";

const CreateGroupModal = ({ isOpen, onClose }) => {
  const [selectedContacts, setSelectedContacts] = useState([]);
  if (!isOpen) return null;

  const contacts = [
    { id: 1, name: "Cody Fisher", avatar: "https://placehold.co/50x50" },
    { id: 2, name: "Devon Lane", avatar: "https://placehold.co/50x50" },
    { id: 3, name: "Marvin McKinney", avatar: "https://placehold.co/50x50" },
    { id: 4, name: "Floyd Miles", avatar: "https://placehold.co/50x50" },
    { id: 5, name: "Esther Howard", avatar: "https://placehold.co/50x50" },
  ];

  const toggleContact = (id) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-[400px] h-[500px] flex flex-col shadow-xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-4 border-b border-neutral-light flex items-center justify-between bg-primary text-white rounded-t-lg">
          <h3 className="font-medium text-lg">Add group participants</h3>
          <button
            onClick={onClose}
            className="hover:bg-white/10 p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-neutral-light">
          <div className="relative">
            <input
              type="text"
              placeholder="Type contact name"
              className="w-full pl-9 pr-4 py-2 bg-neutral-light/30 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => toggleContact(contact.id)}
              className="flex items-center gap-3 p-3 hover:bg-neutral-light/30 rounded-lg cursor-pointer transition-colors"
            >
              <div className="relative w-10 h-10">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-full h-full rounded-full object-cover"
                />
                {selectedContacts.includes(contact.id) && (
                  <div className="absolute -bottom-1 -right-1 bg-secondary text-white rounded-full p-0.5 border-2 border-white">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
              <span className="text-primary font-medium">{contact.name}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-light bg-gray-50 rounded-b-lg flex justify-end">
          <button
            className="bg-secondary hover:bg-secondary/90 text-white px-6 py-2 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedContacts.length === 0}
            onClick={onClose}
          >
            Create group
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
