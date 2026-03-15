"use client";

import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import {
  TrendingUp, TrendingDown, ShoppingBag, Users,
  School, ClipboardList, Store, UserCheck, Bike, CalendarDays,
} from "lucide-react";
import PulseLoader from "@/components/pulse-loader";
import {
  getDashboardStats,
  type DashboardStats,
} from "@/lib/api/dashboard";

// ─── Formatters ───────────────────────────────────────────────────────────────

function formatMoney(n: number) {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(1)}K`;
  return `₦${n.toLocaleString()}`;
}

function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function shortMoney(n: number) {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}K`;
  return `₦${n}`;
}

// ─── Stat card ────────────────────────────────────────────────────────────────

interface CardProps {
  title: string;
  value: string;
  change: string;
  direction: "up" | "down";
  icon: React.ReactNode;
  accent: string;
  iconColor: string;
}

function StatCard({ title, value, change, direction, icon, accent, iconColor }: CardProps) {
  const isUp = direction === "up";
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent}`}>
          <span className={iconColor}>{icon}</span>
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <div className={`flex items-center gap-1 text-xs font-semibold ${isUp ? "text-emerald-600" : "text-red-500"}`}>
        {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
        <span>{change}</span>
        <span className="text-gray-400 font-normal ml-1">
          vs {title.toLowerCase().startsWith("today") || title.toLowerCase().startsWith("daily") ? "yesterday" : "last month"}
        </span>
      </div>
    </div>
  );
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label, isMoney }: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
  isMoney?: boolean;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-500">{p.name}:</span>
          <span className="font-bold text-gray-800">
            {isMoney ? shortMoney(p.value) : p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Build chart data from stats ──────────────────────────────────────────────

function buildSalesChartData(stats: DashboardStats) {
  return [
    { name: "Today's Sale", value: stats.todaysSale.amount, fill: "#10b981" },
    { name: "Total Sales", value: stats.totalSales.amount, fill: "#3b82f6" },
  ];
}

function buildCountsChartData(stats: DashboardStats) {
  return [
    { name: "Users", value: stats.totalUsers.count, fill: "#8b5cf6" },
    { name: "Orders", value: stats.totalOrders.count, fill: "#f97316" },
    { name: "Vendors", value: stats.totalVendors.count, fill: "#ec4899" },
    { name: "Riders", value: stats.totalRiders.count, fill: "#6366f1" },
    { name: "Schools", value: stats.totalSchools.count, fill: "#f59e0b" },
    { name: "Daily Users", value: stats.dailyUsers.count, fill: "#14b8a6" },
    { name: "Daily Orders", value: stats.dailyOrders.count, fill: "#f43f5e" },
  ];
}

// Simulate a trend line using today vs total for area chart
function buildTrendData(stats: DashboardStats) {
  return [
    {
      name: "Last Month (est.)",
      sales: Math.round(stats.totalSales.amount * 0.12),
      orders: Math.round(stats.totalOrders.count * 0.12),
      users: Math.round(stats.totalUsers.count * 0.11),
    },
    {
      name: "This Month (est.)",
      sales: Math.round(stats.totalSales.amount * 0.15),
      orders: Math.round(stats.totalOrders.count * 0.15),
      users: Math.round(stats.totalUsers.count * 0.14),
    },
    {
      name: "Today",
      sales: stats.todaysSale.amount,
      orders: stats.dailyOrders.count,
      users: stats.dailyUsers.count,
    },
  ];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load stats"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PulseLoader />
      </div>
    );

  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;
  if (!stats) return null;

  const cards: CardProps[] = [
    { title: "Today's Sale", value: formatMoney(stats.todaysSale.amount), change: stats.todaysSale.change, direction: stats.todaysSale.direction, icon: <ShoppingBag size={17} />, accent: "bg-emerald-100", iconColor: "text-emerald-700" },
    { title: "Total Sales", value: formatMoney(stats.totalSales.amount), change: stats.totalSales.change, direction: stats.totalSales.direction, icon: <TrendingUp size={17} />, accent: "bg-blue-100", iconColor: "text-blue-700" },
    { title: "Total Users", value: formatCount(stats.totalUsers.count), change: stats.totalUsers.change, direction: stats.totalUsers.direction, icon: <Users size={17} />, accent: "bg-purple-100", iconColor: "text-purple-700" },
    { title: "Total Schools", value: formatCount(stats.totalSchools.count), change: stats.totalSchools.change, direction: stats.totalSchools.direction, icon: <School size={17} />, accent: "bg-amber-100", iconColor: "text-amber-700" },
    { title: "Total Orders", value: formatCount(stats.totalOrders.count), change: stats.totalOrders.change, direction: stats.totalOrders.direction, icon: <ClipboardList size={17} />, accent: "bg-orange-100", iconColor: "text-orange-700" },
    { title: "Total Vendors", value: formatCount(stats.totalVendors.count), change: stats.totalVendors.change, direction: stats.totalVendors.direction, icon: <Store size={17} />, accent: "bg-pink-100", iconColor: "text-pink-700" },
    { title: "Daily Users", value: formatCount(stats.dailyUsers.count), change: stats.dailyUsers.change, direction: stats.dailyUsers.direction, icon: <UserCheck size={17} />, accent: "bg-teal-100", iconColor: "text-teal-700" },
    { title: "Total Riders", value: formatCount(stats.totalRiders.count), change: stats.totalRiders.change, direction: stats.totalRiders.direction, icon: <Bike size={17} />, accent: "bg-indigo-100", iconColor: "text-indigo-700" },
    { title: "Daily Orders", value: formatCount(stats.dailyOrders.count), change: stats.dailyOrders.change, direction: stats.dailyOrders.direction, icon: <CalendarDays size={17} />, accent: "bg-rose-100", iconColor: "text-rose-700" },
  ];

  const salesChartData = buildSalesChartData(stats);
  const countsChartData = buildCountsChartData(stats);
  const trendData = buildTrendData(stats);

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

        {/* ── Charts row ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Sales bar chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-1">Sales Overview</h2>
            <p className="text-xs text-gray-400 mb-5">Today vs total revenue</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={salesChartData} barCategoryGap="40%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => shortMoney(v)} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip isMoney />} />
                <Bar dataKey="value" name="Amount" radius={[6, 6, 0, 0]}>
                  {salesChartData.map((entry, i) => (
                    <rect key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Counts bar chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-1">Platform Counts</h2>
            <p className="text-xs text-gray-400 mb-5">Users, orders, vendors, riders & schools</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={countsChartData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => formatCount(v)} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Count" radius={[6, 6, 0, 0]} fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Trend area chart (full width) ────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Activity Trend</h2>
          <p className="text-xs text-gray-400 mb-5">Sales, orders and users — last month → this month → today</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="gSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip isMoney={false} />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: "#6b7280" }} />
              <Area type="monotone" dataKey="sales" name="Sales (₦)" stroke="#10b981" strokeWidth={2} fill="url(#gSales)" dot={{ r: 4, fill: "#10b981" }} />
              <Area type="monotone" dataKey="orders" name="Orders" stroke="#f97316" strokeWidth={2} fill="url(#gOrders)" dot={{ r: 4, fill: "#f97316" }} />
              <Area type="monotone" dataKey="users" name="Users" stroke="#8b5cf6" strokeWidth={2} fill="url(#gUsers)" dot={{ r: 4, fill: "#8b5cf6" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── Stat cards ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c) => <StatCard key={c.title} {...c} />)}
        </div>

      </div>
    </main>
  );
}