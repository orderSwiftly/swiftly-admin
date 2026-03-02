"use client";

import React from "react";
import type { PendingVendor } from "@/types/vendor";

interface PendingVendorCardProps {
  vendor: PendingVendor;
  onApprove: (vendor: PendingVendor) => void;
  onReject: (vendor: PendingVendor) => void;
}

export function PendingVendorCard({
  vendor,
  onApprove,
  onReject,
}: PendingVendorCardProps) {
  return (
    <div className="min-w-[260px] max-w-[280px] border border-gray-200 rounded-xl p-5 flex-shrink-0 bg-white">
      <h3 className="text-[#669917] font-semibold text-base mb-3">
        {vendor.name}
      </h3>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-800">University</span>
          <span className="text-gray-600">{vendor.university}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-800">Type</span>
          <span className="text-gray-600">{vendor.type}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-800">Email</span>
          <span className="text-gray-600 text-xs">{vendor.email}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-800">Number</span>
          <span className="text-gray-600">{vendor.phone}</span>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => onApprove(vendor)}
          className="flex-1 py-2 bg-[#669917] text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer"
        >
          Approve
        </button>
        <button
          onClick={() => onReject(vendor)}
          className="flex-1 py-2 bg-[#993127] text-white rounded-lg text-sm font-medium hover:bg-red-900 transition-colors cursor-pointer"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
