import React from 'react';
import { useStore } from '../store/useStore';
import { Target, Server, ClipboardList } from 'lucide-react';

export const ContextPanel: React.FC = () => {
  const { getActiveSession } = useStore();
  const session = getActiveSession();

  if (!session) return null;

  const confirmedEvidence = session.evidence.filter(e => e.status === 'confirmed');
  const hypotheses = session.evidence.filter(e => e.status === 'hypothesis');

  return (
    <aside className="w-80 bg-[var(--color-thm-panel)] border-l border-[var(--color-thm-border)] flex flex-col h-screen hidden lg:flex">
      <div className="p-4 border-b border-[var(--color-thm-border)]">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <Target className="w-5 h-5 text-[var(--color-thm-accent)]" />
          Investigation Context
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">

        {/* Target Info */}
        <section>
          <h3 className="text-xs font-semibold text-[var(--color-thm-muted)] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Server className="w-4 h-4" />
            Target Details
          </h3>
          <div className="bg-[var(--color-thm-bg)] p-3 rounded border border-[var(--color-thm-border)] space-y-2 text-sm">
            <div><span className="text-[var(--color-thm-muted)]">Room:</span> {session.roomInfo.name}</div>
            {session.roomInfo.ip && (
              <div><span className="text-[var(--color-thm-muted)]">IP:</span> <span className="font-mono text-[var(--color-thm-accent)]">{session.roomInfo.ip}</span></div>
            )}
            <div><span className="text-[var(--color-thm-muted)]">Objective:</span> {session.roomInfo.objective}</div>
          </div>
        </section>

        {/* Confirmed Evidence */}
        <section>
          <h3 className="text-xs font-semibold text-[var(--color-thm-muted)] uppercase tracking-wider mb-3 flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            Confirmed Discoveries
          </h3>
          {confirmedEvidence.length === 0 ? (
            <div className="text-sm text-[var(--color-thm-muted)] italic">None yet.</div>
          ) : (
            <ul className="space-y-2">
              {confirmedEvidence.map(ev => (
                <li key={ev.id} className="bg-[var(--color-thm-bg)] p-2.5 rounded border border-[var(--color-thm-border)] text-sm border-l-2 border-l-green-500">
                  {ev.description}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Hypotheses */}
        <section>
          <h3 className="text-xs font-semibold text-[var(--color-thm-muted)] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Working Hypotheses
          </h3>
          {hypotheses.length === 0 ? (
            <div className="text-sm text-[var(--color-thm-muted)] italic">None yet.</div>
          ) : (
            <ul className="space-y-2">
              {hypotheses.map(ev => (
                <li key={ev.id} className="bg-[var(--color-thm-bg)] p-2.5 rounded border border-[var(--color-thm-border)] text-sm border-l-2 border-l-yellow-500">
                  {ev.description}
                </li>
              ))}
            </ul>
          )}
        </section>

      </div>
    </aside>
  );
};
