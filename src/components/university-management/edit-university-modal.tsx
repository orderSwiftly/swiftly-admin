"use client";

import React, { useState, useEffect, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import type { University } from "@/types/university";
import {
  editInstitution,
  deleteInstitution,
  type Institution,
} from "@/lib/api/institution";

interface EditUniversityModalProps {
  isOpen: boolean;
  onClose: () => void;
  university: University | null;
  onEnableDisable: (university: University) => void;
  onDelete: (university: University) => void;
  onSave: (institution: Institution) => void; // returns real updated institution
}

export function EditUniversityModal({
  isOpen,
  onClose,
  university,
  onEnableDisable,
  onDelete,
  onSave,
}: EditUniversityModalProps) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (university) {
      setName(university.name);
      // location is stored as "city, state" from mapInstitution
      const [parsedCity = "", parsedState = ""] = university.location.split(", ");
      setCity(parsedCity);
      setState(parsedState);
      setCountry("");
      setLogoFile(null);
      setLogoPreview(null);
      setError(null);
    }
  }, [university]);

  if (!isOpen || !university) return null;

  const isEnabled = university.status === "Enabled";

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const updated = await editInstitution(university.id, {
        name,
        city,
        state,
        country: country || undefined,
        logo: logoFile,
      });
      onSave(updated);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update institution");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await deleteInstitution(university.id);
      onDelete(university);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete institution");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Edit University
        </h2>

        {/* Logo upload */}
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors overflow-hidden"
          >
            {logoPreview ? (
              <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Camera size={24} className="text-gray-500" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="hidden"
          />
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <Field label="Name" value={name} onChange={setName} placeholder="Babcock University" />

          <div className="grid grid-cols-2 gap-4">
            <Field label="City" value={city} onChange={setCity} placeholder="Ilishan-Remo" />
            <Field label="State" value={state} onChange={setState} placeholder="Ogun State" />
          </div>

          <Field label="Country" value={country} onChange={setCountry} placeholder="Nigeria" />
        </div>

        {/* Error */}
        {error && <p className="mt-3 text-sm text-red-500 text-center">{error}</p>}

        {/* Actions */}
        <div className="space-y-3 mt-6">
          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving || deleting}
            className="w-full px-6 py-3 bg-[#669917] text-white rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : "Save Changes"}
          </button>

          {/* Enable / Disable */}
          <button
            onClick={() => onEnableDisable(university)}
            disabled={saving || deleting}
            className={`w-full px-6 py-3 text-white rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-60 ${isEnabled ? "bg-red-400 hover:bg-red-500" : "bg-[#669917] hover:bg-green-700"
              }`}
          >
            {isEnabled ? "Disable University" : "Enable University"}
          </button>

          {/* Delete */}
          <button
            onClick={handleDelete}
            disabled={saving || deleting}
            className="w-full px-6 py-3 bg-red-700 text-white rounded-lg font-medium hover:bg-red-800 transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {deleting ? <><Loader2 size={16} className="animate-spin" /> Deleting…</> : "Delete University"}
          </button>

          <button
            onClick={onClose}
            disabled={saving || deleting}
            className="w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Field helper ─────────────────────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 block mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
    </div>
  );
}