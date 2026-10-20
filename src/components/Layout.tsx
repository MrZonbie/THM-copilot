import React from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-full bg-[var(--color-thm-bg)] overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex overflow-hidden">
        {children}
      </main>
    </div>
  );
};
