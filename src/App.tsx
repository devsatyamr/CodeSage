import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { Message } from './types';
import { sendMessage } from './api';
import logo from './assets/logo3.png';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant. How can I help you today?",
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage(input.trim());
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to get response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white">
      <div className="max-w-4xl mx-auto p-4 flex flex-col h-screen">
        <header className="text-center py-8 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
          <h1 className="text-4xl font-bold  mb-3 relative flex items-center justify-center">
            <Sparkles className="relative -left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400/70" />
            <img src={logo} alt="Logo" className="w-1/3 h-1/3 object-contain mr-2 bg-transparent mix-blend-multiply" />
            <Sparkles className="relative -right-8 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400/70" />
          </h1>
          {/* <p className="text-gray-400 font-light tracking-wide">Your personal product expert</p> */}
        </header>

        <div className="flex-1 overflow-y-auto space-y-4 mb-6 px-2">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3 relative">
          <div className="absolute inset-0 bg-purple-500/5 blur-2xl -z-10 rounded-lg"></div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 glass-effect rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="glass-effect hover:bg-purple-500/20 rounded-2xl px-6 py-4 flex items-center gap-2 transition-all disabled:opacity-50 disabled:hover:bg-transparent"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;