"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import type { University } from "@/types/university";
import { deleteInstitution } from "@/lib/api/institution";

export default function DeleteUniversityModal({
    university,
    onClose,
    onDelete,
}: {
    university: University;
    onClose: () => void;
    onDelete: (university: University) => void;
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        setLoading(true);
        setError(null);
        try {
            await deleteInstitution(university.id);
            onDelete(university);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete institution");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-8 text-center">

                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={24} className="text-red-600" />
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">Delete University</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-gray-700">{university.name}</span>?
                    This action cannot be undone.
                </p>

                {error && (
                    <p className="text-sm text-red-500 mb-4">{error}</p>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <><Loader2 size={16} className="animate-spin" /> Deleting…</>
                        ) : (
                            "Delete"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}