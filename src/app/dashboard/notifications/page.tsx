'use client';

import dynamic from 'next/dynamic';
import PulseLoader from '@/components/pulse-loader';

// Lazy-load the GetNotification component
const GetNotification = dynamic(() => import('./get-notification'), {
  loading: () => <PulseLoader />,
  ssr: false,
});

export default function NotificationPage() {
  return (
    <main className="flex min-h-screen items-center justify-start bg-[var(--light-bg)] flex-col gap-5 p-4">
      <h1 className="text-4xl font-bold mb-4 pry-ff text-[var(--acc-clr)]">Notifications</h1>
      <GetNotification />
    </main>
  );
}
