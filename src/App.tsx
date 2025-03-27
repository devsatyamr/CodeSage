import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Paperclip } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { Message } from './types';
import { sendMessage } from './api';
import logo from './assets/logo5.png';
import { Sidebar } from "./components/Sidebar";

function App() {
  const [conversations, setConversations] = useState<
    { id: string; name: string; messages: Message[] }[]
  >([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations]);

  useEffect(() => {
    if (!activeConversationId) {
      startNewChat();
    }
  }, []);

  const generateChatName = (messages: Message[], existingNames: string[]): string => {
    if (!messages.length) return "New Chat";
    const firstUserMessage = messages.find(msg => msg.role === "user");
    if (!firstUserMessage) return "New Chat";
    let baseName = firstUserMessage.content.trim().split(/\s+/).slice(0, 3).join(" ");
    if (!baseName) return "New Chat";
    let uniqueName = baseName;
    let count = 1;
    while (existingNames.includes(uniqueName)) {
        uniqueName = `${baseName} (${count})`;
        count++;
    }
    return uniqueName;
  };

  const startNewChat = () => {
    setConversations(prev => {
      const existingNames = prev.map(chat => chat.name);
      const newChat = {
          id: Date.now().toString(),
          name: "New Chat",
          messages: [
              {
                  id: "1",
                  content: "Hello! I'm your AI assistant. How can I help you today?",
                  role: "assistant",
                  timestamp: new Date(),
              } as Message,
          ],
      };
      newChat.name = generateChatName(newChat.messages, existingNames);
      return [newChat, ...prev];
    });
    setActiveConversationId(Date.now().toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !selectedFile) || isLoading || !activeConversationId) return;
    const userMessage: Message = {
        id: Date.now().toString(),
        content: input.trim(),
        role: "user",
        timestamp: new Date(),
    };
    setConversations((prev) => 
        prev.map((chat) => {
            if (chat.id === activeConversationId) {
                const isFirstUserMessage = chat.messages.every(msg => msg.role !== "user");
                const updatedName = isFirstUserMessage ? generateChatName([userMessage], prev.map(c => c.name)) : chat.name;
                return {
                    ...chat,
                    messages: [...chat.messages, userMessage],
                    name: updatedName,
                };
            }
            return chat;
        })
    );
    setInput("");
    setIsLoading(true);
    try {
        const response = await sendMessage(input.trim(), selectedFile || undefined);
        const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: response.response || "No response",
            role: "assistant",
            timestamp: new Date(),
            fileUrl: response.fileUrl || undefined,
        };
        setConversations((prev) => 
            prev.map((chat) =>
                chat.id === activeConversationId
                    ? { ...chat, messages: [...chat.messages, botMessage] }
                    : chat
            )
        );
    } catch (error) {
        console.error("Failed to send message:", error);
    } finally {
        setIsLoading(false);
        setSelectedFile(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      console.log("Selected file:", e.target.files[0]);
    }
  };

  const filteredMessages =
    conversations.find((chat) => chat.id === activeConversationId)?.messages || [];

  return (
    <div className="flex">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        setActiveConversationId={setActiveConversationId}
        startNewChat={startNewChat}
      />
      <div className="flex-1 min-h-screen bg-transparent text-white">
        <div className="max-w-4xl mx-auto p-4 flex flex-col h-screen">
          <header className="text-center py-8 relative">
            <img src={logo} alt="Logo" className="h-12 mx-auto" />
          </header>
          <div className="flex-1 overflow-y-auto space-y-4 mb-6 px-2">
            {filteredMessages?.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="flex gap-3 relative w-full max-w-4xl mx-auto px-6 pb-4 items-center">
            <input type="file" id="file-upload" className="hidden" onChange={handleFileUpload} />
            <label
              htmlFor="file-upload"
              className="cursor-pointer shrink-0 rounded-2xl px-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2 hover:bg-white/20 transition"
            >
              <Paperclip className="text-white" />
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-2xl px-6 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 focus:border-white/50 outline-none placeholder-gray-300"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-2xl px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2 hover:bg-white/20 transition"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
              <span className="text-white">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default App;
