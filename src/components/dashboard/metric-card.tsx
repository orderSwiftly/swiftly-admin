import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  prefix?: string;
}

export function MetricCard({
  title,
  value,
  change,
  prefix = "",
}: MetricCardProps) {
  const isPositive = change >= 0;
  const changeColor = isPositive ? "text-green-500" : "text-red-500";
  const formattedChange = isPositive ? `+${change}%` : `${change}%`;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
        {title}
      </h3>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-gray-900">
          {prefix}
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        <span
          className={`text-sm font-medium ${changeColor} flex items-center`}
        >
          {formattedChange}
          <span className="ml-1">{isPositive ? "↑" : "↓"}</span>
        </span>
      </div>
    </div>
  );
}
