import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { FilterState } from '../../hooks/usePackageFilter';
import type { PackageType } from '../../repositories/packagesRepository';
import { formatCurrency } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';

interface Props {
  filters: FilterState;
  onToggleArray: (key: 'durations' | 'types' | 'hotelRatings' | 'meals' | 'activities', value: any) => void;
  onBudgetChange: (min: number, max: number) => void;
  onClear: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const DURATION_OPTIONS = [
  { value: '3-5', label: '3-5 Days' },
  { value: '6-8', label: '6-8 Days' },
  { value: '9-12', label: '9-12 Days' },
  { value: '13+', label: '13+ Days' },
];

const TYPE_OPTIONS: { value: PackageType; label: string }[] = [
  { value: 'budget', label: 'Budget' },
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' },
  { value: 'luxury', label: 'Luxury' },
];

const MEAL_OPTIONS = ['Breakfast', 'Half Board', 'Full Board', 'All Inclusive'];
const ACTIVITY_OPTIONS = ['Beach', 'Wildlife Safari', 'Cultural', 'Adventure', 'Wellness'];

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3"
      >
        <span className="font-semibold text-gray-800 text-sm">{title}</span>
        {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </button>
      {open && children}
    </div>
  );
}

export default function FilterSidebar({ filters, onToggleArray, onBudgetChange, onClear, isMobile, onClose }: Props) {
  const { currency } = useCurrency();
  const hasActiveFilters = filters.durations.length > 0 || filters.types.length > 0 || filters.hotelRatings.length > 0 || filters.meals.length > 0 || filters.activities.length > 0;

  return (
    <div className={`bg-white rounded-xl border border-gray-200 ${isMobile ? 'h-full overflow-y-auto' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-900">Filter Packages</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button onClick={onClear} className="text-xs text-[#E32636] font-medium hover:underline">
              Clear All
            </button>
          )}
          {isMobile && onClose && (
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Budget */}
        <FilterSection title="Budget (per person)">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>{formatCurrency(filters.budgetMin, currency)}</span>
              <span>{filters.budgetMax >= 5000 ? `${formatCurrency(5000, currency)}+` : formatCurrency(filters.budgetMax, currency)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={5000}
              step={50}
              value={filters.budgetMax}
              onChange={e => onBudgetChange(filters.budgetMin, Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#003580]"
            />
          </div>
        </FilterSection>

        {/* Duration */}
        <FilterSection title="Duration">
          <div className="space-y-2">
            {DURATION_OPTIONS.map(opt => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.durations.includes(opt.value)}
                  onChange={() => onToggleArray('durations', opt.value)}
                  className="w-4 h-4 rounded border-gray-300 text-[#003580] accent-[#003580]"
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Package Type */}
        <FilterSection title="Package Type">
          <div className="space-y-2">
            {TYPE_OPTIONS.map(opt => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.types.includes(opt.value)}
                  onChange={() => onToggleArray('types', opt.value)}
                  className="w-4 h-4 rounded border-gray-300 accent-[#003580]"
                />
                <span className="text-sm text-gray-700 capitalize">{opt.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Hotel Rating */}
        <FilterSection title="Hotel Rating">
          <div className="space-y-2">
            {[3, 4, 5].map(stars => (
              <label key={stars} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.hotelRatings.includes(stars)}
                  onChange={() => onToggleArray('hotelRatings', stars)}
                  className="w-4 h-4 rounded border-gray-300 accent-[#003580]"
                />
                <span className="text-sm text-gray-700">{'⭐'.repeat(stars)} {stars} Stars</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Meals */}
        <FilterSection title="Meals Included">
          <div className="space-y-2">
            {MEAL_OPTIONS.map(meal => (
              <label key={meal} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.meals.includes(meal)}
                  onChange={() => onToggleArray('meals', meal)}
                  className="w-4 h-4 rounded border-gray-300 accent-[#003580]"
                />
                <span className="text-sm text-gray-700">{meal}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Activities */}
        <FilterSection title="Activities">
          <div className="space-y-2">
            {ACTIVITY_OPTIONS.map(act => (
              <label key={act} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.activities.includes(act)}
                  onChange={() => onToggleArray('activities', act)}
                  className="w-4 h-4 rounded border-gray-300 accent-[#003580]"
                />
                <span className="text-sm text-gray-700">{act}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );
}
