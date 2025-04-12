export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  runningAgent?: string;
  isAgentStatus?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}

export type AgentRole = 'Business Analyst' | 'Designer' | 'Software Developer' | 'Software Tester' | 'Project Manager';

export interface AgentStatus {
  role: AgentRole;
  status: 'idle' | 'working' | 'completed';
  progress: number;
  currentTask?: string;
}

export interface AgentStatusState {
  agents: AgentStatus[];
  currentPhase: string;
  overallProgress: number;
}