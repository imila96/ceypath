import { getCatalogSnapshot } from '../catalog/catalogStore';
import { testimonials as testimonialsSeed } from '../data/testimonials';
import type { Testimonial } from '../data/testimonials';

export function getAllTestimonials(): Testimonial[] {
  return getCatalogSnapshot().testimonials;
}

export function getTestimonialsSeed(): Testimonial[] {
  return testimonialsSeed;
}

export type { Testimonial } from '../data/testimonials';
