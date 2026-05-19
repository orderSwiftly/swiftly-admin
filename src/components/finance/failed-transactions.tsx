"use client";

import { useEffect, useState } from "react";
import { getDashboard } from "@/lib/api/financials";
import { Loader2, AlertCircle, TrendingDown, TrendingUp } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FailedTransactionsData {
    yesterday: {
        count: number;
        total: number;
    };
    day_before: {
        count: number;
        total: number;
    };
    change_count: number | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
    return `₦${n.toLocaleString()}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FailedTransactions() {
    const [data, setData]       = useState<FailedTransactionsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getDashboard();
                setData(res.data.failed_transactions);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Failed to load failed transactions");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const isWorse = (data?.change_count ?? 0) > 0;

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 shadow-sm w-full">

            {/* Header */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <AlertCircle size={15} className="text-red-400" />
                </div>
                <p className="text-sm font-semibold text-gray-500 tracking-wide">
                    Failed Transactions
                </p>
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
                    {/* Primary — yesterday count */}
                    <div className="flex flex-col gap-1">
                        <div className="flex items-end gap-2">
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                                {data.yesterday.count}
                            </h2>
                            <span className="text-xs text-gray-400 mb-1">
                                cancelled yesterday
                            </span>
                        </div>
                        <span className="text-sm font-semibold text-red-400">
                            {fmt(data.yesterday.total)}{" "}
                            <span className="text-xs font-normal text-gray-400">affected</span>
                        </span>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-50" />

                    {/* Day before row */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                            {data.day_before.count}{" "}
                            {data.day_before.count === 1 ? "failure" : "failures"} day before
                        </span>
                        <span className="text-sm font-medium text-gray-400">
                            {fmt(data.day_before.total)}
                        </span>
                    </div>

                    {/* Change badge */}
                    {data.change_count === null ? (
                        <span className="text-xs text-gray-300">No comparison available</span>
                    ) : (
                        <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg w-fit ${
                                isWorse
                                    ? "bg-red-50 text-red-500"
                                    : "bg-emerald-50 text-emerald-600"
                            }`}
                        >
                            {isWorse ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {isWorse ? "+" : ""}{data.change_count}% vs yesterday
                        </span>
                    )}
                </>
            ) : null}
        </div>
    );
}