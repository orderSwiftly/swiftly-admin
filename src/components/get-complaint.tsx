"use client";

import { useEffect, useState } from "react";
import { getComplaints } from "@/lib/api/get-complaint";
import PulseLoader from "./pulse-loader";
import ReplyComplaintForm from "./reply-complaint"; // your reply form component
import sendReply from "@/lib/api/reply-complaint"; // your frontend API function

interface Complaint {
  _id: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  isRead?: boolean;
}

export default function ComplaintsList() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null); // track which complaint is being replied to

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await getComplaints();
        setComplaints(data || []);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const handleReplyClick = (complaintId: string) => {
    setActiveReplyId(activeReplyId === complaintId ? null : complaintId); // toggle form
  };

  const handleSendReply = async (complaintId: string, replyContent: string) => {
    try {
      const data = await sendReply(complaintId, replyContent);
      console.log("Reply sent:", data);
      // optionally refresh complaints or append reply locally
      setActiveReplyId(null); // hide form after sending
    } catch (error) {
      console.error("Failed to send reply:", error);
    }
  };

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
      {complaints.map((complaint) => (
        <div
          key={complaint._id}
          className={`flex flex-col p-4 rounded-xl border-l-4 shadow-md backdrop-blur-md transition duration-200 hover:scale-[1.01] ${
            complaint.isRead
              ? "bg-black/40 border-transparent"
              : "bg-white/10 border-[var(--acc-clr)]"
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                complaint.status === "resolved"
                  ? "bg-green-500/20 text-green-400"
                  : complaint.status === "pending"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {complaint.status}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(complaint.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Content */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[var(--acc-clr)] mb-2">
              {complaint.subject}
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {complaint.message}
            </p>
          </div>

          {/* Reply Button */}
          <div className="flex justify-end mb-2">
            <button
              onClick={() => handleReplyClick(complaint._id)}
              className="px-4 py-2 bg-[var(--acc-clr)] text-[var(--bg-clr)] text-sm rounded-md hover:opacity-90 transition-opacity cursor-pointer"
            >
              Reply
            </button>
          </div>

          {/* Reply Form */}
          {activeReplyId === complaint._id && (
            <ReplyComplaintForm
              complaintId={complaint._id}
              onSend={handleSendReply}
            />
          )}
        </div>
      ))}
    </div>
  );
}
