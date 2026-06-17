import { useEffect, useState } from "react";
import SideNavBar from "./SideNavBar";
import MessagesSidebar from "./MessagesSidebar";
import ChatWindow from "./ChatWindow";
import CreateGroupModal from "./CreateGroupModal";
import ChatRightPanel from "./ChatRightPanel";
import useChatStore from "../store/useChatStore";

const ChatLayout = () => {
  const [rightPanel, setRightPanel] = useState("none");
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("messages");

  const { connectSocket, disconnectSocket, activeRoomId, rooms } = useChatStore();

  useEffect(() => {
    connectSocket();
    return () => {
      disconnectSocket();
    };
  }, []);

  const activeChat = rooms.find((r) => r.id === activeRoomId) ?? null;

  const toggleRightPanel = (panel) => {
    setRightPanel((prev) => (prev === panel ? "none" : panel));
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
