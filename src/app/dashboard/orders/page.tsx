"use client";

import React, { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Order, OrderStatus } from "@/types/order";
import { OrderDetailModal } from "@/components/order-management/order-detail-modal";
import { ConfirmationModal } from "@/components/user-management/confirmation-modal";
import { SuccessModal } from "@/components/user-management/success-modal";

const mockOrders: Order[] = [
  {
    id: "1",
    orderId: "ORD-4829",
    status: "Cancelled",
    email: "example@gmail.com",
    university: "Babcock",
    name: "John Snow",
    number: "08123456789",
    vendor: "Flakky Rice",
    vendorEmail: "Flakky@gmail.com",
    vendorNumber: "Flakky Rice",
    state: "Lagos",
    rider: "Micheal stone",
    riderNumber: "08123456789",
    items: 5,
    totalAmount: 20000,
  },
  {
    id: "2",
    orderId: "ORD-4829",
    status: "Completed",
    email: "example@gmail.com",
    university: "Asuu",
    name: "John Snow",
    number: "08123456789",
    vendor: "Flakky Rice",
    vendorEmail: "Flakky@gmail.com",
    vendorNumber: "Flakky Rice",
    state: "Lagos",
    rider: "Micheal stone",
    riderNumber: "08123456789",
    items: 5,
    totalAmount: 20000,
  },
  {
    id: "3",
    orderId: "ORD-4829",
    status: "Refunded",
    email: "example@gmail.com",
    university: "Unilag",
    name: "John Snow",
    number: "08123456789",
    vendor: "Flakky Rice",
    vendorEmail: "Flakky@gmail.com",
    vendorNumber: "Flakky Rice",
    state: "Lagos",
    rider: "Micheal stone",
    riderNumber: "08123456789",
    items: 5,
    totalAmount: 20000,
    refundIssuer: "olamide kairo",
    issuerLevel: "Admin - High",
  },
  {
    id: "4",
    orderId: "ORD-4829",
    status: "Cancelled",
    email: "example@gmail.com",
    university: "Unilorin",
    name: "John Snow",
    number: "08123456789",
    vendor: "Flakky Rice",
    vendorEmail: "Flakky@gmail.com",
    vendorNumber: "Flakky Rice",
    state: "Lagos",
    rider: "Micheal stone",
    riderNumber: "08123456789",
    items: 5,
    totalAmount: 20000,
  },
  {
    id: "5",
    orderId: "ORD-4829",
    status: "Completed",
    email: "example@gmail.com",
    university: "Bells",
    name: "John Snow",
    number: "08123456789",
    vendor: "Flakky Rice",
    vendorEmail: "Flakky@gmail.com",
    vendorNumber: "Flakky Rice",
    state: "Lagos",
    rider: "Micheal stone",
    riderNumber: "08123456789",
    items: 5,
    totalAmount: 20000,
  },
  {
    id: "6",
    orderId: "ORD-4829",
    status: "Refunded",
    email: "example@gmail.com",
    university: "Unilorin",
    name: "John Snow",
    number: "08123456789",
    vendor: "Flakky Rice",
    vendorEmail: "Flakky@gmail.com",
    vendorNumber: "Flakky Rice",
    state: "Lagos",
    rider: "Micheal stone",
    riderNumber: "08123456789",
    items: 5,
    totalAmount: 20000,
    refundIssuer: "olamide kairo",
    issuerLevel: "Admin - High",
  },
  {
    id: "7",
    orderId: "ORD-4829",
    status: "Completed",
    email: "example@gmail.com",
    university: "Babcock",
    name: "John Snow",
    number: "08123456789",
    vendor: "Flakky Rice",
    vendorEmail: "Flakky@gmail.com",
    vendorNumber: "Flakky Rice",
    state: "Lagos",
    rider: "Micheal stone",
    riderNumber: "08123456789",
    items: 5,
    totalAmount: 20000,
  },
  {
    id: "8",
    orderId: "ORD-4829",
    status: "Cancelled",
    email: "example@gmail.com",
    university: "Unilorin",
    name: "John Snow",
    number: "08123456789",
    vendor: "Flakky Rice",
    vendorEmail: "Flakky@gmail.com",
    vendorNumber: "Flakky Rice",
    state: "Lagos",
    rider: "Micheal stone",
    riderNumber: "08123456789",
    items: 5,
    totalAmount: 20000,
  },
  {
    id: "9",
    orderId: "ORD-4829",
    status: "In Transit",
    email: "example@gmail.com",
    university: "Babcock",
    name: "John Snow",
    number: "08123456789",
    vendor: "Flakky Rice",
    vendorEmail: "Flakky@gmail.com",
    vendorNumber: "Flakky Rice",
    state: "Lagos",
    rider: "Micheal stone",
    riderNumber: "08123456789",
    items: 5,
    totalAmount: 20000,
  },
  {
    id: "10",
    orderId: "ORD-4829",
    status: "Refunded",
    email: "example@gmail.com",
    university: "Unilorin",
    name: "John Snow",
    number: "08123456789",
    vendor: "Flakky Rice",
    vendorEmail: "Flakky@gmail.com",
    vendorNumber: "Flakky Rice",
    state: "Lagos",
    rider: "Micheal stone",
    riderNumber: "08123456789",
    items: 5,
    totalAmount: 20000,
    refundIssuer: "olamide kairo",
    issuerLevel: "Admin - High",
  },
];

export default function OrdersPage() {
  const [orders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus>("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReassignConfirmOpen, setIsReassignConfirmOpen] = useState(false);
  const [isRefundConfirmOpen, setIsRefundConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState({
    title: "",
    message: "",
  });

  const totalPages = 10;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Refunded":
        return "bg-teal-100 text-teal-700";
      case "In Transit":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.university.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleRefund = () => {
    setIsDetailModalOpen(false);
    setIsRefundConfirmOpen(true);
  };

  const confirmRefund = () => {
    setIsRefundConfirmOpen(false);
    setSuccessMessage({
      title: "Refund Issued Successfully",
      message: "",
    });
    setIsSuccessModalOpen(true);
  };

  const handleReassignRider = () => {
    setIsDetailModalOpen(false);
    setIsReassignConfirmOpen(true);
  };

  const confirmReassignRider = () => {
    setIsReassignConfirmOpen(false);
    setSuccessMessage({
      title: "Rider Reassigned Successfully",
      message: "",
    });
    setIsSuccessModalOpen(true);
  };

  const handleDeleteOrder = () => {
    setIsDetailModalOpen(false);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    setIsDeleteConfirmOpen(false);
    setSuccessMessage({
      title: "Order Cancelled Successfully",
      message: "",
    });
    setIsSuccessModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="relative min-w-[120px] sm:min-w-[140px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus)}
                className="w-full appearance-none px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer"
              >
                <option>All Status</option>
                <option>Completed</option>
                <option>Cancelled</option>
                <option>Refunded</option>
                <option>In Transit</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
            </div>
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ORDER ID
                  </th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    EMAIL
                  </th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    UNIVERSITY
                  </th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4 text-sm text-gray-900">
                      #{order.orderId}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex px-4 py-2 rounded-[6px] text-xs font-medium ${getStatusBadgeClass(
                          order.status,
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {order.email}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {order.university}
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
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">
                      #{order.orderId}
                    </h3>
                    <p className="text-xs text-gray-600">{order.email}</p>
                  </div>
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                      order.status,
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    {order.university}
                  </span>
                  <button
                    onClick={() => handleViewOrder(order)}
                    className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 mt-4 sm:mt-6">
            <span className="text-xs sm:text-sm text-gray-600">
              Page {currentPage} of {totalPages}
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
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

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
        title="Rider Reassigned Successfully"
        message=""
        confirmText="Confirm Reassign Rider"
        confirmButtonClass="bg-green-600 hover:bg-green-700"
      />

      <ConfirmationModal
        isOpen={isRefundConfirmOpen}
        onClose={() => setIsRefundConfirmOpen(false)}
        onConfirm={confirmRefund}
        title={
          selectedOrder?.status === "Completed"
            ? "Confirm Refund"
            : "Confirm Refund"
        }
        message=""
        confirmText="Confirm Refund"
        confirmButtonClass="bg-green-600 hover:bg-green-700"
      />

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Delete Order"
        message=""
        confirmText="Confirm Delete Order"
        confirmButtonClass="bg-green-600 hover:bg-green-700"
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          setSelectedOrder(null);
        }}
        title={successMessage.title}
        message={successMessage.message}
      />
    </main>
  );
}
