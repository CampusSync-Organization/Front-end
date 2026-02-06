import React from "react";
import { Sparkles, Paperclip, Send, Search } from "lucide-react";

const ChatWindow = ({ activeChat, onOpenAi, onOpenContact }) => {
  if (!activeChat) {
    return (
      <div className="flex h-full items-center justify-center bg-[#F0F2F5] border-b-[6px] border-[#008069]">
        <div className="text-center text-[#41525d]">
          <h1 className="text-3xl font-light mb-4">WhatsApp Web</h1>
          <p>Send and receive messages without keeping your phone online.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Background pattern overlay could go here */}
      <div className="absolute inset-0 opacity-[0.06] bg-[url('https://camo.githubusercontent.com/854a93c27d64274c4f8f5a7babb175962b3c2e1f40b82b9e6027393439031b26/68747470733a2f2f7765622e77686174736170702e636f6d2f696d672f62672d636861742d74696c652d6461726b5f61346265353132653731393562366237333364393131306234303866303735642e706e67')] pointer-events-none"></div>

      {/* Header */}
      <div className="bg-primary px-4 py-2.5 flex items-center justify-between border-b border-[#D1D7DB] z-10">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={onOpenContact}
        >
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
            <img
              src={activeChat.avatar}
              alt={activeChat.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-white text-[16px] leading-tight">
              {activeChat.name}
            </h2>
            <p className="text-[13px] text-white truncate max-w-[300px] leading-tight">
              {activeChat.status}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-white">
          <button
            className="p-2 rounded-full hover:bg-black/5"
            onClick={onOpenAi}
            title="AI Assistant"
          >
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 z-0 relative">
        {/* Date Separator (Mock) */}
        <div className="flex justify-center my-4">
          <span className="bg-white/95 px-3 py-1.5 rounded-lg text-xs text-[#54656F] shadow-sm uppercase font-medium">
            Today
          </span>
        </div>

        {/* Message Received */}
        <div className="flex gap-2 max-w-[85%] md:max-w-[70%]">
          {activeChat.type === "group" && (
            <div className="w-7 h-7 rounded-full bg-gray-300 overflow-hidden mt-1 self-start flex-shrink-0">
              <img
                src="https://placehold.co/40x40"
                alt="Sender"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex flex-col bg-secondary/60 rounded-lg rounded-tl-none shadow-sm p-1.5 relative group">
            {activeChat.type === "group" && (
              <span className="text-xs font-bold text-[#E542A3] px-1.5 pt-0.5">
                Cody
              </span>
            )}
            <div className="px-1.5 pb-5 text-primary text-[14.2px] leading-[19px]">
              Hello there! This is a message.
            </div>
            <div className="self-end text-primary text-[11px] text-grey px-1.5 absolute bottom-1 right-0.5">
              9:30 am
            </div>
          </div>
        </div>

        {/* Message Sent */}
        <div className="flex gap-2 max-w-[85%] md:max-w-[70%] ml-auto justify-end">
          <div className="flex  flex-col bg-primary rounded-lg rounded-tr-none shadow-sm p-1.5 relative min-w-[100px]">
            <div className="px-1.5 pb-5 text-white text-[14.2px] leading-[19px]">
              Hello! How are you?
            </div>
            <div className=" self-end text-[11px] text-white/60 px-1.5 absolute bottom-1 right-0.5 flex items-center gap-1">
              9:32 am
              {/* Double tick logic could go here */}
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-[#F0F2F5] px-4 py-3 flex items-center gap-4 z-10">
        <button className="text-[#54656F] hover:text-[#41525d]">
          <Paperclip className="w-6 h-6" />
        </button>
        <div className="flex-1 bg-white rounded-lg px-4 py-2 flex items-center">
          <input
            type="text"
            placeholder="Type a message"
            className="flex-1 bg-transparent focus:outline-none text-[#111B21] placeholder-[#667781] text-[15px]"
          />
        </div>
        <button className="text-[#54656F] hover:text-[#41525d]">
          {/* If text input is not empty, switch to Send icon */}
          <Send className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
