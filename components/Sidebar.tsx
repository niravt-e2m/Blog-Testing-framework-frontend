
import React from 'react';
import { AnalysisSession } from '../types';

interface SidebarProps {
  sessions: AnalysisSession[];
  activeSessionId?: string;
  onSelectSession: (id: string) => void;
  onNewAnalysis: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sessions, activeSessionId, onSelectSession, onNewAnalysis }) => {
  return (
    <div className="w-64 h-full bg-[#F7F6F3] border-r border-gray-200 flex flex-col pt-16">
      <div className="px-4 py-4 flex flex-col gap-1">
        <button 
          onClick={onNewAnalysis}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          New Analysis
        </button>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto px-2">
        <div className="px-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">History</div>
        <div className="space-y-0.5">
          {sessions.length === 0 ? (
            <p className="px-3 py-2 text-xs text-gray-400 italic">No analyses yet</p>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors flex items-center gap-2 truncate ${
                  activeSessionId === session.id 
                    ? 'bg-gray-200 text-[#37352F] font-medium' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <span className="truncate">{session.title}</span>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 text-xs text-gray-400">
        EditorialAI v1.0.4
      </div>
    </div>
  );
};

export default Sidebar;
