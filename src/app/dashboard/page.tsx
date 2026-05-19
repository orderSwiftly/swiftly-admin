// src/app/dashboard/page.tsx

"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Section1 from "@/components/finance/section-1";
import Section2 from "@/components/finance/section-2";

export default function DashboardPage() {
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem("admin_token");

      await fetch(`${api_url}/api/v1/auth/super-admin/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("admin_token");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Top bar ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-600 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
          >
            <LogOut size={15} />
            {loggingOut ? "Signing out…" : "Sign Out"}
          </button>
        </div>

        {/* ── Finance Section 1 — KPI cards ───────────────────────────── */}
        <Section1 />

        {/* ── Finance Section 2 — Money Flow ───────────────────────────── */}
        <Section2 />

      </div>
    </main>
  );
}