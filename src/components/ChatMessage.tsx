import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '../types';
import { Bot, User, Terminal, Copy, Check } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const CodeBlock = ({ inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || '');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return !inline && match ? (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 p-1.5 bg-[var(--color-thm-panel)] rounded border border-[var(--color-thm-border)] text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
        title="Copy code"
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      </button>
      <pre className={className} style={{ margin: 0 }}>
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  ) : (
    <code className="bg-[var(--color-thm-bg)] px-1.5 py-0.5 rounded text-[var(--color-thm-accent)] font-mono" {...props}>
      {children}
    </code>
  );
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex gap-4 p-4 rounded-lg ${isAssistant ? 'bg-[var(--color-thm-panel)] border border-[var(--color-thm-border)]' : ''}`}>
      <div className="flex-shrink-0 mt-1">
        {isAssistant ? (
          <div className="w-8 h-8 rounded bg-[var(--color-thm-accent)] flex items-center justify-center text-white">
            <Bot className="w-5 h-5" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded bg-gray-600 flex items-center justify-center text-white">
            <User className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        {/* User Message Rendering */}
        {!isAssistant && message.metadata && (
          <div className="space-y-3">
            {message.metadata.commandExecuted && (
              <div>
                <span className="text-xs font-semibold text-[var(--color-thm-muted)] uppercase">Command:</span>
                <div className="bg-[var(--color-thm-bg)] p-2 rounded border border-[var(--color-thm-border)] font-mono text-sm text-[var(--color-thm-accent)] flex items-center gap-2 mt-1">
                  <Terminal className="w-4 h-4" />
                  {message.metadata.commandExecuted}
                </div>
              </div>
            )}

            {message.metadata.terminalOutput && (
              <div>
                <span className="text-xs font-semibold text-[var(--color-thm-muted)] uppercase">Output:</span>
                <pre className="bg-[var(--color-thm-bg)] p-3 rounded border border-[var(--color-thm-border)] font-mono text-sm overflow-x-auto mt-1 whitespace-pre-wrap text-gray-300">
                  {message.metadata.terminalOutput}
                </pre>
              </div>
            )}

            {message.metadata.note && (
              <div>
                <span className="text-xs font-semibold text-[var(--color-thm-muted)] uppercase">Note:</span>
                <div className="text-sm mt-1">{message.metadata.note}</div>
              </div>
            )}

            {message.content && !message.metadata.terminalOutput && (
               <div className="text-sm">{message.content}</div>
            )}
          </div>
        )}

        {/* Assistant Message Rendering */}
        {isAssistant && (
          <div className="prose prose-invert max-w-none text-sm leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: CodeBlock
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};
