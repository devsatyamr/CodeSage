# Project Manager Chatbot

This project combines a React frontend chatbot with a backend that integrates with AI agents for project management.

## Setup

### Frontend Setup
1. Install Node.js dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173`

### Backend Setup
1. Create a Python virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the project root with your Gemini API key:
```
GOOGLE_API_KEY=your_gemini_api_key_here
MODEL_NAME=gemini-pro
```

4. Start the backend server:
```bash
python server.py
```
The backend API will be available at `http://localhost:8000`

## Usage

1. Open the chatbot interface in your browser at `http://localhost:5173`
2. Type your questions about the project status or specifics
3. The chatbot will communicate with the project manager agent and display the responses

## Features

- Real-time communication with AI project manager agent powered by Gemini
- Detailed project status updates
- Natural language processing for project queries
- Beautiful and responsive UI

## Architecture

- Frontend: React + TypeScript + Vite
- Backend: FastAPI + Python
- AI Agents: CrewAI + LangChain + Gemini
- Communication: REST API 