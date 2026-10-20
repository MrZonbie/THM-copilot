import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Send, Terminal } from 'lucide-react';
import { generateChatResponse } from '../services/api';

interface TerminalInputProps {
  sessionId: string;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({ sessionId }) => {
  const { addMessage, getActiveSession } = useStore();
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() && !output.trim() && !note.trim()) return;

    // Add user message
    addMessage(sessionId, {
      role: 'user',
      content: 'Provided new terminal output.',
      metadata: {
        commandExecuted: command.trim(),
        terminalOutput: output.trim(),
        note: note.trim(),
      },
    });

    setCommand('');
    setOutput('');
    setNote('');
    setIsLoading(true);

    try {
      const session = getActiveSession();
      if (session) {
        // Fetch AI response
        const reply = await generateChatResponse(session);
        addMessage(sessionId, {
          role: 'assistant',
          content: reply,
        });
      }
    } catch (error) {
      console.error(error);
      addMessage(sessionId, {
        role: 'system',
        content: `Error communicating with AI: ${error instanceof Error ? error.message : String(error)}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-3">
        <div className="flex-1 space-y-2">
          <div className="relative">
            <Terminal className="absolute left-3 top-2.5 w-4 h-4 text-[var(--color-thm-muted)]" />
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Command executed (e.g. nmap -sC -sV IP)"
              className="w-full bg-[var(--color-thm-bg)] border border-[var(--color-thm-border)] rounded pl-10 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-thm-accent)] font-mono transition-colors"
            />
          </div>

          <textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            placeholder="Paste terminal output here..."
            className="w-full h-32 bg-[var(--color-thm-bg)] border border-[var(--color-thm-border)] rounded p-3 text-sm text-white focus:outline-none focus:border-[var(--color-thm-accent)] font-mono transition-colors resize-y"
          />

          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Additional notes or questions... (Optional)"
            className="w-full bg-[var(--color-thm-bg)] border border-[var(--color-thm-border)] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-thm-accent)] transition-colors"
          />
        </div>

        <div className="flex flex-col justify-end">
          <button
            type="submit"
            disabled={isLoading || (!command.trim() && !output.trim() && !note.trim())}
            className="h-[42px] px-4 bg-[var(--color-thm-accent)] hover:bg-[var(--color-thm-accent-hover)] text-white rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
