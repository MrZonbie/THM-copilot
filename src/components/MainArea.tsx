import React, { useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { SessionForm } from './SessionForm';
import { TerminalInput } from './TerminalInput';
import { ChatMessage } from './ChatMessage';

export const MainArea: React.FC = () => {
  const { getActiveSession } = useStore();
  const session = getActiveSession();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session?.messages]);

  if (!session) {
    return <SessionForm />;
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--color-thm-bg)] relative">
      <div className="p-4 border-b border-[var(--color-thm-border)] bg-[var(--color-thm-panel)] flex-shrink-0">
        <h2 className="text-xl font-bold">{session.roomInfo.name}</h2>
        <p className="text-sm text-[var(--color-thm-muted)] mt-1">{session.roomInfo.objective}</p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {session.messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[var(--color-thm-muted)]">
            No messages yet. Provide your first terminal output below.
          </div>
        ) : (
          session.messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))
        )}
      </div>

      <div className="p-4 border-t border-[var(--color-thm-border)] bg-[var(--color-thm-panel)]">
        <TerminalInput sessionId={session.id} />
      </div>
    </div>
  );
};
