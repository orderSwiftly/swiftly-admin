"use client";

import {
  Home,
  Users,
  Building2,
  Store,
  Bike,
  Truck,
  DollarSign,
  Shield,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  {
    label: "User & Role Management",
    href: "/dashboard/all-users",
    icon: Users,
  },
  {
    label: "University & Campus Management",
    href: "/dashboard/universities",
    icon: Building2,
  },
  { label: "Vendor Management", href: "/dashboard/vendors", icon: Store },
  {
    label: "Delivery Partner Management",
    href: "/dashboard/delivery-partners",
    icon: Bike,
  },
  {
    label: "Order & Delivery Oversight",
    href: "/dashboard/orders",
    icon: Truck,
  },
  {
    label: "Financial & Pricing Controls",
    href: "/dashboard/financial",
    icon: DollarSign,
  },
  {
    label: "Security & Verification",
    href: "/dashboard/security",
    icon: Shield,
  },
  {
    label: "Platform Configuration",
    href: "/dashboard/configuration",
    icon: Settings,
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <>
      <div className="hidden md:flex w-64 bg-gray-50 flex-col h-screen fixed left-0 top-0 z-50 border-r border-gray-200 pry-ff">
        <div className="p-6">
          <div className="flex items-center justify-center">
            <Image
              src="/brand-logo.png"
              alt="Swiftly Logo"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                  isActive
                    ? "text-green-600 bg-green-50 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="leading-tight text-xs font-medium">
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="relative h-32 overflow-hidden">
          <svg
            viewBox="0 0 240 130"
            className="absolute bottom-0 left-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <path d="M0 130 L0 5000 L160 0 L440 70 L240 530 Z" fill="#D9D9D9" />
            <path d="M160 0 L240 60 L240 130 L180 130 Z" fill="#669917" />
          </svg>
        </div>

        <button className="flex items-center gap-3 px-7 py-4 text-gray-700 hover:bg-gray-100 transition-colors text-sm border-t border-gray-200">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-2 z-50">
        {navItems.slice(0, 4).map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center text-xs p-2 ${
                isActive
                  ? "text-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              title={label}
            >
              <Icon size={22} />
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Sidebar;
