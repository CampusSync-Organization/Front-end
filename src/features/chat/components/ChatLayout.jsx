import React from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import CreateGroupModal from "./CreateGroupModal";

import ChatRightPanel from "./ChatRightPanel";

const ChatLayout = () => {
  const [rightPanel, setRightPanel] = React.useState("none"); // "none", "ai", "contact"
  const [isGroupModalOpen, setIsGroupModalOpen] = React.useState(false);

  // Default active chat
  const [activeChat, setActiveChat] = React.useState({
    id: 1,
    name: "Cody Fisher",
    avatar: "https://placehold.co/50x50",
    status: "last seen today at 10 pm",
    type: "individual",
  });

  const toggleRightPanel = (panel) => {
    setRightPanel((prev) => (prev === panel ? "none" : panel));
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-inter relative">
      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
      />

      {/* Sidebar */}
      <div className="w-80 md:w-96 flex-shrink-0 h-full border-r border-neutral-light">
        <ChatSidebar
          activeChat={activeChat}
          setActiveChat={setActiveChat}
          onOpenCreateGroup={() => setIsGroupModalOpen(true)}
        />
      </div>

      {/* Main Window */}
      <div className="flex-1 h-full min-w-0 bg-[#EFE7DD]">
        {" "}
        {/* WhatsApp-ish background color base */}
        <ChatWindow
          activeChat={activeChat}
          onOpenAi={() => toggleRightPanel("ai")}
          onOpenContact={() => toggleRightPanel("contact")}
          activePanel={rightPanel}
        />
      </div>

      {/* Right Panel */}
      {rightPanel !== "none" && (
        <div className="w-80 border-l border-neutral-light bg-white h-full transition-all duration-300 ease-in-out shadow-xl z-10 flex flex-col">
          <ChatRightPanel type={rightPanel} />
        </div>
      )}
    </div>
  );
};

export default ChatLayout;
