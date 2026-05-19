"use client";

import { useEffect, useState } from "react";
import { getOrders, getOrderById } from "@/lib/api/financials";
import { Loader2, ChevronDown, ArrowLeft, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderPricing {
    subtotal: number;
    serviceFee: number;
    deliveryFee: number;
    total: number;
}

interface OrderPayment {
    charged_amount: number;
    flw_fee: number;
    vat: number;
    amount_settled: number;
    swiftly_earnings: number;
    flw_id: number;
}

interface Order {
    _id: string;
    store_name: string;
    createdAt: string;
    paymentStatus: "paid" | "cancelled" | "pending";
    payout_status: "unpaid" | "processing" | "paid" | "n/a";
    flutterwaveReference: string;
    paymentConfirmedAt: string | null;
    delivered_at: string | null;
    assigned_rider_id: string | null;
    pricing: OrderPricing;
    payment: OrderPayment;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    pages: number;
}

type PaymentStatusFilter = "all" | "paid" | "cancelled" | "pending";
type PayoutStatusFilter  = "all" | "unpaid" | "processing" | "paid";
type DateRangeFilter = "today" | "thisWeek" | "thisMonth" | "custom";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number | undefined | null) {
    if (n == null) return "—";
    return `₦${n.toLocaleString()}`;
}

function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-NG", {
        day: "2-digit", month: "short", year: "numeric",
    });
}

function fmtDateTime(iso: string) {
    return new Date(iso).toLocaleString("en-NG", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

function shortId(id: string) {
    return `#${id.slice(-6).toUpperCase()}`;
}

function getDateRangeParams(range: DateRangeFilter, customFrom: string, customTo: string): { from?: string; to?: string } {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    switch (range) {
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
}

// ─── Status badges ────────────────────────────────────────────────────────────

function PaymentBadge({ status }: Readonly<{ status: Order["paymentStatus"] }>) {
    const map: Record<Order["paymentStatus"], string> = {
        paid:      "bg-emerald-50 text-emerald-600",
        cancelled: "bg-red-50 text-red-500",
        pending:   "bg-amber-50 text-amber-600",
    };
    return (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${map[status]}`}>
            {status}
        </span>
    );
}

function PayoutBadge({ status }: { status: Order["payout_status"] }) {
    const map: Record<Order["payout_status"], string> = {
        paid:       "bg-emerald-50 text-emerald-600",
        unpaid:     "bg-rose-50 text-rose-500",
        processing: "bg-blue-50 text-blue-500",
        "n/a":      "bg-gray-100 text-gray-400",
    };
    return (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${map[status]}`}>
            {status}
        </span>
    );
}

// ─── Filter dropdown ──────────────────────────────────────────────────────────

function FilterDropdown<T extends string>({
    label, value, options, onChange,
}: {
    label: string;
    value: T;
    options: { label: string; value: T }[];
    onChange: (v: T) => void;
}) {
    const [open, setOpen] = useState(false);
    const current = options.find((o) => o.value === value)?.label ?? label;

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
                <div className="absolute left-0 top-full mt-1.5 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                    {options.map((o) => (
                        <button
                            key={o.value}
                            onClick={() => { onChange(o.value); setOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${
                                value === o.value
                                    ? "bg-violet-50 text-violet-600 font-semibold"
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

// ─── Date Range Filter Dropdown ──────────────────────────────────────────────

function DateRangeFilterDropdown({
    value, options, onChange,
}: {
    value: DateRangeFilter;
    options: { label: string; value: DateRangeFilter }[];
    onChange: (v: DateRangeFilter) => void;
}) {
    const [open, setOpen] = useState(false);
    const current = options.find((o) => o.value === value)?.label ?? "Date range";

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
            >
                <Calendar size={12} />
                {current}
                <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <div className="absolute left-0 top-full mt-1.5 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                    {options.map((o) => (
                        <button
                            key={o.value}
                            onClick={() => { onChange(o.value); setOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${
                                value === o.value
                                    ? "bg-violet-50 text-violet-600 font-semibold"
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

// ─── Detail view ──────────────────────────────────────────────────────────────

function OrderDetail({ id, onBack }: { id: string; onBack: () => void }) {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]   = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        getOrderById(id)
            .then((res) => setOrder(res.data.orders as Order))
            .catch((err) => setError(err instanceof Error ? err.message : "Failed to load order"))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="flex items-center gap-2 text-gray-400 py-12 justify-center">
            <Loader2 size={16} className="animate-spin" /> Loading order...
        </div>
    );
    if (error) return <p className="text-sm text-red-500 p-4">{error}</p>;
    if (!order) return null;

    const rows: { label: string; value: string }[] = [
        { label: "Order ID",            value: order._id },
        { label: "Store",               value: order.store_name },
        { label: "FLW Reference",       value: order.flutterwaveReference },
        { label: "FLW ID",              value: String(order.payment.flw_id) },
        { label: "Assigned Rider",      value: order.assigned_rider_id ?? "—" },
        { label: "Created",             value: fmtDateTime(order.createdAt) },
        { label: "Payment Confirmed",   value: order.paymentConfirmedAt ? fmtDateTime(order.paymentConfirmedAt) : "—" },
        { label: "Delivered",           value: order.delivered_at ? fmtDateTime(order.delivered_at) : "—" },
    ];

    const pricing: { label: string; value: string }[] = [
        { label: "Subtotal (vendor)",   value: fmt(order.pricing.subtotal) },
        { label: "Service fee",         value: fmt(order.pricing.serviceFee) },
        { label: "Delivery fee",        value: fmt(order.pricing.deliveryFee) },
        { label: "Order total",         value: fmt(order.pricing.total) },
    ];

    const payment: { label: string; value: string }[] = [
        { label: "Charged amount",      value: fmt(order.payment.charged_amount) },
        { label: "FLW fee",             value: fmt(order.payment.flw_fee) },
        { label: "VAT",                 value: `₦${order.payment.vat.toFixed(2)}` },
        { label: "Amount settled",      value: fmt(order.payment.amount_settled) },
        { label: "Swiftly earnings",    value: fmt(order.payment.swiftly_earnings) },
    ];

    return (
        <div className="flex flex-col gap-6">
            <button
                onClick={onBack}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors w-fit"
            >
                <ArrowLeft size={15} /> Back to orders
            </button>

            <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-900">{shortId(order._id)}</h2>
                <PaymentBadge status={order.paymentStatus} />
                <PayoutBadge status={order.payout_status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Order Info</p>
                    {rows.map((r) => (
                        <div key={r.label} className="flex items-start justify-between gap-4 text-sm">
                            <span className="text-gray-400 shrink-0">{r.label}</span>
                            <span className="text-gray-800 font-medium text-right break-all">{r.value}</span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-4">
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pricing</p>
                        {pricing.map((r) => (
                            <div key={r.label} className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">{r.label}</span>
                                <span className="text-gray-800 font-medium">{r.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Payment</p>
                        {payment.map((r) => (
                            <div key={r.label} className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">{r.label}</span>
                                <span className={`font-semibold ${r.label === "Swiftly earnings" ? "text-emerald-600" : "text-gray-800"}`}>
                                    {r.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function OrdersTable() {
    const [orders, setOrders]         = useState<Order[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [mounted, setMounted]       = useState(false);

    const [page, setPage]                       = useState(1);
    const [paymentStatus, setPaymentStatus]     = useState<PaymentStatusFilter>("all");
    const [payoutStatus, setPayoutStatus]       = useState<PayoutStatusFilter>("all");
    const [dateRange, setDateRange]             = useState<DateRangeFilter>("today");
    const [customFrom, setCustomFrom]           = useState<string>("");
    const [customTo, setCustomTo]               = useState<string>("");
    const [showCustomPicker, setShowCustomPicker] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const { from, to } = getDateRangeParams(dateRange, customFrom, customTo);
            
            const res = await getOrders({
                page,
                limit: 20,
                ...(from && { from }),
                ...(to && { to }),
                ...(paymentStatus !== "all" && { paymentStatus }),
                ...(payoutStatus !== "all" && { payoutStatus }),
            });
            setOrders(res.data.orders as Order[]);
            setPagination(res.data.pagination as Pagination);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (mounted) {
            fetchOrders();
        }
    }, [page, paymentStatus, payoutStatus, dateRange, customFrom, customTo, mounted]);

    useEffect(() => {
        setShowCustomPicker(dateRange === "custom");
    }, [dateRange]);

    if (!mounted) return null;

    if (selectedId) {
        return <OrderDetail id={selectedId} onBack={() => setSelectedId(null)} />;
    }

    const paymentOptions: { label: string; value: PaymentStatusFilter }[] = [
        { label: "All payments", value: "all" },
        { label: "Paid",         value: "paid" },
        { label: "Pending",      value: "pending" },
        { label: "Cancelled",    value: "cancelled" },
    ];

    const payoutOptions: { label: string; value: PayoutStatusFilter }[] = [
        { label: "All payouts",  value: "all" },
        { label: "Paid",         value: "paid" },
        { label: "Unpaid",       value: "unpaid" },
        { label: "Processing",   value: "processing" },
    ];

    const dateRangeOptions: { label: string; value: DateRangeFilter }[] = [
        { label: "Today", value: "today" },
        { label: "This Week", value: "thisWeek" },
        { label: "This Month", value: "thisMonth" },
        { label: "Custom Range", value: "custom" },
    ];

    return (
        <div className="flex flex-col gap-4">

            {/* Filters */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                    <DateRangeFilterDropdown
                        value={dateRange}
                        options={dateRangeOptions}
                        onChange={setDateRange}
                    />
                    <FilterDropdown
                        label="Payment status"
                        value={paymentStatus}
                        options={paymentOptions}
                        onChange={(v) => { setPaymentStatus(v); setPage(1); }}
                    />
                    <FilterDropdown
                        label="Payout status"
                        value={payoutStatus}
                        options={payoutOptions}
                        onChange={(v) => { setPayoutStatus(v); setPage(1); }}
                    />
                    {pagination && (
                        <span className="text-xs text-gray-400 ml-auto">
                            {pagination.total} order{pagination.total !== 1 ? "s" : ""}
                        </span>
                    )}
                </div>

                {/* Custom Date Picker */}
                {showCustomPicker && (
                    <div className="flex gap-4">
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
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center gap-2 text-gray-400 py-12 justify-center">
                        <Loader2 size={16} className="animate-spin" /> Loading orders...
                    </div>
                ) : error ? (
                    <p className="text-sm text-red-500 p-6">{error}</p>
                ) : orders.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-12">No orders found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
                                    <th className="text-left px-5 py-3 font-semibold">Order</th>
                                    <th className="text-left px-5 py-3 font-semibold">Date</th>
                                    <th className="text-left px-5 py-3 font-semibold">Store</th>
                                    <th className="text-right px-5 py-3 font-semibold">Charged</th>
                                    <th className="text-right px-5 py-3 font-semibold">Vendor cut</th>
                                    <th className="text-right px-5 py-3 font-semibold">Swiftly gross</th>
                                    <th className="text-center px-5 py-3 font-semibold">Payment</th>
                                    <th className="text-center px-5 py-3 font-semibold">Payout</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((o, i) => (
                                    <tr
                                        key={o._id}
                                        onClick={() => setSelectedId(o._id)}
                                        className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                                            i !== orders.length - 1 ? "border-b border-gray-50" : ""
                                        }`}
                                    >
                                        <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{shortId(o._id)}</td>
                                        <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{fmtDate(o.createdAt)}</td>
                                        <td className="px-5 py-3.5 text-gray-800 font-medium">{o.store_name}</td>
                                        <td className="px-5 py-3.5 text-right text-gray-800 font-semibold">{fmt(o.payment?.charged_amount)}</td>
                                        <td className="px-5 py-3.5 text-right text-gray-500">{fmt(o.pricing?.subtotal)}</td>
                                        <td className="px-5 py-3.5 text-right text-emerald-600 font-semibold">{fmt(o.payment?.swiftly_earnings)}</td>
                                        <td className="px-5 py-3.5 text-center"><PaymentBadge status={o.paymentStatus} /></td>
                                        <td className="px-5 py-3.5 text-center"><PayoutBadge status={o.payout_status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Page {pagination.page} of {pagination.pages}</span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={14} />
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                            disabled={page === pagination.pages}
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}