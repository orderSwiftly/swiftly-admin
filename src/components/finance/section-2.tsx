// src/components/finance/section-2.tsx
"use client";

import { useEffect, useState } from "react";
import { getTransferTransactions, getPaymentTransactions } from "@/lib/api/financials";
import { ArrowRight, ArrowDown, ChevronDown } from "lucide-react";

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

// ─── Money Flow Card ──────────────────────────────────────────────────────────

function MoneyFlowCard({
  title,
  lifetime,
  period,
  periodLabel,
  isRider = false,
}: {
  title: string;
  lifetime: number;
  period: number;
  periodLabel: string;
  isRider?: boolean;
}) {
  return (
    <div className="flex-1 space-y-1">
      <p className="text-sm text-gray-500">{title}</p>
      <div>
        <p className="text-2xl font-bold text-gray-900">
          ₦{lifetime.toLocaleString()}
        </p>
        <p className="text-xs text-gray-400">lifetime</p>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-100">
        <p className="text-lg font-semibold text-gray-700">
          ₦{period.toLocaleString()}
        </p>
        <p className="text-xs text-gray-400">
          {isRider && periodLabel === "today" ? "paid today" : 
           isRider && periodLabel === "selected period" ? "paid in selected period" :
           isRider ? `paid ${periodLabel}` : periodLabel}
        </p>
      </div>
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      
      const periodPayments = paymentsResult?.data?.payments?.reduce((sum: number, p: PaymentTransaction) => sum + p.amount, 0) || 0;
      const periodTransfers = transfersResult?.data?.transfers?.reduce((sum: number, t: TransferTransaction) => sum + t.amount, 0) || 0;
      
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
    if (mounted) {
      fetchMoneyFlow();
    }
  }, [dateRange, customFrom, customTo, mounted]);

  const dateRangeOptions: { label: string; value: DateRange }[] = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "thisWeek" },
    { label: "This Month", value: "thisMonth" },
  ];

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <section className="w-full flex flex-col gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="flex flex-col md:flex-row gap-6 md:gap-4">
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

  const periodLabel = getPeriodLabel();

  return (
    <section className="w-full flex flex-col gap-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Money Flow</h2>
          
          <FilterDropdown
            value={dateRange}
            options={dateRangeOptions}
            onChange={setDateRange}
          />
        </div>

        {/* Custom Date Picker */}
        {dateRange === "custom" && (
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">From</label>
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">To</label>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
        )}
        
        {/* Desktop Layout: Horizontal with arrows */}
        <div className="hidden md:flex items-center justify-between gap-4">
          <MoneyFlowCard
            title="Customers Paid"
            lifetime={moneyFlow.customersPaid.lifetime}
            period={moneyFlow.customersPaid.period}
            periodLabel={periodLabel}
          />
          
          <ArrowRight className="w-5 h-5 text-(--prof-clr) flex-shrink-0" />
          
          <MoneyFlowCard
            title="Vendor Allocation"
            lifetime={moneyFlow.vendorAllocation.lifetime}
            period={moneyFlow.vendorAllocation.period}
            periodLabel={periodLabel}
          />
          
          <ArrowRight className="w-5 h-5 text-(--prof-clr) flex-shrink-0" />
          
          <MoneyFlowCard
            title="Rider Allocation"
            lifetime={moneyFlow.riderAllocation.lifetime}
            period={moneyFlow.riderAllocation.period}
            periodLabel={periodLabel}
            isRider={true}
          />
          
          <ArrowRight className="w-5 h-5 text-(--prof-clr) flex-shrink-0" />
          
          <MoneyFlowCard
            title="Swiftly Gross"
            lifetime={moneyFlow.swiftlyGross.lifetime}
            period={moneyFlow.swiftlyGross.period}
            periodLabel={periodLabel}
          />
        </div>

        {/* Mobile Layout: Vertical with down arrows */}
        <div className="flex flex-col md:hidden gap-4">
          <MoneyFlowCard
            title="Customers Paid"
            lifetime={moneyFlow.customersPaid.lifetime}
            period={moneyFlow.customersPaid.period}
            periodLabel={periodLabel}
          />
          
          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-(--prof-clr)" />
          </div>
          
          <MoneyFlowCard
            title="Vendor Allocation"
            lifetime={moneyFlow.vendorAllocation.lifetime}
            period={moneyFlow.vendorAllocation.period}
            periodLabel={periodLabel}
          />
          
          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-(--prof-clr)" />
          </div>
          
          <MoneyFlowCard
            title="Rider Allocation"
            lifetime={moneyFlow.riderAllocation.lifetime}
            period={moneyFlow.riderAllocation.period}
            periodLabel={periodLabel}
            isRider={true}
          />
          
          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-(--prof-clr)" />
          </div>
          
          <MoneyFlowCard
            title="Swiftly Gross"
            lifetime={moneyFlow.swiftlyGross.lifetime}
            period={moneyFlow.swiftlyGross.period}
            periodLabel={periodLabel}
          />
        </div>
      </div>
    </section>
  );
}