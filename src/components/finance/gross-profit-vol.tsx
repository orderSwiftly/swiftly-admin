"use client";

import { useEffect, useState } from "react";
import { getDashboard } from "@/lib/api/financials";
import { Loader2, TrendingUp, TrendingDown, ChevronDown, CalendarDays } from "lucide-react";

interface GPVData {
    yesterday: number;
    day_before: number;
    change_pct: number | null;
    order_count: number;
}

type RangeOption = {
    label: string;
    from: string;
    to: string;
};

function getRangeOptions(): RangeOption[] {
    const today = new Date();
    const fmt = (d: Date) => d.toISOString().split("T")[0];

    const daysAgo = (n: number) => {
        const d = new Date(today);
        d.setDate(d.getDate() - n);
        return d;
    };

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    return [
        { label: "Last 7 days",   from: fmt(daysAgo(7)),           to: fmt(today) },
        { label: "Last 14 days",  from: fmt(daysAgo(14)),          to: fmt(today) },
        { label: "Last 30 days",  from: fmt(daysAgo(30)),          to: fmt(today) },
        { label: "This month",    from: fmt(startOfMonth),         to: fmt(today) },
        { label: "Last month",    from: fmt(startOfLastMonth),     to: fmt(endOfLastMonth) },
    ];
}

export default function GrossProfitVol() {
    const ranges = getRangeOptions();

    const [data, setData]               = useState<GPVData | null>(null);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState<string | null>(null);
    const [open, setOpen]               = useState(false);
    const [selected, setSelected]       = useState<RangeOption>(ranges[0]);

    const fetchData = async (range: RangeOption) => {
        setLoading(true);
        setError(null);
        try {
            const res = await getDashboard({ from: range.from, to: range.to });
            setData(res.data.gpv);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to load GPV data");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(selected);
    }, []);

    const handleSelect = (range: RangeOption) => {
        setSelected(range);
        setOpen(false);
        fetchData(range);
    };

    const isPositive = (data?.change_pct ?? 0) >= 0;

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 shadow-sm w-full">

            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                        <CalendarDays size={15} className="text-(--prof-clr)" />
                    </div>
                    <p className="text-sm font-semibold text-gray-500 tracking-wide">
                        Gross Platform Volume
                    </p>
                </div>

                {/* Date range dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setOpen((o) => !o)}
                        className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-100 transition-colors"
                    >
                        {selected.label}
                        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>

                    {open && (
                        <div className="absolute right-0 top-full mt-1.5 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                            {ranges.map((r) => (
                                <button
                                    key={r.label}
                                    onClick={() => handleSelect(r)}
                                    className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${
                                        selected.label === r.label
                                            ? "bg-violet-50 text-(--prof-clr) font-semibold"
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Body */}
            {loading ? (
                <div className="flex items-center gap-2 text-gray-300 py-4">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-sm">Loading...</span>
                </div>
            ) : error ? (
                <p className="text-sm text-red-500">{error}</p>
            ) : data ? (
                <>
                    {/* Primary figure */}
                    <div className="flex items-end gap-2">
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                            ₦{data.yesterday.toLocaleString()}
                        </h2>
                        <span className="text-xs text-gray-400 mb-1">
                            yesterday · {data.order_count} {data.order_count === 1 ? "order" : "orders"}
                        </span>
                    </div>

                    {/* Day before */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-400">
                            ₦{data.day_before.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-300">day before</span>
                    </div>

                    {/* Change badge */}
                    {data.change_pct === null ? (
                        <span className="text-xs text-gray-300">No comparison available</span>
                    ) : (
                        <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg w-fit ${
                                isPositive
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "bg-red-50 text-red-500"
                            }`}
                        >
                            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {isPositive ? "+" : ""}{data.change_pct}% vs yesterday
                        </span>
                    )}
                </>
            ) : null}
        </div>
    );
}