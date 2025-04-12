import React from 'react';
import { Brain, Paintbrush, Code, TestTube, BarChart, Loader2 } from 'lucide-react';

interface AgentRunningMessageProps {
  agentRole: string;
}

const agentIcons = {
  'Business Analyst': Brain,
  'Designer': Paintbrush,
  'Software Developer': Code,
  'Software Tester': TestTube,
  'Project Manager': BarChart,
};

const agentColors = {
  'Business Analyst': 'from-blue-500 to-cyan-500',
  'Designer': 'from-purple-500 to-pink-500',
  'Software Developer': 'from-green-500 to-emerald-500',
  'Software Tester': 'from-yellow-500 to-orange-500',
  'Project Manager': 'from-red-500 to-rose-500',
};

export function AgentRunningMessage({ agentRole }: AgentRunningMessageProps) {
  const Icon = agentIcons[agentRole as keyof typeof agentIcons];
  const colors = agentColors[agentRole as keyof typeof agentColors];

  return (
    <div className="flex items-center gap-3 animate-fadeIn">
      <div className={`p-2 rounded-lg bg-gradient-to-br ${colors} bg-opacity-20 animate-pulse`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium text-white">{agentRole}</span>
        <span className="text-gray-400">is analyzing your request</span>
        <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
      </div>
    </div>
  );
} 