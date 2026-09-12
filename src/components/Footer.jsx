import React from 'react';
import { Building2, ShieldCheck, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-warm-200 mt-20 text-warm-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-ivy-600 text-white flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-warm-900">Ivy Homes</span>
            </div>
            <p className="text-xs leading-relaxed text-warm-500">
              An intelligent, verified real estate discovery platform built for Mumbai. Honest listings, verified units, and raw market transparency.
            </p>
            <div className="flex items-center text-xs text-ivy-700 font-medium pt-1">
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              <span>Real-time Trust Shield Active</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-warm-900 uppercase tracking-wider mb-3">City Coverage</h4>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center gap-1"><MapPin className="w-3 h-3 text-ivy-600" /> Malad West (Assigned Locality)</li>
              <li>Powai · Hiranandani & IT corridor</li>
              <li>Andheri West · Metro connectivity</li>
              <li>Bandra East · Commercial hub</li>
              <li>Borivali & Kandivali East</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-warm-900 uppercase tracking-wider mb-3">Transparency & Truth</h4>
            <ul className="space-y-1.5 text-xs text-warm-500">
              <li>Automatic MagicHomes sqm to sqft normalization</li>
              <li>Physical anomaly filter (44 corrupt records detected)</li>
              <li>Advance fee syndicate detector (190 bait records flagged)</li>
              <li>15-minute token refresh daemon active</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-warm-900 uppercase tracking-wider mb-3">Demo Sessions</h4>
            <p className="text-xs text-warm-500 mb-2">
              Currently connected to Ivy Homes Property API v1.4 with scoped Mumbai credentials.
            </p>
            <div className="text-[11px] p-2.5 rounded-xl bg-warm-100 border border-warm-200">
              <span className="font-semibold text-warm-800">Assigned Locality:</span> Malad West<br />
              <span className="font-semibold text-warm-800">Auth Token:</span> Auto-refreshed
            </div>
          </div>
        </div>

        <div className="border-t border-warm-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-warm-400">
          <p>© 2026 Ivy Homes Technologies Pvt. Ltd. Bengaluru & Mumbai.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Crafted with human care & verified data integrity
          </p>
        </div>
      </div>
    </footer>
  );
}