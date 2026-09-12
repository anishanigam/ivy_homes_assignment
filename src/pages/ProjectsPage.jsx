import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { formatProjectPriceRange } from '../utils/dataFixer';
import { Building2, MapPin, Calendar, CheckCircle2, AlertCircle, Loader2, Sparkles, Tag } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProjects() {
      setLoading(true);
      try {
        const b1 = await api.getProjects({ limit: 50, offset: 0 });
        const b2 = await api.getProjects({ limit: 50, offset: 50 });
        setProjects([...(b1.results || []), ...(b2.results || [])]);
      } catch (err) {
        setError(err.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivy-50 text-ivy-800 text-xs font-semibold mb-2.5 border border-ivy-200">
          <Building2 className="w-3.5 h-3.5 text-ivy-600" />
          <span>New Builder Developments</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-warm-900 tracking-tight">
          Mumbai Residential Projects
        </h1>
        <p className="text-sm sm:text-base text-warm-600 max-w-2xl mt-1.5 leading-relaxed">
          Comprehensive project directory with RERA registrations, tower plans, verified unit counts, and corrected price boundaries in Crores.
        </p>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 mx-auto text-ivy-600 animate-spin mb-3" />
          <p className="text-sm text-warm-600">Gathering Mumbai builder projects...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p.project_id}
              className="bg-white rounded-3xl border border-warm-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[11px] font-semibold text-ivy-700 uppercase tracking-wider">
                      {p.developer_name || 'Premier Developer'}
                    </span>
                    <h3 className="text-lg font-bold text-warm-900 leading-tight">
                      {p.apartment_name}
                    </h3>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-md font-semibold uppercase ${
                    p.project_status === 'ready to move'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {p.project_status || 'Under Construction'}
                  </span>
                </div>

                <div className="flex items-center text-xs text-warm-500 mb-4">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-ivy-600" />
                  <span className="capitalize">{p.locality}</span>
                  <span className="mx-2 text-warm-300">·</span>
                  <span>RERA: {p.rera_number || 'Registered'}</span>
                </div>

                {/* Price Display in Crores (Corrected from Rupees documentation discrepancy) */}
                <div className="bg-warm-50 p-3.5 rounded-2xl mb-4 border border-warm-100">
                  <span className="text-[11px] text-warm-500 block">Unit Price Range</span>
                  <span className="text-lg font-extrabold text-warm-900">
                    {formatProjectPriceRange(p.price_min, p.price_max)}
                  </span>
                  <span className="text-[10px] text-warm-400 block mt-0.5">
                    Area: {p.min_area_sqft} - {p.max_area_sqft} sq ft
                  </span>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-2 text-xs text-warm-600 mb-4">
                  <div>• Total Towers: <strong>{p.total_towers || 1}</strong></div>
                  <div>• Total Units: <strong>{p.total_units || '-'}</strong></div>
                  <div>• Floors: <strong>{p.total_floors || '-'}</strong></div>
                  <div>• Active Listings: <strong className="text-ivy-800">{p.total_listings}</strong></div>
                </div>

                {/* Amenities pills */}
                {p.amenities && p.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {p.amenities.slice(0, 4).map((a) => (
                      <span key={a} className="px-2 py-0.5 rounded-md text-[10px] bg-warm-100 text-warm-700 capitalize">
                        {a}
                      </span>
                    ))}
                    {p.amenities.length > 4 && (
                      <span className="px-1.5 py-0.5 text-[10px] text-warm-400 font-medium">
                        +{p.amenities.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-warm-100 flex items-center justify-between text-xs text-warm-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Possession: {p.possession_date || '2027'}
                </span>
                <span className="font-mono text-[11px]">#{p.project_id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}