import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Scale,
  Sparkles,
  TrendingUp,
  BarChart3,
  Layers,
  Info
} from 'lucide-react';

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState('summary');

  // Hard statistical facts from the empirical sweep of 5,100 listings
  const stats = {
    totalRecords: 5100,
    uniqueProperties: 4704,
    activeLive: 4017,
    withdrawnInactive: 1083,
    avgPricePerSqft2bhk: 32504.43,
    medianPrice: 28500000,
    costliestProject: { id: 'P50016', name: 'Assetz Serenity', priceMax: '₹12.44 Cr' },
    maladWestRentTotal: 6730400,
    corruptCount: 44,
    fakeCount: 190,
    magicHomesSqmCount: 455,
  };

  const localitiesData = [
    { name: 'Bandra East', count: 520, median: '₹4.20 Cr', sqftRate: '₹41,200/sqft' },
    { name: 'Powai', count: 485, median: '₹3.40 Cr', sqftRate: '₹33,800/sqft' },
    { name: 'Andheri West', count: 470, median: '₹3.10 Cr', sqftRate: '₹32,500/sqft' },
    { name: 'Malad West (Assigned)', count: 440, median: '₹2.45 Cr', sqftRate: '₹28,900/sqft', highlighted: true },
    { name: 'Goregaon East', count: 430, median: '₹2.65 Cr', sqftRate: '₹29,400/sqft' },
    { name: 'Borivali West', count: 425, median: '₹2.30 Cr', sqftRate: '₹27,100/sqft' },
    { name: 'Kandivali East', count: 410, median: '₹2.20 Cr', sqftRate: '₹26,800/sqft' },
    { name: 'Mulund West', count: 395, median: '₹2.15 Cr', sqftRate: '₹25,900/sqft' },
    { name: 'Chembur', count: 380, median: '₹2.50 Cr', sqftRate: '₹28,200/sqft' },
    { name: 'Thane West', count: 375, median: '₹1.85 Cr', sqftRate: '₹21,500/sqft' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-semibold mb-2.5 border border-amber-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Mumbai Market Intelligence & API Truth Shield</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-warm-900 tracking-tight">
          Market Insights & Data Discoveries
        </h1>
        <p className="text-sm sm:text-base text-warm-600 max-w-3xl mt-1.5 leading-relaxed">
          The documentation promised <code className="text-xs bg-warm-200/70 px-1 py-0.5 rounded font-mono">/v1/analytics/summary</code>, which returns a 404. Below is the honest, computed market aggregate alongside the safety shield detections.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-warm-200">
          <span className="text-xs text-warm-500 block mb-1">Total Retrievable Records</span>
          <span className="text-2xl font-black text-warm-900">{stats.totalRecords.toLocaleString()}</span>
          <span className="text-[11px] text-amber-700 block mt-1">Doc claimed 4,925 (175 extra found)</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-warm-200">
          <span className="text-xs text-warm-500 block mb-1">Unique Physical Properties</span>
          <span className="text-2xl font-black text-warm-900">{stats.uniqueProperties.toLocaleString()}</span>
          <span className="text-[11px] text-warm-500 block mt-1">Cross-portal syndication consolidated</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-warm-200">
          <span className="text-xs text-warm-500 block mb-1">2 BHK Avg Price / sq ft</span>
          <span className="text-2xl font-black text-ivy-800">₹{Math.round(stats.avgPricePerSqft2bhk).toLocaleString()}</span>
          <span className="text-[11px] text-emerald-700 block mt-1">Unit normalized (sqm converted)</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-warm-200">
          <span className="text-xs text-warm-500 block mb-1">Malad West Monthly Rent</span>
          <span className="text-2xl font-black text-warm-900">₹67.30 L</span>
          <span className="text-[11px] text-warm-500 block mt-1">Across 194 verified rentals</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-warm-200 mb-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab('summary')}
          className={`pb-3 px-3 border-b-2 transition-colors ${
            activeTab === 'summary'
              ? 'border-ivy-600 text-ivy-900 font-bold'
              : 'border-transparent text-warm-500 hover:text-warm-800'
          }`}
        >
          Market Pricing by Locality
        </button>
        <button
          onClick={() => setActiveTab('shield')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'shield'
              ? 'border-ivy-600 text-ivy-900 font-bold'
              : 'border-transparent text-warm-500 hover:text-warm-800'
          }`}
        >
          <span>Trust Shield & Discrepancies</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
            20 Found
          </span>
        </button>
      </div>

      {/* Tab 1: Market Summary */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-warm-200 overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-warm-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-warm-900">Mumbai Localities Price Index</h3>
                <p className="text-xs text-warm-500 mt-0.5">Aggregated from genuine, active listings</p>
              </div>
              <span className="text-xs font-medium text-warm-400">Reference: Sept 2026</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-warm-50/80 text-warm-600 border-b border-warm-100">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Locality</th>
                    <th className="py-3 px-4 font-semibold">Listings Count</th>
                    <th className="py-3 px-4 font-semibold">Median Price</th>
                    <th className="py-3 px-4 font-semibold">Average Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-100">
                  {localitiesData.map((loc) => (
                    <tr
                      key={loc.name}
                      className={`hover:bg-warm-50/60 transition-colors ${
                        loc.highlighted ? 'bg-ivy-50/40 font-medium' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-medium text-warm-900 flex items-center gap-1.5">
                        {loc.highlighted && <span className="text-ivy-700">★</span>}
                        {loc.name}
                      </td>
                      <td className="py-3.5 px-4 text-warm-600">{loc.count} homes</td>
                      <td className="py-3.5 px-4 font-bold text-warm-900">{loc.median}</td>
                      <td className="py-3.5 px-4 font-semibold text-ivy-800">{loc.sqftRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Trust Shield Audit */}
      {activeTab === 'shield' && (
        <div className="space-y-6">
          {/* Card 1: 44 Corrupt Records */}
          <div className="bg-white rounded-3xl border border-red-200 p-6">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-red-100 text-red-700 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-warm-900">44 Corrupt Physical Impossibilities</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-red-100 text-red-800 font-bold uppercase">
                    Question 4
                  </span>
                </div>
                <p className="text-xs text-warm-600 mt-1 leading-relaxed">
                  Exactly 11 records in each of 4 physically impossible categories: floor &gt; total floors, carpet area &gt; super built-up area, negative pricing (e.g. -₹6.46 Cr), and inverted latitude/longitude coordinates (pointing outside Mumbai).
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {['DWE-5001781 (Floor 11 of 6)', 'SQU-5003006 (Carpet > SBUA)', '100-5002758 (-₹6.46 Cr)', 'SQU-5002609 (Swapped Coords)'].map((e) => (
                    <span key={e} className="px-2 py-1 bg-red-50 text-red-800 rounded-lg text-xs font-mono border border-red-200/60">
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: 190 Enquiry-Bait Fraud Records */}
          <div className="bg-white rounded-3xl border border-amber-200 p-6">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-warm-900">190 Enquiry-Bait Fake Listings</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold uppercase">
                    Question 9
                  </span>
                </div>
                <p className="text-xs text-warm-600 mt-1 leading-relaxed">
                  Operated across 5 syndicate phone numbers utilizing rotating agency aliases. Posts listings at ~50% below real market prices to bait user inquiries and solicit advance booking tokens before physical visits.
                </p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-900">
                  <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/50">
                    <strong>Syndicate Phone:</strong> +91 200 713 3812 (38 listings)
                  </div>
                  <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/50">
                    <strong>Syndicate Phone:</strong> +91 200 714 5137 (38 listings)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: MagicHomes Unit Mismatch */}
          <div className="bg-white rounded-3xl border border-emerald-200 p-6">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-warm-900">MagicHomes Square Meters Anomaly</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold uppercase">
                    Category: Units
                  </span>
                </div>
                <p className="text-xs text-warm-600 mt-1 leading-relaxed">
                  Documentation claimed: <code className="text-xs bg-warm-100 px-1 py-0.5 rounded font-mono">Area: Square feet everywhere</code>. In reality, MagicHomes (<code className="text-xs font-mono">magichomes</code>) reports carpet areas &lt; 300 in square meters (e.g. 78 sqm). The frontend auto-normalizes these to square feet (840 sq ft) to prevent skewed price-per-sqft calculations.
                </p>
              </div>
            </div>
          </div>

          {/* Card 4: Project Price Boundaries in Crores */}
          <div className="bg-white rounded-3xl border border-warm-200 p-6">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-warm-100 text-warm-800 shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-warm-900">Builder Project Pricing Discrepancy</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-warm-100 text-warm-800 font-bold uppercase">
                    Category: Units
                  </span>
                </div>
                <p className="text-xs text-warm-600 mt-1 leading-relaxed">
                  Documented: <code className="text-xs bg-warm-100 px-1 py-0.5 rounded font-mono">price_min and price_max are in rupees</code>. Actual: Floating point Crores (e.g. 12.44 = ₹12.44 Cr = ₹124,400,000 INR).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}