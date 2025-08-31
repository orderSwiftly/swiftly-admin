'use client';

import Sidebar from '@/components/sidebar';
import { SidebarProvider, useSidebar } from '@/components/sidebar-context';

const DashboardContent = ({ children }: { children: React.ReactNode }) => {
  const { collapsed } = useSidebar();
  
  return (
    <main 
      className={`flex-1 bg-[var(--light-bg)] p-4 transition-all duration-300 min-h-screen ${
        collapsed ? 'ml-16' : 'ml-64'
      }`}
    >
      {children}
    </main>
  );
};

export default function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex">
        <Sidebar />
        <DashboardContent>{children}</DashboardContent>
      </div>
    </SidebarProvider>
  );
}