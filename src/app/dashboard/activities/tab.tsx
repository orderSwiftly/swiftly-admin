'use client';

import { useState } from "react";
import GetNotifs from "@/components/get-notification";
import Transaction from "@/components/transaction";

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

  return (
    <main className="min-h-screen w-full bg-[var(--light-bg)]">
      <div>
        <h1 className="text-2xl font-bold text-[var(--acc-clr)] pry-ff">Activities</h1>
        <p className="text-lg text-[var(--txt-clr)] sec-ff">
          Manage your account activities here.
        </p>
      </div>

      {/* Tabs Header */}
      <div className="mt-6 border-b border-gray-300 overflow-x-auto sec-ff">
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
      </div>

      {/* Tabs Content */}
      <section className="w-full max-w-4xl space-y-6 mt-6 sec-ff">
        {activeTab === "notifications" && (
          <div>
            <h2 className="text-xl font-semibold text-[var(--acc-clr)]">Notifications</h2>
            <p className="text-sm text-[var(--txt-clr)]">Manage your notifications here.</p>
            <GetNotifs />
          </div>
        )}
        {activeTab === "complaints" && (
          <div>
            <h2 className="text-xl font-semibold text-[var(--acc-clr)]">Complaints</h2>
            <p className="text-sm text-[var(--txt-clr)]">Manage your complaints here.</p>
          </div>
        )}
        {activeTab === "settings" && (
          <div>
            <h2 className="text-xl font-semibold text-[var(--acc-clr)]">Settings</h2>
            <p className="text-sm text-[var(--txt-clr)]">Manage your settings here.</p>
          </div>
        )}
        {activeTab === "reports" && (
          <div>
            <h2 className="text-xl font-semibold text-[var(--acc-clr)]">Reports</h2>
            <p className="text-sm text-[var(--txt-clr)]">View and manage reports here.</p>
          </div>
        )}
        {activeTab === "transactions" && (
          <div>
            <h2 className="text-xl font-semibold text-[var(--acc-clr)]">Transactions</h2>
            <p className="text-sm text-[var(--txt-clr)]">Manage transactions here.</p>
            <Transaction />
          </div>
        )}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-xl font-semibold text-[var(--acc-clr)]">Orders</h2>
            <p className="text-sm text-[var(--txt-clr)]">Manage orders here.</p>
          </div>
        )}
      </section>
    </main>
  );
}