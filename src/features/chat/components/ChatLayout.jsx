import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideNavBar from "./SideNavBar";
import MessagesSidebar from "./MessagesSidebar";
import ChatWindow from "./ChatWindow";
import CreateGroupModal from "./CreateGroupModal";
import ChatRightPanel from "./ChatRightPanel";
import useChatStore from "../store/useChatStore";
import { useEventStore } from "../../events-communities/store/useEventStore";
import { fetchConnectionsWithHydration, selectHydratedConnections, selectConnectionsStatus } from "../../../services/connections/store/connectionsSlice";

const ChatLayout = () => {
  const [rightPanel, setRightPanel] = useState("none");
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("messages");

  const dispatch = useDispatch();
  const { connectSocket, disconnectSocket, fetchRooms, activeRoomId, rooms } = useChatStore();
  const { fetchCommunities } = useEventStore();
  const hydratedConnections = useSelector(selectHydratedConnections);
  const connectionsStatus = useSelector(selectConnectionsStatus);

  useEffect(() => {
    connectSocket();
    fetchRooms();
    fetchCommunities();
    if (connectionsStatus === "idle") {
      dispatch(fetchConnectionsWithHydration());
    }
    return () => disconnectSocket();
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
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        connections={hydratedConnections}
        connectionsLoading={connectionsStatus === "loading"}
      />

      <ChatWindow
        activeChat={activeChat}
        onOpenAi={() => toggleRightPanel("ai")}
        onOpenContact={() => toggleRightPanel("contact")}
      />

      {rightPanel !== "none" && (
        <div className="w-[320px] shrink-0 border-l border-outline-variant/20 bg-white h-full flex flex-col">
          <ChatRightPanel type={rightPanel} onClose={() => setRightPanel("none")} />
        </div>
      )}
    </div>
  );
};

export default ChatLayout;
