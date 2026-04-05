import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#003580] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-black">Lanka<span className="text-[#FFB700]">Trips</span></span>
              <span className="text-lg">🌿</span>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed mb-4">
              Sri Lanka's premier tour package specialist. We craft unforgettable journeys from airport pickup to departure, with zero stress for you.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-blue-200">
                <Phone size={14} className="text-[#FFB700] shrink-0" />
                <span>+94 11 234 5678</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-200">
                <Mail size={14} className="text-[#FFB700] shrink-0" />
                <span>hello@lankatrips.lk</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-200">
                <MapPin size={14} className="text-[#FFB700] shrink-0" />
                <span>32 Galle Road, Colombo 03, Sri Lanka</span>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <button key={i} className="w-8 h-8 bg-blue-700 rounded flex items-center justify-center hover:bg-[#FFB700] hover:text-[#003580] transition-colors">
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          {/* Popular Packages */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#FFB700] mb-4">Popular Packages</h3>
            <ul className="space-y-2">
              {[
                { label: 'Island Wonders — Heritage & Wildlife', to: '/packages/pkg-island-wonders' },
                { label: 'Classic Sri Lanka Explorer', to: '/packages/pkg-1' },
                { label: 'Luxury Grand Tour', to: '/packages/pkg-2' },
                { label: 'Beach & Culture Combo', to: '/packages/pkg-4' },
                { label: 'Honeymoon Special', to: '/packages/pkg-6' },
                { label: 'Family Fun Sri Lanka', to: '/packages/pkg-11' },
                { label: 'Budget Backpacker', to: '/packages/pkg-3' },
                { label: 'Tea Country & Wildlife', to: '/packages/pkg-7' },
              ].map(item => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm text-blue-200 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#FFB700] mb-4">Destinations</h3>
            <ul className="space-y-2">
              {[
                'Colombo', 'Kandy', 'Sigiriya', 'Galle',
                'Ella', 'Mirissa', 'Nuwara Eliya', 'Trincomalee',
              ].map(dest => (
                <li key={dest}>
                  <Link
                    to={`/destinations/${dest.toLowerCase().replace(' ', '-')}`}
                    className="text-sm text-blue-200 hover:text-white transition-colors"
                  >
                    {dest}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#FFB700] mb-4">Support</h3>
            <ul className="space-y-2 mb-6">
              {[
                { label: 'How It Works', to: '/' },
                { label: 'Booking FAQ', to: '/' },
                { label: 'Cancellation Policy', to: '/' },
                { label: 'Travel Insurance', to: '/' },
                { label: 'Visa Information', to: '/' },
                { label: 'Contact Us', to: '/contact' },
                { label: 'Partner With Us', to: '/' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-blue-200 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Payment Methods */}
            <div>
              <p className="text-xs text-blue-300 font-medium uppercase tracking-wider mb-2">Secure Payments</p>
              <div className="flex flex-wrap gap-2">
                {['VISA', 'MC', 'AMEX', 'PayPal'].map(p => (
                  <span key={p} className="px-2 py-1 bg-white/10 rounded text-xs font-bold text-white">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-blue-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-blue-300">
            © 2025 LankaTrips (Pvt) Ltd. All rights reserved. SLTDA License #TRV-2025-0042
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/" className="text-sm text-blue-300 hover:text-white">Privacy Policy</Link>
            <Link to="/" className="text-sm text-blue-300 hover:text-white">Terms of Service</Link>
            <Link to="/" className="text-sm text-blue-300 hover:text-white">Cookie Policy</Link>
            <Link to="/admin/login" className="text-sm text-blue-400/90 hover:text-[#FFB700]">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
