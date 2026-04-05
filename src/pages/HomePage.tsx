import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/sections/HeroSection';
import TrustBar from '../components/sections/TrustBar';
import HighlightedTourSection from '../components/sections/HighlightedTourSection';
import FeaturedPackages from '../components/sections/FeaturedPackages';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import DestinationsGrid from '../components/sections/DestinationsGrid';
import TestimonialsCarousel from '../components/sections/TestimonialsCarousel';
import { Wand2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <TrustBar />
      <HighlightedTourSection />
      <FeaturedPackages />
      <WhyChooseUs />
      <DestinationsGrid />
      <TestimonialsCarousel />

      {/* Sticky CTA Banner */}
      <section className="py-14 bg-gradient-to-r from-[#003580] to-[#0d6e4e]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-[#FFB700] text-[#003580] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            Build Your Own
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3">
            Can't find the perfect package?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Build your own custom Sri Lanka tour — choose your destinations, hotels, vehicle, and activities. Get an instant live price.
          </p>
          <Link
            to="/customize"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#E32636] text-white font-bold text-lg rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-900/30 hover:scale-105 transform"
          >
            <Wand2 size={20} />
            Start Customizing →
          </Link>
        </div>
      </section>
    </div>
  );
}
