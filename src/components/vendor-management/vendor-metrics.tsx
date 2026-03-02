"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChevronLeft } from "lucide-react";
import type {
  Vendor,
  VendorMetrics as VendorMetricsType,
} from "@/types/vendor";

interface VendorMetricsProps {
  vendor: Vendor;
  metrics: VendorMetricsType;
  onBack: () => void;
  onEnable: (vendor: Vendor) => void;
  onDisable: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
}

function formatCurrency(value: number): string {
  return "₦" + value.toLocaleString();
}

function formatNumber(value: number): string {
  return value.toLocaleString();
}

export function VendorMetricsView({
  vendor,
  metrics,
  onBack,
  onEnable,
  onDisable,
  onDelete,
}: VendorMetricsProps) {
  const isEnabled = vendor.status === "Enabled";

  const metricCards = [
    {
      label: "TODAY'S SALE",
      value: formatCurrency(metrics.todaySale),
      change: metrics.todaySaleChange,
    },
    {
      label: "TOTAL SALES",
      value: formatCurrency(metrics.totalSales),
      change: metrics.totalSalesChange,
    },
    {
      label: "DAILY ORDERS",
      value: formatNumber(metrics.dailyOrders),
      change: metrics.dailyOrdersChange,
    },
    {
      label: "TOTAL ORDERS",
      value: formatNumber(metrics.totalOrders),
      change: metrics.totalOrdersChange,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#669917]">
          {vendor.name}
        </h2>
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Chart + Metrics Grid */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={metrics.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7280" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7280" }}
              />
              <Tooltip />
              <Legend
                verticalAlign="top"
                align="center"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ paddingBottom: 16 }}
              />
              <Bar
                dataKey="completed"
                name="Completed"
                fill="#669917"
                stackId="a"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="cancelled"
                name="Cancelled"
                fill="#6B1A1A"
                stackId="a"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:w-[220px]">
          {metricCards.map((card) => {
            const isPositive = card.change >= 0;
            return (
              <div
                key={card.label}
                className="border border-gray-100 rounded-xl p-4"
              >
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  {card.label}
                </p>
                <div className="flex items-end justify-between gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    {card.value}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      isPositive ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {card.change}% {isPositive ? "↑" : "↓"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          onClick={() => (isEnabled ? onDisable(vendor) : onEnable(vendor))}
          className="flex-1 py-3 bg-[#669917] text-white rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer"
        >
          {isEnabled ? "Disable Vendor" : "Enable Vendor"}
        </button>
        <button
          onClick={() => onDelete(vendor)}
          className="flex-1 py-3 bg-[#993127] text-white rounded-lg font-medium hover:bg-red-900 transition-colors cursor-pointer"
        >
          Delete Vendor
        </button>
      </div>
    </div>
  );
}
