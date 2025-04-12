import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

interface ServerResponse {
  response: string;
  status?: 'processing' | 'complete';
}

export const sendMessage = async (message: string): Promise<ServerResponse> => {
  try {
    const response = await axios.post(`${API_URL}/chat`, { message });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getAgentUpdates = async (): Promise<string | null> => {
  try {
    const response = await axios.get(`${API_URL}/agent-updates`);
    return response.data.response;
  } catch (error) {
    console.error('Error getting agent updates:', error);
    return null;
  }
}; 