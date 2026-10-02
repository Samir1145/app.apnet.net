// admin-panel/src/app/dashboard/layout.tsx
import React from 'react';
import { ClientSidebar } from '@/components/client/sidebar';
import { ClientHeader } from '@/components/client/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* 6-Pillar Client Sidebar */}
      <ClientSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ClientHeader />
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
