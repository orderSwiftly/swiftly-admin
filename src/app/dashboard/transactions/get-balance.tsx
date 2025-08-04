'use client';

import { useState, useEffect } from "react";
import PulseLoader from "@/components/pulse-loader";

export default function GetBalance() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBalance = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to access this page');
      setLoading(false);
      return;
    }

    const api_url = process.env.NEXT_PUBLIC_API_URL;
    try {
      const res = await fetch(`${api_url}/api/v1/paystack/balance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await res.json();
      if (res.ok && data?.data?.[0]) {
        setBalance(data.data[0].balance);
      } else {
        throw new Error(data.message || 'Failed to fetch balance');
      }
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        setError(error.message || 'An error occurred while fetching balance');
      } else {
        setError('An error occurred while fetching balance');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <div className="w-full max-w-md text-[var(--txt-clr)] sec-ff bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md">
      {loading ? (
        <PulseLoader />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-2 text-[var(--acc-clr)] pry-ff">Balance Overview</h2>
          <p className="mb-1">Your current balance is:</p>
          <h1 className="text-lg font-bold pry-ff">
            {(balance / 100).toLocaleString('en-NG', {
              style: 'currency',
              currency: 'NGN',
            })}
          </h1>
        </>
      )}
    </div>
  );
}