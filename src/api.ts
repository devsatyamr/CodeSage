const API_ENDPOINT = "http://localhost:5000/api/chat";


export interface ChatResponse {
  message: string;  // ✅ Ensure this matches backend response
  fileUrl?: string; // ✅ Optional if backend supports file responses
  error?: string;   // ✅ Capture errors properly
}

export const sendMessage = async (message: string, file?: File) => {  
  if (!message.trim() && !file) {
    throw new Error("Message or file is required!"); // ✅ Prevents sending empty request
  }

  const formData = new FormData();
  formData.append("message", message);
  if (file) {
    formData.append("file", file);
  }

  const response = await fetch("http://localhost:5000/api/chat", {
    method: "POST",
    body: formData, // ✅ Use FormData instead of JSON
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`HTTP ${response.status}: ${errorData.error}`);
  }

  return response.json();
};
