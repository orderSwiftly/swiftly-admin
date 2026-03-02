"use client";

import React from "react";
import type { AuditLog } from "@/types/audit";

interface FraudulentActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: AuditLog | null;
  onSuspend: (log: AuditLog) => void;
  onDelete: (log: AuditLog) => void;
}

export function FraudulentActionModal({
  isOpen,
  onClose,
  log,
  onSuspend,
  onDelete,
}: FraudulentActionModalProps) {
  if (!isOpen || !log) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-6">
          Fraudulent Action
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              User Type
            </label>
            <input
              type="text"
              value={log.userType || "Customer"}
              readOnly
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 bg-white outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Name
              </label>
              <input
                type="text"
                value={log.name || "John Snow"}
                readOnly
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 bg-white outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={log.email}
                readOnly
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 bg-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Phone number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 py-2.5 border border-r-0 border-gray-300 rounded-l-lg text-gray-600 text-sm bg-white">
                  NIG <span className="ml-1 text-gray-400">∨</span>
                </span>
                <input
                  type="text"
                  value={log.phone || "+234 123456789"}
                  readOnly
                  className="flex-1 px-3 py-2.5 border border-gray-300 rounded-r-lg text-gray-800 bg-white outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                University
              </label>
              <input
                type="text"
                value={log.university || "Babcock"}
                readOnly
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-800 bg-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Action
            </label>
            <input
              type="text"
              value={
                log.actionDetail ||
                "3 suspicious login attempts detected from IP: 192.168.1.45"
              }
              readOnly
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 bg-white outline-none"
            />
          </div>
        </div>

        <div className="space-y-3 mt-6">
          <button
            onClick={() => onSuspend(log)}
            className="w-full px-6 py-3 bg-[#997615] text-white rounded-lg font-medium hover:bg-[#7a6a2c] transition-colors cursor-pointer"
          >
            Suspend User
          </button>
          <button
            onClick={() => onDelete(log)}
            className="w-full px-6 py-3 bg-[#993127] text-white rounded-lg font-medium hover:bg-red-900 transition-colors cursor-pointer"
          >
            Delete User
          </button>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
