import React from 'react';
import { AgentStatus as AgentStatusType } from '../types';
import { Brain, Paintbrush, Code, TestTube, BarChart } from 'lucide-react';

interface AgentStatusProps {
  agent: AgentStatusType;
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

export function AgentStatus({ agent }: AgentStatusProps) {
  const Icon = agentIcons[agent.role];
  const colors = agentColors[agent.role];
  
  return (
    <div className="glass-effect rounded-lg p-2 relative overflow-hidden group hover:scale-105 transition-all duration-300">
      {/* Background glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className={`p-1.5 rounded-md bg-gradient-to-br ${colors} bg-opacity-20`}>
            <Icon className="w-3.5 h-3.5 text-white" />
          </div>
          <h3 className="font-medium text-sm text-white">{agent.role}</h3>
        </div>
        
        {/* Progress bar */}
        <div className="h-1.5 bg-gray-700/30 rounded-full overflow-hidden mb-1.5">
          <div 
            className={`h-full bg-gradient-to-r ${colors} transition-all duration-1000 ease-out`}
            style={{ width: `${agent.progress}%` }}
          />
        </div>
        
        {/* Status and progress text */}
        <div className="flex justify-between text-xs">
          <span className={`capitalize ${
            agent.status === 'working' ? 'text-green-400' :
            agent.status === 'completed' ? 'text-blue-400' :
            'text-gray-400'
          }`}>
            {agent.status}
          </span>
          <span className="text-gray-400">{agent.progress}%</span>
        </div>
        
        {/* Current task - only show if working */}
        {agent.status === 'working' && agent.currentTask && (
          <div className="mt-1 text-xs text-gray-400 truncate">
            {agent.currentTask}
          </div>
        )}
      </div>
      
      {/* Animation for working status */}
      {agent.status === 'working' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
      )}
    </div>
  );
} 