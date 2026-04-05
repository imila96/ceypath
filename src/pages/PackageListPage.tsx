import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Map, ChevronDown, X } from 'lucide-react';
import PackageListCard from '../components/ui/PackageListCard';
import FilterSidebar from '../components/ui/FilterSidebar';
import Breadcrumb from '../components/ui/Breadcrumb';
import { usePackageFilter, type SortOption } from '../hooks/usePackageFilter';
import { usePackages } from '../hooks/usePackages';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'duration', label: 'Duration' },
  { value: 'rating', label: 'Top Rated' },
];

export default function PackageListPage() {
  const [searchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [toast, setToast] = useState('');

  const { data: packages = [], isLoading, isError, error, refetch } = usePackages();
  const { filters, filtered, sort, setSort, updateFilter, toggleArrayFilter, clearFilters } = usePackageFilter(packages);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  const typeFromSearch = searchParams.get('type');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#003580] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading packages…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center py-24 px-4">
        <div className="text-center max-w-md">
          <p className="text-red-600 font-semibold mb-2">Could not load packages</p>
          <p className="text-gray-600 text-sm mb-4">{error instanceof Error ? error.message : 'Unknown error'}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 bg-[#003580] text-white rounded-lg font-semibold text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Packages' }]} />
        </div>

        <div className="flex gap-6">
          {/* Sidebar — Desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-20">
              <FilterSidebar
                filters={filters}
                onToggleArray={toggleArrayFilter}
                onBudgetChange={(min, max) => {
                  updateFilter('budgetMin', min);
                  updateFilter('budgetMax', max);
                }}
                onClear={clearFilters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="font-bold text-gray-900 text-lg">
                  <span className="text-[#003580]">{filtered.length}</span> Sri Lanka Packages Found
                </h1>
                {typeFromSearch && (
                  <p className="text-sm text-gray-500">Showing {typeFromSearch} packages</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  <SlidersHorizontal size={15} />
                  Filters
                </button>

                {/* Map Toggle */}
                <button
                  onClick={() => showToast('Interactive map coming in Phase 2 🗺️')}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  <Map size={15} />
                  <span className="hidden sm:inline">Show on Map</span>
                </button>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value as SortOption)}
                    className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#003580] cursor-pointer"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Package List */}
            <div className="space-y-4">
              {filtered.length > 0 ? (
                filtered.map(pkg => <PackageListCard key={pkg.id} pkg={pkg} />)
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <p className="text-4xl mb-4">🔍</p>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">No packages match your filters</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your budget or other filters</p>
                  <button onClick={clearFilters} className="px-4 py-2 bg-[#003580] text-white rounded-lg font-semibold text-sm">
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filtered.length > 0 && (
              <div className="flex items-center justify-center gap-1 mt-8">
                {[1, 2, 3].map(p => (
                  <button
                    key={p}
                    className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors
                      ${p === 1 ? 'bg-[#003580] text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-[#003580]'}`}
                  >
                    {p}
                  </button>
                ))}
                <span className="text-gray-400 px-1">...</span>
                <button className="w-9 h-9 rounded-lg text-sm font-semibold bg-white border border-gray-200 text-gray-700 hover:border-[#003580]">
                  8
                </button>
                <button className="px-4 h-9 rounded-lg text-sm font-semibold bg-white border border-gray-200 text-gray-700 hover:border-[#003580]">
                  Next →
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white">
            <FilterSidebar
              filters={filters}
              onToggleArray={toggleArrayFilter}
              onBudgetChange={(min, max) => {
                updateFilter('budgetMin', min);
                updateFilter('budgetMax', max);
              }}
              onClear={clearFilters}
              isMobile
              onClose={() => setShowMobileFilters(false)}
            />
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-lg shadow-xl animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
