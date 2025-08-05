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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--acc-clr)]"></div>
        <p className="ml-3 text-[var(--txt-clr)]">Loading transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[var(--txt-clr)]">No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop Table */}
      <div className="hidden lg:block w-full overflow-x-auto">
        <div className="min-w-full">
          <table className="w-full text-sm bg-white/10 backdrop-blur-md border border-[var(--acc-clr)] rounded-lg overflow-hidden">
            <thead className="bg-white/20">
              <tr className="sec-ff text-[var(--acc-clr)] font-semibold">
                <th className="py-3 px-4 text-left whitespace-nowrap">Reference</th>
                <th className="py-3 px-4 text-left whitespace-nowrap">Email</th>
                <th className="py-3 px-4 text-left whitespace-nowrap">Amount</th>
                <th className="py-3 px-4 text-left whitespace-nowrap">Status</th>
                <th className="py-3 px-4 text-left whitespace-nowrap">Response</th>
                <th className="py-3 px-4 text-left whitespace-nowrap">Channel</th>
                <th className="py-3 px-4 text-left whitespace-nowrap">Currency</th>
                <th className="py-3 px-8 text-left whitespace-nowrap">IP Address</th>
                <th className="py-3 px-4 text-left whitespace-nowrap">Paid At</th>
                <th className="py-3 px-4 text-left whitespace-nowrap">Created At</th>
              </tr>
            </thead>
            <tbody className="text-[var(--txt-clr)] sec-ff">
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-t border-[var(--acc-clr)]/30 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs">{tx.reference}</span>
                  </td>
                  <td className="py-3 px-4 max-w-[150px] truncate" title={tx.customer?.email}>
                    {tx.customer?.email || 'N/A'}
                  </td>
                  <td className="py-3 px-4 font-semibold">
                    {(tx.amount / 100).toLocaleString('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tx.status === 'success' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : tx.status === 'failed'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-[120px] truncate" title={tx.gateway_response}>
                    {tx.gateway_response}
                  </td>
                  <td className="py-3 px-4 capitalize">{tx.channel}</td>
                  <td className="py-3 px-4">{tx.currency}</td>
                  <td className="py-3 px-4 font-mono text-xs max-w-[100px] truncate" title={tx.ip_address}>
                    {tx.ip_address}
                  </td>
                  <td className="py-3 px-4 text-xs">
                    {tx.paid_at ? new Date(tx.paid_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-3 px-4 text-xs">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="bg-white/10 backdrop-blur-md border border-[var(--acc-clr)] rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <p className="font-mono text-xs text-[var(--acc-clr)] mb-1">
                  {tx.reference}
                </p>
                <p className="text-sm font-semibold text-[var(--txt-clr)]">
                  {(tx.amount / 100).toLocaleString('en-NG', {
                    style: 'currency',
                    currency: 'NGN',
                  })}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                tx.status === 'success' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : tx.status === 'failed'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {tx.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-[var(--txt-clr)]">
              <div className="flex justify-between">
                <span className="text-white/70">Email:</span>
                <span className="truncate ml-2">{tx.customer?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Channel:</span>
                <span className="capitalize">{tx.channel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Response:</span>
                <span className="truncate ml-2">{tx.gateway_response}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Currency:</span>
                <span>{tx.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">IP:</span>
                <span className="font-mono text-xs">{tx.ip_address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Paid:</span>
                <span className="text-xs">
                  {tx.paid_at ? new Date(tx.paid_at).toLocaleDateString() : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Created:</span>
                <span className="text-xs">{new Date(tx.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}