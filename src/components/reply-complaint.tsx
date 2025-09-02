"use client";

import { useState } from "react";

interface ReplyFormProps {
  complaintId: string;
  onSend: (complaintId: string, message: string) => void;
}

export default function ReplyComplaintForm({ complaintId, onSend }: ReplyFormProps) {
  const [reply, setReply] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    onSend(complaintId, reply);
    setReply("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Type your reply here..."
        className="w-full p-2 border border-[var(--acc-clr)] focus:outline-none focus:ring-2 focus:ring-[var(--acc-clr)] rounded-md text-[var(--txt-clr)]"
      />
      <button
        type="submit"
        className="self-end px-4 py-2 bg-[var(--acc-clr)] text-[var(--bg-clr)] rounded-md hover:opacity-90 transition-opacity cursor-pointer"
      >
        Send Reply
      </button>
    </form>
  );
}
