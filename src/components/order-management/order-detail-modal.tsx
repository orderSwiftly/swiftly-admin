"use client";

import React from "react";
import { type ApiOrder } from "@/lib/api/order";

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: ApiOrder | null;
  onRefund: () => void;
  onReassignRider: () => void;
  onDeleteOrder: () => void;
}

export function OrderDetailModal({
  isOpen,
  onClose,
  order,
  onRefund,
  onReassignRider,
  onDeleteOrder,
}: OrderDetailModalProps) {
  if (!isOpen || !order) return null;

  const status = order.orderStatus;

  const getStatusColor = (s: string) => {
    switch (s) {
      case "delivered": return "text-green-600";
      case "cancelled": return "text-red-600";
      case "refunded": return "text-teal-600";
      case "shipped":
      case "collected": return "text-orange-500";
      case "confirmed": return "text-blue-600";
      default: return "text-gray-600";
    }
  };

  const showRefundButton = status === "delivered" || status === "cancelled";
  const showInTransitActions = status === "shipped" || status === "collected";
  const isRefunded = status === "refunded";

  // Resolve shipping address from either address format
  const addressLine = order.shippingAddress.building
    ? `${order.shippingAddress.building}, Room ${order.shippingAddress.room}`
    : `${order.shippingAddress.addressLine1 ?? "—"}, ${order.shippingAddress.city ?? ""}`;

  const itemSummary = order.items
    .map((i) => `${i.title} x${i.quantity}`)
    .join(", ");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sec-ff">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">

          {/* Header */}
          <h2 className={`text-2xl font-semibold text-center mb-8 capitalize ${getStatusColor(status)}`}>
            #{order._id.slice(-6).toUpperCase()} ({status})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Field label="Order Reference" value={order.paystackReference} />
            <Field label="Payment Status" value={order.paymentStatus} capitalize />
            <Field label="Escrow Status" value={order.escrowStatus} capitalize />
            <Field label="Delivery Code" value={String(order.deliveryCode)} />

            {/* Seller */}
            <Field label="Seller" value={order.seller_name ?? "—"} />

            {/* Shipping address */}
            <Field label="Delivery Address" value={addressLine} />

            {/* Items */}
            <div className="sm:col-span-2">
              <Field label="Items" value={itemSummary} />
            </div>

            {/* Pricing */}
            <Field label="Subtotal" value={`₦${order.pricing.subtotal.toLocaleString()}`} />
            <Field label="Service Fee" value={`₦${order.pricing.serviceFee.toLocaleString()}`} />
            <Field label="Delivery Fee" value={`₦${order.pricing.deliveryFee.toLocaleString()}`} />
            <Field label="Total" value={`₦${order.pricing.total.toLocaleString()}`} />

            {/* Timestamps */}
            <Field
              label="Order Date"
              value={new Date(order.createdAt).toLocaleDateString("en-GB", {
                day: "numeric", month: "long", year: "numeric",
              })}
            />
            {order.delivered_at && (
              <Field
                label="Delivered At"
                value={new Date(order.delivered_at).toLocaleDateString("en-GB", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              />
            )}

            {/* Rider */}
            {order.assigned_rider_id && (
              <Field label="Rider ID" value={order.assigned_rider_id} />
            )}

            {/* Refund info */}
            {isRefunded && (
              <>
                <Field label="Refund Issuer" value="—" />
                <Field label="Issuer Level" value="—" />
              </>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3 mt-6">
            {showRefundButton && (
              <button
                onClick={onRefund}
                className="w-full px-6 py-3 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors cursor-pointer"
              >
                {status === "cancelled" ? "Confirm Refund" : "Refund Order"}
              </button>
            )}

            {showInTransitActions && (
              <>
                <button
                  onClick={onReassignRider}
                  className="w-full px-6 py-3 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors cursor-pointer"
                >
                  Reassign Rider
                </button>
                <button
                  onClick={onDeleteOrder}
                  className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Cancel Order
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Read-only field ──────────────────────────────────────────────────────────

function Field({
  label,
  value,
  capitalize,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        readOnly
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 ${capitalize ? "capitalize" : ""}`}
      />
    </div>
  );
}