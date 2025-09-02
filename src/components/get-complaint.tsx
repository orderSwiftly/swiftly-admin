"use client";

import { useEffect, useState } from "react";
import { getComplaints } from "@/lib/api/get-complaint";
import PulseLoader from "./pulse-loader";

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
        <PulseLoader />
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
          className={`flex flex-col p-4 rounded-xl border-l-4 shadow-md backdrop-blur-md transition duration-200 hover:scale-[1.01] ${
            notif.isRead
              ? "bg-black/40 border-transparent"
              : "bg-white/10 border-[var(--acc-clr)]"
          }`}
        >
          {/* Status at the top left */}
          <div className="flex justify-between items-start mb-3">
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                notif.status === "resolved"
                  ? "bg-green-500/20 text-green-400"
                  : notif.status === "pending"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {notif.status}
            </span>
            
            <span className="text-xs text-gray-400">
              {new Date(notif.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          {/* Complaint content */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[var(--acc-clr)] mb-2">
              {notif.subject}
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {notif.content}
            </p>
          </div>
          
          {/* Action button */}
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-[var(--acc-clr)] text-white text-sm rounded-md hover:opacity-90 transition-opacity">
              Reply
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}