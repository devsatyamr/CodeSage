import React from 'react';
import { AgentStatus } from './AgentStatus';
import { AgentStatusState } from '../types';

interface AgentStatusContainerProps {
  agentState: AgentStatusState;
}

export function AgentStatusContainer({ agentState }: AgentStatusContainerProps) {
  return (
    <div className="glass-effect rounded-2xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
            Project Progress
          </h2>
          <p className="text-gray-400 text-xs mt-1">Phase: {agentState.currentPhase}</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-white">{agentState.overallProgress}%</div>
          <div className="text-gray-400 text-xs">Overall</div>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="h-1.5 bg-gray-700/30 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 transition-all duration-1000 ease-out"
          style={{ width: `${agentState.overallProgress}%` }}
        />
      </div>

      {/* Agent status grid */}
      <div className="grid grid-cols-2 gap-2">
        {agentState.agents.map((agent) => (
          <AgentStatus key={agent.role} agent={agent} />
        ))}
      </div>
    </div>
  );
} 