import React from 'react';

const FEATURES = [
  { icon: '✈️', title: 'Airport Transfers', description: 'Seamless pickup and drop-off at both Colombo and Mattala airports, 24/7.' },
  { icon: '🏨', title: 'Handpicked Hotels', description: '500+ verified hotels from budget guesthouses to 5-star resorts, all quality-checked.' },
  { icon: '🗺️', title: 'Expert Local Guides', description: 'English-speaking guides with deep cultural knowledge and heritage expertise.' },
  { icon: '🚗', title: 'Premium Fleet', description: 'Air-conditioned vehicles from sedans to luxury coaches, all with professional drivers.' },
  { icon: '📱', title: '24/7 Support', description: 'Our local team is reachable round-the-clock throughout your Sri Lanka journey.' },
  { icon: '💳', title: 'Secure Payment', description: 'Fully encrypted bookings. Pay only when you\'re completely satisfied with the itinerary.' },
];

export default function WhyChooseUs() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Why Choose LankaTrips?</h2>
          <p className="text-gray-500 max-w-xl mx-auto">We go beyond booking — we craft experiences that become memories for a lifetime.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div key={i} className="text-center p-5 rounded-xl hover:shadow-md transition-shadow border border-transparent hover:border-gray-100 group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 group-hover:bg-[#003580] transition-colors group-hover:scale-110 transform duration-200">
                <span>{f.icon}</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
