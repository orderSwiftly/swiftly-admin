"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import type { University } from "@/types/university";
import type { AddUniversityData } from "@/types/university";
import { AddUniversityModal } from "@/components/university-management/add-university-modal";
import { EditUniversityModal } from "@/components/university-management/edit-university-modal";
import { ConfirmationModal } from "@/components/user-management/confirmation-modal";
import { SuccessModal } from "@/components/user-management/success-modal";

const mockUniversities: University[] = Array.from({ length: 20 }, (_, i) => ({
  id: String(i + 1),
  name: i % 2 === 0 ? "UNILAG" : "Babcock",
  email: i % 2 === 0 ? "Unilagexample@gmail.com" : "Babcockexample@gmail.com",
  status: i % 2 === 0 ? "Disabled" : "Enabled",
  location: i % 2 === 0 ? "Lagos" : "Ogun",
  deliveryZone: i % 2 === 0 ? "Lagos" : "Ogun",
  hours: 10,
  fees: 300,
}));

const ITEMS_PER_PAGE = 15;

export default function UniversitiesPage() {
  const [universities, setUniversities] =
    useState<University[]>(mockUniversities);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedUniversity, setSelectedUniversity] =
    useState<University | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const query = searchQuery.toLowerCase().trim();

  const filteredUniversities = universities.filter((u) => {
    if (!query) return true;
    return (
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.location.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUniversities.length / ITEMS_PER_PAGE),
  );
  const paginatedUniversities = filteredUniversities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleAddUniversity = (data: AddUniversityData) => {
    const newUniversity: University = {
      id: String(universities.length + 1),
      name: data.name,
      email: data.email,
      status: "Enabled",
      location: data.state,
      deliveryZone: data.state,
      hours: 10,
      fees: 300,
    };
    setUniversities([newUniversity, ...universities]);
    setShowAddModal(false);
    setSuccessMessage("University Added Successfully");
    setShowSuccessModal(true);
  };

  const handleEdit = (university: University) => {
    setSelectedUniversity(university);
    setShowEditModal(true);
  };

  const handleEnableDisable = (university: University) => {
    const newStatus = university.status === "Enabled" ? "Disabled" : "Enabled";
    setUniversities(
      universities.map((u) =>
        u.id === university.id ? { ...u, status: newStatus } : u,
      ),
    );
    setShowEditModal(false);
    setSuccessMessage(
      `University ${newStatus === "Enabled" ? "Enabled" : "Disabled"} Successfully`,
    );
    setShowSuccessModal(true);
  };

  const handleDeleteClick = (university: University) => {
    setSelectedUniversity(university);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUniversity) {
      setUniversities(
        universities.filter((u) => u.id !== selectedUniversity.id),
      );
      setShowDeleteModal(false);
      setShowEditModal(false);
      setSuccessMessage("University Deleted Successfully");
      setShowSuccessModal(true);
    }
  };

  const handleSaveEdit = (updated: University) => {
    setUniversities(
      universities.map((u) => (u.id === updated.id ? updated : u)),
    );
    setShowEditModal(false);
    setSuccessMessage("University Updated Successfully");
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setSuccessMessage("");
    setSelectedUniversity(null);
  };

  const getStatusBadge = (status: string) => {
    const isEnabled = status === "Enabled";
    return (
      <span
        className={`inline-flex items-center justify-center px-4 py-2 rounded-[6px] text-xs font-semibold ${
          isEnabled
            ? "bg-[#D8FF9C] text-[#669917]"
            : "bg-[#FFB0A8] text-[#993127]"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="p-4 md:p-6 min-h-screen">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-lg w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-[#C8FF73] text-[#669917] rounded-lg text-sm md:text-lg font-medium hover:bg-green-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            + Add University
          </button>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="pb-3 pl-2">Name</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Location</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedUniversities.map((university) => (
                <tr
                  key={university.id}
                  className="text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 pl-2 font-medium">{university.name}</td>
                  <td className="py-3">{getStatusBadge(university.status)}</td>
                  <td className="py-3 text-gray-500">{university.email}</td>
                  <td className="py-3 text-gray-500">{university.location}</td>
                  <td className="py-3 text-right pr-2">
                    <button
                      onClick={() => handleEdit(university)}
                      className="px-4 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedUniversities.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-gray-400 text-sm"
                  >
                    No universities found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-3">
          {paginatedUniversities.map((university) => (
            <div
              key={university.id}
              className="border border-gray-100 rounded-xl p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 text-sm">
                  {university.name}
                </span>
                {getStatusBadge(university.status)}
              </div>
              <div className="text-xs text-gray-500">{university.email}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {university.location}
                </span>
                <button
                  onClick={() => handleEdit(university)}
                  className="px-4 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
          {paginatedUniversities.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-sm">
              No universities found.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <AddUniversityModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddUniversity}
      />

      <EditUniversityModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        university={selectedUniversity}
        onEnableDisable={handleEnableDisable}
        onDelete={handleDeleteClick}
        onSave={handleSaveEdit}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete University"
        message="Are you sure you want to delete this? This action cannot be undone."
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title={successMessage}
      />
    </div>
  );
}
