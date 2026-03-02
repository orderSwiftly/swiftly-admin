"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import type { AuditLog } from "@/types/audit";
import { FraudulentActionModal } from "@/components/configuration/fraudulent-action-modal";
import { ConfirmationModal } from "@/components/user-management/confirmation-modal";
import { SuccessModal } from "@/components/user-management/success-modal";

const actions = [
  "Vendor Suspended",
  "Order Refunded",
  "Comm rate change",
  "Rider Suspended",
  "Order Refunded",
  "Vendor Suspended",
  "Order Refunded",
  "Order Refunded",
  "3 suspicious login attempts",
  "Vendor Suspended",
  "Order Refunded",
  "Vendor Suspended",
  "Order Refunded",
  "Order Refunded",
  "Vendor Suspended",
  "Order Refunded",
  "Vendor Suspended",
  "Vendor Suspended",
];

const roles = [
  "Admin - High",
  "Admin - Low",
  "Admin - Low",
  "Admin - Low",
  "Admin - High",
  "Admin - High",
  "Admin - Low",
  "Admin - Low",
  "User",
  "Admin - Low",
  "Admin - Low",
  "Admin - Low",
  "Admin - High",
  "Customer",
  "Admin - Low",
  "Admin - Low",
  "Admin - Low",
  "Admin - High",
];

const mockAuditLogs: AuditLog[] = actions.map((action, i) => ({
  id: String(i + 1),
  timestamp: "20/06/26 (14:32)",
  action,
  email: "example@gmail.com",
  role: roles[i] || "Admin - Low",
  isFlagged: action === "3 suspicious login attempts",
  flagText:
    action === "3 suspicious login attempts"
      ? "3 suspicious login attempts"
      : undefined,
  userType: "Customer",
  name: "John Snow",
  phone: "+234 123456789",
  university: "Babcock",
  actionDetail:
    action === "3 suspicious login attempts"
      ? "3 suspicious login attempts detected from IP: 192.168.1.45"
      : action,
}));

const ITEMS_PER_PAGE = 15;

const allActionTypes = [
  "All Actions",
  "Vendor Suspended",
  "Order Refunded",
  "Comm rate change",
  "Rider Suspended",
  "3 suspicious login attempts",
];

export default function ConfigurationPage() {
  const [logs] = useState<AuditLog[]>(mockAuditLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("All Actions");
  const [currentPage, setCurrentPage] = useState(1);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [confirmAction, setConfirmAction] = useState<"suspend" | "delete">(
    "suspend",
  );
  const [successMessage, setSuccessMessage] = useState("");

  const query = searchQuery.toLowerCase().trim();
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      !query ||
      log.action.toLowerCase().includes(query) ||
      log.email.toLowerCase().includes(query) ||
      log.role.toLowerCase().includes(query);
    const matchesAction =
      actionFilter === "All Actions" || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLogs.length / ITEMS_PER_PAGE),
  );
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleView = (log: AuditLog) => {
    setSelectedLog(log);
    setShowViewModal(true);
  };

  const handleSuspendClick = (log: AuditLog) => {
    setSelectedLog(log);
    setConfirmAction("suspend");
    setShowConfirmModal(true);
  };

  const handleDeleteClick = (log: AuditLog) => {
    setSelectedLog(log);
    setConfirmAction("delete");
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    setShowViewModal(false);
    if (confirmAction === "suspend") {
      setSuccessMessage("User Disabled Successfully");
    } else {
      setSuccessMessage("User Deleted Successfully");
    }
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setSuccessMessage("");
    setSelectedLog(null);
  };

  return (
    <div className="p-4 md:p-6 min-h-screen overflow-hidden">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-lg w-full">
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

          <div className="relative">
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer bg-white"
            >
              {allActionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="pb-3 pl-2">Timestamp</th>
                <th className="pb-3">Action</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Role</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedLogs.map((log) => (
                <tr
                  key={log.id}
                  className="text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <td
                    className={`py-3 pl-2 font-medium whitespace-nowrap ${
                      log.isFlagged ? "text-blue-600" : ""
                    }`}
                  >
                    {log.timestamp}
                  </td>
                  <td className="py-3">
                    {log.isFlagged ? (
                      <span className="text-red-500 text-xs">
                        {log.flagText}
                      </span>
                    ) : (
                      <span className="text-gray-700">{log.action}</span>
                    )}
                  </td>
                  <td className="py-3 text-gray-500">{log.email}</td>
                  <td className="py-3 text-gray-500">{log.role}</td>
                  <td className="py-3 text-right pr-2">
                    <button
                      onClick={() => handleView(log)}
                      className="px-4 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedLogs.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-gray-400 text-sm"
                  >
                    No audit logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-3">
          {paginatedLogs.map((log) => (
            <div
              key={log.id}
              className="border border-gray-100 rounded-xl p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-medium ${
                    log.isFlagged ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {log.timestamp}
                </span>
                <button
                  onClick={() => handleView(log)}
                  className="px-4 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  View
                </button>
              </div>
              <div className="text-sm">
                {log.isFlagged ? (
                  <span className="text-red-500 text-xs">{log.flagText}</span>
                ) : (
                  <span className="font-medium text-gray-900">
                    {log.action}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {log.email} · {log.role}
              </div>
            </div>
          ))}
          {paginatedLogs.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-sm">
              No audit logs found.
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

      <FraudulentActionModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedLog(null);
        }}
        log={selectedLog}
        onSuspend={handleSuspendClick}
        onDelete={handleDeleteClick}
      />

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirm}
        title={confirmAction === "suspend" ? "Disable User" : "Delete User"}
        message={
          confirmAction === "suspend"
            ? "Are you sure you want to Disable this? This action can be undone later."
            : "Are you sure you want to delete this? This action cannot be undone."
        }
        confirmText={confirmAction === "suspend" ? "Disable" : "Delete"}
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title={successMessage}
      />
    </div>
  );
}
