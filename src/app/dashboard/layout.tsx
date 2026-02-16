"use client";

import Sidebar from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <body>
      <header>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital@0;1&display=swap" rel="stylesheet" />
      </header>
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <main className="flex-1 md:ml-64 pry-ff">{children}</main>
      </div>
    </body>
  );
}
