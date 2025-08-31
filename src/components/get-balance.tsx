'use client';

import { useState, useEffect } from "react";
import PulseLoader from "@/components/pulse-loader";
import { getBalance } from "@/lib/api/get-balance";

export default function GetBalance() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      const balanceData = await getBalance();
      setBalance(balanceData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching balance';
      setError(errorMessage);
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleRetry = () => {
    fetchBalance();
  };

  if (loading) {
    return (
      <div className="w-full max-w-md text-[var(--txt-clr)] sec-ff bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md">
        <div className="flex justify-center">
          <PulseLoader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md text-[var(--txt-clr)] sec-ff bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-[var(--acc-clr)] text-white rounded-md hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md text-[var(--txt-clr)] sec-ff bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-[var(--acc-clr)] pry-ff">Balance Overview</h2>
      <p className="mb-1">Your current balance is:</p>
      <h1 className="text-lg font-bold pry-ff">
        {(balance / 100).toLocaleString('en-NG', {
          style: 'currency',
          currency: 'NGN',
        })}
      </h1>
    </div>
  );
}