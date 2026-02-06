import React from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import CreateGroupModal from "./CreateGroupModal";

const ChatLayout = () => {
  const [rightPanel, setRightPanel] = React.useState("none"); // "none", "ai", "contact"
  const [isGroupModalOpen, setIsGroupModalOpen] = React.useState(false);

  // Default active chat
  const [activeChat, setActiveChat] = React.useState({
      id: 1,
      name: "Cody Fisher",
      avatar: "https://placehold.co/50x50",
      status: "last seen today at 10 pm",
      type: "individual"
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
      <div className="flex-1 h-full min-w-0 bg-[#EFE7DD]"> {/* WhatsApp-ish background color base */}
        <ChatWindow
          activeChat={activeChat}
          onOpenAi={() => toggleRightPanel("ai")}
          onOpenContact={() => toggleRightPanel("contact")}
          activePanel={rightPanel}
        />
      </div>

      {/* Right Panel */}
      {rightPanel !== "none" && (
        <div className="w-80 border-l border-neutral-light bg-white h-full transition-all duration-300 ease-in-out shadow-xl z-10">
            <div className="p-4">
                <h3 className="text-lg font-medium text-primary mb-4">
                    {rightPanel === "ai" ? "AI Assistant" : "Contact Info"}
                </h3>
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    {rightPanel === "ai" ? "AI Panel Content" : "Contact Details Content"}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ChatLayout;
