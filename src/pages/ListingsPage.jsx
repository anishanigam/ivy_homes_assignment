import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';
import FilterBar from '../components/FilterBar';
import { isCorruptListing, isFakeListing, normalizeCarpetArea } from '../utils/dataFixer';
import { Building2, Sparkles, AlertCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 24;

  // Read filters directly from browser URL query parameters
  const filters = useMemo(() => ({
    query: searchParams.get('q') || '',
    locality: searchParams.get('locality') || '',
    bhk: searchParams.get('bhk') || '',
    furnishing: searchParams.get('furnishing') || '',
    priceRange: searchParams.get('priceRange') || '',
    sortBy: searchParams.get('sort_by') || 'recommended',
    order: searchParams.get('order') || 'asc',
    safeOnly: searchParams.get('safeOnly') !== 'false',
  }), [searchParams]);

  useEffect(() => {
    async function loadAllListings() {
      setLoading(true);
      setError(null);
      try {
        const queryParams = { limit: 50, offset: 0 };
        if (filters.locality) queryParams.locality = filters.locality;
        if (filters.bhk) queryParams.bhk = filters.bhk;

        const b1 = await api.getListings(queryParams);
        const b2 = await api.getListings({ ...queryParams, offset: 50 });
        const b3 = await api.getListings({ ...queryParams, offset: 100 });
        const combined = [
          ...(b1.results || []),
          ...(b2.results || []),
          ...(b3.results || []),
        ];
        setListings(combined);
      } catch (err) {
        console.error('Failed to load listings', err);
        setError(err.message || 'Could not connect to property server');
      } finally {
        setLoading(false);
      }
    }
    loadAllListings();
  }, [filters.locality, filters.bhk]);

  // Sync state changes directly to the browser URL
  const handleFilterChange = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!value || value === 'All' || value === 'All Localities') {
      nextParams.delete(key);
      if (key === 'sortBy') nextParams.delete('order');
    } else {
      if (key === 'query') nextParams.set('q', value);
      else if (key === 'sortBy') {
        if (value === 'price_asc') {
          nextParams.set('sort_by', 'price');
          nextParams.set('order', 'asc');
        } else if (value === 'price_desc') {
          nextParams.set('sort_by', 'price');
          nextParams.set('order', 'desc');
        } else {
          nextParams.set('sort_by', value);
          nextParams.delete('order');
        }
      } else {
        nextParams.set(key, value);
      }
    }
    setSearchParams(nextParams);
    setPage(1);
  };

  const handleReset = () => {
    setSearchParams(new URLSearchParams());
    setPage(1);
  };

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      if (filters.safeOnly) {
        if (isCorruptListing(item)) return false;
        if (isFakeListing(item)) return false;
      }
      if (filters.query) {
        const q = filters.query.toLowerCase();
        const apt = (item.apartment_name || '').toLowerCase();
        const loc = (item.locality || '').toLowerCase();
        const desc = (item.description || '').toLowerCase();
        if (!apt.includes(q) && !loc.includes(q) && !desc.includes(q)) return false;
      }
      if (filters.locality && item.locality?.toLowerCase() !== filters.locality.toLowerCase()) {
        return false;
      }
      if (filters.bhk) {
        if (filters.bhk === '4+') {
          if (item.bedroom < 4) return false;
        } else if (item.bedroom !== parseInt(filters.bhk, 10)) {
          return false;
        }
      }
      if (filters.furnishing && item.furnishing?.toLowerCase() !== filters.furnishing.toLowerCase()) {
        return false;
      }
      if (filters.priceRange) {
        const p = item.price || 0;
        if (filters.priceRange === 'under_1cr' && p >= 10000000) return false;
        if (filters.priceRange === '1cr_2cr' && (p < 10000000 || p > 20000000)) return false;
        if (filters.priceRange === '2cr_4cr' && (p < 20000000 || p > 40000000)) return false;
        if (filters.priceRange === 'above_4cr' && p <= 40000000) return false;
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price') {
        return filters.order === 'desc' ? (b.price || 0) - (a.price || 0) : (a.price || 0) - (b.price || 0);
      }
      if (filters.sortBy === 'area_desc') {
        const areaA = normalizeCarpetArea(a).area;
        const areaB = normalizeCarpetArea(b).area;
        return areaB - areaA;
      }
      if (filters.sortBy === 'newest') {
        return new Date(b.posted_at || 0) - new Date(a.posted_at || 0);
      }
      return 0;
    });
  }, [listings, filters]);

  const totalPages = Math.ceil(filteredListings.length / pageSize) || 1;
  const paginatedListings = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredListings.slice(start, start + pageSize);
  }, [filteredListings, page, pageSize]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivy-50 text-ivy-800 text-xs font-semibold mb-2.5 border border-ivy-200">
          <Sparkles className="w-3.5 h-3.5 text-ivy-600" />
          <span>Mumbai Curated Residential Collection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-warm-900 tracking-tight">
          Find your next home with verified honesty
        </h1>
        <p className="text-sm sm:text-base text-warm-600 max-w-3xl mt-1.5 leading-relaxed">
          Every apartment verified against building floor plans and true market prices. Automatic normalization of area units and built-in protection against enquiry-bait traps.
        </p>
      </div>

      <FilterBar
        filters={{
          query: filters.query,
          locality: filters.locality,
          bhk: filters.bhk,
          furnishing: filters.furnishing,
          priceRange: filters.priceRange,
          sortBy: filters.sortBy === 'price' ? `price_${filters.order}` : filters.sortBy,
          safeOnly: filters.safeOnly,
        }}
        onChange={handleFilterChange}
        onReset={handleReset}
        totalResults={listings.length}
        filteredCount={filteredListings.length}
      />

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-3 my-6">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <div className="text-sm">
            <strong className="font-semibold">Unable to fetch live listings:</strong> {error}
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 mx-auto text-ivy-600 animate-spin mb-3" />
          <p className="text-sm font-medium text-warm-600">Connecting to Ivy Homes Mumbai property node...</p>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-warm-200 p-8 my-4">
          <Building2 className="w-12 h-12 mx-auto text-warm-300 mb-3" />
          <h3 className="text-lg font-semibold text-warm-900">No matching homes found</h3>
          <p className="text-sm text-warm-500 max-w-md mx-auto mt-1">
            Try loosening your budget, switching locality, or turning off the Trust Shield to view unfiltered records.
          </p>
          <button
            onClick={handleReset}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-ivy-600 text-white hover:bg-ivy-700"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedListings.map((listing) => (
              <PropertyCard key={listing.listing_id} listing={listing} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-between border-t border-warm-200 pt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-4 py-2 rounded-xl border border-warm-200 text-sm font-medium text-warm-700 hover:bg-warm-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <span className="text-xs font-medium text-warm-500">
                Page <strong className="text-warm-900">{page}</strong> of <strong className="text-warm-900">{totalPages}</strong>
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-4 py-2 rounded-xl border border-warm-200 text-sm font-medium text-warm-700 hover:bg-warm-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}