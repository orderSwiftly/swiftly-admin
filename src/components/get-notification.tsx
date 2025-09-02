'use client';

import { useEffect, useState } from 'react';
import PulseLoader from '@/components/pulse-loader';
import { getNotifications, markNotificationAsRead, type Notification } from '@/lib/api/get-notif';

const NotificationsList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
      alert(errorMessage);
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
      <div className="flex justify-center items-center py-10">
        <PulseLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
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
      <div className="p-6 text-center bg-white/10 backdrop-blur-md rounded-lg">
        <p className="text-[var(--txt-clr)] pry-ff">No notifications found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      {notifications.map((notif) => (
        <div
          key={notif._id}
          className={`flex flex-col p-3 md:p-4 rounded-lg border-l-4 shadow-md backdrop-blur-md transition duration-200 ${
            notif.isRead
              ? 'bg-[var(--light-bg)]/70 border-transparent'
              : 'bg-[var(--light-bg)]/80 border-[var(--acc-clr)]'
          } ${isMobile ? 'gap-3' : 'gap-4'}`}
        >
          {/* Top Section - Content */}
          <div className="flex items-start gap-3 w-full">
            <input 
              type="checkbox" 
              className="accent-[var(--acc-clr)] mt-1" 
              checked={notif.isRead}
              onChange={() => !notif.isRead && handleMarkAsRead(notif._id)}
            />

            <img
              src="/default-avatar.jpg"
              alt="User Avatar"
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base leading-snug text-[var(--txt-clr)] break-words">
                <span className="font-semibold text-[var(--acc-clr)]">You</span>{' '}
                {notif.message.replace(/Jonathon Smith/i, '')}
              </p>
              <p className="text-xs text-[var(--sec-clr)] mt-1 sec-ff">{getTimeAgo(notif.createdAt)}</p>
            </div>
          </div>

          {/* Bottom Section - Actions */}
          <div className="flex items-center justify-between sec-ff">
            <span
              className={`text-xs md:text-sm font-medium ${
                notif.isRead ? 'text-[var(--sec-clr)]' : 'text-[var(--acc-clr)]'
              }`}
            >
              {notif.isRead ? 'Read' : 'Unread'}
            </span>

            {!notif.isRead && (
              <button
                onClick={() => handleMarkAsRead(notif._id)}
                className="px-3 py-1.5 text-xs md:text-sm rounded font-medium bg-[#1E2C3B] hover:bg-[#243545] transition-colors"
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