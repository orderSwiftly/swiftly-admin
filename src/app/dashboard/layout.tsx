"use client";

import Sidebar from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <body>
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <main className="flex-1 md:ml-64">{children}</main>
      </div>
    </body>
  );
}
