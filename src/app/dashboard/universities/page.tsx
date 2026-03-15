"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import type { University } from "@/types/university";
import { AddUniversityModal } from "@/components/university-management/add-university-modal";
import { EditUniversityModal } from "@/components/university-management/edit-university-modal";
import { SuccessModal } from "@/components/user-management/success-modal";
import PulseLoader from "@/components/pulse-loader";
import { getInstitutions, type Institution } from "@/lib/api/institution";

// ─── Map API institution → local University shape ─────────────────────────────

function mapInstitution(inst: Institution): University {
  return {
    id: inst._id,
    name: inst.name,
    email: "",
    status: "Enabled",
    location: `${inst.address.city}, ${inst.address.state}`,
    deliveryZone: inst.address.state,
    hours: 10,
    fees: 300,
  };
}

const ITEMS_PER_PAGE = 15;

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  // ─── Fetch ───────────────────────────────────────────────────────────────────

  useEffect(() => {
    getInstitutions()
      .then((institutions) => setUniversities(institutions.map(mapInstitution)))
      .catch((err) =>
        setFetchError(err instanceof Error ? err.message : "Failed to load institutions")
      )
      .finally(() => setLoading(false));
  }, []);

  // ─── Filter + paginate ────────────────────────────────────────────────────────

  const query = searchQuery.toLowerCase().trim();

  const filteredUniversities = universities.filter((u) => {
    if (!query) return true;
    return (
      u.name.toLowerCase().includes(query) ||
      u.location.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredUniversities.length / ITEMS_PER_PAGE));
  const paginatedUniversities = filteredUniversities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleAddUniversity = (institution: Institution) => {
    setUniversities([mapInstitution(institution), ...universities]);
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
      universities.map((u) => (u.id === university.id ? { ...u, status: newStatus } : u))
    );
    setShowEditModal(false);
    setSuccessMessage(`University ${newStatus} Successfully`);
    setShowSuccessModal(true);
  };

  // Called by EditUniversityModal after the API delete succeeds
  const handleDeleteClick = (university: University) => {
    setUniversities(universities.filter((u) => u.id !== university.id));
    setShowEditModal(false);
    setSuccessMessage("University Deleted Successfully");
    setShowSuccessModal(true);
  };

  const handleSaveEdit = (institution: Institution) => {
    setUniversities(universities.map((u) =>
      u.id === institution._id ? mapInstitution(institution) : u
    ));
    setShowEditModal(false);
    setSuccessMessage("University Updated Successfully");
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setSuccessMessage("");
    setSelectedUniversity(null);
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  const getStatusBadge = (status: string) => {
    const isEnabled = status === "Enabled";
    return (
      <span
        className={`inline-flex items-center justify-center px-4 py-2 rounded-[6px] text-xs font-semibold ${isEnabled ? "bg-[#D8FF9C] text-[#669917]" : "bg-[#FFB0A8] text-[#993127]"
          }`}
      >
        {status}
      </span>
    );
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="p-4 md:p-6 min-h-screen sec-ff">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-lg w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
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

        {/* Loading / error */}
        {loading && <div className="flex justify-center py-12"><PulseLoader /></div>}
        {fetchError && <p className="text-center py-12 text-sm text-red-500">{fetchError}</p>}

        {!loading && !fetchError && (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="pb-3 pl-2">Name</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Location</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedUniversities.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-gray-400 text-sm">
                        No universities found.
                      </td>
                    </tr>
                  ) : (
                    paginatedUniversities.map((university) => (
                      <tr key={university.id} className="text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <td className="py-3 pl-2 font-medium">{university.name}</td>
                        <td className="py-3">{getStatusBadge(university.status)}</td>
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
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {paginatedUniversities.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">No universities found.</div>
              ) : (
                paginatedUniversities.map((university) => (
                  <div key={university.id} className="border border-gray-100 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 text-sm">{university.name}</span>
                      {getStatusBadge(university.status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{university.location}</span>
                      <button
                        onClick={() => handleEdit(university)}
                        className="px-4 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages} · {filteredUniversities.length} institution{filteredUniversities.length !== 1 ? "s" : ""}
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
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
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

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title={successMessage}
      />
    </div>
  );
}