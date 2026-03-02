"use client";

import React, { useState, useEffect } from "react";
import type { University } from "@/types/university";

interface EditUniversityModalProps {
  isOpen: boolean;
  onClose: () => void;
  university: University | null;
  onEnableDisable: (university: University) => void;
  onDelete: (university: University) => void;
  onSave: (university: University) => void;
}

export function EditUniversityModal({
  isOpen,
  onClose,
  university,
  onEnableDisable,
  onDelete,
  onSave,
}: EditUniversityModalProps) {
  const [deliveryZone, setDeliveryZone] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [email, setEmail] = useState("");
  const [hours, setHours] = useState("");
  const [fees, setFees] = useState("");

  useEffect(() => {
    if (university) {
      setDeliveryZone(university.deliveryZone || university.location || "");
      setUniversityName(university.name);
      setEmail(university.email);
      setHours(university.hours?.toString() || "10");
      setFees(university.fees?.toString() || "300");
    }
  }, [university]);

  if (!isOpen || !university) return null;

  const isEnabled = university.status === "Enabled";

  const handleSave = () => {
    onSave({
      ...university,
      deliveryZone,
      name: universityName,
      email,
      hours: Number(hours),
      fees: Number(fees),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Edit university
        </h2>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Delivery zone
            </label>
            <input
              type="text"
              value={deliveryZone}
              onChange={(e) => setDeliveryZone(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                University
              </label>
              <input
                type="text"
                value={universityName}
                onChange={(e) => setUniversityName(e.target.value)}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Hours
              </label>
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Fees
              </label>
              <input
                type="number"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mt-6">
          <button
            onClick={() => {
              handleSave();
              onEnableDisable(university);
            }}
            className={`w-full px-6 py-3 text-white rounded-lg font-medium transition-colors cursor-pointer ${
              isEnabled
                ? "bg-red-400 hover:bg-red-500"
                : "bg-[#669917] hover:bg-green-700"
            }`}
          >
            {isEnabled ? "Disable University" : "Enable University"}
          </button>

          <button
            onClick={() => onDelete(university)}
            className="w-full px-6 py-3 bg-red-700 text-white rounded-lg font-medium hover:bg-red-800 transition-colors cursor-pointer"
          >
            Delete University
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
