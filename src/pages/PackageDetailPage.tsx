import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ChevronDown, ChevronUp, Check, X, Minus, Plus, Users, Eye, Download } from 'lucide-react';
import { usePackage } from '../hooks/usePackage';
import { usePackages } from '../hooks/usePackages';
import { useVehicles } from '../hooks/useVehicles';
import { useCatalogStore } from '../catalog/catalogStore';
import type { HotelTier } from '../repositories/hotelsRepository';
import Breadcrumb from '../components/ui/Breadcrumb';
import RatingBadge from '../components/ui/RatingBadge';
import VehicleCard from '../components/ui/VehicleCard';
import HotelTierSelector from '../components/ui/HotelTierSelector';
import PriceSummary from '../components/ui/PriceSummary';
import { calcPackageTotal } from '../utils/priceCalculator';
import { formatCurrency } from '../utils/formatters';
import { catalogHotelImageForName, findCatalogHotelByName } from '../utils/catalogHotel';
import { useCurrency } from '../context/CurrencyContext';
import { downloadPackageItinerary } from '../utils/itineraryDocument';

export default function PackageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currency } = useCurrency();
  const { package: pkg, isLoading: pkgLoading, isError: pkgError, error: pkgQueryError, refetch: refetchPkg } = usePackage(id);
  const { data: allPackages = [] } = usePackages();
  const { data: vehicles = [] } = useVehicles();
  const hotels = useCatalogStore(s => s.hotels);

  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedVehicleId, setSelectedVehicleId] = useState('v3');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [hotelTier, setHotelTier] = useState<HotelTier>('standard');
  const [selectedHotelId, setSelectedHotelId] = useState<string>('');
  const [openDays, setOpenDays] = useState<number[]>([1]);
  const [activeGallery, setActiveGallery] = useState(0);
  const [watchers, setWatchers] = useState(() => Math.floor(Math.random() * 11) + 2);
  const [toast, setToast] = useState('');
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setWatchers(Math.floor(Math.random() * 11) + 2);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setActiveGallery(0);
  }, [id]);

  useEffect(() => {
    if (!pkg) return;
    const def = vehicles.find(v => v.name === pkg.vehicle);
    if (def) setSelectedVehicleId(def.id);
  }, [pkg?.id, pkg?.vehicle, vehicles]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  if (pkgLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#003580] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading package…</p>
        </div>
      </div>
    );
  }

  if (pkgError) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center py-24 px-4">
        <div className="text-center max-w-md">
          <p className="text-red-600 font-semibold mb-2">Could not load package</p>
          <p className="text-gray-600 text-sm mb-4">{pkgQueryError instanceof Error ? pkgQueryError.message : 'Unknown error'}</p>
          <button
            type="button"
            onClick={() => refetchPkg()}
            className="px-4 py-2 bg-[#003580] text-white rounded-lg font-semibold text-sm mr-2"
          >
            Try again
          </button>
          <Link to="/packages" className="text-[#003580] font-semibold text-sm hover:underline">← Back to packages</Link>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="text-center">
          <p className="text-5xl mb-4">🔍</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Package not found</h2>
          <Link to="/packages" className="text-[#003580] font-semibold hover:underline">← Back to packages</Link>
        </div>
      </div>
    );
  }

  const defaultVehicle = vehicles.find(v => v.name === pkg.vehicle);
  const breakdown = calcPackageTotal(pkg, adults, children, selectedVehicleId, selectedAddOns, hotelTier, vehicles);
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

  type GallerySlide = { label: string; gradient: string; src?: string };
  const GALLERY_ITEMS: GallerySlide[] = pkg.galleryImages?.length
    ? pkg.galleryImages.slice(0, 5).map(g => ({ label: g.label, src: g.src, gradient: pkg.gradient }))
    : [
        { label: pkg.destinations[0] || 'Arrival', gradient: pkg.gradient },
        { label: pkg.destinations[1] || 'Explore', gradient: 'from-emerald-500 to-teal-700' },
        { label: pkg.destinations[2] || 'Culture', gradient: 'from-amber-500 to-orange-700' },
        { label: pkg.destinations[3] || 'Beach', gradient: 'from-sky-500 to-blue-700' },
        { label: 'Departure', gradient: 'from-rose-500 to-pink-700' },
      ];

  const destSlug = pkg.destinations[1]?.toLowerCase().replace(/\s+/g, '-') ?? 'sigiriya';
  const hotelTierDestination = hotels.some(h => h.destination === destSlug) ? destSlug : 'sigiriya';

  const relatedPackages = allPackages.filter(p => p.id !== pkg.id && p.type === pkg.type).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb crumbs={[
            { label: 'Home', to: '/' },
            { label: 'Packages', to: '/packages' },
            { label: pkg.name },
          ]} />
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-4 gap-2 mb-6 rounded-2xl overflow-hidden h-64 sm:h-80">
          <div
            className={`col-span-2 row-span-2 bg-gradient-to-br ${GALLERY_ITEMS[activeGallery].gradient} relative cursor-pointer`}
            onClick={() => {}}
          >
            {GALLERY_ITEMS[activeGallery].src ? (
              <img src={GALLERY_ITEMS[activeGallery].src} alt="" className="absolute inset-0 w-full h-full object-cover" />
            ) : null}
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-white font-bold text-lg drop-shadow-md">{GALLERY_ITEMS[activeGallery].label}</span>
            </div>
          </div>
          {GALLERY_ITEMS.slice(1, 5).map((item, i) => (
            <div
              key={i}
              onClick={() => setActiveGallery(i + 1)}
              className={`bg-gradient-to-br ${item.gradient} relative cursor-pointer hover:opacity-90 transition-opacity
                ${activeGallery === i + 1 ? 'ring-3 ring-white ring-inset' : ''}`}
            >
              {item.src ? (
                <img src={item.src} alt="" className="absolute inset-0 w-full h-full object-cover" />
              ) : null}
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-2 left-2 right-2">
                <span className="text-white text-xs font-medium drop-shadow">{item.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Package Header */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex flex-wrap items-start gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-1 rounded bg-[#E32636] text-white">{pkg.badge}</span>
                {pkg.spotsLeft && (
                  <span className="text-xs font-bold px-2 py-1 rounded bg-amber-100 text-amber-800 border border-amber-200">
                    Only {pkg.spotsLeft} spots left!
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-black text-gray-900 mb-2">
                {pkg.name} — {pkg.days} Days / {pkg.nights} Nights
              </h1>

              {/* Destination Chips */}
              <div className="flex flex-wrap gap-1 mb-3">
                {pkg.destinations.map((dest, i) => (
                  <React.Fragment key={dest}>
                    <Link
                      to={`/destinations/${dest.toLowerCase().replace(' ', '-')}`}
                      className="text-sm bg-blue-50 text-[#003580] px-3 py-1 rounded-full hover:bg-blue-100 font-medium"
                    >
                      {dest}
                    </Link>
                    {i < pkg.destinations.length - 1 && (
                      <span className="text-gray-300 self-center">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <RatingBadge rating={pkg.rating} reviewCount={pkg.reviewCount} isStarRating={true} />
                <span className="flex items-center gap-1.5 text-sm text-orange-600 font-medium animate-pulse">
                  <Eye size={14} />
                  {watchers} people looking at this right now
                </span>
              </div>
            </div>

            {/* Quick Highlights Bar */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex flex-wrap gap-2">
                {[
                  `${pkg.nights} nights`,
                  'Airport pickup ✓',
                  'Airport drop-off ✓',
                  'English guide',
                  'All transport',
                  'Breakfast included',
                  `${pkg.hotelRating}★ hotels`,
                  'Free cancellation',
                ].map((item, i) => (
                  <span key={i} className="text-xs bg-blue-50 text-[#003580] border border-blue-100 px-3 py-1.5 rounded-full font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Itinerary Accordion */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="font-bold text-gray-900 text-lg">Day-by-Day Itinerary</h2>
                <button
                  type="button"
                  disabled={downloadingPdf}
                  onClick={async () => {
                    setDownloadingPdf(true);
                    try {
                      const fmt = await downloadPackageItinerary({
                        pkg,
                        adults,
                        children,
                        currency,
                        estimatedTotal: breakdown.total,
                      });
                      setToast(
                        fmt === 'pdf'
                          ? 'PDF downloaded — check your Downloads folder.'
                          : 'PDF could not be created — we saved an HTML file instead.'
                      );
                      setTimeout(() => setToast(''), 5000);
                    } finally {
                      setDownloadingPdf(false);
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border border-[#003580] text-[#003580] rounded-lg hover:bg-blue-50 transition-colors shrink-0 disabled:opacity-60 disabled:cursor-wait"
                >
                  <Download size={16} aria-hidden />
                  {downloadingPdf ? 'Preparing PDF…' : 'Download PDF itinerary'}
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {pkg.itinerary.map(day => {
                  const hasSlot =
                    day.title ||
                    day.morning ||
                    day.afternoon ||
                    day.evening ||
                    (day.gallery && day.gallery.length > 0) ||
                    (day.hotelOptions && day.hotelOptions.length > 0) ||
                    !!day.hotel;
                  if (!hasSlot) return null;
                  const previewHotel = day.hotelOptions?.[0]?.name || day.hotel;
                  const previewHotelImg =
                    previewHotel &&
                    (day.hotelOptions?.[0]?.image ||
                      catalogHotelImageForName(hotels, previewHotel));
                  const legacyHotelCatalogImg = day.hotel
                    ? catalogHotelImageForName(hotels, day.hotel)
                    : undefined;
                  const isOpen = openDays.includes(day.day);
                  return (
                    <div key={day.day}>
                      <button
                        onClick={() => setOpenDays(prev =>
                          prev.includes(day.day) ? prev.filter(d => d !== day.day) : [...prev, day.day]
                        )}
                        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-full bg-[#003580] text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {day.day}
                        </div>
                        {previewHotelImg && !isOpen && (
                          <img
                            src={previewHotelImg}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-100 bg-gray-50"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-gray-900 text-sm">{day.title}</span>
                          {previewHotel && !isOpen && (
                            <span className="ml-2 text-xs text-gray-500">· {previewHotel}</span>
                          )}
                          {day.gallery && day.gallery.length > 0 && !isOpen && (
                            <span className="ml-2 text-xs text-[#003580]">· {day.gallery.length} photo{day.gallery.length > 1 ? 's' : ''}</span>
                          )}
                        </div>
                        {isOpen ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 ml-0 sm:ml-12 space-y-3">
                          {day.morning && (
                            <div className="flex gap-2">
                              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded shrink-0">Morning</span>
                              <p className="text-sm text-gray-600">{day.morning}</p>
                            </div>
                          )}
                          {day.afternoon && (
                            <div className="flex gap-2">
                              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded shrink-0">Afternoon</span>
                              <p className="text-sm text-gray-600">{day.afternoon}</p>
                            </div>
                          )}
                          {day.evening && (
                            <div className="flex gap-2">
                              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded shrink-0">Evening</span>
                              <p className="text-sm text-gray-600">{day.evening}</p>
                            </div>
                          )}

                          {day.gallery && day.gallery.length > 0 && (
                            <div className="pt-1">
                              <p className="text-xs font-semibold text-gray-500 mb-2">Photos</p>
                              <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                                {day.gallery.map((g, gi) => (
                                  <figure key={gi} className="shrink-0 w-[9.5rem]">
                                    <img
                                      src={g.src}
                                      alt={g.label || `Day ${day.day}`}
                                      className="w-full h-24 object-cover rounded-lg border border-gray-100 bg-gray-50"
                                    />
                                    {g.label && (
                                      <figcaption className="text-[10px] text-gray-500 mt-1 line-clamp-2">{g.label}</figcaption>
                                    )}
                                  </figure>
                                ))}
                              </div>
                            </div>
                          )}

                          {day.hotelOptions && day.hotelOptions.length > 0 ? (
                            <div className="pt-2 border-t border-gray-100 space-y-2">
                              <p className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                                <span aria-hidden>🏨</span> Where to stay
                              </p>
                              <div className="grid gap-2 sm:grid-cols-2">
                                {day.hotelOptions.map((ho, hi) => {
                                  const hoImg = ho.image || catalogHotelImageForName(hotels, ho.name);
                                  const catalogHo = findCatalogHotelByName(hotels, ho.name);
                                  const cardClass =
                                    'rounded-xl border border-gray-100 bg-gray-50/90 overflow-hidden flex flex-col sm:flex-row gap-0 transition-shadow';
                                  const cardInner = (
                                    <>
                                      {hoImg ? (
                                        <div className="sm:w-28 h-24 sm:h-auto shrink-0 bg-gray-200">
                                          <img src={hoImg} alt="" className="w-full h-full object-cover min-h-[6rem]" />
                                        </div>
                                      ) : (
                                        <div className="sm:w-20 shrink-0 bg-gradient-to-br from-[#003580]/15 to-emerald-700/10 min-h-[4rem]" />
                                      )}
                                      <div className="p-3 min-w-0 flex-1">
                                        <p className="font-semibold text-sm text-gray-900 group-hover:text-[#003580]">
                                          {ho.name}
                                        </p>
                                        {ho.summary && (
                                          <p className="text-xs text-gray-600 mt-1 leading-snug">{ho.summary}</p>
                                        )}
                                        {ho.pricePerNight != null && ho.pricePerNight > 0 && (
                                          <p className="text-xs font-bold text-[#003580] mt-2">
                                            from {formatCurrency(ho.pricePerNight, currency)}
                                            <span className="font-normal text-gray-500"> / night</span>
                                          </p>
                                        )}
                                        {catalogHo && (
                                          <p className="text-[10px] text-[#003580] font-semibold mt-2">View hotel →</p>
                                        )}
                                      </div>
                                    </>
                                  );
                                  return catalogHo ? (
                                    <Link
                                      key={hi}
                                      to={`/hotels/${catalogHo.id}`}
                                      className={`${cardClass} hover:border-[#003580]/40 hover:shadow-md group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003580]`}
                                    >
                                      {cardInner}
                                    </Link>
                                  ) : (
                                    <div key={hi} className={cardClass}>
                                      {cardInner}
                                    </div>
                                  );
                                })}
                              </div>
                              {(day.meals ?? []).length > 0 && (
                                <div className="flex items-center gap-1 text-xs text-gray-500 pt-1">
                                  <span>🍽️</span>
                                  <span>{(day.meals ?? []).join(', ')}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            day.hotel && (() => {
                              const legacyCatalog = findCatalogHotelByName(hotels, day.hotel);
                              const legacyBlock = (
                                <>
                                  {legacyHotelCatalogImg ? (
                                    <img
                                      src={legacyHotelCatalogImg}
                                      alt=""
                                      className="w-16 h-16 rounded-lg object-cover shrink-0 border border-gray-100 bg-gray-50"
                                    />
                                  ) : (
                                    <span className="text-xs mt-0.5">🏨</span>
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <span className="text-xs text-gray-500 font-medium group-hover:text-[#003580] group-hover:underline">
                                      {day.hotel}
                                    </span>
                                    {(day.meals ?? []).length > 0 && (
                                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                        <span>🍽️</span>
                                        <span>{(day.meals ?? []).join(', ')}</span>
                                      </div>
                                    )}
                                    {legacyCatalog && (
                                      <p className="text-[10px] text-[#003580] font-semibold mt-1">View hotel →</p>
                                    )}
                                  </div>
                                </>
                              );
                              return legacyCatalog ? (
                                <Link
                                  to={`/hotels/${legacyCatalog.id}`}
                                  className="flex items-start gap-3 mt-1 pt-2 border-t border-gray-100 group hover:bg-blue-50/50 -mx-1 px-1 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003580]"
                                >
                                  {legacyBlock}
                                </Link>
                              ) : (
                                <div className="flex items-start gap-3 mt-1 pt-2 border-t border-gray-100">
                                  {legacyBlock}
                                </div>
                              );
                            })()
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inclusions / Exclusions */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 text-lg mb-4">What's Included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-green-700 text-sm mb-2 flex items-center gap-1">
                    <Check size={14} /> Inclusions
                  </h3>
                  <ul className="space-y-1.5">
                    {pkg.inclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check size={12} className="text-green-500 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-red-600 text-sm mb-2 flex items-center gap-1">
                    <X size={14} /> Exclusions
                  </h3>
                  <ul className="space-y-1.5">
                    {pkg.exclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <X size={12} className="text-red-400 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Hotel Selection */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 text-lg mb-1">Choose Hotel Tier</h2>
              <p className="text-sm text-gray-500 mb-4">Upgrade your accommodation to match your style</p>
              <HotelTierSelector
                destination={hotelTierDestination}
                selectedTier={hotelTier}
                onSelectTier={setHotelTier}
                selectedHotelId={selectedHotelId}
                onSelectHotel={setSelectedHotelId}
              />
            </div>

            {/* Vehicle Selection */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 text-lg mb-1">Choose Your Vehicle</h2>
              <p className="text-sm text-gray-500 mb-4">All vehicles include professional driver & fuel</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {vehicles.slice(0, 4).map(v => (
                  <VehicleCard
                    key={v.id}
                    vehicle={v}
                    selected={selectedVehicleId === v.id}
                    priceModifierDiff={defaultVehicle ? Math.max(0, v.priceModifier - defaultVehicle.priceModifier) : v.priceModifier}
                    onSelect={setSelectedVehicleId}
                  />
                ))}
              </div>
            </div>

            {/* Add-on Activities */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 text-lg mb-1">Enhance Your Experience</h2>
              <p className="text-sm text-gray-500 mb-4">Optional add-ons to make your trip unforgettable</p>
              <div className="space-y-3">
                {pkg.addOns.map(ao => (
                  <div
                    key={ao.id}
                    onClick={() => {
                      if (ao.included) return;
                      setSelectedAddOns(prev =>
                        prev.includes(ao.id) ? prev.filter(id => id !== ao.id) : [...prev, ao.id]
                      );
                    }}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all
                      ${ao.included
                        ? 'border-green-200 bg-green-50 cursor-default'
                        : selectedAddOns.includes(ao.id)
                        ? 'border-[#003580] bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0
                        ${ao.included ? 'bg-green-500 border-green-500' : selectedAddOns.includes(ao.id) ? 'bg-[#003580] border-[#003580]' : 'border-gray-300'}`}>
                        {(ao.included || selectedAddOns.includes(ao.id)) && (
                          <Check size={10} className="text-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{ao.name}</span>
                    </div>
                    <span className={`text-sm font-bold shrink-0 ml-2 ${ao.included ? 'text-green-600' : 'text-gray-900'}`}>
                      {ao.included ? 'INCLUDED' : `+${formatCurrency(ao.pricePerPerson, currency)}/pp`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 text-lg">Guest Reviews</h2>
                <RatingBadge rating={pkg.rating} reviewCount={pkg.reviewCount} isStarRating={true} size="lg" />
              </div>

              {/* Rating Bars */}
              <div className="space-y-2 mb-6">
                {[5, 4, 3, 2, 1].map(stars => {
                  const pct = stars === 5 ? 68 : stars === 4 ? 22 : stars === 3 ? 7 : stars === 2 ? 2 : 1;
                  return (
                    <div key={stars} className="flex items-center gap-2 text-sm">
                      <span className="w-4 text-gray-600 shrink-0">{stars}</span>
                      <Star size={12} fill="#FFB700" className="text-[#FFB700] shrink-0" />
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#FFB700] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-right text-gray-500 text-xs">{pct}%</span>
                    </div>
                  );
                })}
              </div>

              {/* Review Cards */}
              <div className="space-y-4">
                {[
                  { name: 'Sarah M.', country: '🇬🇧', rating: 5, date: 'Feb 2025', text: 'Absolutely flawless organization. Every hotel was better than expected and the guide was incredibly knowledgeable. The Sigiriya sunrise was breathtaking!' },
                  { name: 'Klaus W.', country: '🇩🇪', rating: 5, date: 'Jan 2025', text: 'Perfect holiday from start to finish. The live price calculator made budgeting so transparent. Mercedes transfer from airport was a premium touch.' },
                  { name: 'Priya N.', country: '🇮🇳', rating: 5, date: 'Dec 2024', text: 'Traveled with family of 6. Child car seats arranged on request — so thoughtful! The cooking class in Galle was a highlight for the kids.' },
                ].map((r, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-[#003580] flex items-center justify-center text-white font-bold text-xs">
                          {r.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{r.name} {r.country}</p>
                          <p className="text-xs text-gray-500">{r.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(r.rating)].map((_, j) => (
                          <Star key={j} size={12} fill="#FFB700" className="text-[#FFB700]" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column — Sticky Booking Widget */}
          <div className="lg:w-80 shrink-0">
            <div className="sticky top-20 space-y-4">
              {/* Travelers */}
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="font-bold text-gray-900 mb-3">Travelers</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Adults', sub: 'Ages 13+', val: adults, set: setAdults, min: 1 },
                    { label: 'Children', sub: 'Ages 0-12', val: children, set: setChildren, min: 0 },
                  ].map(({ label, sub, val, set, min }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-gray-800">{label}</p>
                        <p className="text-xs text-gray-500">{sub}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => set(Math.max(min, val - 1))}
                          className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#003580] transition-colors">
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center font-bold text-sm">{val}</span>
                        <button onClick={() => set(val + 1)}
                          className="w-8 h-8 rounded-full border-2 border-[#003580] bg-[#003580] text-white flex items-center justify-center hover:bg-[#002560] transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <PriceSummary
                breakdown={breakdown}
                adults={adults}
                children={children}
                packageName={pkg.name}
                onReserve={() => navigate('/confirmation', { state: { pkg, adults, children, breakdown } })}
              />

              {/* Similar Packages */}
              {relatedPackages.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <h3 className="font-bold text-gray-900 text-sm mb-3">Similar Packages</h3>
                  <div className="space-y-3">
                    {relatedPackages.map(rp => (
                      <Link key={rp.id} to={`/packages/${rp.id}`} className="flex gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors">
                        <div className={`w-16 h-14 rounded-lg bg-gradient-to-br ${rp.gradient} shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 line-clamp-2">{rp.name}</p>
                          <p className="text-xs text-gray-500">{rp.days} days</p>
                          <p className="text-sm font-bold text-[#003580]">{formatCurrency(rp.price, currency)}<span className="text-xs font-normal text-gray-500">/pp</span></p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-lg shadow-xl animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
