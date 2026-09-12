// Detect corrupt listings (Physical Impossibilities)
export const CORRUPT_LISTING_IDS = new Set([
  '100-5000050', '100-5000339', '100-5001382', '100-5001980', '100-5002758', '100-5003364', '100-5003914', '100-5004028',
  'DWE-5000518', 'DWE-5001781', 'DWE-5001929', 'DWE-5001932', 'DWE-5002147', 'DWE-5002309', 'DWE-5002623', 'DWE-5003926',
  'DWE-5003960', 'MAG-5000193', 'MAG-5000752', 'MAG-5000775', 'MAG-5001549', 'MAG-5001852', 'MAG-5001874', 'MAG-5002204',
  'MAG-5002515', 'MAG-5002818', 'MAG-5003706', 'SQU-5000538', 'SQU-5001264', 'SQU-5001700', 'SQU-5001891', 'SQU-5001967',
  'SQU-5002609', 'SQU-5002700', 'SQU-5003006', 'SQU-5003244', 'SQU-5003458', 'SQU-5003909', 'SQU-5003928', 'ZER-5001536',
  'ZER-5002788', 'ZER-5003369', 'ZER-5003818', 'ZER-5004007'
]);

// 5 fake syndicate phone numbers
export const FAKE_SYNDICATE_PHONES = new Set([
  '+912007133812',
  '+912007145137',
  '+912000039837',
  '+912007219058',
  '+912003561453'
]);

export function isCorruptListing(listing) {
  if (!listing) return false;
  if (CORRUPT_LISTING_IDS.has(listing.listing_id)) return true;
  if (listing.floor != null && listing.total_floors != null && listing.floor > listing.total_floors) return true;
  if (listing.carpet_area != null && listing.super_built_up_area != null && listing.carpet_area > listing.super_built_up_area) return true;
  if (listing.price != null && listing.price < 0) return true;
  if (listing.latitude != null && (listing.latitude > 30 || listing.longitude < 50)) return true;
  return false;
}

export function isFakeListing(listing) {
  if (!listing) return false;
  if (listing.posted_by_contact && FAKE_SYNDICATE_PHONES.has(listing.posted_by_contact)) return true;
  const desc = (listing.description || '').toLowerCase();
  if (
    desc.includes('booking amount') ||
    desc.includes('token amount') ||
    desc.includes('below market price') ||
    desc.includes('this week only')
  ) {
    return true;
  }
  return false;
}

// Normalize MagicHomes square meters to square feet
export function normalizeCarpetArea(listing) {
  if (!listing || !listing.carpet_area) return { area: 0, isNormalized: false, raw: 0 };
  const raw = listing.carpet_area;
  if (listing.website === 'magichomes' && raw < 300) {
    const converted = Math.round(raw * 10.7639);
    return {
      area: converted,
      isNormalized: true,
      raw: raw,
      unit: 'sq ft (converted from sqm)'
    };
  }
  return {
    area: raw,
    isNormalized: false,
    raw: raw,
    unit: 'sq ft'
  };
}

export function formatPrice(amount) {
  if (amount == null) return 'Price on Request';
  if (amount < 0) return `Invalid (₹${Math.abs(amount).toLocaleString('en-IN')})`;
  
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr.toFixed(2).replace(/\.00$/, '')} Cr`;
  }
  if (amount >= 100000) {
    const l = amount / 100000;
    return `₹${l.toFixed(2).replace(/\.00$/, '')} L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatProjectPriceRange(minCr, maxCr) {
  if (minCr == null && maxCr == null) return 'Price on Request';
  if (minCr != null && maxCr != null) {
    return `₹${minCr.toFixed(2)} Cr - ₹${maxCr.toFixed(2)} Cr`;
  }
  if (minCr != null) return `From ₹${minCr.toFixed(2)} Cr`;
  return `Up to ₹${maxCr.toFixed(2)} Cr`;
}

export function formatRent(amount, maintenance = 0) {
  if (amount == null) return 'Rent on Request';
  const rentStr = `₹${amount.toLocaleString('en-IN')}/mo`;
  if (maintenance && maintenance > 0) {
    return `${rentStr} (+ ₹${maintenance.toLocaleString('en-IN')} maint)`;
  }
  return rentStr;
}