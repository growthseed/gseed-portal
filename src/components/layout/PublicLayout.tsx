import { ReactNode } from 'react';
import { PublicHeader } from './PublicHeader';

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PublicHeader />
      <main>
        {children}
      </main>
    </div>
  );
}
