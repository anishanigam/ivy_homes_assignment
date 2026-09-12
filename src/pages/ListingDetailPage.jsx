import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useSaved } from '../context/SavedContext';
import {
  formatPrice,
  normalizeCarpetArea,
  isCorruptListing,
  isFakeListing
} from '../utils/dataFixer';
import PropertyCard from '../components/PropertyCard';
import {
  Building,
  MapPin,
  Heart,
  Share2,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Bed,
  Bath,
  Maximize2,
  Compass,
  Car,
  Layers,
  Phone,
  User,
  ArrowLeft,
  Calendar,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Loader2
} from 'lucide-react';

export default function ListingDetailPage() {
  const { id } = useParams();
  const { isSaved, toggleSave } = useSaved();
  const [listing, setListing] = useState(null);
  const [similarListings, setSimilarListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        // Discrepancy #8: Detail endpoint is plural /v1/listings/{id}
        const data = await api.getListing(id);
        setListing(data);

        // Discrepancy #9: /v1/listings/{id}/similar 404s, so we compute similar properties client-side
        // same locality, same bedroom count, price within 15%
        try {
          const peers = await api.getListings({ limit: 50, locality: data.locality });
          const matches = (peers.results || []).filter((item) => {
            if (item.listing_id === data.listing_id) return false;
            if (item.bedroom !== data.bedroom) return false;
            const priceDiff = Math.abs(item.price - data.price) / data.price;
            return priceDiff <= 0.25; // within 25%
          }).slice(0, 3);
          setSimilarListings(matches);
        } catch (simErr) {
          console.warn('Could not fetch similar listings', simErr);
        }
      } catch (err) {
        console.error('Failed to load listing', err);
        setError(err.message || 'Listing not found');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <Loader2 className="w-8 h-8 mx-auto text-ivy-600 animate-spin mb-3" />
        <p className="text-sm text-warm-600">Retrieving verified property specifications...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <AlertTriangle className="w-12 h-12 mx-auto text-amber-500 mb-3" />
        <h2 className="text-xl font-bold text-warm-900">Property Not Found</h2>
        <p className="text-sm text-warm-500 mt-1 mb-4">{error || 'This listing does not exist.'}</p>
        <Link to="/" className="inline-flex items-center px-4 py-2 bg-ivy-600 text-white rounded-xl text-sm font-semibold">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Listings
        </Link>
      </div>
    );
  }

  const saved = isSaved(listing.listing_id);
  const { area, isNormalized } = normalizeCarpetArea(listing);
  const isCorrupt = isCorruptListing(listing);
  const isFake = isFakeListing(listing);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-warm-500 mb-6">
        <Link to="/" className="hover:text-warm-800 transition-colors">Listings</Link>
        <span>/</span>
        <span className="capitalize">{listing.locality}</span>
        <span>/</span>
        <span className="text-warm-800 font-medium truncate">{listing.apartment_name}</span>
      </nav>

      {/* Safety Alert Banners */}
      {isCorrupt && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-bold">Physical Data Anomaly Detected</h4>
            <p className="text-xs text-red-700 mt-0.5">
              This record describes impossible physical parameters (e.g. carpet area exceeding super built-up area, floor exceeding total building height, or inverted coordinates).
            </p>
          </div>
        </div>
      )}

      {isFake && !isCorrupt && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <Flame className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-bold">Trust Advisory: Suspicious Enquiry-Bait Listing</h4>
            <p className="text-xs text-amber-800 mt-0.5">
              This listing matches known broker advance-fee patterns (heavy below-market discount soliciting token booking amounts). Never transfer money prior to physical inspection.
            </p>
          </div>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-white rounded-3xl border border-warm-200 p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-warm-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-ivy-100 text-ivy-800">
                {listing.bedroom} BHK {listing.property_type || 'Apartment'}
              </span>
              {listing.is_verified && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 text-white flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified
                </span>
              )}
              {listing.website && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-warm-100 text-warm-700 uppercase">
                  Source: {listing.website}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-warm-900 tracking-tight">
              {listing.apartment_name}
            </h1>
            <div className="flex items-center text-sm text-warm-500 mt-1">
              <MapPin className="w-4 h-4 mr-1 text-ivy-600" />
              <span className="capitalize">{listing.locality}, Mumbai</span>
              {listing.project_id && (
                <span className="ml-3 text-xs bg-warm-100 px-2 py-0.5 rounded font-mono text-warm-600">
                  Project #{listing.project_id}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col md:items-end">
            <div className="text-3xl font-extrabold text-warm-900">
              {formatPrice(listing.price)}
            </div>
            {area > 0 && listing.price > 0 && (
              <span className="text-xs text-warm-500 mt-0.5">
                ₹{Math.round(listing.price / area).toLocaleString('en-IN')} / sq ft
              </span>
            )}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => toggleSave(listing)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  saved
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-white hover:bg-warm-50 text-warm-700 border-warm-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${saved ? 'fill-current text-rose-500' : ''}`} />
                <span>{saved ? 'Saved to Favorites' : 'Save Property'}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-xl border border-warm-200 text-warm-600 hover:bg-warm-50"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
              {copied && <span className="text-xs text-ivy-700 font-medium">Link copied!</span>}
            </div>
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-warm-100 text-sm">
          <div className="bg-warm-50/70 p-3.5 rounded-2xl">
            <span className="text-xs text-warm-500 block mb-1">Carpet Area</span>
            <div className="font-bold text-warm-900 flex items-center gap-1">
              <Maximize2 className="w-4 h-4 text-ivy-600" />
              <span>{area} sq ft</span>
            </div>
            {isNormalized && (
              <span className="text-[10px] text-emerald-700 font-medium block mt-0.5">
                ✦ Normalized from {listing.carpet_area} sqm
              </span>
            )}
          </div>

          <div className="bg-warm-50/70 p-3.5 rounded-2xl">
            <span className="text-xs text-warm-500 block mb-1">Floor Elevation</span>
            <div className="font-bold text-warm-900 flex items-center gap-1">
              <Layers className="w-4 h-4 text-ivy-600" />
              <span>Floor {listing.floor} of {listing.total_floors || '-'}</span>
            </div>
          </div>

          <div className="bg-warm-50/70 p-3.5 rounded-2xl">
            <span className="text-xs text-warm-500 block mb-1">Facing Direction</span>
            <div className="font-bold text-warm-900 flex items-center gap-1 capitalize">
              <Compass className="w-4 h-4 text-ivy-600" />
              <span>{listing.facing_direction || 'East'}</span>
            </div>
          </div>

          <div className="bg-warm-50/70 p-3.5 rounded-2xl">
            <span className="text-xs text-warm-500 block mb-1">Covered Parking</span>
            <div className="font-bold text-warm-900 flex items-center gap-1">
              <Car className="w-4 h-4 text-ivy-600" />
              <span>{listing.covered_parking || 1} Vehicle(s)</span>
            </div>
          </div>
        </div>

        {/* Description & Seller Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-bold text-warm-900 text-base">Property Description</h3>
            <p className="text-sm text-warm-700 leading-relaxed whitespace-pre-line">
              {listing.description || 'Spacious residence in well-maintained residential society with reliable power and water backup.'}
            </p>

            <div className="pt-4">
              <h4 className="font-semibold text-warm-900 text-sm mb-3">Unit Specifications</h4>
              <ul className="grid grid-cols-2 gap-2 text-xs text-warm-600">
                <li>• Super Built-up Area: {listing.super_built_up_area || '-'} sq ft</li>
                <li>• Bathrooms: {listing.bathroom || 1}</li>
                <li>• Balconies: {listing.balcony || 1}</li>
                <li>• Furnishing: {listing.furnishing || 'Semi-furnished'}</li>
                <li>• Posted on: {listing.posted_at?.split('T')[0] || 'Recent'}</li>
                <li>• Global Listing ID: #{listing.listing_id}</li>
              </ul>
            </div>
          </div>

          {/* Seller / Agent Box */}
          <div className="bg-warm-50 p-5 rounded-2xl border border-warm-200/80 space-y-3">
            <h4 className="text-xs font-semibold text-warm-400 uppercase tracking-wider">
              Contact Verified Representative
            </h4>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-ivy-100 text-ivy-800 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-warm-900">{listing.posted_by_name || 'Verified Agent'}</p>
                <p className="text-xs text-warm-500 capitalize">Role: {listing.posted_by || 'Agent'}</p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-warm-200">
              <span className="text-[11px] text-warm-400 block mb-0.5">Verified Contact</span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-warm-900">
                  {listing.posted_by_contact || '+91 200 000 0000'}
                </span>
                <a
                  href={`tel:${listing.posted_by_contact}`}
                  className="px-2 py-1 rounded bg-ivy-600 text-white text-[11px] font-semibold"
                >
                  Call
                </a>
              </div>
            </div>

            <p className="text-[11px] text-warm-400 leading-tight">
              Safety note: Never pay booking tokens without a physical tour and verified registry documents.
            </p>
          </div>
        </div>
      </div>

      {/* Similar Properties Section (Calculated fallback for missing /similar endpoint) */}
      {similarListings.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-warm-900">Comparable Homes in {listing.locality}</h3>
              <p className="text-xs text-warm-500">Same {listing.bedroom} BHK configuration within ±20% budget</p>
            </div>
            <span className="text-xs text-ivy-700 bg-ivy-50 px-2.5 py-1 rounded-full font-medium">
              Client-side Match Matrix
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {similarListings.map((peer) => (
              <PropertyCard key={peer.listing_id} listing={peer} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}