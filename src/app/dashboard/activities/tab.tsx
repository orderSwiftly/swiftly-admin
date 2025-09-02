'use client';

import { useState, useEffect } from "react";
import GetNotifs from "@/components/get-notification";
import Transaction from "@/components/transaction";
import Settings from "@/components/settings/settings";
import Complaint from "@/components/get-complaint";

const tabs = [
  { label: "Notifications", value: "notifications" },
  { label: "Complaints", value: "complaints" },
  { label: "Settings", value: "settings" },
  { label: "Reports", value: "reports" },
  { label: "Transactions", value: "transactions" },
  { label: "Orders", value: "orders" }
];

export default function ActivitiesPage() {
  const [activeTab, setActiveTab] = useState("notifications");
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <main className="min-h-screen w-full bg-[var(--light-bg)] p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--acc-clr)] pry-ff">Activities</h1>
        <p className="text-base md:text-lg text-[var(--txt-clr)] sec-ff mt-1">
          Manage your account activities here.
        </p>
      </div>

      {/* Tabs Header */}
      <div className="mb-6 border-b border-gray-300 overflow-x-auto sec-ff">
        {isMobile ? (
          // Mobile select dropdown
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full p-3 rounded-lg border border-[var(--acc-clr)] bg-[var(--light-bg)] backdrop-blur-md text-[var(--txt-clr)] focus:outline-none focus:ring-2 focus:ring-[var(--acc-clr)]"
          >
            {tabs.map((tab) => (
              <option key={tab.value} value={tab.value}>
                {tab.label}
              </option>
            ))}
          </select>
        ) : (
          // Desktop tabs
          <div className="flex gap-4 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`py-2 px-4 font-medium flex-shrink-0 transition-colors cursor-pointer ${
                  activeTab === tab.value
                    ? "border-b-2 border-[var(--acc-clr)] text-[var(--acc-clr)]"
                    : "text-[var(--txt-clr)] hover:text-[var(--acc-clr)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tabs Content */}
      <section className="w-full max-w-6xl space-y-6 sec-ff">
        {activeTab === "notifications" && (
          <div>
            <h2 className="text-xl font-semibold text-[var(--acc-clr)] mb-2">Notifications</h2>
            <p className="text-sm text-[var(--txt-clr)] mb-4">Manage your notifications here.</p>
            <GetNotifs />
          </div>
        )}
        {activeTab === "complaints" && (
          <div>
            <h2 className="text-xl font-semibold text-[var(--acc-clr)] mb-2">Complaints</h2>
            <p className="text-sm text-[var(--txt-clr)] mb-4">View and manage complaints here.</p>
            <Complaint />
          </div>
        )}
        {activeTab === "settings" && (
          <div>
            <h2 className="text-xl font-semibold text-[var(--acc-clr)] mb-2">Settings</h2>
            <p className="text-sm text-[var(--txt-clr)] mb-4">Manage your account settings.</p>
            <Settings />
          </div>
        )}
        {activeTab === "reports" && (
          <div>
            <h2 className="text-xl font-semibold text-[var(--acc-clr)] mb-2">Reports</h2>
            <p className="text-sm text-[var(--txt-clr)] mb-4">View and manage reports here.</p>
            <div className="p-6 text-center bg-white/10 backdrop-blur-md rounded-lg">
              <p className="text-[var(--txt-clr)]">Reports feature coming soon</p>
            </div>
          </div>
        )}
        {activeTab === "transactions" && (
          <div>
            <h2 className="text-xl font-semibold text-[var(--acc-clr)] mb-2">Transactions</h2>
            <p className="text-sm text-[var(--txt-clr)] mb-4">Manage transactions here.</p>
            <Transaction />
          </div>
        )}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-xl font-semibold text-[var(--acc-clr)] mb-2">Orders</h2>
            <p className="text-sm text-[var(--txt-clr)] mb-4">Manage orders here.</p>
            <div className="p-6 text-center bg-white/10 backdrop-blur-md rounded-lg">
              <p className="text-[var(--txt-clr)]">Orders feature coming soon</p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}