'use client';

import { useEffect, useState } from 'react';

type Transaction = {
  id: number;
  reference: string;
  amount: number;
  status: string;
  gateway_response: string;
  paid_at: string;
  created_at: string;
  channel: string;
  currency: string;
  ip_address: string;
  customer: {
    email: string;
  };
};

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
        try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('You must be logged in to access this page');
        }
        const api_url = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${api_url}/api/v1/paystack/transactions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setTransactions(data.data); // Assuming backend returns { data: [...] }
      } catch (err) {
        console.error('Failed to fetch transactions', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <p>Loading transactions...</p>;

  return (
    <div className="overflow-x-hidden w-full">
      <table className="min-w-full bg-white/10 backdrop-blur-md border border-[var(--acc-clr)] rounded-md">
        <thead className="bg-white/10 backdrop-blur-md text-left text-sm font-semibold">
          <tr className="sec-ff text-[var(--acc-clr)]">
            <th className="py-2 px-4">Reference</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Amount (₦)</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Response</th>
            <th className="py-2 px-4">Channel</th>
            <th className="py-2 px-4">Currency</th>
            <th className="py-2 px-4">IP Address</th>
            <th className="py-2 px-4">Paid At</th>
            <th className="py-2 px-4">Created At</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-t border-[var(--acc-clr)] hover:bg-white/5 transition-colors text-[var(--txt-clr)] sec-ff">
              <td className="py-2 px-4">{tx.reference}</td>
              <td className="py-2 px-4">{tx.customer?.email || 'N/A'}</td>
              <td className="py-2 px-4">
                {(tx.amount / 100).toLocaleString('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                })}
              </td>
              <td className="py-2 px-4">{tx.status}</td>
              <td className="py-2 px-4">{tx.gateway_response}</td>
              <td className="py-2 px-4">{tx.channel}</td>
              <td className="py-2 px-4">{tx.currency}</td>
              <td className="py-2 px-4">{tx.ip_address}</td>
              <td className="py-2 px-4">{tx.paid_at ? new Date(tx.paid_at).toLocaleString() : '—'}</td>
              <td className="py-2 px-4">{new Date(tx.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}