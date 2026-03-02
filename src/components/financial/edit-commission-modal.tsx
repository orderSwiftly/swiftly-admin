"use client";

import React, { useState } from "react";

interface EditCommissionRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    user: string;
    name: string;
    email: string;
    rate: number;
  }) => void;
  currentRate: number;
}

export function EditCommissionRateModal({
  isOpen,
  onClose,
  onConfirm,
  currentRate,
}: EditCommissionRateModalProps) {
  const [user, setUser] = useState("Admin - High");
  const [name, setName] = useState("John Snow");
  const [email, setEmail] = useState("you@company.com");
  const [rate, setRate] = useState(String(currentRate));

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!rate) return;
    onConfirm({ user, name, email, rate: Number(rate) });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Edit Commission Rate
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              User
            </label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Input New Commission Rate
            </label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="20"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-3 mt-6">
          <button
            onClick={handleConfirm}
            className="w-full px-6 py-3 bg-[#669917] text-white rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer"
          >
            Confirm
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
