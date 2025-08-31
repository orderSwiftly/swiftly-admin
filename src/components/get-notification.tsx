'use client';

import { useEffect, useState } from 'react';
import PulseLoader from '@/components/pulse-loader';
import { getNotifications, markNotificationAsRead, type Notification } from '@/lib/api/get-notif';

const NotificationsList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch notifications';
      setError(errorMessage);
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      // Update local state optimistically
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark notification as read';
      console.error('Error marking notification as read:', error);
      // You could show a toast notification here
      alert(errorMessage); // Replace with proper toast/notification system
    }
  };

  const getTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInMs = now.getTime() - past.getTime();

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-5">
        <PulseLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5">
        <p className="text-red-500 pry-ff mb-4">{error}</p>
        <button
          onClick={fetchNotifications}
          className="px-4 py-2 bg-[var(--acc-clr)] text-white rounded-md hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <p className="text-center text-[var(--txt-clr)] pry-ff">No notifications found.</p>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notif) => (
        <div
          key={notif._id}
          className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 py-4 rounded-xl border-l-4 shadow-md backdrop-blur-md transition duration-200 hover:scale-[1.01] ${
            notif.isRead
              ? 'bg-[var(--light-bg)]/70 border-transparent'
              : 'bg-[var(--light-bg)]/80 border-[var(--acc-clr)]'
          }`}
        >
          {/* Left Side */}
          <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto">
            <input type="checkbox" className="accent-[var(--acc-clr)] mt-1 sm:mt-0" />

            <img
              src="/default-avatar.jpg"
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />

            <div className="flex flex-col sec-ff">
              <p className="text-sm leading-snug text-[var(--txt-clr)]">
                <span className="font-semibold text-[var(--acc-clr)]">You</span>{' '}
                {notif.message.replace(/Jonathon Smith/i, '')}
              </p>
              <p className="text-xs text-[var(--sec-clr)] sec-ff">{getTimeAgo(notif.createdAt)}</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4 justify-end sm:justify-start sec-ff">
            <span
              className={`text-sm font-medium ${
                notif.isRead ? 'text-[var(--sec-clr)]' : 'text-[var(--acc-clr)]'
              }`}
            >
              {notif.isRead ? 'Read' : 'Unread'}
            </span>

            {!notif.isRead && (
              <button
                onClick={() => handleMarkAsRead(notif._id)}
                className="px-4 py-1.5 text-sm rounded-md font-medium whitespace-nowrap bg-[#1E2C3B] hover:bg-[#243545] transition-colors"
                style={{
                  color: 'var(--txt-clr)',
                }}
              >
                Mark as Read
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationsList;