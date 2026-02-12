"use client";

import React from "react";
import { Order } from "@/types/order";

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-[#669917]";
      case "Cancelled":
        return "text-[#993127]";
      case "Refunded":
        return "text-[#2BBD96]";
      case "In Transit":
        return "text-[#997615]";
      default:
        return "text-gray-600";
    }
  };

  const showRefundButton =
    order.status === "Completed" || order.status === "Cancelled";
  const showInTransitActions = order.status === "In Transit";
  const isRefunded = order.status === "Refunded";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <h2
            className={`text-3xl font-semibold text-center mb-8 ${getStatusColor(order.status)}`}
          >
            #{order.orderId} ({order.status})
            {order.status === "Cancelled" && showRefundButton && " - Refunding"}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={order.name}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Email
              </label>
              <input
                type="email"
                value={order.email}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number
              </label>
              <input
                type="text"
                value={order.number}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                University
              </label>
              <input
                type="text"
                value={order.university}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor
              </label>
              <input
                type="text"
                value={order.vendor}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor Email
              </label>
              <input
                type="email"
                value={order.vendorEmail}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor Number
              </label>
              <input
                type="text"
                value={order.vendorNumber}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                value={order.state}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rider
              </label>
              <input
                type="text"
                value={order.rider}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rider Number
              </label>
              <input
                type="text"
                value={order.riderNumber}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Items
              </label>
              <input
                type="text"
                value={order.items}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Amount
              </label>
              <input
                type="text"
                value={order.totalAmount.toLocaleString()}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            {isRefunded && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Refund Issuer
                  </label>
                  <input
                    type="text"
                    value={order.refundIssuer || ""}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issuer level
                  </label>
                  <input
                    type="text"
                    value={order.issuerLevel || ""}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
              </>
            )}
          </div>

          <div className="space-y-3 mt-6">
            {showRefundButton && (
              <button
                onClick={onRefund}
                className="w-full px-6 py-3 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors cursor-pointer"
              >
                {order.status === "Cancelled"
                  ? "Confirm Refund"
                  : "Refund Order"}
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
                  Delete Order
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
