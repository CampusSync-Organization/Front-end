import { useEffect, useState, useMemo } from "react";
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
  const connectSocket = useChatStore((s) => s.connectSocket);
  const disconnectSocket = useChatStore((s) => s.disconnectSocket);
  const fetchRooms = useChatStore((s) => s.fetchRooms);
  const fetchTeams = useChatStore((s) => s.fetchTeams);
  const activeRoomId = useChatStore((s) => s.activeRoomId);
  const rooms = useChatStore((s) => s.rooms);
  const { fetchCommunities } = useEventStore();
  const hydratedConnections = useSelector(selectHydratedConnections);
  const connectionsStatus = useSelector(selectConnectionsStatus);

  useEffect(() => {
    connectSocket();
    fetchRooms();
    fetchTeams();
    fetchCommunities();
    if (connectionsStatus === "idle") {
      dispatch(fetchConnectionsWithHydration());
    }
    return () => disconnectSocket();
  }, []);

  const activeChat = useMemo(
    () => rooms.find((r) => r.id === activeRoomId) ?? null,
    [rooms, activeRoomId]
  );

  // Auto-switch sidebar tab to match the active room's type
  useEffect(() => {
    if (!activeChat) return;
    if (activeChat.type === "team") setActiveSection("teams");
    else if (activeChat.type === "community") setActiveSection("communities");
    else if (activeChat.type === "direct") setActiveSection("messages");
  }, [activeChat?.id]);

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
