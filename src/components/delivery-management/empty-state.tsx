"use client";

import React from "react";
import Image from "next/image";

interface EmptyStateProps {
  message?: string;
}

export function RiderEmptyState({
  message = "Nothing to see here",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <Image src="/ghost.png" alt="Empty State" width={140} height={140} />
      <p className="text-gray-400 text-lg">{message}</p>
    </div>
  );
}
