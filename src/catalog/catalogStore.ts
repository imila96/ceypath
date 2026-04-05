import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { packages as packagesSeed } from '../data/packages';
import { destinations as destinationsSeed } from '../data/destinations';
import { vehicles as vehiclesSeed } from '../data/vehicles';
import { hotels as hotelsSeed } from '../data/hotels';
import { activities as activitiesSeed } from '../data/activities';
import { testimonials as testimonialsSeed } from '../data/testimonials';
import type { TourPackage } from '../data/packages';
import type { Destination } from '../data/destinations';
import type { Vehicle } from '../data/vehicles';
import type { Hotel } from '../data/hotels';
import type { Activity } from '../data/activities';
import type { Testimonial } from '../data/testimonials';

function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

export type CatalogSnapshot = {
  packages: TourPackage[];
  destinations: Destination[];
  vehicles: Vehicle[];
  hotels: Hotel[];
  activities: Activity[];
  testimonials: Testimonial[];
};

type CatalogActions = {
  setPackages: (packages: TourPackage[]) => void;
  upsertPackage: (pkg: TourPackage) => void;
  deletePackage: (id: string) => void;
  setDestinations: (destinations: Destination[]) => void;
  upsertDestination: (d: Destination) => void;
  deleteDestination: (id: string) => void;
  setVehicles: (vehicles: Vehicle[]) => void;
  upsertVehicle: (v: Vehicle) => void;
  deleteVehicle: (id: string) => void;
  setHotels: (hotels: Hotel[]) => void;
  upsertHotel: (h: Hotel) => void;
  deleteHotel: (id: string) => void;
  setActivities: (activities: Activity[]) => void;
  upsertActivity: (a: Activity) => void;
  deleteActivity: (id: string) => void;
  setTestimonials: (testimonials: Testimonial[]) => void;
  upsertTestimonial: (t: Testimonial) => void;
  deleteTestimonial: (id: string) => void;
  resetCatalogToSeed: () => void;
};

export type CatalogStore = CatalogSnapshot & CatalogActions;

const seed: CatalogSnapshot = {
  packages: clone(packagesSeed),
  destinations: clone(destinationsSeed),
  vehicles: clone(vehiclesSeed),
  hotels: clone(hotelsSeed),
  activities: clone(activitiesSeed),
  testimonials: clone(testimonialsSeed),
};

export const useCatalogStore = create<CatalogStore>()(
  persist(
    (set, _get) => ({
      ...seed,
      setPackages: packages => set({ packages }),
      upsertPackage: pkg =>
        set(state => {
          const i = state.packages.findIndex(p => p.id === pkg.id);
          if (i >= 0) {
            const next = [...state.packages];
            next[i] = pkg;
            return { packages: next };
          }
          return { packages: [...state.packages, pkg] };
        }),
      deletePackage: id => set(state => ({ packages: state.packages.filter(p => p.id !== id) })),

      setDestinations: destinations => set({ destinations }),
      upsertDestination: d =>
        set(state => {
          const i = state.destinations.findIndex(x => x.id === d.id);
          if (i >= 0) {
            const next = [...state.destinations];
            next[i] = d;
            return { destinations: next };
          }
          return { destinations: [...state.destinations, d] };
        }),
      deleteDestination: id => set(state => ({ destinations: state.destinations.filter(d => d.id !== id) })),

      setVehicles: vehicles => set({ vehicles }),
      upsertVehicle: v =>
        set(state => {
          const i = state.vehicles.findIndex(x => x.id === v.id);
          if (i >= 0) {
            const next = [...state.vehicles];
            next[i] = v;
            return { vehicles: next };
          }
          return { vehicles: [...state.vehicles, v] };
        }),
      deleteVehicle: id => set(state => ({ vehicles: state.vehicles.filter(v => v.id !== id) })),

      setHotels: hotels => set({ hotels }),
      upsertHotel: h =>
        set(state => {
          const i = state.hotels.findIndex(x => x.id === h.id);
          if (i >= 0) {
            const next = [...state.hotels];
            next[i] = h;
            return { hotels: next };
          }
          return { hotels: [...state.hotels, h] };
        }),
      deleteHotel: id => set(state => ({ hotels: state.hotels.filter(h => h.id !== id) })),

      setActivities: activities => set({ activities }),
      upsertActivity: a =>
        set(state => {
          const i = state.activities.findIndex(x => x.id === a.id);
          if (i >= 0) {
            const next = [...state.activities];
            next[i] = a;
            return { activities: next };
          }
          return { activities: [...state.activities, a] };
        }),
      deleteActivity: id => set(state => ({ activities: state.activities.filter(a => a.id !== id) })),

      setTestimonials: testimonials => set({ testimonials }),
      upsertTestimonial: t =>
        set(state => {
          const i = state.testimonials.findIndex(x => x.id === t.id);
          if (i >= 0) {
            const next = [...state.testimonials];
            next[i] = t;
            return { testimonials: next };
          }
          return { testimonials: [...state.testimonials, t] };
        }),
      deleteTestimonial: id => set(state => ({ testimonials: state.testimonials.filter(t => t.id !== id) })),

      resetCatalogToSeed: () =>
        set({
          packages: clone(seed.packages),
          destinations: clone(seed.destinations),
          vehicles: clone(seed.vehicles),
          hotels: clone(seed.hotels),
          activities: clone(seed.activities),
          testimonials: clone(seed.testimonials),
        }),
    }),
    { name: 'lankatrips-catalog-v1' }
  )
);

/** Sync read for repositories (outside React). */
export function getCatalogSnapshot(): CatalogSnapshot {
  return {
    packages: useCatalogStore.getState().packages,
    destinations: useCatalogStore.getState().destinations,
    vehicles: useCatalogStore.getState().vehicles,
    hotels: useCatalogStore.getState().hotels,
    activities: useCatalogStore.getState().activities,
    testimonials: useCatalogStore.getState().testimonials,
  };
}
