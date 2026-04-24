import { useState } from "react";
import SideNavBar from "./SideNavBar";
import MessagesSidebar from "./MessagesSidebar";
import ChatWindow from "./ChatWindow";
import CreateGroupModal from "./CreateGroupModal";
import ChatRightPanel from "./ChatRightPanel";

const ChatLayout = () => {
  const [rightPanel, setRightPanel] = useState("none");
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("messages");

  const [activeChat, setActiveChat] = useState({
    id: 1,
    name: "Sarah Chen",
    avatar: "https://placehold.co/100x100/14213D/FCA311?text=SC",
    status: "Active",
    type: "individual",
    role: "Research Fellow",
  });

  const toggleRightPanel = (panel) => {
    setRightPanel((prev) => (prev === panel ? "none" : panel));
  };

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full bg-neutral-light overflow-hidden">
      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
      />

      <SideNavBar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <MessagesSidebar
        activeChat={activeChat}
        setActiveChat={handleChatSelect}
        onOpenCreateGroup={() => setIsGroupModalOpen(true)}
      />

      <ChatWindow
        activeChat={activeChat}
        onOpenAi={() => toggleRightPanel("ai")}
        onOpenContact={() => toggleRightPanel("contact")}
        onBack={() => {}}
      />

      {rightPanel !== "none" && (
        <div className="w-[320px] shrink-0 border-l border-outline-variant/20 bg-white h-full transition-all duration-300 flex flex-col">
          <ChatRightPanel type={rightPanel} />
        </div>
      )}
    </div>
  );
};

export default ChatLayout;
