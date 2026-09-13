import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { formatRent } from '../utils/dataFixer';
import { KeyRound, MapPin, Building, Bed, Bath, Maximize2, ArrowLeft, Loader2, User } from 'lucide-react';

export default function RentalDetailPage() {
  const { id } = useParams();
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadRental() {
      setLoading(true);
      try {
        const data = await api.getRental(id);
        setRental(data);
      } catch (err) {
        setError(err.message || 'Rental not found');
      } finally {
        setLoading(false);
      }
    }
    loadRental();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <Loader2 className="w-8 h-8 mx-auto text-ivy-600 animate-spin mb-3" />
        <p className="text-sm text-warm-600">Loading rental specifications...</p>
      </div>
    );
  }

  if (error || !rental) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-warm-900">Rental Not Found</h2>
        <p className="text-sm text-warm-500 mt-1 mb-4">{error}</p>
        <Link to="/rentals" className="inline-flex items-center px-4 py-2 bg-ivy-600 text-white rounded-xl text-sm font-semibold">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Rentals
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/rentals" className="inline-flex items-center text-xs text-warm-500 hover:text-warm-800 mb-6">
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Rentals
      </Link>

      <div className="bg-white rounded-3xl border border-warm-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-warm-100 gap-4">
          <div>
            <span className="text-xs px-2.5 py-1 rounded-lg font-semibold bg-emerald-100 text-emerald-800">
              {rental.bedroom} BHK Rental
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-warm-900 mt-2">{rental.apartment_name}</h1>
            <div className="flex items-center text-sm text-warm-500 mt-1">
              <MapPin className="w-4 h-4 mr-1 text-ivy-600" />
              <span className="capitalize">{rental.locality}, Mumbai</span>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-warm-900">
            {formatRent(rental.price, rental.maintenance)}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-warm-100 text-sm">
          <div className="bg-warm-50 p-3 rounded-2xl">
            <span className="text-xs text-warm-500 block">Security Deposit</span>
            <span className="font-bold text-warm-900">₹{(rental.deposit || 0).toLocaleString('en-IN')}</span>
          </div>
          <div className="bg-warm-50 p-3 rounded-2xl">
            <span className="text-xs text-warm-500 block">Carpet Area</span>
            <span className="font-bold text-warm-900">{rental.carpet_area} sq ft</span>
          </div>
          <div className="bg-warm-50 p-3 rounded-2xl">
            <span className="text-xs text-warm-500 block">Furnishing</span>
            <span className="font-bold text-warm-900 capitalize">{rental.furnishing || 'Semi-furnished'}</span>
          </div>
          <div className="bg-warm-50 p-3 rounded-2xl">
            <span className="text-xs text-warm-500 block">Floor</span>
            <span className="font-bold text-warm-900">{rental.floor} of {rental.total_floors}</span>
          </div>
        </div>

        <div className="pt-6">
          <h3 className="font-bold text-warm-900 text-sm mb-2">Description</h3>
          <p className="text-sm text-warm-600 leading-relaxed">{rental.description}</p>
        </div>
      </div>
    </main>
  );
}