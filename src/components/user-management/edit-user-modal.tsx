"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { EditUserData, User } from "@/types/user";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onActivate: () => void;
  onSuspend: () => void;
  onDelete: () => void;
  onUpdate: (data: EditUserData) => void;
}

export function EditUserModal({
  isOpen,
  onClose,
  user,
  onActivate,
  onSuspend,
  onDelete,
  onUpdate,
}: EditUserModalProps) {
  const [formData, setFormData] = useState<EditUserData>({
    userType: user?.userType || "Admin - High",
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    countryCode: "NIG",
    university: user?.university || "",
  });

  if (!isOpen || !user) return null;

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 md:p-8">
          <h2 className="text-3xl md:text-5xl font-semibold text-center text-[#101828] mb-8">
            Edit user
          </h2>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Type
              </label>
              <div className="relative">
                <select
                  value={formData.userType}
                  onChange={(e) =>
                    setFormData({ ...formData, userType: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer"
                >
                  <option>Admin - High</option>
                  <option>Admin - Low</option>
                  <option>Vendor</option>
                  <option>Rider</option>
                  <option>Customer</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone number
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.countryCode}
                    onChange={(e) =>
                      setFormData({ ...formData, countryCode: e.target.value })
                    }
                    className="w-20 px-2 py-3 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm cursor-pointer"
                  >
                    <option>NIG</option>
                    <option>USA</option>
                    <option>UK</option>
                  </select>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  University
                </label>
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) =>
                    setFormData({ ...formData, university: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-3 pt-4">
              {user.status === "Inactive" ? (
                <button
                  type="button"
                  onClick={onActivate}
                  className="w-full px-6 py-3 bg-[#669917] text-white rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer"
                >
                  Activate user
                </button>
              ) : user.status === "Active" ? (
                <button
                  type="button"
                  onClick={onSuspend}
                  className="w-full px-6 py-3 bg-[#997615] text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors cursor-pointer"
                >
                  Suspend user
                </button>
              ) : null}

              <button
                type="button"
                onClick={onDelete}
                className="w-full px-6 py-3 bg-[#993127] text-white rounded-lg font-medium hover:bg-red-700 transition-colors cursor-pointer"
              >
                Delete User
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
