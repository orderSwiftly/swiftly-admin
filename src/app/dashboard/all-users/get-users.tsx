'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import PulseLoader from "@/components/pulse-loader";

interface User {
  _id: string;
  fullname: string;
  email: string;
  phoneNumber?: string;
  photo?: string;
  isVerifiedStudent: boolean;
  paystackSubaccountId?: string;   // ✅ string, optional
  hasSubaccount?: boolean; // ✅ boolean, comes from backend
  role: string;
  createdAt: string;
}

export default function GetUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You must be logged in to access this page");
      }

      const res = await axios.get(`${apiUrl}/api/v1/user/get-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data.data.users);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div className="flex items-center justify-center"><PulseLoader /></div>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <main className="p-4 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 pry-ff text-[var(--txt-clr)]">Users List</h2>
      <table className="min-w-full bg-white/10 backdrop-blur-md border border-[var(--acc-clr)] rounded-lg shadow">
        <thead>
          <tr className="bg-white/20 text-left text-sm font-semibold text-[var(--acc-clr)] pry-ff">
            <th className="py-2 px-4 border-b">#</th>
            <th className="py-2 px-4 border-b">Photo</th>
            <th className="py-2 px-4 border-b">Full Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Phone</th>
            <th className="py-2 px-4 border-b">Verified</th>
            <th className="py-2 px-4 border-b">Subaccount</th> {/* ✅ New column */}
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id} className="border-t hover:bg-[var(--bg-clr)] cursor-pointer transition duration-200">
              <td className="py-2 px-4 text-[var(--acc-clr)] pry-ff">{index + 1}</td>
              <td className="py-2 px-4">
                {user.photo ? (
                  <img
                    src={user.photo}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600">
                    N/A
                  </div>
                )}
              </td>
              <td className="py-2 px-4 text-[var(--txt-clr)] sec-ff">{user.fullname}</td>
              <td className="py-2 px-4 text-[var(--txt-clr)] sec-ff">{user.email}</td>
              <td className="py-2 px-4 text-[var(--txt-clr)] sec-ff">{user.phoneNumber || "N/A"}</td>
              <td className="py-2 px-4 text-[var(--txt-clr)] sec-ff">
                {user.isVerifiedStudent ? "Yes" : "No"}
              </td>
              <td className="py-2 px-4 text-[var(--txt-clr)] sec-ff">
                {user.hasSubaccount || user.paystackSubaccountId ? "Yes" : "No"}
              </td>
              <td className="py-2 px-4 capitalize text-[var(--txt-clr)] sec-ff">{user.role}</td>
              <td className="py-2 px-4 text-[var(--txt-clr)] sec-ff">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}