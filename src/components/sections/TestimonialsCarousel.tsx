import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useCatalogStore } from '../../catalog/catalogStore';
import type { Testimonial } from '../../repositories/testimonialsRepository';

export default function TestimonialsCarousel() {
  const testimonials = useCatalogStore(s => s.testimonials);
  const [current, setCurrent] = useState(0);

  if (testimonials.length === 0) {
    return null;
  }

  const n = testimonials.length;
  const prev = () => setCurrent(i => (i - 1 + n) % n);
  const next = () => setCurrent(i => (i + 1) % n);

  const visible = [
    testimonials[current % n],
    testimonials[(current + 1) % n],
    testimonials[(current + 2) % n],
  ];

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">What Travelers Say</h2>
          <p className="text-gray-500">Real stories from real adventurers</p>
        </div>

        {/* Desktop: 3 columns */}
        <div className="hidden lg:grid grid-cols-3 gap-5 mb-6">
          {visible.map((t, i) => (
            <TestimonialCard key={`${t.id}-${i}`} testimonial={t} />
          ))}
        </div>

        {/* Mobile/Tablet: Single card */}
        <div className="lg:hidden mb-6">
          <TestimonialCard testimonial={testimonials[current]} />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prev}
            className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 shadow-sm transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-[#003580] w-6' : 'bg-gray-300'}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 shadow-sm transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
      {/* Stars */}
      <div className="flex gap-1 mb-3">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} size={14} fill="#FFB700" className="text-[#FFB700]" />
        ))}
      </div>

      {/* Text */}
      <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">"{testimonial.text}"</p>

      <div className="text-xs text-[#003580] font-medium mb-4 italic">
        — {testimonial.packageName}
      </div>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.avatarGradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
          {testimonial.initials}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
          <p className="text-xs text-gray-500">{testimonial.countryFlag} {testimonial.country} · {testimonial.date}</p>
        </div>
      </div>
    </div>
  );
}
