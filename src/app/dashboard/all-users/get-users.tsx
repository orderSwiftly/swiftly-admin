'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import PulseLoader from "@/components/pulse-loader";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  fullname: string;
  email: string;
  phoneNumber?: string;
  photo?: string;
  isVerifiedStudent: boolean;
  paystackSubaccountId?: string;
  hasSubaccount?: boolean;
  role: string;
  createdAt: string;
}

export default function GetUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const fetchUsers = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You must be logged in to access this page");
      }

      const res = await axios.get(`${apiUrl}/api/v1/user/get-users`, {
        headers: { Authorization: `Bearer ${token}` },
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

  if (loading) return <div className="flex items-center justify-center min-h-screen"><PulseLoader /></div>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <main className="p-4 overflow-x-auto bg-[var(--light-bg)] min-h-screen">
      <h2 className="text-2xl font-bold mb-6 pry-ff text-[var(--txt-clr)]">Users List</h2>
      
      {isMobile ? (
        // Mobile view - card layout
        <div className="grid grid-cols-1 gap-4">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => router.push(`/dashboard/all-users/${user._id}`)}
              className="bg-white/10 backdrop-blur-md border border-[var(--acc-clr)] rounded-lg p-4 shadow hover:bg-[var(--bg-clr)] cursor-pointer transition duration-200"
            >
              <div className="flex items-center gap-3 mb-3">
                {user.photo ? (
                  <img
                    src={user.photo}
                    alt="User"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600">
                    N/A
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-[var(--txt-clr)] pry-ff">{user.fullname}</h3>
                  <p className="text-sm text-[var(--txt-clr)] sec-ff">{user.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-[var(--acc-clr)] pry-ff">Phone:</span>
                  <p className="text-[var(--txt-clr)] sec-ff">{user.phoneNumber || "N/A"}</p>
                </div>
                <div>
                  <span className="text-[var(--acc-clr)] pry-ff">Verified:</span>
                  <p className="text-[var(--txt-clr)] sec-ff">{user.isVerifiedStudent ? "Yes" : "No"}</p>
                </div>
                <div>
                  <span className="text-[var(--acc-clr)] pry-ff">Subaccount:</span>
                  <p className="text-[var(--txt-clr)] sec-ff">
                    {user.hasSubaccount || user.paystackSubaccountId ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <span className="text-[var(--acc-clr)] pry-ff">Role:</span>
                  <p className="text-[var(--txt-clr)] sec-ff capitalize">{user.role}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-[var(--acc-clr)] pry-ff">Joined:</span>
                  <p className="text-[var(--txt-clr)] sec-ff">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Desktop view - table layout
        <div className="overflow-x-auto rounded-lg border border-[var(--acc-clr)]">
          <table className="min-w-full bg-white/10 backdrop-blur-md">
            <thead>
              <tr className="bg-white/20 text-left text-sm font-semibold text-[var(--acc-clr)] pry-ff">
                <th className="py-3 px-4 border-b">#</th>
                <th className="py-3 px-4 border-b">Photo</th>
                <th className="py-3 px-4 border-b">Full Name</th>
                <th className="py-3 px-4 border-b">Email</th>
                <th className="py-3 px-4 border-b">Phone</th>
                <th className="py-3 px-4 border-b">Verified</th>
                <th className="py-3 px-4 border-b">Subaccount</th>
                <th className="py-3 px-4 border-b">Role</th>
                <th className="py-3 px-4 border-b">Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  onClick={() => router.push(`/dashboard/all-users/${user._id}`)}
                  className="border-t hover:bg-[var(--bg-clr)] cursor-pointer transition duration-200"
                >
                  <td className="py-3 px-4 text-[var(--acc-clr)] pry-ff">{index + 1}</td>
                  <td className="py-3 px-4">
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
                  <td className="py-3 px-4 text-[var(--txt-clr)] sec-ff">{user.fullname}</td>
                  <td className="py-3 px-4 text-[var(--txt-clr)] sec-ff">{user.email}</td>
                  <td className="py-3 px-4 text-[var(--txt-clr)] sec-ff">{user.phoneNumber || "N/A"}</td>
                  <td className="py-3 px-4 text-[var(--txt-clr)] sec-ff">
                    {user.isVerifiedStudent ? "Yes" : "No"}
                  </td>
                  <td className="py-3 px-4 text-[var(--txt-clr)] sec-ff">
                    {user.hasSubaccount || user.paystackSubaccountId ? "Yes" : "No"}
                  </td>
                  <td className="py-3 px-4 capitalize text-[var(--txt-clr)] sec-ff">{user.role}</td>
                  <td className="py-3 px-4 text-[var(--txt-clr)] sec-ff">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {users.length === 0 && !loading && (
        <div className="text-center py-10 text-[var(--txt-clr)]">
          No users found.
        </div>
      )}
    </main>
  );
}