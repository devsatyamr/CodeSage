export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  fileUrl?: string;  // ✅ URL of the uploaded file
  fileName?: string; // ✅ Original name of the uploaded file
}


export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}