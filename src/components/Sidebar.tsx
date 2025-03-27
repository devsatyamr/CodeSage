import { useState } from "react";
import sidebarLogo from "/src/assets/logo6.png";


interface SidebarProps {
  conversations: { id: string; name: string }[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string) => void;
  startNewChat: () => void;
}

export function Sidebar({ conversations, activeConversationId, setActiveConversationId, startNewChat }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`h-screen p-4 text-white transition-all duration-300 ${isOpen ? "w-64" : "w-16"}`} style={{ backgroundColor: "#2a1b3d" }}>
      
      {/* Sidebar Toggle Logo */}
      <div className="flex justify-center mb-4 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <img src={sidebarLogo} alt="Sidebar Logo" className="w-12 h-12 rounded-full transition-transform duration-300 hover:scale-110" />
      </div>

      {isOpen && (
        <>
          {/* New Chat Button */}
          <button
            onClick={startNewChat}
            className="w-full mb-4 bg-purple-600 p-2 rounded-lg text-center hover:bg-purple-700 transition-all"
          >
            + New Chat
          </button>

          {/* Chat List */}
          <ul>
            {conversations.map((chat) => (
              <li
                key={chat.id}
                className={`p-3 cursor-pointer rounded-lg mb-2 transition-all ${
                  chat.id === activeConversationId ? "bg-purple-700 shadow-lg shadow-purple-500/50" : "hover:bg-gray-700"
                }`}
                onClick={() => setActiveConversationId(chat.id)}
              >
                {chat.name}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
