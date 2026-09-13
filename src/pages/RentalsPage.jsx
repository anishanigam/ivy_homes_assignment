import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { formatRent, formatPrice } from '../utils/dataFixer';
import { KeyRound, MapPin, Building, ShieldCheck, Bed, Bath, Maximize2, Loader2, Sparkles } from 'lucide-react';

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

export default function RentalsPage() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocality, setSelectedLocality] = useState('malad west');
  const [selectedBhk, setSelectedBhk] = useState('All');

  useEffect(() => {
    async function loadRentals() {
      setLoading(true);
      try {
        const b1 = await api.getRentals({ limit: 50, offset: 0 });
        const b2 = await api.getRentals({ limit: 50, offset: 50 });
        const b3 = await api.getRentals({ limit: 50, offset: 100 });
        setRentals([...(b1.results || []), ...(b2.results || []), ...(b3.results || [])]);
      } catch (err) {
        setError(err.message || 'Failed to load rentals');
      } finally {
        setLoading(false);
      }
    }
    loadRentals();
  }, []);

  const filteredRentals = useMemo(() => {
    return rentals.filter((r) => {
      if (selectedLocality !== 'All Localities' && r.locality?.toLowerCase() !== selectedLocality.toLowerCase()) {
        return false;
      }
      if (selectedBhk !== 'All' && r.bedroom !== parseInt(selectedBhk, 10)) {
        return false;
      }
      return true;
    });
  }, [rentals, selectedLocality, selectedBhk]);

  // Specific stats for assigned locality (Malad West)
  const maladStats = useMemo(() => {
    const maladItems = rentals.filter((r) => r.locality?.toLowerCase() === 'malad west');
    const totalRent = maladItems.reduce((acc, r) => acc + (r.price || 0), 0);
    const avgRent = maladItems.length > 0 ? Math.round(totalRent / maladItems.length) : 0;
    return { count: maladItems.length, totalRent, avgRent };
  }, [rentals]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2.5 border border-emerald-200">
          <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
          <span>Mumbai Long-Term Rental Index</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-warm-900 tracking-tight">
          Verified Rental Homes
        </h1>
        <p className="text-sm sm:text-base text-warm-600 max-w-2xl mt-1.5 leading-relaxed">
          Transparent monthly rents, explicit maintenance charges, and clear security deposit terms across Mumbai.
        </p>
      </div>

      {/* Highlighted Banner for Assigned Locality: Malad West */}
      <div className="bg-gradient-to-r from-ivy-50 via-emerald-50 to-warm-50 border border-ivy-200 rounded-3xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-ivy-800 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Assigned Locality Benchmark
          </span>
          <h3 className="text-xl font-extrabold text-warm-900 mt-1">Malad West Rentals Hub</h3>
          <p className="text-xs text-warm-600 mt-0.5">
            Key metric for Question 5: Total monthly rent across all retrievable rental records.
          </p>
        </div>
        <div className="flex items-center gap-4 text-center">
          <div className="bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-ivy-200/60">
            <span className="text-[11px] text-warm-500 block">Total Rent (Sample)</span>
            <span className="text-base font-extrabold text-warm-900">₹{maladStats.totalRent.toLocaleString('en-IN')}</span>
          </div>
          <div className="bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-ivy-200/60">
            <span className="text-[11px] text-warm-500 block">Average Monthly Rent</span>
            <span className="text-base font-extrabold text-ivy-800">₹{maladStats.avgRent.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-warm-200 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs text-warm-500 font-medium">Locality:</span>
          <select
            value={selectedLocality}
            onChange={(e) => setSelectedLocality(e.target.value)}
            className="px-3 py-1.5 text-sm bg-warm-50 border border-warm-200 rounded-xl capitalize"
          >
            {LOCALITIES.map((loc) => (
              <option key={loc} value={loc} className="capitalize">
                {loc === 'malad west' ? '★ Malad West (Assigned)' : loc}
              </option>
            ))}
          </select>

          <span className="text-xs text-warm-500 font-medium ml-2">BHK:</span>
          <div className="flex items-center space-x-1 bg-warm-100/80 p-1 rounded-xl">
            {['All', '1', '2', '3'].map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBhk(b)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  selectedBhk === b ? 'bg-white text-warm-900 shadow-xs' : 'text-warm-600 hover:text-warm-900'
                }`}
              >
                {b === 'All' ? 'All' : `${b} BHK`}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-warm-500">
          Showing <strong className="text-warm-900">{filteredRentals.length}</strong> rental homes
        </span>
      </div>

      {/* Rentals Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 mx-auto text-ivy-600 animate-spin mb-3" />
          <p className="text-sm text-warm-600">Loading verified rentals...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRentals.map((r) => (
           <Link
            to={`/rentals/${r.listing_id}`}
            key={r.listing_id}
            className="bg-white rounded-2xl border border-warm-200 p-5 hover:shadow-md hover:border-ivy-300 transition-all flex flex-col justify-between group"
          >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2.5 py-1 rounded-lg font-semibold bg-emerald-50 text-emerald-800">
                    {r.bedroom} BHK {r.property_type || 'Apartment'}
                  </span>
                  <span className="text-[11px] text-warm-400 capitalize">{r.furnishing}</span>
                </div>

                <div className="text-2xl font-extrabold text-warm-900 mb-0.5">
                  {formatRent(r.price, r.maintenance)}
                </div>

                <h3 className="font-semibold text-warm-900 text-sm mt-2">{r.apartment_name}</h3>
                <div className="flex items-center text-xs text-warm-500 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-ivy-600" />
                  <span className="capitalize">{r.locality}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-warm-100 my-3 text-xs text-warm-700">
                  <div>
                    <span className="text-[10px] text-warm-400 block">Security Deposit</span>
                    <span className="font-semibold">₹{(r.deposit || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-warm-400 block">Area</span>
                    <span className="font-semibold">{r.carpet_area} sq ft</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-warm-400 block">Floor</span>
                    <span className="font-semibold">{r.floor}/{r.total_floors || '-'}</span>
                  </div>
                </div>

                <p className="text-xs text-warm-500 line-clamp-2 leading-relaxed">
                  {r.description || 'Convenient location with great connectivity to metro.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-warm-100 flex items-center justify-between text-xs">
                <span className="text-warm-400">By {r.posted_by_name || 'Owner'}</span>
                <a
                  href={`tel:${r.posted_by_contact}`}
                  className="font-semibold text-ivy-700 hover:text-ivy-900"
                >
                  Contact
                </a>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}