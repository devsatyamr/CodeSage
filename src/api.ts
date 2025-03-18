const API_ENDPOINT = '/api/chat'; // Replace with your actual API endpoint

export async function sendMessage(message: string): Promise<string> {
  // For development: Use mock response while backend is not available
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`This is a mock response to your message: "${message}". Please implement the actual backend API endpoint to receive real responses.`);
    }, 1000); // Simulate network delay
  });

  // Uncomment this section when your backend is ready
  /*
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
  */
}