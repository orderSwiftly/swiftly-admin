"use client";

import { useState, useRef } from "react";
import { Search } from "lucide-react";
import type { Vendor, PendingVendor, VendorMetrics } from "@/types/vendor";
import { PendingVendorCard } from "@/components/vendor-management/pending-vendor-card";
import { VendorMetricsView } from "@/components/vendor-management/vendor-metrics";
import { EmptyState } from "@/components/vendor-management/empty-state";
import { ConfirmationModal } from "@/components/user-management/confirmation-modal";
import { SuccessModal } from "@/components/user-management/success-modal";

const mockPendingVendors: PendingVendor[] = Array.from(
  { length: 6 },
  (_, i) => ({
    id: `pending-${i + 1}`,
    name: "Campus Grills",
    university: "Babcock",
    type: "Food",
    email: "Food@gmail.com",
    phone: "08031245678",
  }),
);

const mockVendors: Vendor[] = [
  {
    id: "1",
    name: "Vendor 1",
    status: "Disabled",
    school: "UNILAG",
    location: "Lagos",
  },
  {
    id: "2",
    name: "Vendor 2",
    status: "Enabled",
    school: "Babcock",
    location: "Ogun",
  },
  {
    id: "3",
    name: "Vendor 1",
    status: "Disabled",
    school: "Crescent",
    location: "Lagos",
  },
  {
    id: "4",
    name: "Vendor 1",
    status: "Enabled",
    school: "ABUAD",
    location: "Ogun",
  },
  {
    id: "5",
    name: "Vendor 1",
    status: "Enabled",
    school: "UNILORIN",
    location: "Ogun",
  },
  {
    id: "6",
    name: "Vendor 1",
    status: "Enabled",
    school: "CALEB",
    location: "Ogun",
  },
  {
    id: "7",
    name: "Vendor 1",
    status: "Disabled",
    school: "Nile",
    location: "Lagos",
  },
  {
    id: "8",
    name: "Vendor 1",
    status: "Disabled",
    school: "ABUZAR",
    location: "Lagos",
  },
  {
    id: "9",
    name: "Vendor 2",
    status: "Enabled",
    school: "Bells",
    location: "Ogun",
  },
  {
    id: "10",
    name: "Vendor 2",
    status: "Enabled",
    school: "Polytechnic",
    location: "Ogun",
  },
].map((v) => ({
  ...v,
  status: v.status as "Enabled" | "Disabled",
  email: `${v.name.replace(" ", "").toLowerCase()}@gmail.com`,
  phone: "08031245678",
  type: "Food",
}));

const mockMetrics: VendorMetrics = {
  todaySale: 120426,
  todaySaleChange: 36,
  totalSales: 20380485,
  totalSalesChange: -14,
  dailyOrders: 33493,
  dailyOrdersChange: 36,
  totalOrders: 84382,
  totalOrdersChange: 36,
  monthlyData: [
    { month: "Jan", completed: 120, cancelled: 30 },
    { month: "Feb", completed: 280, cancelled: 50 },
    { month: "Mar", completed: 180, cancelled: 60 },
    { month: "Apr", completed: 150, cancelled: 40 },
    { month: "May", completed: 220, cancelled: 70 },
    { month: "Jun", completed: 350, cancelled: 60 },
    { month: "Jul", completed: 200, cancelled: 80 },
    { month: "Aug", completed: 230, cancelled: 50 },
    { month: "Sep", completed: 260, cancelled: 55 },
    { month: "Oct", completed: 210, cancelled: 45 },
    { month: "Nov", completed: 170, cancelled: 40 },
    { month: "Dec", completed: 140, cancelled: 30 },
  ],
};

const ITEMS_PER_PAGE = 10;

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [pendingVendors, setPendingVendors] =
    useState<PendingVendor[]>(mockPendingVendors);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showMetrics, setShowMetrics] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeScrollIndex, setActiveScrollIndex] = useState(0);

  const query = searchQuery.toLowerCase().trim();
  const filteredVendors = vendors.filter((v) => {
    if (!query) return true;
    return (
      v.name.toLowerCase().includes(query) ||
      v.school.toLowerCase().includes(query) ||
      v.location.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredVendors.length / ITEMS_PER_PAGE),
  );
  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const cardsPerView = 3;
  const totalScrollPages = Math.max(
    1,
    Math.ceil(pendingVendors.length / cardsPerView),
  );

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = 280 + 16; // card width + gap
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

  const handleApproveVendor = (vendor: PendingVendor) => {
    setPendingVendors(pendingVendors.filter((v) => v.id !== vendor.id));
    const newVendor: Vendor = {
      id: `vendor-${Date.now()}`,
      name: vendor.name,
      status: "Enabled",
      school: vendor.university,
      location: "Lagos",
      email: vendor.email,
      phone: vendor.phone,
      type: vendor.type,
    };
    setVendors([newVendor, ...vendors]);
    setSuccessMessage("Vendor Approved Successfully");
    setShowSuccessModal(true);
  };

  const handleRejectVendor = (vendor: PendingVendor) => {
    setPendingVendors(pendingVendors.filter((v) => v.id !== vendor.id));
    setSuccessMessage("Vendor Rejected Successfully");
    setShowSuccessModal(true);
  };

  const handleMetrics = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowMetrics(true);
  };

  const handleBackFromMetrics = () => {
    setShowMetrics(false);
    setSelectedVendor(null);
  };

  const handleEnableVendor = (vendor: Vendor) => {
    setVendors(
      vendors.map((v) =>
        v.id === vendor.id ? { ...v, status: "Enabled" } : v,
      ),
    );
    setShowMetrics(false);
    setSuccessMessage("Vendor Enabled Successfully");
    setShowSuccessModal(true);
  };

  const handleDisableVendor = (vendor: Vendor) => {
    setVendors(
      vendors.map((v) =>
        v.id === vendor.id ? { ...v, status: "Disabled" } : v,
      ),
    );
    setShowMetrics(false);
    setSuccessMessage("Vendor Disabled Successfully");
    setShowSuccessModal(true);
  };

  const handleDeleteClick = (vendor: Vendor) => {
    setVendorToDelete(vendor);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (vendorToDelete) {
      setVendors(vendors.filter((v) => v.id !== vendorToDelete.id));
      setShowDeleteModal(false);
      setShowMetrics(false);
      setVendorToDelete(null);
      setSuccessMessage("Vendor Deleted Successfully");
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
          Pending Vendor Application
        </h2>

        {pendingVendors.length === 0 ? (
          <EmptyState message="Nothing to see here" />
        ) : (
          <>
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {pendingVendors.map((vendor) => (
                <PendingVendorCard
                  key={vendor.id}
                  vendor={vendor}
                  onApprove={handleApproveVendor}
                  onReject={handleRejectVendor}
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

      {showMetrics && selectedVendor ? (
        <VendorMetricsView
          vendor={selectedVendor}
          metrics={mockMetrics}
          onBack={handleBackFromMetrics}
          onEnable={handleEnableVendor}
          onDisable={handleDisableVendor}
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
                {paginatedVendors.map((vendor) => (
                  <tr
                    key={vendor.id}
                    className="text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 pl-2 font-medium">{vendor.name}</td>
                    <td className="py-3">{getStatusBadge(vendor.status)}</td>
                    <td className="py-3 text-gray-500">{vendor.school}</td>
                    <td className="py-3 text-gray-500">{vendor.location}</td>
                    <td className="py-3 text-right pr-2">
                      <button
                        onClick={() => handleMetrics(vendor)}
                        className="px-4 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        Metrics
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedVendors.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-gray-400 text-sm"
                    >
                      No vendors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {paginatedVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="border border-gray-100 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 text-sm">
                    {vendor.name}
                  </span>
                  {getStatusBadge(vendor.status)}
                </div>
                <div className="text-xs text-gray-500">
                  {vendor.school} · {vendor.location}
                </div>
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => handleMetrics(vendor)}
                    className="px-4 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Metrics
                  </button>
                </div>
              </div>
            ))}
            {paginatedVendors.length === 0 && (
              <div className="py-12 text-center text-gray-400 text-sm">
                No vendors found.
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
          setVendorToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Vendor"
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
