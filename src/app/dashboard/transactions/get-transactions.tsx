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
        setTransactions(data.data);
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
    <div className="w-full overflow-x-auto">
      <table className="min-w-[900px] w-full text-sm md:text-base bg-white/10 backdrop-blur-md border border-[var(--acc-clr)] rounded-md">
        <thead className="bg-white/10 text-left font-semibold text-[var(--acc-clr)]">
          <tr className="sec-ff">
            <th className="py-2 px-4 whitespace-nowrap">Reference</th>
            <th className="py-2 px-4 whitespace-nowrap">Email</th>
            <th className="py-2 px-4 whitespace-nowrap">Amount (₦)</th>
            <th className="py-2 px-4 whitespace-nowrap">Status</th>
            <th className="py-2 px-4 whitespace-nowrap">Response</th>
            <th className="py-2 px-4 whitespace-nowrap">Channel</th>
            <th className="py-2 px-4 whitespace-nowrap">Currency</th>
            <th className="py-2 px-4 whitespace-nowrap">IP Address</th>
            <th className="py-2 px-4 whitespace-nowrap">Paid At</th>
            <th className="py-2 px-4 whitespace-nowrap">Created At</th>
          </tr>
        </thead>
        <tbody className="text-sm text-[var(--txt-clr)] sec-ff">
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-t border-[var(--acc-clr)] hover:bg-white/5 transition-colors">
              <td className="py-2 px-4 break-all">{tx.reference}</td>
              <td className="py-2 px-4 break-all">{tx.customer?.email || 'N/A'}</td>
              <td className="py-2 px-4">
                {(tx.amount / 100).toLocaleString('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                })}
              </td>
              <td className="py-2 px-4 capitalize">{tx.status}</td>
              <td className="py-2 px-4">{tx.gateway_response}</td>
              <td className="py-2 px-4 capitalize">{tx.channel}</td>
              <td className="py-2 px-4">{tx.currency}</td>
              <td className="py-2 px-4 break-all">{tx.ip_address}</td>
              <td className="py-2 px-4">{tx.paid_at ? new Date(tx.paid_at).toLocaleString() : '—'}</td>
              <td className="py-2 px-4">{new Date(tx.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
