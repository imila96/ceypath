import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown, User, Briefcase } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { Currency } from '../../utils/formatters';

const NAV_LINKS = [
  { to: '/packages', label: 'Packages' },
  { to: '/customize', label: 'Customize' },
  { to: '/vehicles', label: 'Vehicles' },
  { to: '/hotels', label: 'Hotels' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

function navLinkActive(path: string, pathname: string): boolean {
  if (path === '/') return pathname === '/';
  return pathname === path || pathname.startsWith(`${path}/`);
}

const CURRENCIES: Currency[] = ['USD', 'EUR', 'LKR'];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [toast, setToast] = useState('');
  const { currency, setCurrency } = useCurrency();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white shadow-md' : 'bg-white shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <span className="text-2xl font-black text-[#003580]">Lanka<span className="text-[#E32636]">Trips</span></span>
              <span className="text-lg">🌿</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                    navLinkActive(link.to, location.pathname)
                      ? 'text-[#003580] bg-blue-50'
                      : 'text-gray-700 hover:text-[#003580] hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Side Controls */}
            <div className="hidden md:flex items-center gap-2">
              {/* Currency Selector */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded border border-gray-200">
                  <Globe size={14} />
                  <span>{currency}</span>
                  <ChevronDown size={12} />
                </button>
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[100px]">
                  {CURRENCIES.map(c => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${currency === c ? 'text-[#003580] font-semibold' : 'text-gray-700'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded border border-gray-200">
                <span>🇬🇧</span>
                <span>EN</span>
              </button>

              {/* Sign In */}
              <button
                onClick={() => showToast('Sign in coming soon — we\'re launching accounts in Phase 2!')}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded border border-gray-200"
              >
                <User size={14} />
                <span>Sign In</span>
              </button>

              {/* List Your Service */}
              <button
                onClick={() => showToast('Partner portal coming soon!')}
                className="flex items-center gap-1 px-4 py-2 bg-[#003580] text-white text-sm font-semibold rounded hover:bg-[#002560] transition-colors"
              >
                <Briefcase size={14} />
                <span>List Your Service</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-3 py-2.5 text-sm font-medium rounded transition-colors ${
                    navLinkActive(link.to, location.pathname)
                      ? 'text-[#003580] bg-blue-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-100 flex gap-2">
                {CURRENCIES.map(c => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-3 py-1.5 text-xs font-medium rounded border ${currency === c ? 'bg-[#003580] text-white border-[#003580]' : 'border-gray-200 text-gray-700'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <button
                onClick={() => showToast('Sign in coming soon!')}
                className="w-full mt-2 py-2.5 bg-[#003580] text-white text-sm font-semibold rounded"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-lg shadow-xl animate-fade-in">
          {toast}
        </div>
      )}
    </>
  );
}
