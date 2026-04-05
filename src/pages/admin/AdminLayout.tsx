import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  MapPin,
  Truck,
  ImageIcon,
  LogOut,
  Menu,
  ExternalLink,
  Building2,
  Sparkles,
  MessageSquareQuote,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const NAV = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/packages', label: 'Packages', icon: Package },
  { to: '/admin/destinations', label: 'Destinations', icon: MapPin },
  { to: '/admin/vehicles', label: 'Vehicles', icon: Truck },
  { to: '/admin/hotels', label: 'Hotels', icon: Building2 },
  { to: '/admin/activities', label: 'Activities', icon: Sparkles },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { to: '/admin/media', label: 'Images & media', icon: ImageIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAdminAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar — desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0f2744] text-white transform transition-transform duration-200 lg:translate-x-0 lg:static lg:flex-shrink-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full border-r border-white/10">
          <div className="p-4 border-b border-white/10">
            <Link to="/admin" className="flex items-center gap-2">
              <span className="text-xl font-black">
                Lanka<span className="text-[#FFB700]">Trips</span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-300 bg-white/10 px-2 py-0.5 rounded">
                Admin
              </span>
            </Link>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {NAV.map(({ to, end, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-[#003580] text-white' : 'text-blue-200 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon size={18} className="shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="p-3 border-t border-white/10 space-y-2">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 text-sm text-blue-200 hover:text-white rounded-lg hover:bg-white/10"
            >
              <ExternalLink size={16} />
              View public site
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-200 hover:bg-red-900/40 rounded-lg"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {open && (
        <button
          type="button"
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            className="lg:hidden inline-flex items-center gap-2 px-2 py-2 rounded-lg text-gray-800 hover:bg-gray-100 -ml-1 font-medium text-sm"
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
            <span>Menu</span>
          </button>
          <h1 className="text-lg font-bold text-gray-900 truncate flex-1 lg:flex-none">Administration</h1>
          <div className="w-[4.5rem] lg:hidden shrink-0" aria-hidden />
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950 shadow-sm">
            <p className="font-semibold text-emerald-900 mb-1">Local catalog editor</p>
            <p className="text-emerald-900/90">
              Use <strong>Add</strong>, <strong>Edit</strong> (forms with labels), and <strong>Delete</strong>. Each
              editor has a <strong>Raw JSON</strong> switch if you need full control. Data persists in this browser via{' '}
              <code className="bg-white/70 px-1 rounded text-xs">localStorage</code>. Package images: form fields for
              cover &amp; gallery, or JSON.
            </p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
