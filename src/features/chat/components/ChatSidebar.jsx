import React from "react";
import { Search, Plus } from "lucide-react";

const ChatSidebar = ({ activeChat, setActiveChat, onOpenCreateGroup }) => {
  const [activeTab, setActiveTab] = React.useState("Chats");
  const tabs = ["Chats", "Communities", "Project chats"];

  // Mock Data - Merged List
  const allChats = [
    {
       id: 1,
       name: "Cody Fisher",
       time: "10:00 am",
       msg: "typing..",
       avatar: "https://placehold.co/50x50",
       type: "individual",
       status: "last seen today at 10 pm"
    },
    {
       id: 101, // ID distinction for groups
       name: "Project Alpha Team",
       time: "10:05 am",
       msg: "Cody: I uploaded the files.",
       avatar: "https://placehold.co/50x50?text=G",
       type: "group",
       participants: ["Cody, Devon, Marvin"],
       status: "Cody, Devon, Marvin, You"
    },
    { id: 2, name: "Devon Lane", time: "9:15 am", msg: "ok.", avatar: "https://placehold.co/50x50", type: "individual", status: "online" },
    {
       id: 3,
       name: "Marvin McKinney",
       time: "10:00 am",
       msg: "heey",
       avatar: "https://placehold.co/50x50",
        type: "individual",
        status: "offline"
    },
    {
       id: 4,
       name: "Floyd Miles",
       time: "8:00 am",
       msg: "don’t forget our meeting..",
       avatar: "https://placehold.co/50x50",
        type: "individual",
        status: "last seen yesterday"
    },
    { id: 5, name: "Esther Howard", time: "", msg: "", avatar: "https://placehold.co/50x50", type: "individual", status: "online" },
    { id: 6, name: "Eleanor Pena", time: "", msg: "", avatar: "https://placehold.co/50x50", type: "individual", status: "offline" },
  ];

  return (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="p-3 bg-[#F0F2F5] border-r border-[#D1D7DB] flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                <img src="https://placehold.co/50x50?text=Me" alt="Profile" className="w-full h-full object-cover" />
            </div>
         </div>
         <div className="flex gap-4 text-[#54656F]">
            <button
                onClick={onOpenCreateGroup}
                title="Create Group"
                className="hover:bg-black/10 p-2 rounded-full transition-colors"
            >
                <Plus className="w-5 h-5" />
            </button>
         </div>
      </div>

      <div className="p-2 space-y-2 border-b border-neutral-light">
          {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full pl-10 pr-4 py-1.5 bg-[#F0F2F5] rounded-lg focus:outline-none text-sm placeholder-[#54656F]"
          />
          <Search className="w-4 h-4 text-[#54656F] absolute left-3 top-2" />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pb-0 border-b border-neutral-light flex gap-6 text-sm overflow-x-auto no-scrollbar pt-2">
        {tabs.map((tab) => (
          <span
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer pb-2 whitespace-nowrap transition-all border-b-[3px] ${
              activeTab === tab
                ? "font-medium border-[primary] text-[primary]"
                : "text-[{primary}] border-transparent hover:text-primary"
            }`}
          >
            {tab}
          </span>
        ))}
      </div>

      {/* Chat List Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        {activeTab === "Chats" ? (
          <>
            {allChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-[#F0F2F5] hover:bg-secondary/30 ${
                  activeChat?.id === chat.id ? "bg-secondary/50" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[#111B21] font-normal text-[17px] truncate">
                      {chat.name}
                    </h3>
                    {chat.time && (
                      <span className= "text-xs  text-[#667781]">{chat.time}</span>
                    )}
                  </div>
                   <div className="flex justify-between items-center">
                      <p
                        className="text-sm truncate leading-5 text-[#667781]"
                        >
                        {chat.msg}
                        </p>
                   </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-[#667781] text-sm p-8 text-center">
            <p className="mb-2 font-medium">No {activeTab} yet</p>
             <p className="text-xs">Start a new conversation or create a group.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
