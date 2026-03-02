"use client";

import React from "react";
import type { PendingRider } from "@/types/rider";

interface PendingRiderCardProps {
  rider: PendingRider;
  onApprove: (rider: PendingRider) => void;
  onReject: (rider: PendingRider) => void;
}

export function PendingRiderCard({
  rider,
  onApprove,
  onReject,
}: PendingRiderCardProps) {
  return (
    <div className="min-w-[260px] max-w-[280px] border border-gray-200 rounded-xl p-5 flex-shrink-0 bg-white">
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-800">Name</span>
          <span className="text-gray-600">{rider.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-800">University</span>
          <span className="text-gray-600">{rider.university}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-800">Email</span>
          <span className="text-gray-600 text-xs">{rider.email}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-800">Number</span>
          <span className="text-gray-600">{rider.phone}</span>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => onApprove(rider)}
          className="flex-1 py-2 bg-[#669917] text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer"
        >
          Approve
        </button>
        <button
          onClick={() => onReject(rider)}
          className="flex-1 py-2 bg-[#993127] text-white rounded-lg text-sm font-medium hover:bg-red-900 transition-colors cursor-pointer"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
