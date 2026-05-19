// src/components/finance/section-2.tsx
"use client";

import { useEffect, useState } from "react";
import { getTransferTransactions, getPaymentTransactions } from "@/lib/api/financials";
import { ArrowRight, ChevronDown } from "lucide-react";

interface MoneyFlowData {
  customersPaid: { lifetime: number; period: number };
  vendorAllocation: { lifetime: number; period: number };
  riderAllocation: { lifetime: number; period: number };
  swiftlyGross: { lifetime: number; period: number };
}

interface PaymentTransaction {
  amount: number;
}

interface TransferTransaction {
  amount: number;
}

interface PaymentsResponse {
  status: string;
  data: {
    payments: PaymentTransaction[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

interface TransfersResponse {
  status: string;
  data: {
    transfers: TransferTransaction[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

type DateRange = "today" | "thisWeek" | "thisMonth" | "custom";

// ─── Filter dropdown ──────────────────────────────────────────────────────────

function FilterDropdown({
  value, options, onChange,
}: {
  value: DateRange;
  options: { label: string; value: DateRange }[];
  onChange: (v: DateRange) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value)?.label ?? "Filter";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
      >
        {current}
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
          {options.map((o) => (
            <button
              key={o.value}
              onClick={() => { onChange(o.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${
                value === o.value
                  ? "bg-violet-50 text-(--prof-clr) font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Section2() {
  const [moneyFlow, setMoneyFlow] = useState<MoneyFlowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>("today");
  const [customFrom, setCustomFrom] = useState<string>("");
  const [customTo, setCustomTo] = useState<string>("");

  const getDateRangeParams = (): { from?: string; to?: string } => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    switch (dateRange) {
      case "today":
        return { from: todayStr, to: todayStr };
      case "thisWeek": {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        return { 
          from: startOfWeek.toISOString().split('T')[0], 
          to: todayStr 
        };
      }
      case "thisMonth": {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return { 
          from: startOfMonth.toISOString().split('T')[0], 
          to: todayStr 
        };
      }
      case "custom":
        return { from: customFrom, to: customTo };
      default:
        return { from: todayStr, to: todayStr };
    }
  };

  const getPeriodLabel = (): string => {
    switch (dateRange) {
      case "today": return "today";
      case "thisWeek": return "this week";
      case "thisMonth": return "this month";
      case "custom": return "selected period";
      default: return "today";
    }
  };

  const fetchMoneyFlow = async () => {
    try {
      setLoading(true);
      
      const { from, to } = getDateRangeParams();
      
      if (dateRange === "custom" && (!customFrom || !customTo)) {
        setMoneyFlow(null);
        setLoading(false);
        return;
      }
      
      // Fetch both payment and transfer transactions
      const [paymentsResult, transfersResult] = await Promise.all([
        getPaymentTransactions({
          from,
          to,
          status: "paid"
        }) as Promise<PaymentsResponse>,
        getTransferTransactions({
          from,
          to,
          status: "paid"
        }) as Promise<TransfersResponse>
      ]);
      
      // Calculate totals from API responses
      const periodPayments = paymentsResult?.data?.payments?.reduce((sum: number, p: PaymentTransaction) => sum + p.amount, 0) || 0;
      const periodTransfers = transfersResult?.data?.transfers?.reduce((sum: number, t: TransferTransaction) => sum + t.amount, 0) || 0;
      
      // Using dummy data for now - replace with actual API data when available
      const mockData: MoneyFlowData = {
        customersPaid: {
          lifetime: 2601,
          period: periodPayments || 867
        },
        vendorAllocation: {
          lifetime: 400,
          period: 200
        },
        riderAllocation: {
          lifetime: 400,
          period: periodTransfers || 0
        },
        swiftlyGross: {
          lifetime: 1331,
          period: 466
        }
      };
      
      setMoneyFlow(mockData);
    } catch (err) {
      console.error("Failed to fetch money flow data:", err);
      setError("Failed to load money flow data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoneyFlow();
  }, [dateRange, customFrom, customTo]);

  const dateRangeOptions: { label: string; value: DateRange }[] = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "thisWeek" },
    { label: "This Month", value: "thisMonth" },
  ];

  if (loading) {
    return (
      <section className="w-full flex flex-col gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="flex items-center justify-between gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full flex flex-col gap-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600">
          {error}
        </div>
      </section>
    );
  }

  if (!moneyFlow) return null;

  return (
    <section className="w-full flex flex-col gap-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Money Flow</h2>
          
          <FilterDropdown
            value={dateRange}
            options={dateRangeOptions}
            onChange={setDateRange}
          />
        </div>

        {/* Custom Date Picker */}
        {dateRange === "custom" && (
          <div className="mb-6 flex gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">From</label>
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-(--acc-clr)"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">To</label>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-(--acc-clr)"
              />
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between gap-4">
          {/* Customers Paid */}
          <div className="flex-1 space-y-1">
            <p className="text-sm text-gray-500">Customers Paid</p>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ₦{moneyFlow.customersPaid.lifetime.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">lifetime</p>
            </div>
            <div className="mt-2">
              <p className="text-lg font-semibold text-gray-700">
                ₦{moneyFlow.customersPaid.period.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">{getPeriodLabel()}</p>
            </div>
          </div>

          {/* Arrow */}
          <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />

          {/* Vendor Allocation */}
          <div className="flex-1 space-y-1">
            <p className="text-sm text-gray-500">Vendor Allocation</p>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ₦{moneyFlow.vendorAllocation.lifetime.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">lifetime</p>
            </div>
            <div className="mt-2">
              <p className="text-lg font-semibold text-gray-700">
                ₦{moneyFlow.vendorAllocation.period.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">{getPeriodLabel()}</p>
            </div>
          </div>

          {/* Arrow */}
          <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />

          {/* Rider Allocation */}
          <div className="flex-1 space-y-1">
            <p className="text-sm text-gray-500">Rider Allocation</p>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ₦{moneyFlow.riderAllocation.lifetime.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">lifetime</p>
            </div>
            <div className="mt-2">
              <p className="text-lg font-semibold text-gray-700">
                ₦{moneyFlow.riderAllocation.period.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">
                {dateRange === "today" ? "paid today" : getPeriodLabel() === "selected period" ? "paid in selected period" : `paid ${getPeriodLabel()}`}
              </p>
            </div>
          </div>

          {/* Arrow */}
          <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />

          {/* Swiftly Gross */}
          <div className="flex-1 space-y-1">
            <p className="text-sm text-gray-500">Swiftly Gross</p>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ₦{moneyFlow.swiftlyGross.lifetime.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">lifetime</p>
            </div>
            <div className="mt-2">
              <p className="text-lg font-semibold text-gray-700">
                ₦{moneyFlow.swiftlyGross.period.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">{getPeriodLabel()}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}