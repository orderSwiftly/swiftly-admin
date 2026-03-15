'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Calendar } from "lucide-react";
import PulseLoader from "@/components/pulse-loader";
import { getInstitutions, type Institution } from "@/lib/api/institution";

export default function GetInstitutionsPage() {
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getInstitutions()
            .then(setInstitutions)
            .catch((err) =>
                setError(err instanceof Error ? err.message : "An error occurred")
            )
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
        <main className="p-4 md:p-8 bg-[var(--light-bg)] min-h-screen">
            <h2 className="text-2xl font-bold mb-6 pry-ff text-[var(--txt-clr)]">
                Institutions
            </h2>

            {institutions.length === 0 ? (
                <p className="text-center py-10 text-[var(--txt-clr)]">
                    No institutions found.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {institutions.map((institution) => (
                        <InstitutionCard key={institution._id} institution={institution} />
                    ))}
                </div>
            )}
        </main>
    );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function InstitutionCard({ institution }: { institution: Institution }) {
    const { name, logo, address, createdAt } = institution;

    return (
        <div className="bg-white/10 backdrop-blur-md border border-[var(--acc-clr)] rounded-2xl shadow p-5 flex flex-col gap-4">
            {/* Logo + name */}
            <div className="flex items-center gap-4">
                <Image
                    src={logo}
                    alt={name}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full object-cover shrink-0"
                />
                <h3 className="font-semibold text-[var(--txt-clr)] pry-ff leading-tight">
                    {name}
                </h3>
            </div>

            {/* Address */}
            <div className="flex items-start gap-2 text-sm text-[var(--txt-clr)] sec-ff">
                <MapPin className="w-4 h-4 mt-0.5 text-[var(--acc-clr)] shrink-0" />
                <span>
                    {address.city}, {address.state}, {address.country}
                </span>
            </div>

            {/* Created at */}
            <div className="flex items-center gap-2 text-xs text-[var(--txt-clr)]/70 sec-ff">
                <Calendar className="w-3.5 h-3.5 text-[var(--acc-clr)]" />
                <span>
                    Added{" "}
                    {new Date(createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })}
                </span>
            </div>
        </div>
    );
}