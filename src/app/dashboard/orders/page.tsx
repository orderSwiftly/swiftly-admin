"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { OrderDetailModal } from "@/components/order-management/order-detail-modal";
import { ConfirmationModal } from "@/components/user-management/confirmation-modal";
import { SuccessModal } from "@/components/user-management/success-modal";
import PulseLoader from "@/components/pulse-loader";
import { getAllOrders, type ApiOrder, type OrderStatus } from "@/lib/api/order";

// ─── Constants ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "All Status", value: "all" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Preparing", value: "preparing" },
  { label: "Shipped", value: "shipped" },
  { label: "Collected", value: "collected" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Refunded", value: "refunded" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "delivered": return "bg-green-100 text-green-700";
    case "confirmed": return "bg-blue-100 text-blue-700";
    case "preparing": return "bg-purple-100 text-purple-700";
    case "shipped": return "bg-orange-100 text-orange-700";
    case "collected": return "bg-yellow-100 text-yellow-700";
    case "cancelled": return "bg-red-100 text-red-700";
    case "refunded": return "bg-teal-100 text-teal-700";
    default: return "bg-gray-100 text-gray-700";
  }
}

function formatAddress(addr: ApiOrder["shippingAddress"]): string {
  if (addr.building) return `${addr.building}, Room ${addr.room}`;
  if (addr.addressLine1) return `${addr.addressLine1}, ${addr.city}`;
  return "—";
}

function shortId(id: string) {
  return `#${id.slice(-6).toUpperCase()}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReassignConfirmOpen, setIsReassignConfirmOpen] = useState(false);
  const [isRefundConfirmOpen, setIsRefundConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: "", message: "" });

  // ─── Fetch ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    getAllOrders()
      .then(setOrders)
      .catch((err) =>
        setFetchError(err instanceof Error ? err.message : "An error occurred")
      )
      .finally(() => setLoading(false));
  }, []);

  // ─── Filter + paginate ─────────────────────────────────────────────────────

  const filtered = orders.filter((order) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      order._id.toLowerCase().includes(q) ||
      order.paystackReference.toLowerCase().includes(q) ||
      (order.seller_name?.toLowerCase().includes(q) ?? false) ||
      order.items.some((i) => i.title.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === "all" || order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (v: string) => { setSearchQuery(v); setCurrentPage(1); };
  const handleFilter = (v: string) => { setStatusFilter(v); setCurrentPage(1); };

  // ─── Actions ───────────────────────────────────────────────────────────────

  const handleViewOrder = (order: ApiOrder) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleRefund = () => {
    setIsDetailModalOpen(false);
    setIsRefundConfirmOpen(true);
  };

  const confirmRefund = () => {
    setIsRefundConfirmOpen(false);
    setSuccessMessage({ title: "Refund Issued Successfully", message: "" });
    setIsSuccessModalOpen(true);
  };

  const handleReassignRider = () => {
    setIsDetailModalOpen(false);
    setIsReassignConfirmOpen(true);
  };

  const confirmReassignRider = () => {
    setIsReassignConfirmOpen(false);
    setSuccessMessage({ title: "Rider Reassigned Successfully", message: "" });
    setIsSuccessModalOpen(true);
  };

  const handleDeleteOrder = () => {
    setIsDetailModalOpen(false);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    setIsDeleteConfirmOpen(false);
    setSuccessMessage({ title: "Order Cancelled Successfully", message: "" });
    setIsSuccessModalOpen(true);
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PulseLoader />
      </div>
    );

  if (fetchError)
    return <p className="p-4 text-red-500">Error: {fetchError}</p>;

  return (
    <main className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 sec-ff">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">

          {/* ── Toolbar ─────────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by order ID, seller or item…"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="relative min-w-[140px]">
              <select
                value={statusFilter}
                onChange={(e) => handleFilter(e.target.value)}
                className="w-full appearance-none px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
            </div>
          </div>

          {/* ── Desktop table ────────────────────────────────────────────── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {["Order ID", "Status", "Seller", "Items", "Total", "Date", "Action"].map((h) => (
                    <th
                      key={h}
                      className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm text-gray-400">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((order) => (
                    <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm font-mono text-gray-900">
                        {shortId(order._id)}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-3 py-1 rounded-[6px] text-xs font-medium capitalize ${getStatusBadgeClass(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {order.seller_name ?? "—"}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        ₦{order.pricing.total.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="px-4 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Mobile cards ─────────────────────────────────────────────── */}
          <div className="md:hidden space-y-3">
            {paginated.length === 0 ? (
              <p className="py-12 text-center text-sm text-gray-400">No orders found.</p>
            ) : (
              paginated.map((order) => (
                <div key={order._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm font-mono">
                        {shortId(order._id)}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {order.seller_name ?? "—"}
                      </p>
                    </div>
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadgeClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    {formatAddress(order.shippingAddress)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      ₦{order.pricing.total.toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ── Pagination ───────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 mt-4 sm:mt-6">
            <span className="text-xs sm:text-sm text-gray-600">
              Page {currentPage} of {totalPages} · {filtered.length} order{filtered.length !== 1 ? "s" : ""}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        order={selectedOrder}
        onRefund={handleRefund}
        onReassignRider={handleReassignRider}
        onDeleteOrder={handleDeleteOrder}
      />

      <ConfirmationModal
        isOpen={isReassignConfirmOpen}
        onClose={() => setIsReassignConfirmOpen(false)}
        onConfirm={confirmReassignRider}
        title="Reassign Rider"
        message="Are you sure you want to reassign the rider for this order?"
        confirmText="Confirm Reassign Rider"
        confirmButtonClass="bg-green-600 hover:bg-green-700"
      />

      <ConfirmationModal
        isOpen={isRefundConfirmOpen}
        onClose={() => setIsRefundConfirmOpen(false)}
        onConfirm={confirmRefund}
        title="Confirm Refund"
        message="Are you sure you want to issue a refund for this order?"
        confirmText="Confirm Refund"
        confirmButtonClass="bg-green-600 hover:bg-green-700"
      />

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        confirmText="Confirm Cancel Order"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => { setIsSuccessModalOpen(false); setSelectedOrder(null); }}
        title={successMessage.title}
        message={successMessage.message}
      />
    </main>
  );
}