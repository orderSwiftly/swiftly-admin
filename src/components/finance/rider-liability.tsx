"use client";

import { useEffect, useState } from "react";
import { getDashboard } from "@/lib/api/financials";
import { Loader2, Bike } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RiderLiabilityData {
    unpaid: {
        count: number;
        total: number;
    };
    processing: {
        count: number;
        total: number;
    };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
    return `₦${n.toLocaleString()}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RiderLiability() {
    const [data, setData]     = useState<RiderLiabilityData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]   = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getDashboard();
                setData(res.data.rider_liability);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Failed to load rider liability");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 shadow-sm w-full">

            {/* Header */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                    <Bike size={15} className="text-rose-500" />
                </div>
                <p className="text-sm font-semibold text-gray-500 tracking-wide">
                    Rider Liability
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
                    {/* Unpaid — primary */}
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                            {fmt(data.unpaid.total)}
                        </h2>
                        <span className="text-xs text-gray-400">
                            unpaid · {data.unpaid.count}{" "}
                            {data.unpaid.count === 1 ? "order" : "orders"} pending tonight&apos;s payout
                        </span>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-50" />

                    {/* Processing */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Currently processing</span>
                        <span
                            className={`text-sm font-semibold ${
                                data.processing.total > 0 ? "text-blue-500" : "text-gray-300"
                            }`}
                        >
                            {fmt(data.processing.total)}
                        </span>
                    </div>

                    {/* Processing count pill — only show if active */}
                    {data.processing.count > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg w-fit bg-blue-50 text-blue-500">
                            {data.processing.count} payout{data.processing.count !== 1 ? "s" : ""} in batch
                        </span>
                    )}
                </>
            ) : null}
        </div>
    );
}