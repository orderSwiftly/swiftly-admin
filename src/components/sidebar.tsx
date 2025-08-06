'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Package,
  ShoppingBag,
  Bell,
  Wallet2,
  Users,
  Settings,
  LayoutDashboard,
  Menu,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/dashboard/all-products', icon: Package },
  { label: 'Orders', href: '/dashboard/all-orders', icon: ShoppingBag },
  { label: 'Users', href: '/dashboard/all-users', icon: Users },
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { label: 'Transactions', href: '/dashboard/transactions', icon: Wallet2 },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block fixed top-0 left-0 h-screen z-40 ${
          open ? 'w-64' : 'w-20'
        } transition-all duration-300 bg-[var(--bg-clr)] text-[var(--txt-clr)] shadow-md sec-ff`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Header with Toggle and Logo */}
          <div className="flex items-center justify-between mb-6">
            <div className={`${open ? 'block' : 'hidden'}`}>
              <Link href='/'>
                <Image
                  src="/tredia-logo.png"
                  alt="Tredia Logo"
                  width={40}
                  height={40}
                  className="w-auto object-cover"
                />
              </Link>
            </div>
            <button
              onClick={() => setOpen(!open)}
              className="text-white/70 hover:text-white transition-colors"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Logo when collapsed */}
          {!open && (
            <div className="mb-6 flex justify-center">
              <Link href='/'>
                <Image
                  src="/tredia-logo.png"
                  alt="Tredia Logo"
                  width={32}
                  height={32}
                  className="w-auto object-cover"
                />
              </Link>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-200 hover:bg-white/10 ${
                    isActive ? 'bg-white/10 font-semibold' : ''
                  } ${!open ? 'justify-center' : ''}`}
                  title={!open ? label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {open && <span className="truncate">{label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Bottom Nav for Mobile */}
      <nav className="fixed md:hidden bottom-0 left-0 w-full bg-[var(--bg-clr)] text-[var(--txt-clr)] shadow-inner flex justify-around py-3 z-50">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center text-xs ${
                isActive ? 'text-[var(--acc-clr)]' : 'text-white/70'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}