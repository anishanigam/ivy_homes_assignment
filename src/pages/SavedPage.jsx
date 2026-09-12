import React from 'react';
import { Link } from 'react-router-dom';
import { useSaved } from '../context/SavedContext';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import { formatPrice } from '../utils/dataFixer';
import { Heart, Building2, ArrowRight, Loader2, BookmarkCheck } from 'lucide-react';

export default function SavedPage() {
  const { savedItems, loading } = useSaved();
  const { user } = useAuth();

  const totalValue = savedItems.reduce((acc, item) => acc + (item.price || 0), 0);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-semibold mb-2.5 border border-rose-200">
            <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
            <span>Personal Watchlist</span>
          </div>
          <h1 className="text-3xl font-extrabold text-warm-900 tracking-tight">
            Saved Properties
          </h1>
          <p className="text-sm text-warm-600 mt-1">
            Persisted server-side for <strong className="text-warm-800">{user?.email}</strong>. Survives refresh and re-login.
          </p>
        </div>

        {savedItems.length > 0 && (
          <div className="bg-white p-4 rounded-2xl border border-warm-200 flex items-center gap-4 text-xs">
            <div>
              <span className="text-warm-400 block">Properties Saved</span>
              <span className="text-base font-bold text-warm-900">{savedItems.length}</span>
            </div>
            <div className="h-8 w-px bg-warm-200"></div>
            <div>
              <span className="text-warm-400 block">Watchlist Value</span>
              <span className="text-base font-bold text-ivy-800">{formatPrice(totalValue)}</span>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 mx-auto text-ivy-600 animate-spin mb-3" />
          <p className="text-sm text-warm-600">Synchronizing saved collection...</p>
        </div>
      ) : savedItems.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-warm-200 p-8 my-4">
          <BookmarkCheck className="w-12 h-12 mx-auto text-warm-300 mb-3" />
          <h3 className="text-lg font-semibold text-warm-900">No properties saved yet</h3>
          <p className="text-sm text-warm-500 max-w-sm mx-auto mt-1 mb-4">
            Click the heart icon on any listing card to save homes to your personal account.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-ivy-600 text-white hover:bg-ivy-700"
          >
            Explore Properties <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedItems.map((listing) => (
            <PropertyCard key={listing.listing_id} listing={listing} />
          ))}
        </div>
      )}
    </main>
  );
}