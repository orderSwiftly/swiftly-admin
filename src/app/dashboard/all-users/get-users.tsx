'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PulseLoader from "@/components/pulse-loader";
import { getUsers, type User } from "@/lib/api/users"; // adjust path as needed

export default function GetUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((err) => setError(err instanceof Error ? err.message : "An error occurred"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PulseLoader />
      </div>
    );
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <main className="p-4 overflow-x-auto bg-[var(--light-bg)] min-h-screen">
      <h2 className="text-2xl font-bold mb-6 pry-ff text-[var(--txt-clr)]">
        Users List
      </h2>

      {isMobile ? (
        <div className="grid grid-cols-1 gap-4">
          {users.map((user) => (
            <MobileUserCard
              key={user._id}
              user={user}
              onClick={() => router.push(`/dashboard/all-users/${user._id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[var(--acc-clr)]">
          <table className="min-w-full bg-white/10 backdrop-blur-md">
            <thead>
              <tr className="bg-white/20 text-left text-sm font-semibold text-[var(--acc-clr)] pry-ff">
                <th className="py-3 px-4 border-b">#</th>
                <th className="py-3 px-4 border-b">Photo</th>
                <th className="py-3 px-4 border-b">Name</th>
                <th className="py-3 px-4 border-b">Email</th>
                <th className="py-3 px-4 border-b">Phone</th>
                <th className="py-3 px-4 border-b">Verified</th>
                <th className="py-3 px-4 border-b">Subaccount</th>
                <th className="py-3 px-4 border-b">Role</th>
                <th className="py-3 px-4 border-b">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <DesktopUserRow
                  key={user._id}
                  user={user}
                  index={index}
                  onClick={() => router.push(`/dashboard/all-users/${user._id}`)}
                />
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

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Sellers have a logo + businessName; everyone else has photo + fullname. */
function resolveDisplayName(user: User) {
  return user.businessName ?? user.fullname ?? "Unknown";
}

function resolveAvatar(user: User) {
  return user.logo ?? user.photo ?? null;
}

function UserAvatar({ src, size }: { src: string | null; size: number }) {
  const cls = `rounded-full object-cover`;
  if (src) {
    return (
      <Image
        src={src}
        alt="User"
        width={size}
        height={size}
        className={cls}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600"
      style={{ width: size, height: size }}
    >
      N/A
    </div>
  );
}

// ─── Mobile card ─────────────────────────────────────────────────────────────

function MobileUserCard({ user, onClick }: { user: User; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white/10 backdrop-blur-md border border-[var(--acc-clr)] rounded-lg p-4 shadow hover:bg-[var(--bg-clr)] cursor-pointer transition duration-200"
    >
      <div className="flex items-center gap-3 mb-3">
        <UserAvatar src={resolveAvatar(user)} size={48} />
        <div>
          <h3 className="font-semibold text-[var(--txt-clr)] pry-ff">
            {resolveDisplayName(user)}
          </h3>
          <p className="text-sm text-[var(--txt-clr)] sec-ff">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <Field label="Phone" value={user.phoneNumber || "N/A"} />
        <Field label="Subaccount" value={user.hasSubaccount ? "Yes" : "No"} />
        <Field label="Role" value={user.role} capitalize />
        <Field
          label="Joined"
          value={new Date(user.createdAt).toLocaleDateString()}
          span
        />
      </div>
    </div>
  );
}

// ─── Desktop row ─────────────────────────────────────────────────────────────

function DesktopUserRow({
  user,
  index,
  onClick,
}: {
  user: User;
  index: number;
  onClick: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className="border-t hover:bg-[var(--bg-clr)] cursor-pointer transition duration-200"
    >
      <td className="py-3 px-4 text-[var(--acc-clr)] pry-ff">{index + 1}</td>
      <td className="py-3 px-4">
        <UserAvatar src={resolveAvatar(user)} size={40} />
      </td>
      <td className="py-3 px-4 text-[var(--txt-clr)] sec-ff">
        {resolveDisplayName(user)}
      </td>
      <td className="py-3 px-4 text-[var(--txt-clr)] sec-ff">{user.email}</td>
      <td className="py-3 px-4 text-[var(--txt-clr)] sec-ff">
        {user.phoneNumber || "N/A"}
      </td>
      <td className="py-3 px-4 text-[var(--txt-clr)] sec-ff">
        {/* isVerifiedStudent removed — not in new response */}
        —
      </td>
      <td className="py-3 px-4 text-[var(--txt-clr)] sec-ff">
        {user.hasSubaccount ? "Yes" : "No"}
      </td>
      <td className="py-3 px-4 capitalize text-[var(--txt-clr)] sec-ff">
        {user.role}
      </td>
      <td className="py-3 px-4 text-[var(--txt-clr)] sec-ff">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>
    </tr>
  );
}

// ─── Tiny label+value cell for mobile cards ──────────────────────────────────

function Field({
  label,
  value,
  capitalize,
  span,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
  span?: boolean;
}) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <span className="text-[var(--acc-clr)] pry-ff">{label}:</span>
      <p className={`text-[var(--txt-clr)] sec-ff${capitalize ? " capitalize" : ""}`}>
        {value}
      </p>
    </div>
  );
}