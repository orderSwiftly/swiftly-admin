"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import type { FinancialTransaction, FinancialMetrics } from "@/types/financial";
import { EditCommissionRateModal } from "@/components/financial/edit-commission-modal";
import { SuccessModal } from "@/components/user-management/success-modal";

const initialMetrics: FinancialMetrics = {
  totalRevenue: 20380485,
  commission: 120426,
  vendorPayouts: 10426987,
  commissionRate: 50,
};

const mockTransactions: FinancialTransaction[] = [
  {
    id: "1",
    name: "Vendor 1",
    amount: 20426,
    school: "UNILAG",
    location: "Lagos",
    status: "Processed",
  },
  {
    id: "2",
    name: "Vendor 2",
    amount: 20426,
    school: "Babcock",
    location: "Ogun",
    status: "Processed",
  },
  {
    id: "3",
    name: "Vendor 1",
    amount: 20426,
    school: "Crescent",
    location: "Lagos",
    status: "Processed",
  },
  {
    id: "4",
    name: "Vendor 1",
    amount: 20426,
    school: "ABUAD",
    location: "Ogun",
    status: "Processed",
  },
  {
    id: "5",
    name: "Vendor 1",
    amount: 20426,
    school: "UNILORIN",
    location: "Ogun",
    status: "Processed",
  },
  {
    id: "6",
    name: "Vendor 1",
    amount: 20426,
    school: "CALEB",
    location: "Ogun",
    status: "Processed",
  },
  {
    id: "7",
    name: "Vendor 1",
    amount: 20426,
    school: "Nile",
    location: "Lagos",
    status: "Processed",
  },
  {
    id: "8",
    name: "Vendor 1",
    amount: 20426,
    school: "ABUZAR",
    location: "Lagos",
    status: "Processed",
  },
  {
    id: "9",
    name: "Vendor 2",
    amount: 20426,
    school: "Bells",
    location: "Ogun",
    status: "Processed",
  },
  {
    id: "10",
    name: "Vendor 2",
    amount: 20426,
    school: "Polytechnic",
    location: "Ogun",
    status: "Processed",
  },
  {
    id: "11",
    name: "Vendor 1",
    amount: 20426,
    school: "CALEB",
    location: "Ogun",
    status: "Processed",
  },
  {
    id: "12",
    name: "Vendor 1",
    amount: 20426,
    school: "Nile",
    location: "Lagos",
    status: "Processed",
  },
  {
    id: "13",
    name: "Vendor 1",
    amount: 20426,
    school: "ABUZAR",
    location: "Lagos",
    status: "Processed",
  },
  {
    id: "14",
    name: "Vendor 2",
    amount: 20426,
    school: "Bells",
    location: "Ogun",
    status: "Processed",
  },
  {
    id: "15",
    name: "Vendor 2",
    amount: 20426,
    school: "Polytechnic",
    location: "Ogun",
    status: "Processed",
  },
  {
    id: "16",
    name: "Vendor 2",
    amount: 20426,
    school: "Polytechnic",
    location: "Ogun",
    status: "Processed",
  },
];

const ITEMS_PER_PAGE = 15;

function formatCurrency(value: number): string {
  return "₦" + value.toLocaleString();
}

export default function FinancialPage() {
  const [metrics, setMetrics] = useState<FinancialMetrics>(initialMetrics);
  const [transactions] = useState<FinancialTransaction[]>(mockTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showEditCommission, setShowEditCommission] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const query = searchQuery.toLowerCase().trim();
  const filteredTransactions = transactions.filter((t) => {
    if (!query) return true;
    return (
      t.name.toLowerCase().includes(query) ||
      t.school.toLowerCase().includes(query) ||
      t.location.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE),
  );
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleEditCommission = (data: {
    user: string;
    name: string;
    email: string;
    rate: number;
  }) => {
    setMetrics({ ...metrics, commissionRate: data.rate });
    setShowEditCommission(false);
    setSuccessMessage("Commission rate updated Successfully");
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setSuccessMessage("");
  };

  return (
    <div className="p-4 md:p-6 min-h-screen space-y-6 overflow-hidden">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-5">
          <p className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Total Revenue
          </p>
          <p className="text-xl md:text-2xl font-bold text-gray-900">
            {formatCurrency(metrics.totalRevenue)}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-5">
          <p className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Commission
          </p>
          <p className="text-xl md:text-2xl font-bold text-gray-900">
            {formatCurrency(metrics.commission)}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-5">
          <p className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Vendor Payouts
          </p>
          <p className="text-xl md:text-2xl font-bold text-gray-900">
            {formatCurrency(metrics.vendorPayouts)}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-5">
          <div className="flex items-start justify-between">
            <p className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Commission Rate
            </p>
            <button
              onClick={() => setShowEditCommission(true)}
              className="px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Edit
            </button>
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-900">
            ₦{metrics.commissionRate}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
        <div className="mb-6">
          <div className="relative max-w-lg">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="pb-3 pl-2">Name</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">School</th>
                <th className="pb-3">Location</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 pl-2 font-medium">{transaction.name}</td>
                  <td className="py-3 text-gray-500">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="py-3 text-gray-500">{transaction.school}</td>
                  <td className="py-3 text-gray-500">{transaction.location}</td>
                  <td className="py-3 text-right pr-2">
                    <span className="inline-flex items-center justify-center px-4 py-2 rounded-[6px] text-xs font-semibold bg-[#D8FF9C] text-[#669917]">
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
              {paginatedTransactions.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-gray-400 text-sm"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-3">
          {paginatedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="border border-gray-100 rounded-xl p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 text-sm">
                  {transaction.name}
                </span>
                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold bg-[#D4EDDA] text-[#28A745]">
                  {transaction.status}
                </span>
              </div>
              <div className="text-sm font-medium text-gray-700">
                {formatCurrency(transaction.amount)}
              </div>
              <div className="text-xs text-gray-500">
                {transaction.school} · {transaction.location}
              </div>
            </div>
          ))}
          {paginatedTransactions.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-sm">
              No transactions found.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <EditCommissionRateModal
        isOpen={showEditCommission}
        onClose={() => setShowEditCommission(false)}
        onConfirm={handleEditCommission}
        currentRate={metrics.commissionRate}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title={successMessage}
      />
    </div>
  );
}
