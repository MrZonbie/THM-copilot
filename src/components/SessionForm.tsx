import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { TerminalSquare } from 'lucide-react';

export const SessionForm: React.FC = () => {
  const { createSession } = useStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [objective, setObjective] = useState('');
  const [ip, setIp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSession({ name, description, objective, ip });
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-[var(--color-thm-panel)] p-8 rounded-lg border border-[var(--color-thm-border)] shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <TerminalSquare className="w-8 h-8 text-[var(--color-thm-accent)]" />
          <h2 className="text-2xl font-bold">Start New Investigation</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-thm-muted)] mb-1">Room Name</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[var(--color-thm-bg)] border border-[var(--color-thm-border)] rounded p-2.5 text-white focus:outline-none focus:border-[var(--color-thm-accent)] transition-colors"
              placeholder="e.g. Basic Pentesting"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-thm-muted)] mb-1">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[var(--color-thm-bg)] border border-[var(--color-thm-border)] rounded p-2.5 text-white focus:outline-none focus:border-[var(--color-thm-accent)] transition-colors min-h-[100px]"
              placeholder="Brief description of the room..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-thm-muted)] mb-1">Current Objective / Question</label>
            <input
              required
              type="text"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full bg-[var(--color-thm-bg)] border border-[var(--color-thm-border)] rounded p-2.5 text-white focus:outline-none focus:border-[var(--color-thm-accent)] transition-colors"
              placeholder="e.g. Find the hidden directory or User flag"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-thm-muted)] mb-1">Target IP / Hostname (Optional)</label>
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="w-full bg-[var(--color-thm-bg)] border border-[var(--color-thm-border)] rounded p-2.5 text-white focus:outline-none focus:border-[var(--color-thm-accent)] transition-colors font-mono"
              placeholder="10.10.x.x"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-[var(--color-thm-accent)] hover:bg-[var(--color-thm-accent-hover)] text-white font-medium py-3 px-4 rounded transition-colors"
          >
            Start Investigation
          </button>
        </form>
      </div>
    </div>
  );
};
