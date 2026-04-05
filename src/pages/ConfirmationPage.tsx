import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { generateBookingRef, formatCurrency } from '../utils/formatters';
import { useCurrency } from '../context/CurrencyContext';
import { getCatalogSnapshot } from '../catalog/catalogStore';
import { downloadCustomItinerary, downloadPackageItinerary } from '../utils/itineraryDocument';
import type { CustomizerState } from '../utils/priceCalculator';
import type { TourPackage } from '../data/packages';
import { CheckCircle, Download, ArrowLeft, Mail, Calendar, Users, Package } from 'lucide-react';

const WHAT_NEXT_STEPS = [
  {
    step: 1,
    title: 'Confirmation Email',
    description: 'You\'ll receive a detailed confirmation email with your itinerary within 15 minutes.',
    icon: '📧',
    timeframe: 'Within 15 minutes',
  },
  {
    step: 2,
    title: 'Our Team Reviews',
    description: 'Our local Sri Lanka team personally reviews your itinerary to ensure everything is perfect.',
    icon: '👀',
    timeframe: 'Within 4 hours',
  },
  {
    step: 3,
    title: 'Payment Link Sent',
    description: 'We\'ll send you a secure payment link to confirm your booking. No payment card needed now.',
    icon: '💳',
    timeframe: 'Within 24 hours',
  },
  {
    step: 4,
    title: 'Final Reconfirmation',
    description: 'Once payment is received, you\'ll get your full travel documents and WhatsApp contact for your driver.',
    icon: '✅',
    timeframe: 'Upon payment',
  },
];

type ConfirmationLocationState = {
  pkg?: TourPackage;
  adults?: number;
  children?: number;
  breakdown?: { total: number };
  isCustom?: boolean;
  state?: CustomizerState;
};

export default function ConfirmationPage() {
  const location = useLocation();
  const { currency } = useCurrency();
  const [bookingRef] = useState(() => generateBookingRef());
  const [toast, setToast] = useState('');
  const [animateCheck, setAnimateCheck] = useState(false);
  const { pkg, adults, children, breakdown, isCustom, state: customizerState } =
    (location.state || {}) as ConfirmationLocationState;

  useEffect(() => {
    const t = setTimeout(() => setAnimateCheck(true), 100);
    return () => clearTimeout(t);
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  }

  async function handleDownloadItinerary() {
    const snap = getCatalogSnapshot();
    if (pkg && typeof pkg === 'object' && 'itinerary' in pkg) {
      showToast('Preparing your PDF…');
      const fmt = await downloadPackageItinerary({
        pkg,
        bookingRef,
        adults: adults ?? 2,
        children: children ?? 0,
        currency,
        estimatedTotal: breakdown?.total,
      });
      showToast(
        fmt === 'pdf'
          ? 'PDF downloaded — check your Downloads folder.'
          : 'PDF could not be created — we saved an HTML file you can open or print to PDF instead.'
      );
      return;
    }
    if (isCustom) {
      const state: CustomizerState =
        customizerState ?? {
          arrivalAirport: 'CMB',
          arrivalDate: '',
          departureDate: '',
          adults: adults ?? 2,
          children: children ?? 0,
          destinations: [],
          vehicleId: 'v3',
          selectedActivityIds: [],
          specialRequirements: '',
        };
      showToast('Preparing your PDF…');
      const fmt = await downloadCustomItinerary({
        state,
        snapshot: snap,
        bookingRef,
        currency,
        estimatedTotal: breakdown?.total,
      });
      showToast(
        fmt === 'pdf'
          ? 'PDF downloaded — check your Downloads folder.'
          : 'PDF could not be created — we saved an HTML file you can open or print to PDF instead.'
      );
      return;
    }
    showToast('No itinerary data for this confirmation — browse a package and try again.');
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-10">
      <div className="max-w-3xl mx-auto px-4">
        {/* Success Card */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          {/* Green Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-10 text-center">
            {/* Animated Checkmark */}
            <div className={`w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-700 ${animateCheck ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
              <CheckCircle size={44} className="text-green-500" />
            </div>
            <h1 className="text-2xl font-black text-white mb-1">
              {isCustom ? 'Quote Request Received!' : 'Booking Request Sent!'}
            </h1>
            <p className="text-green-100 text-base">
              {isCustom
                ? 'We\'ll prepare your custom Sri Lanka tour quote and send it shortly.'
                : 'Great choice! Your package request is with our team.'
              }
            </p>
          </div>

          {/* Booking Reference */}
          <div className="bg-green-50 border-b border-green-100 px-6 py-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Your Booking Reference</p>
            <p className="text-3xl font-black text-[#003580] tracking-widest">{bookingRef}</p>
            <p className="text-xs text-gray-500 mt-1">Save this number — you'll need it to track your booking</p>
          </div>

          <div className="p-6">
            {/* Booking Summary */}
            {(pkg || isCustom) && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  {pkg && (
                    <div className="flex items-center gap-2">
                      <Package size={14} className="text-[#003580] shrink-0" />
                      <span className="text-gray-600">Package:</span>
                      <span className="font-semibold text-gray-800">{pkg.name}</span>
                    </div>
                  )}
                  {isCustom && !pkg && (
                    <div className="flex items-center gap-2">
                      <Package size={14} className="text-[#003580] shrink-0" />
                      <span className="text-gray-600">Type:</span>
                      <span className="font-semibold text-gray-800">Custom Sri Lanka Tour</span>
                    </div>
                  )}
                  {(adults || children) && (
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-[#003580] shrink-0" />
                      <span className="text-gray-600">Travelers:</span>
                      <span className="font-semibold text-gray-800">
                        {adults || 2} adults{(children ?? 0) > 0 ? `, ${children} children` : ''}
                      </span>
                    </div>
                  )}
                  {breakdown && (
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-200 mt-2">
                      <span className="text-gray-600">Estimated Total:</span>
                      <span className="font-black text-lg text-[#003580]">
                        {formatCurrency(breakdown.total, currency)}
                      </span>
                      <span className="text-xs text-gray-500">(taxes included)</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* What Happens Next Timeline */}
            <h3 className="font-bold text-gray-900 text-lg mb-4">What Happens Next?</h3>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-200" />

              <div className="space-y-4">
                {WHAT_NEXT_STEPS.map((step, i) => (
                  <div key={step.step} className="flex gap-4 relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 text-lg
                      ${i === 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
                      {step.icon}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h4 className="font-semibold text-gray-900 text-sm">{step.title}</h4>
                        <span className="text-xs bg-blue-50 text-[#003580] px-2 py-0.5 rounded font-medium">
                          {step.timeframe}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handleDownloadItinerary}
                className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-[#003580] text-[#003580] font-semibold rounded-xl hover:bg-blue-50 transition-colors"
              >
                <Download size={16} />
                Download PDF itinerary
              </button>
              <Link
                to="/"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#003580] text-white font-semibold rounded-xl hover:bg-[#002560] transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Home
              </Link>
              <Link
                to="/packages"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#E32636] text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
              >
                Browse More Packages
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-5 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-start gap-3">
            <Mail size={20} className="text-[#003580] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Need Help?</h4>
              <p className="text-sm text-gray-600">
                Contact us at <span className="text-[#003580] font-medium">hello@lankatrips.lk</span> or
                WhatsApp us at <span className="text-[#003580] font-medium">+94 77 123 4567</span>.
                Our team is available 24/7 to assist you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-lg shadow-xl animate-fade-in max-w-sm text-center">
          {toast}
        </div>
      )}
    </div>
  );
}
