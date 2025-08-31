'use client';

import {
  LayoutDashboard,
  Package,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from './sidebar-context';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/dashboard/all-products', icon: Package },
  { label: 'Users', href: '/dashboard/all-users', icon: Users },
  { label: 'Activities', href: '/dashboard/activities', icon: Clock },
];

const Sidebar = () => {
  const { collapsed, setCollapsed } = useSidebar();
  const pathname = usePathname();

  return (
    <div
      className={`
        ${collapsed ? 'w-16' : 'w-64'}
        transition-all duration-300 bg-gray-900 text-white flex flex-col h-screen fixed left-0 top-0
      `}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-2 hover:bg-gray-800 flex justify-center"
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* Nav links */}
      <nav className="flex-1 space-y-2 p-2 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 p-2 rounded-md transition-colors sec-ff ${
                isActive
                  ? 'bg-gray-800 text-[var(--acc-clr)]'
                  : 'hover:bg-gray-800 text-gray-300'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? label : undefined}
            >
              <Icon size={20} />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;