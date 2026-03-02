"use client";

import { useState, useRef } from "react";
import { Search } from "lucide-react";
import type { Rider, PendingRider, RiderMetrics } from "@/types/rider";
import { PendingRiderCard } from "@/components/delivery-management/pending-rider-card";
import { RiderMetricsView } from "@/components/delivery-management/rider-metrics";
import { RiderEmptyState } from "@/components/delivery-management/empty-state";
import { ConfirmationModal } from "@/components/user-management/confirmation-modal";
import { SuccessModal } from "@/components/user-management/success-modal";

const mockPendingRiders: PendingRider[] = Array.from({ length: 6 }, (_, i) => ({
  id: `pending-${i + 1}`,
  name: "John Doe",
  university: "Babcock",
  email: "Food@gmail.com",
  phone: "08031245678",
}));

const mockRiders: Rider[] = [
  {
    id: "1",
    name: "Mike jack",
    status: "Disabled",
    school: "UNILAG",
    location: "Lagos",
  },
  {
    id: "2",
    name: "Mike jack",
    status: "Enabled",
    school: "Babcock",
    location: "Ogun",
  },
  {
    id: "3",
    name: "Mike jack",
    status: "Disabled",
    school: "Crescent",
    location: "Lagos",
  },
  {
    id: "4",
    name: "Mike jack",
    status: "Enabled",
    school: "ABUAD",
    location: "Ogun",
  },
  {
    id: "5",
    name: "Mike jack",
    status: "Enabled",
    school: "UNIIOLORIN",
    location: "Ogun",
  },
  {
    id: "6",
    name: "Mike jack",
    status: "Enabled",
    school: "CALEB",
    location: "Ogun",
  },
  {
    id: "7",
    name: "Mike jack",
    status: "Disabled",
    school: "Nile",
    location: "Lagos",
  },
  {
    id: "8",
    name: "Mike jack",
    status: "Disabled",
    school: "ABUZAR",
    location: "Lagos",
  },
  {
    id: "9",
    name: "Mike jack",
    status: "Enabled",
    school: "Bells",
    location: "Ogun",
  },
  {
    id: "10",
    name: "Mike jack",
    status: "Enabled",
    school: "Polytechnic",
    location: "Ogun",
  },
].map((r) => ({
  ...r,
  status: r.status as "Enabled" | "Disabled",
  email: "mikejack@gmail.com",
  phone: "08031245678",
}));

const mockMetrics: RiderMetrics = {
  active: 4,
  activeChange: 36,
  averageTime: "18 min",
  averageTimeChange: -14,
  todaysOrder: 33493,
  todaysOrderChange: 36,
  totalOrders: 84382,
  totalOrdersChange: 36,
  monthlyData: [
    { month: "Jan", completed: 130 },
    { month: "Feb", completed: 300 },
    { month: "Mar", completed: 180 },
    { month: "Apr", completed: 150 },
    { month: "May", completed: 200 },
    { month: "Jun", completed: 380 },
    { month: "Jul", completed: 230 },
    { month: "Aug", completed: 240 },
    { month: "Sep", completed: 290 },
    { month: "Oct", completed: 220 },
    { month: "Nov", completed: 170 },
    { month: "Dec", completed: 120 },
  ],
};

const ITEMS_PER_PAGE = 10;

export default function DeliveryPartnersPage() {
  const [riders, setRiders] = useState<Rider[]>(mockRiders);
  const [pendingRiders, setPendingRiders] =
    useState<PendingRider[]>(mockPendingRiders);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [showMetrics, setShowMetrics] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [riderToDelete, setRiderToDelete] = useState<Rider | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeScrollIndex, setActiveScrollIndex] = useState(0);

  const query = searchQuery.toLowerCase().trim();
  const filteredRiders = riders.filter((r) => {
    if (!query) return true;
    return (
      r.name.toLowerCase().includes(query) ||
      r.school.toLowerCase().includes(query) ||
      r.location.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRiders.length / ITEMS_PER_PAGE),
  );
  const paginatedRiders = filteredRiders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const cardsPerView = 3;
  const totalScrollPages = Math.max(
    1,
    Math.ceil(pendingRiders.length / cardsPerView),
  );

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = 280 + 16;
      const index = Math.round(scrollLeft / (cardWidth * cardsPerView));
      setActiveScrollIndex(Math.min(index, totalScrollPages - 1));
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = 280 + 16;
      scrollRef.current.scrollTo({
        left: index * cardWidth * cardsPerView,
        behavior: "smooth",
      });
      setActiveScrollIndex(index);
    }
  };

  const handleApproveRider = (rider: PendingRider) => {
    setPendingRiders(pendingRiders.filter((r) => r.id !== rider.id));
    const newRider: Rider = {
      id: `rider-${Date.now()}`,
      name: rider.name,
      status: "Enabled",
      school: rider.university,
      location: "Lagos",
      email: rider.email,
      phone: rider.phone,
    };
    setRiders([newRider, ...riders]);
    setSuccessMessage("Rider Approved Successfully");
    setShowSuccessModal(true);
  };

  const handleRejectRider = (rider: PendingRider) => {
    setPendingRiders(pendingRiders.filter((r) => r.id !== rider.id));
    setSuccessMessage("Rider Rejected Successfully");
    setShowSuccessModal(true);
  };

  const handleMetrics = (rider: Rider) => {
    setSelectedRider(rider);
    setShowMetrics(true);
  };

  const handleBackFromMetrics = () => {
    setShowMetrics(false);
    setSelectedRider(null);
  };

  const handleEnableRider = (rider: Rider) => {
    setRiders(
      riders.map((r) =>
        r.id === rider.id ? { ...r, status: "Enabled" as const } : r,
      ),
    );
    setShowMetrics(false);
    setSuccessMessage("Rider Enabled Successfully");
    setShowSuccessModal(true);
  };

  const handleDisableRider = (rider: Rider) => {
    setRiders(
      riders.map((r) =>
        r.id === rider.id ? { ...r, status: "Disabled" as const } : r,
      ),
    );
    setShowMetrics(false);
    setSuccessMessage("Rider Disabled Successfully");
    setShowSuccessModal(true);
  };

  const handleDeleteClick = (rider: Rider) => {
    setRiderToDelete(rider);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (riderToDelete) {
      setRiders(riders.filter((r) => r.id !== riderToDelete.id));
      setShowDeleteModal(false);
      setShowMetrics(false);
      setRiderToDelete(null);
      setSuccessMessage("Rider Deleted Successfully");
      setShowSuccessModal(true);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setSuccessMessage("");
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
    <div className="p-4 md:p-6 min-h-screen space-y-6 overflow-hidden">
      <div className="overflow-hidden">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Pending Rider Application
        </h2>

        {pendingRiders.length === 0 ? (
          <RiderEmptyState message="Nothing to see here" />
        ) : (
          <>
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {pendingRiders.map((rider) => (
                <PendingRiderCard
                  key={rider.id}
                  rider={rider}
                  onApprove={handleApproveRider}
                  onReject={handleRejectRider}
                />
              ))}
            </div>

            {totalScrollPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                {Array.from({ length: totalScrollPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToIndex(i)}
                    className={`rounded-full transition-all duration-300 cursor-pointer ${
                      i === activeScrollIndex
                        ? "w-10 h-[5px] bg-[#669917]"
                        : "w-10 h-[3px] bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {showMetrics && selectedRider ? (
        <RiderMetricsView
          rider={selectedRider}
          metrics={mockMetrics}
          onBack={handleBackFromMetrics}
          onEnable={handleEnableRider}
          onDisable={handleDisableRider}
          onDelete={handleDeleteClick}
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
          <div className="mb-6">
            <div className="relative max-w-lg">
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
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="pb-3 pl-2">Name</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">School</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedRiders.map((rider) => (
                  <tr
                    key={rider.id}
                    className="text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 pl-2 font-medium">{rider.name}</td>
                    <td className="py-3">{getStatusBadge(rider.status)}</td>
                    <td className="py-3 text-gray-500">{rider.school}</td>
                    <td className="py-3 text-gray-500">{rider.location}</td>
                    <td className="py-3 text-right pr-2">
                      <button
                        onClick={() => handleMetrics(rider)}
                        className="px-4 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        Metrics
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedRiders.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-gray-400 text-sm"
                    >
                      No riders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {paginatedRiders.map((rider) => (
              <div
                key={rider.id}
                className="border border-gray-100 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 text-sm">
                    {rider.name}
                  </span>
                  {getStatusBadge(rider.status)}
                </div>
                <div className="text-xs text-gray-500">
                  {rider.school} · {rider.location}
                </div>
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => handleMetrics(rider)}
                    className="px-4 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Metrics
                  </button>
                </div>
              </div>
            ))}
            {paginatedRiders.length === 0 && (
              <div className="py-12 text-center text-gray-400 text-sm">
                No riders found.
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
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setRiderToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Rider"
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
