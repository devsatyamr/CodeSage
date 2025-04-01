import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "../types";
import { User, Clipboard, Paperclip } from "lucide-react";
import logo4 from "../assets/logo4.png";
import "../index.css";

interface ChatMessageProps {
  message: Message;
}

// Function to copy code to clipboard
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    alert("✅ Code copied to clipboard!");
  });
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === "assistant";

  return (
    <div className="message-container flex flex-col sm:flex-row gap-4 p-2 sm:p-4">
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

      <div className="flex-1 min-w-0 glass-effect p-4 sm:p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <div
            className={`text-sm font-medium ${
              isBot
                ? "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text"
                : "text-gray-300"
            }`}
          >
            {isBot ? "A.U.R.A." : "You"}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>

        {/* Render Markdown content */}
        <div className="text-white leading-relaxed break-words">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children, ...props }) {
                const isBlockCode = className && className.includes("language-");

                if (isBlockCode) {
                  return (
                    <div className="relative">
                      <pre className="bg-gray-900 p-3 rounded-md overflow-x-auto">
                        <code {...props} className={className}>
                          {children}
                        </code>
                      </pre>
                      <button
                        onClick={() => copyToClipboard(children as string)}
                        className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 text-sm rounded flex items-center gap-1"
                      >
                        <Clipboard className="w-4 h-4" />
                        Copy
                      </button>
                    </div>
                  );
                }

                return <span className="text-white">{children}</span>;
              },
              pre: ({ children }) => <div>{children}</div>,
              em: ({ children }) => <span>{children}</span>,
              strong: ({ children }) => <span>{children}</span>,
            }}
          >
            {message.content}
          </ReactMarkdown>

          {/* Display attached file if available */}
          {message.fileUrl && (
            <div className="mt-3">
              <a
                href={message.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline flex items-center gap-2"
              >
                <Paperclip className="w-5 h-5" /> {message.fileName || "Attached File"}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}