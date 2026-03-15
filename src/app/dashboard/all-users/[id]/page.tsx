// @typescript-eslint/no-unused-vars
'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle,
  XCircle,
  User as UserIcon,
  Mail,
  Shield,
  CreditCard,
  BadgeCheck,
  Phone,
  MapPin,
  Building2,
  Hash,
  ArrowLeft,
  Calendar,
  Landmark,
} from "lucide-react";
import PulseLoader from "@/components/pulse-loader";
import { getUserById, type User } from "@/lib/api/users";

export default function UserByIdPage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    if (!id) return;
    getUserById(id)
      .then(setUser)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "An error occurred")
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PulseLoader />
      </div>
    );
  if (error) return <p className="text-red-500 p-4">{error}</p>;
  if (!user) return <p className="text-center text-gray-400">No user found</p>;

  const displayName = user.businessName ?? user.fullname ?? "Unknown";
  const avatar = user.logo ?? user.photo ?? null;
  const isSeller = user.role === "seller";

  return (
    <main className="p-4 md:p-8 bg-[var(--light-bg)] min-h-screen">
      <div className="max-w-2xl mx-auto space-y-4">

        {/* Back button */}
        <Link
          href="/dashboard/all-users"
          className="flex items-center gap-2 text-sm text-[var(--acc-clr)] hover:opacity-75 transition mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </Link>

        {/* ── Header card ─────────────────────────────────────────────── */}
        <div className="bg-white/10 backdrop-blur-md border border-[var(--acc-clr)] rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row items-center gap-5">
          {avatar ? (
            <Image
              src={avatar}
              alt={displayName}
              width={80}
              height={80}
              className="rounded-full object-cover w-20 h-20 shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xl font-bold shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-[var(--acc-clr)] pry-ff">
              {displayName}
            </h1>
            <p className="text-sm text-[var(--txt-clr)] sec-ff mt-0.5">
              {user.email}
            </p>
            <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-semibold capitalize bg-[var(--acc-clr)]/20 text-[var(--acc-clr)] pry-ff">
              {user.role}
            </span>
          </div>
        </div>

        {/* ── Basic info ──────────────────────────────────────────────── */}
        <Section title="Basic Information">
          <Detail icon={<UserIcon />} label={isSeller ? "Business Name" : "Full Name"}>
            {displayName}
          </Detail>
          <Detail icon={<Mail />} label="Email">
            {user.email}
          </Detail>
          {user.phoneNumber && (
            <Detail icon={<Phone />} label="Phone">
              {user.phoneNumber}
            </Detail>
          )}
          <Detail icon={<Shield />} label="Role">
            <span className="capitalize">{user.role}</span>
          </Detail>
          {user.institutionId && (
            <Detail icon={<Building2 />} label="Institution ID">
              {user.institutionId}
            </Detail>
          )}
          <Detail icon={<Calendar />} label="Joined">
            {new Date(user.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Detail>
        </Section>

        {/* ── Status flags ────────────────────────────────────────────── */}
        <Section title="Account Status">
          <BoolDetail icon={<CreditCard />} label="Has Subaccount" value={user.hasSubaccount} />
          {user.isVerifiedStudent !== undefined && (
            <BoolDetail icon={<BadgeCheck />} label="Verified Student" value={user.isVerifiedStudent} />
          )}
        </Section>

        {/* ── Payment info (sellers only) ─────────────────────────────── */}
        {isSeller && (user.accountNumber || user.paystackSubaccountId || user.paystackRecipientCode) && (
          <Section title="Payment Details">
            {user.accountNumber && (
              <Detail icon={<Hash />} label="Account Number">
                {user.accountNumber}
              </Detail>
            )}
            {user.bankCode && (
              <Detail icon={<Landmark />} label="Bank Code">
                {user.bankCode}
              </Detail>
            )}
            {user.paystackSubaccountId && (
              <Detail icon={<CreditCard />} label="Paystack Subaccount">
                {user.paystackSubaccountId}
              </Detail>
            )}
            {user.paystackRecipientCode && (
              <Detail icon={<Hash />} label="Recipient Code">
                {user.paystackRecipientCode}
              </Detail>
            )}
          </Section>
        )}

        {/* ── Addresses (buyers) ──────────────────────────────────────── */}
        {user.address && user.address.length > 0 && (
          <Section title={`Saved Addresses (${user.address.length})`}>
            <div className="space-y-3">
              {user.address.map((addr, i) => (
                <div
                  key={addr._id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-[var(--acc-clr)]/30"
                >
                  <MapPin className="w-4 h-4 mt-0.5 text-[var(--acc-clr)] shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--txt-clr)] pry-ff">
                      Address {i + 1}
                    </p>
                    <p className="text-sm text-[var(--txt-clr)] sec-ff">
                      {addr.building}, Room {addr.room}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

      </div>
    </main>
  );
}

// ─── Section wrapper ─────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-[var(--acc-clr)] rounded-2xl shadow p-5 space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--acc-clr)] pry-ff border-b border-[var(--acc-clr)]/30 pb-2">
        {title}
      </h2>
      {children}
    </div>
  );
}

// ─── Detail row ──────────────────────────────────────────────────────────────

function Detail({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 text-[var(--txt-clr)]">
      <span className="text-[var(--acc-clr)] mt-0.5 w-4 h-4 shrink-0">
        {icon}
      </span>
      <span className="font-semibold text-sm w-36 shrink-0">{label}</span>
      <span className="sec-ff text-sm break-all">{children}</span>
    </div>
  );
}

// ─── Bool detail row ─────────────────────────────────────────────────────────

function BoolDetail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: boolean;
}) {
  return (
    <div className="flex items-center gap-3 text-[var(--txt-clr)]">
      <span className={`mt-0.5 w-4 h-4 shrink-0 ${value ? "text-green-500" : "text-red-400"}`}>
        {value ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
      </span>
      <span className="font-semibold text-sm w-36 shrink-0">{label}</span>
      <span className="sec-ff text-sm">{value ? "Yes" : "No"}</span>
    </div>
  );
}