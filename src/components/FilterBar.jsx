import React from 'react';
import { Search, Filter, Shield, ArrowUpDown, X } from 'lucide-react';

const LOCALITIES = [
  'All Localities',
  'malad west',
  'powai',
  'andheri west',
  'bandra east',
  'borivali west',
  'chembur',
  'goregaon east',
  'kandivali east',
  'mulund west',
  'thane west'
];

export default function FilterBar({
  filters,
  onChange,
  onReset,
  totalResults,
  filteredCount
}) {
  return (
    <div className="bg-white rounded-2xl border border-warm-200/90 shadow-sm p-4 sm:p-5 mb-8 space-y-4">
      {/* Top Search & Primary Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search input */}
        <div className="sm:col-span-4 relative">
          <Search className="w-4 h-4 text-warm-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search apartment, society, or landmark..."
            value={filters.query || ''}
            onChange={(e) => onChange('query', e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-warm-50/70 border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ivy-500/20 focus:border-ivy-500"
          />
        </div>

        {/* Locality dropdown */}
        <div className="sm:col-span-3">
          <select
            value={filters.locality || 'All Localities'}
            onChange={(e) => onChange('locality', e.target.value === 'All Localities' ? '' : e.target.value)}
            className="w-full px-3 py-2 text-sm bg-warm-50/70 border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ivy-500/20 focus:border-ivy-500 capitalize"
          >
            {LOCALITIES.map((loc) => (
              <option key={loc} value={loc} className="capitalize">
                {loc === 'malad west' ? '★ Malad West (Assigned)' : loc}
              </option>
            ))}
          </select>
        </div>

        {/* Bedroom Pills */}
        <div className="sm:col-span-3 flex items-center space-x-1 bg-warm-100/60 p-1 rounded-xl border border-warm-200/60">
          {['All', '1', '2', '3', '4+'].map((b) => {
            const isSelected = (!filters.bhk && b === 'All') || (filters.bhk === b);
            return (
              <button
                key={b}
                type="button"
                onClick={() => onChange('bhk', b === 'All' ? '' : b)}
                className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-all ${
                  isSelected
                    ? 'bg-white text-ivy-900 shadow-xs'
                    : 'text-warm-600 hover:text-warm-900'
                }`}
              >
                {b === 'All' ? 'All BHK' : `${b} BHK`}
              </button>
            );
          })}
        </div>

        {/* Sort selector */}
        <div className="sm:col-span-2">
          <select
            value={filters.sortBy || 'recommended'}
            onChange={(e) => onChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-warm-50/70 border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ivy-500/20 focus:border-ivy-500"
          >
            <option value="recommended">Recommended</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="area_desc">Carpet Area: Largest</option>
            <option value="newest">Newest Posted</option>
          </select>
        </div>
      </div>

      {/* Secondary Row: Furnishing & Safety Shield Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-warm-100 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Furnishing dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-warm-500 font-medium">Furnishing:</span>
            <select
              value={filters.furnishing || ''}
              onChange={(e) => onChange('furnishing', e.target.value)}
              className="px-2.5 py-1 bg-warm-50 border border-warm-200 rounded-lg text-xs font-medium"
            >
              <option value="">Any Furnishing</option>
              <option value="fully-furnished">Fully Furnished</option>
              <option value="semi-furnished">Semi Furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-warm-500 font-medium">Budget:</span>
            <select
              value={filters.priceRange || ''}
              onChange={(e) => onChange('priceRange', e.target.value)}
              className="px-2.5 py-1 bg-warm-50 border border-warm-200 rounded-lg text-xs font-medium"
            >
              <option value="">Any Budget</option>
              <option value="under_1cr">Under ₹1 Cr</option>
              <option value="1cr_2cr">₹1 Cr - ₹2 Cr</option>
              <option value="2cr_4cr">₹2 Cr - ₹4 Cr</option>
              <option value="above_4cr">Above ₹4 Cr</option>
            </select>
          </div>
        </div>

        {/* Safety Shield Switch (Filters Corrupt and Fake Listings) */}
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center cursor-pointer select-none bg-ivy-50/80 px-3 py-1.5 rounded-xl border border-ivy-200 text-ivy-900">
            <input
              type="checkbox"
              checked={filters.safeOnly !== false}
              onChange={(e) => onChange('safeOnly', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-7 h-4 bg-warm-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-warm-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-ivy-600 relative mr-2"></div>
            <Shield className="w-3.5 h-3.5 mr-1 text-ivy-700" />
            <span className="font-semibold text-xs">Trust Shield (Hide Fake & Corrupt)</span>
          </label>

          {(filters.locality || filters.bhk || filters.query || filters.furnishing || filters.priceRange) && (
            <button
              onClick={onReset}
              className="text-warm-500 hover:text-warm-800 font-medium flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-warm-100 transition-colors"
            >
              <X className="w-3 h-3" /> Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results counter message */}
      <div className="text-xs text-warm-500 flex items-center justify-between pt-1">
        <span>
          Showing <strong className="text-warm-800">{filteredCount}</strong> properties in Mumbai
          {filters.safeOnly !== false && (
            <span className="text-ivy-700 font-medium ml-1">
              (44 corrupt & 190 enquiry-bait listings filtered)
            </span>
          )}
        </span>
      </div>
    </div>
  );
}