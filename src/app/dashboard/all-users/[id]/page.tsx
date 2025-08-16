'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CheckCircle, XCircle, User as UserIcon, Mail, Shield } from "lucide-react";
import PulseLoader from "@/components/pulse-loader";

interface User {
  _id: string;
  fullname: string;
  email: string;
  role: string;
  hasSubaccount: boolean;
  isVerifiedStudent: boolean;
}

export default function UserById() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    if (!id) return;

    const fetchUserById = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("You must be logged in");

        const api_url = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${api_url}/api/v1/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data.data.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserById();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><PulseLoader /></div>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;
  if (!user) return <p className="text-center text-gray-400">No user found</p>;

  return (
    <main className="p-6 !bg-[var(--light-bg)] min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md border border-[var(--acc-clr)] rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-[var(--acc-clr)] pry-ff text-center">
          User Details
        </h1>
        <div className="space-y-4 text-[var(--txt-clr)]">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-[var(--acc-clr)]" />
            <span className="font-semibold">Full Name:</span>
            <span className="sec-ff">{user.fullname}</span>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[var(--acc-clr)]" />
            <span className="font-semibold">Email:</span>
            <span className="sec-ff">{user.email}</span>
          </div>

          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[var(--acc-clr)]" />
            <span className="font-semibold">Role:</span>
            <span className="capitalize sec-ff">{user.role}</span>
          </div>

          <div className="flex items-center gap-2">
            {user.hasSubaccount ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <span className="font-semibold">Subaccount:</span>
            <span>{user.hasSubaccount ? "Yes" : "No"}</span>
          </div>

          <div className="flex items-center gap-2">
            {user.isVerifiedStudent ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <span className="font-semibold">Verified Student:</span>
            <span>{user.isVerifiedStudent ? "Yes" : "No"}</span>
          </div>
        </div>
      </div>
    </main>
  );
}