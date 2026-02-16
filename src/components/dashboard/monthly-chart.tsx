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
import {
  MonthlyData,
  PaymentMethodMetrics,
} from "@/lib/api/get-dashboard-metrics";
import { PaymentMethodCard } from "./payment-method-card";

interface MonthlyChartProps {
  data: MonthlyData[];
  paymentMethods: PaymentMethodMetrics;
}

export function MonthlyChart({ data, paymentMethods }: MonthlyChartProps) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between mb-4 md:mb-8">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1">
            Swiftly Metrics
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Your current sales summary and activity.
          </p>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 md:gap-12 mb-4 md:mb-8">
        <PaymentMethodCard
          method="Transfer"
          percentage={paymentMethods.transfer}
          change={paymentMethods.transferChange}
        />
        <PaymentMethodCard
          method="Bank"
          percentage={paymentMethods.bank}
          change={paymentMethods.bankChange}
        />
        <PaymentMethodCard
          method="Cash"
          percentage={paymentMethods.cash}
          change={paymentMethods.cashChange}
        />
      </div>

      <ResponsiveContainer
        width="100%"
        height={300}
        className="sm:h-[350px] md:h-[400px]"
      >
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            stroke="#9ca3af"
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />
          <YAxis
            stroke="#9ca3af"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            ticks={[0, 50, 100, 150, 200, 250]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              padding: "8px 12px",
            }}
            cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
          <Bar
            dataKey="transfer"
            stackId="a"
            fill="#0d9488"
            name="Transfer"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="cash"
            stackId="a"
            fill="#2dd4bf"
            name="Cash"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="bank"
            stackId="a"
            fill="#99f6e4"
            name="Bank"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
