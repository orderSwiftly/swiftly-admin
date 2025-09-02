'use client';

import Sidebar from '@/components/sidebar';
import { SidebarProvider, useSidebar } from '@/components/sidebar-context';

const DashboardContent = ({ children }: { children: React.ReactNode }) => {
  const { collapsed } = useSidebar();
  
  return (
    <div className="min-h-screen bg-[var(--light-bg)]">
      <main
        className={`flex-1 p-4 transition-all duration-300 ${
          collapsed ? 'md:ml-16' : 'md:ml-64'
        } pt-20 md:pt-4`}
      >
        {children}
      </main>
    </div>
  );
};

export default function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex bg-[var(--light-bg)]">
        <Sidebar />
        <DashboardContent>{children}</DashboardContent>
      </div>
    </SidebarProvider>
  );
}