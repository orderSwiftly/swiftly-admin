import React from "react";

interface PaymentMethodCardProps {
  method: string;
  percentage: number;
  change: number;
}

export function PaymentMethodCard({
  method,
  percentage,
  change,
}: PaymentMethodCardProps) {
  const isPositive = change >= 0;
  const changeColor = isPositive ? "text-green-500" : "text-red-500";
  const formattedChange = isPositive ? `+${change}%` : `${change}%`;

  return (
    <div className="flex flex-col">
      <h3 className="text-xs font-medium text-gray-500 mb-2">{method}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-gray-900">{percentage}%</span>
        <span
          className={`text-sm font-semibold ${changeColor} flex items-center gap-1`}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
            <path d="M6 2L10 8H2L6 2Z" />
          </svg>
          {change.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
