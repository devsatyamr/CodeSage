import React from 'react';
import { Message } from '../types';
import { Bot, User } from 'lucide-react';
import logo4 from '../assets/logo4.png';
import '../index.css';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === 'assistant';

  return (
    <div className="message-container flex gap-4">
      <div className="flex-shrink-0">
        {isBot ? (
          <img src={logo4} alt="Bot Logo" className="w-10 h-10 rounded-2xl" />
        ) : (
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/80 to-cyan-500/80 p-0.5">
            <div className="w-full h-full rounded-2xl glass-effect flex items-center justify-center">
              <User className="w-5 h-5 text-blue-200" />
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 glass-effect p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <div className={`text-sm font-medium ${isBot ? 'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text' : 'text-gray-300'}`}>
            {isBot ? 'A.U.R.A.' : 'You'}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
        <div className="text-gray-100 leading-relaxed break-words">
          {message.content}
        </div>
      </div>
    </div>
  );
}