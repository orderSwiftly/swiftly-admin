"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { SuccessModal } from "@/components/user-management/success-modal";

interface PlatformFeature {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export default function SecurityPage() {
  const [features, setFeatures] = useState<PlatformFeature[]>([
    {
      id: "live-tracking",
      title: "Live Order Tracking",
      description: "Allow customers to track deliveries in real-time",
      enabled: true,
    },
    {
      id: "auto-accept",
      title: "Auto-Accept Orders",
      description: "Vendors auto-accept within time limit",
      enabled: false,
    },
    {
      id: "sms-notifications",
      title: "SMS Notifications",
      description: "Send order updates via SMS",
      enabled: true,
    },
  ]);

  const [deliveryFee, setDeliveryFee] = useState("500");
  const [orderTimeout, setOrderTimeout] = useState("1");
  const [isEditing, setIsEditing] = useState(false);

  const [announcementType, setAnnouncementType] = useState("Role- Specific");
  const [targetAudience, setTargetAudience] = useState("All Users");
  const [priority, setPriority] = useState("Medium");
  const [message, setMessage] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const toggleFeature = (id: string) => {
    setFeatures(
      features.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)),
    );
  };

  const handleSaveSettings = () => {
    setIsEditing(false);
    setSuccessMessage("Settings Saved");
    setShowSuccessModal(true);
  };

  const handleSendAnnouncement = () => {
    if (!message.trim()) return;
    setSuccessMessage("Announcement Sent Successfully");
    setShowSuccessModal(true);
    setMessage("");
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setSuccessMessage("");
  };

  return (
    <div className="p-4 md:p-6 min-h-screen overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 text-center mb-6">
              Platform Features
            </h2>

            <div className="space-y-5">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#669917] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bell size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {feature.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFeature(feature.id)}
                    className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                      feature.enabled ? "bg-[#669917]" : "bg-[#A2ACB3]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        feature.enabled ? "translate-x-0.5" : "-translate-x-5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 text-center mb-6">
              Operational Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Default Delivery Fee (₦)
                </label>
                <input
                  type="number"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Order Accept Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={orderTimeout}
                  onChange={(e) => setOrderTimeout(e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            <div className="space-y-3 mt-6">
              {isEditing ? (
                <button
                  onClick={handleSaveSettings}
                  className="w-full px-6 py-3 bg-[#669917] text-white rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={handleSaveSettings}
                  className="w-full px-6 py-3 bg-[#669917] text-white rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              )}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit">
          <h2 className="text-lg font-bold text-gray-900 text-center mb-6">
            System Announcements
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Announcement Type
              </label>
              <div className="relative">
                <select
                  value={announcementType}
                  onChange={(e) => setAnnouncementType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="Role- Specific">Role- Specific</option>
                  <option value="General">General</option>
                  <option value="Urgent">Urgent</option>
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Target Audience
              </label>
              <div className="relative">
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="All Users">All Users</option>
                  <option value="Vendors">Vendors</option>
                  <option value="Students">Students</option>
                  <option value="Delivery Partners">Delivery Partners</option>
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Priority
              </label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter Message"
                rows={6}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          <button
            onClick={handleSendAnnouncement}
            className="w-full px-6 py-3 bg-[#669917] text-white rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer mt-6"
          >
            Send Announcement
          </button>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title={successMessage}
      />
    </div>
  );
}
