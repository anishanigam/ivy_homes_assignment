import React from 'react';
import { Link } from 'react-router-dom';
import { useSaved } from '../context/SavedContext';
import {
  formatPrice,
  normalizeCarpetArea,
  isCorruptListing,
  isFakeListing
} from '../utils/dataFixer';
import {
  Heart,
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Building,
  ShieldCheck,
  AlertTriangle,
  Flame,
  ArrowUpRight
} from 'lucide-react';

// Generates warm pleasant architectural placeholder images based on listing id
function getPropertyImage(listing) {
  const seeds = ['contemporary', 'minimalist', 'warm-interior', 'luxury-terrace', 'modern-apartment'];
  const hash = Math.abs(
    (listing.listing_id || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  );
  const colorIndex = hash % 5;
  const gradients = [
    'from-emerald-800 to-teal-950',
    'from-stone-700 to-warm-900',
    'from-amber-900 to-stone-900',
    'from-cyan-900 to-slate-900',
    'from-emerald-900 to-stone-900'
  ];
  return {
    gradient: gradients[colorIndex],
    badge: seeds[colorIndex]
  };
}

export default function PropertyCard({ listing }) {
  const { isSaved, toggleSave } = useSaved();
  const saved = isSaved(listing.listing_id);
  const { area, isNormalized } = normalizeCarpetArea(listing);
  const isCorrupt = isCorruptListing(listing);
  const isFake = isFakeListing(listing);
  const style = getPropertyImage(listing);

  // Approximate EMI: ₹7,500 per ₹10 Lakhs (approx 8.5% for 20 years)
  const estEmi = listing.price > 0 ? Math.round((listing.price / 1000000) * 7500) : null;

  return (
    <div className={`group bg-white rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-0.5 ${
      isCorrupt
        ? 'border-red-300 bg-red-50/20'
        : isFake
        ? 'border-amber-300 bg-amber-50/20'
        : 'border-warm-200/90 hover:border-ivy-300'
    }`}>
      {/* Top Banner Image Area */}
      <div className={`relative h-48 w-full bg-gradient-to-br ${style.gradient} flex items-center justify-center text-white/90 p-4 overflow-hidden`}>
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative z-10 text-center">
          <Building className="w-10 h-10 mx-auto mb-1.5 opacity-80" />
          <span className="text-xs uppercase tracking-widest font-medium text-white/70 block">
            {listing.apartment_name || 'Mumbai Residence'}
          </span>
          <span className="text-sm font-semibold capitalize text-white">
            {listing.bedroom} BHK {listing.property_type || 'Apartment'}
          </span>
        </div>

        {/* Badges on top */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-20">
          {listing.is_verified && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600/90 backdrop-blur-sm text-white flex items-center shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Verified
            </span>
          )}
          {listing.website && (
            <span className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-black/40 backdrop-blur-sm text-white/90 uppercase tracking-wider">
              {listing.website}
            </span>
          )}
          {!listing.is_live && (
            <span className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-red-600/90 text-white">
              Withdrawn / Inactive
            </span>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSave(listing);
          }}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-transform active:scale-90 z-20 ${
            saved
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-white/80 hover:bg-white text-warm-700 hover:text-rose-500'
          }`}
          title={saved ? 'Remove from saved' : 'Save property'}
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        </button>

        {/* Bottom bar inside photo */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-white/80 z-10">
          <span>Floor {listing.floor} of {listing.total_floors || '-'}</span>
          <span className="capitalize">{listing.furnishing || 'Unfurnished'}</span>
        </div>
      </div>

      {/* Warning flags if data is corrupt or fake */}
      {isCorrupt && (
        <div className="bg-red-100 text-red-800 text-xs px-3 py-1.5 border-b border-red-200 flex items-center gap-1.5 font-medium">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Physical Anomaly Detected (Impossible specs)</span>
        </div>
      )}
      {isFake && !isCorrupt && (
        <div className="bg-amber-100 text-amber-900 text-xs px-3 py-1.5 border-b border-amber-200 flex items-center gap-1.5 font-medium">
          <Flame className="w-3.5 h-3.5 shrink-0 text-amber-600" />
          <span>High Risk: Advance Fee / Enquiry Bait Listing</span>
        </div>
      )}

      {/* Content body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Price & EMI */}
          <div className="flex items-baseline justify-between mb-1">
            <div className="text-xl font-extrabold text-warm-900">
              {formatPrice(listing.price)}
            </div>
            {estEmi && (
              <span className="text-[11px] text-warm-500 font-medium">
                Est. EMI ₹{estEmi.toLocaleString('en-IN')}/mo
              </span>
            )}
          </div>

          {/* Title & Locality */}
          <h3 className="font-semibold text-warm-900 text-sm line-clamp-1 group-hover:text-ivy-800 transition-colors">
            {listing.apartment_name || 'Apartment in ' + (listing.locality || 'Mumbai')}
          </h3>

          <div className="flex items-center text-xs text-warm-500 mt-1 mb-3">
            <MapPin className="w-3.5 h-3.5 mr-1 text-ivy-600 shrink-0" />
            <span className="capitalize">{listing.locality}</span>
            {listing.project_id && (
              <span className="ml-2 text-[10px] text-warm-400 font-mono">
                Project #{listing.project_id}
              </span>
            )}
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-warm-100 text-xs text-warm-700 my-2">
            <div className="flex items-center space-x-1.5">
              <Bed className="w-3.5 h-3.5 text-warm-400" />
              <span>{listing.bedroom} BHK</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Bath className="w-3.5 h-3.5 text-warm-400" />
              <span>{listing.bathroom || 1} Bath</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-warm-400" />
              <span>{area} sq ft</span>
            </div>
          </div>

          {/* MagicHomes normalized badge */}
          {isNormalized && (
            <div className="my-1.5 text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1 font-medium">
              <span>✦ Normalized from {listing.carpet_area} sqm to {area} sq ft</span>
            </div>
          )}

          <p className="text-xs text-warm-500 line-clamp-2 mt-2 leading-relaxed">
            {listing.description || 'Spacious home with good ventilation and prime locality access.'}
          </p>
        </div>

        {/* Footer Action */}
        <div className="mt-4 pt-3 border-t border-warm-100 flex items-center justify-between">
          <span className="text-[11px] text-warm-400">
            By {listing.posted_by_name || 'Agent'}
          </span>
          <Link
            to={`/listings/${listing.listing_id}`}
            className="inline-flex items-center text-xs font-semibold text-ivy-700 hover:text-ivy-900 group-hover:translate-x-0.5 transition-all"
          >
            View Specs <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}