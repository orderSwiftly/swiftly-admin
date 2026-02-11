"use client";

import React from "react";
import { SuccessIllustration } from "./success-illustration";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: string;
}

export function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8">
        <div className="flex flex-col items-center text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
          {message && <p className="text-gray-600 mb-4">{message}</p>}

          <SuccessIllustration className="my-6" />

          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-[#669917] text-white rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
