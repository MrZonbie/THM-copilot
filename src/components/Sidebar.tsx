import React from 'react';
import { useStore } from '../store/useStore';
import { Shield, PlusCircle, MessageSquare, Settings, Trash2 } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { sessions, activeSessionId, setActiveSession, deleteSession } = useStore();

  return (
    <aside className="w-64 bg-[var(--color-thm-panel)] border-r border-[var(--color-thm-border)] flex flex-col h-screen">
      <div className="p-4 border-b border-[var(--color-thm-border)] flex items-center gap-2">
        <Shield className="w-6 h-6 text-[var(--color-thm-accent)]" />
        <h1 className="font-bold text-lg tracking-wider text-[var(--color-thm-text)]">THM COPILOT</h1>
      </div>

      <div className="p-4">
        <button
          onClick={() => setActiveSession('')}
          className="w-full flex items-center justify-center gap-2 bg-[var(--color-thm-accent)] hover:bg-[var(--color-thm-accent-hover)] text-white py-2 px-4 rounded transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Investigation</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <h2 className="text-xs font-semibold text-[var(--color-thm-muted)] uppercase tracking-wider mb-2 px-2">
          Recent Sessions
        </h2>
        <div className="space-y-1">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`flex items-center justify-between group px-3 py-2 rounded cursor-pointer transition-colors ${
                activeSessionId === session.id
                  ? 'bg-[var(--color-thm-border)] text-white'
                  : 'text-[var(--color-thm-muted)] hover:bg-[var(--color-thm-border)] hover:text-white'
              }`}
            >
              <div
                className="flex items-center gap-2 flex-1 overflow-hidden"
                onClick={() => setActiveSession(session.id)}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="truncate text-sm">{session.title}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSession(session.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-[var(--color-thm-accent)] transition-opacity"
                title="Delete Session"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {sessions.length === 0 && (
            <div className="text-sm text-[var(--color-thm-muted)] px-2 italic">
              No recent sessions.
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-[var(--color-thm-border)]">
        <button className="flex items-center gap-2 text-[var(--color-thm-muted)] hover:text-white transition-colors w-full px-2 py-2 rounded hover:bg-[var(--color-thm-border)]">
          <Settings className="w-4 h-4" />
          <span className="text-sm">Settings</span>
        </button>
      </div>
    </aside>
  );
};
