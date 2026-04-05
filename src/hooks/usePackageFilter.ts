import { useState, useMemo } from 'react';
import type { TourPackage, PackageType } from '../repositories/packagesRepository';

export interface FilterState {
  budgetMin: number;
  budgetMax: number;
  durations: string[];
  types: PackageType[];
  hotelRatings: number[];
  meals: string[];
  activities: string[];
}

export type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'duration' | 'rating';

const DEFAULT_FILTERS: FilterState = {
  budgetMin: 0,
  budgetMax: 5000,
  durations: [],
  types: [],
  hotelRatings: [],
  meals: [],
  activities: [],
};

function matchesDuration(pkg: TourPackage, durations: string[]): boolean {
  if (durations.length === 0) return true;
  for (const d of durations) {
    if (d === '3-5' && pkg.days >= 3 && pkg.days <= 5) return true;
    if (d === '6-8' && pkg.days >= 6 && pkg.days <= 8) return true;
    if (d === '9-12' && pkg.days >= 9 && pkg.days <= 12) return true;
    if (d === '13+' && pkg.days >= 13) return true;
  }
  return false;
}

export function usePackageFilter(packages: TourPackage[], initialSearch?: Partial<FilterState>) {
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTERS, ...initialSearch });
  const [sort, setSort] = useState<SortOption>('recommended');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let result = packages.filter(pkg => {
      if (pkg.price < filters.budgetMin || pkg.price > filters.budgetMax) return false;
      if (!matchesDuration(pkg, filters.durations)) return false;
      if (filters.types.length > 0 && !filters.types.includes(pkg.type)) return false;
      if (filters.hotelRatings.length > 0 && !filters.hotelRatings.includes(pkg.hotelRating)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !pkg.name.toLowerCase().includes(q) &&
          !pkg.destinations.some(d => d.toLowerCase().includes(q)) &&
          !pkg.shortDescription.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });

    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'duration': return a.days - b.days;
        case 'rating': return b.rating - a.rating;
        default: return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });

    return result;
  }, [packages, filters, sort, searchQuery]);

  function updateFilter(key: keyof FilterState, value: FilterState[keyof FilterState]) {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  function toggleArrayFilter<K extends 'durations' | 'types' | 'hotelRatings' | 'meals' | 'activities'>(
    key: K,
    value: FilterState[K][number]
  ) {
    setFilters(prev => {
      const arr = prev[key] as unknown[];
      const exists = arr.includes(value);
      return {
        ...prev,
        [key]: exists ? arr.filter(v => v !== value) : [...arr, value],
      };
    });
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery('');
  }

  return { filters, filtered, sort, setSort, updateFilter, toggleArrayFilter, clearFilters, searchQuery, setSearchQuery };
}
