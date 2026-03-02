"use client";

import React, { useState } from "react";
import { Search, ChevronDown, Plus } from "lucide-react";
import { User, AddUserData, EditUserData } from "@/types/user";
import { AddUserModal } from "@/components/user-management/add-user-modal";
import { EditUserModal } from "@/components/user-management/edit-user-modal";
import { ConfirmationModal } from "@/components/user-management/confirmation-modal";
import { SuccessModal } from "@/components/user-management/success-modal";

const mockUsers: User[] = [
  {
    id: "1",
    name: "John doe",
    email: "example@gmail.com",
    phoneNumber: "+234123456789",
    status: "Inactive",
    role: "Admin - High",
    userType: "Admin - High",
  },
  {
    id: "2",
    name: "Jill doe",
    email: "example@gmail.com",
    phoneNumber: "+234123456789",
    status: "Active",
    role: "Vendor",
    userType: "Vendor",
  },
  {
    id: "3",
    name: "jimoh Ahmed",
    email: "example@gmail.com",
    phoneNumber: "+234123456789",
    status: "Removed",
    role: "Customer",
    userType: "Customer",
  },
  {
    id: "4",
    name: "Shitu usman",
    email: "example@gmail.com",
    phoneNumber: "+234123456789",
    status: "Inactive",
    role: "Admin - Low",
    userType: "Admin - Low",
  },
  {
    id: "5",
    name: "Mike jack",
    email: "example@gmail.com",
    phoneNumber: "+234123456789",
    status: "Active",
    role: "Rider",
    userType: "Rider",
  },
  {
    id: "6",
    name: "jimoh Ahmed",
    email: "example@gmail.com",
    phoneNumber: "+234123456789",
    status: "Removed",
    role: "Customer",
    userType: "Customer",
  },
  {
    id: "7",
    name: "Shitu usman",
    email: "example@gmail.com",
    phoneNumber: "+234123456789",
    status: "Inactive",
    role: "Admin - Low",
    userType: "Admin - Low",
  },
  {
    id: "8",
    name: "Mike jack",
    email: "example@gmail.com",
    phoneNumber: "+234123456789",
    status: "Active",
    role: "Rider",
    userType: "Rider",
  },
  {
    id: "9",
    name: "jimoh Ahmed",
    email: "example@gmail.com",
    phoneNumber: "+234123456789",
    status: "Removed",
    role: "Customer",
    userType: "Customer",
  },
  {
    id: "10",
    name: "Shitu usman",
    email: "example@gmail.com",
    phoneNumber: "+234123456789",
    status: "Inactive",
    role: "Admin - Low",
    userType: "Admin - Low",
  },
];

export default function AllUsersPage() {
  const [users] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isSuspendConfirmOpen, setIsSuspendConfirmOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState({
    title: "",
    message: "",
  });

  const totalPages = 10;
  

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "All Roles" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Inactive":
        return "bg-yellow-100 text-yellow-700";
      case "Removed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleAddUser = (data: AddUserData) => {
    console.log("Adding user:", data);
    setIsAddModalOpen(false);
    setSuccessMessage({
      title: "User Added Successfully",
      message: "Login details have been sent to the users mail",
    });
    setIsSuccessModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = (data: EditUserData) => {
    console.log("Updating user:", data);
    setIsEditModalOpen(false);
  };

  const handleActivateUser = () => {
    console.log("Activating user:", selectedUser);
    setIsEditModalOpen(false);
    setSuccessMessage({
      title: "User Activated Successfully",
      message: "",
    });
    setIsSuccessModalOpen(true);
  };

  const handleSuspendUser = () => {
    setIsEditModalOpen(false);
    setIsSuspendConfirmOpen(true);
  };

  const confirmSuspend = () => {
    console.log("Suspending user:", selectedUser);
    setIsSuspendConfirmOpen(false);
    setSuccessMessage({
      title: "User Suspended Successfully",
      message: "",
    });
    setIsSuccessModalOpen(true);
  };

  const handleDeleteUser = () => {
    setIsEditModalOpen(false);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    console.log("Deleting user:", selectedUser);
    setIsDeleteConfirmOpen(false);
    setSuccessMessage({
      title: "User Deleted Successfully",
      message: "",
    });
    setIsSuccessModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer"
              />
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-[#C8FF73] text-[#669917] rounded-lg font-medium hover:bg-[#A6D94A] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Plus size={20} />
              Add Users
            </button>

            <div className="relative min-w-[120px] sm:min-w-[140px]">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full appearance-none px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer"
              >
                <option>All Roles</option>
                <option>Admin - High</option>
                <option>Admin - Low</option>
                <option>Vendor</option>
                <option>Rider</option>
                <option>Customer</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
            </div>
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NAME
                  </th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    EMAIL
                  </th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ROLE
                  </th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {user.name}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex px-4 py-2 rounded-[6px] text-xs font-medium ${getStatusBadgeClass(
                          user.status,
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {user.role}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="px-4 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">
                      {user.name}
                    </h3>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                      user.status,
                    )}`}
                  >
                    {user.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{user.role}</span>
                  <button
                    onClick={() => handleEditUser(user)}
                    className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 mt-4 sm:mt-6">
            <span className="text-xs sm:text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddUser}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
        onActivate={handleActivateUser}
        onSuspend={handleSuspendUser}
        onDelete={handleDeleteUser}
        onUpdate={handleUpdateUser}
      />

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this? This action cannot be undone."
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />

      <ConfirmationModal
        isOpen={isSuspendConfirmOpen}
        onClose={() => setIsSuspendConfirmOpen(false)}
        onConfirm={confirmSuspend}
        title="Suspend User"
        message="Are you sure you want to Suspend this? This action can be undone later."
        confirmText="Suspend"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          setSelectedUser(null);
        }}
        title={successMessage.title}
        message={successMessage.message}
      />
    </main>
  );
}
