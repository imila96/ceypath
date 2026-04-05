import React from 'react';
import SearchWidget from '../ui/SearchWidget';

export default function HeroSection() {
  return (
    <div className="relative min-h-[620px] flex items-center bg-gradient-to-br from-[#003580] via-[#1a5276] to-[#0d6e4e] overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#FFB700]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-[#E32636]/10 rounded-full blur-2xl" />
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Sri Lanka silhouette hint */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 bg-gradient-to-l from-green-400/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 w-full">
        <div className="max-w-3xl mb-10">
          {/* Trust indicator */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="text-[#FFB700] text-sm">⭐</span>
            <span className="text-white/90 text-sm font-medium">Trusted by 10,000+ travelers from 45 countries</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
            Discover Sri Lanka —<br />
            <span className="text-[#FFB700]">Tailored Just for You</span>
          </h1>
          <p className="text-white/80 text-lg sm:text-xl leading-relaxed max-w-2xl">
            Airport pickup → Luxury hotels → Hidden gems → Airport drop-off.
            <span className="text-white font-semibold"> One package, zero stress.</span>
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-6 mt-6 mb-8">
            {[
              { value: '500+', label: 'Verified Hotels' },
              { value: '12+', label: 'Curated Packages' },
              { value: '24/7', label: 'Local Support' },
              { value: '4.9★', label: 'Average Rating' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="text-2xl font-black text-[#FFB700]">{stat.value}</p>
                <p className="text-white/70 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search Widget */}
        <div className="max-w-5xl">
          <SearchWidget />
        </div>
      </div>
    </div>
  );
}
