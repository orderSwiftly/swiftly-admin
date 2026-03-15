"use client";

import React, { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { addInstitution, type AddInstitutionData, type Institution } from "@/lib/api/institution";

interface AddUniversityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (institution: Institution) => void; // returns the real created institution
}

const EMPTY_FORM: AddInstitutionData = {
  name: "",
  city: "",
  state: "",
  country: "",
  logo: null,
};

export function AddUniversityModal({ isOpen, onClose, onAdd }: AddUniversityModalProps) {
  const [formData, setFormData] = useState<AddInstitutionData>(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, logo: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.city || !formData.state || !formData.country) {
      setError("Name, city, state and country are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const institution = await addInstitution(formData);
      onAdd(institution);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(EMPTY_FORM);
    setImagePreview(null);
    setError(null);
    onClose();
  };

  const field = (
    label: string,
    key: keyof Omit<AddInstitutionData, "logo">,
    placeholder: string,
    type = "text"
  ) => (
    <div>
      <label className="text-sm font-medium text-gray-700 block mb-1.5">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={formData[key] as string}
        onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }))}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Add University
        </h2>

        {/* Logo upload */}
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors overflow-hidden"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Camera size={24} className="text-gray-500" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {field("Name", "name", "Babcock University")}
          {field("City", "city", "Ilishan-Remo")}
          {field("State", "state", "Ogun State")}
          {field("Country", "country", "Nigeria")}
        </div>

        {/* Error */}
        {error && (
          <p className="mt-3 text-sm text-red-500 text-center">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-[#669917] text-white rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Adding…
              </>
            ) : (
              "Proceed"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}