"use client";

import { useEffect, useState } from "react";
import { getComplaints } from "@/lib/api/get-complaint";

interface Complaint {
  _id: string;
  subject: string;
  content: string;
  status: string;
  createdAt: string;
  isRead?: boolean;
}

export default function ComplaintsList() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await getComplaints();
        setComplaints(data || []); // ✅ correct
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-400 animate-pulse">Loading complaints...</p>
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No complaints found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {complaints.map((notif) => (
        <div
          key={notif._id}
          className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 py-4 rounded-xl border-l-4 shadow-md backdrop-blur-md transition duration-200 hover:scale-[1.01] ${
            notif.isRead
              ? "bg-black/40 border-transparent"
              : "bg-white/10 border-[var(--acc-clr)]"
          }`}
        >
          <div>
            <h3 className="text-lg font-semibold text-[var(--acc-clr)]">
              {notif.subject}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {notif.content}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(notif.createdAt).toLocaleString()}
            </p>
          </div>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              notif.status === "resolved"
                ? "bg-green-500/20 text-green-400"
                : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {notif.status}
          </span>
        </div>
      ))}
    </div>
  );
}
