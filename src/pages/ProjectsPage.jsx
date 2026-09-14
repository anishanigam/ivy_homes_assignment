import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { formatProjectPriceRange } from '../utils/dataFixer';
import { Building2, MapPin, Calendar, ArrowRight, Loader2 } from 'lucide-react';

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

export default function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectedLocality = searchParams.get('locality') || 'All Localities';

  useEffect(() => {
    async function loadProjects() {
      setLoading(true);
      try {
        const queryParams = { limit: 50, offset: 0 };
        if (selectedLocality !== 'All Localities') {
          queryParams.locality = selectedLocality;
        }
        const b1 = await api.getProjects(queryParams);
        const b2 = await api.getProjects({ ...queryParams, offset: 50 });
        setProjects([...(b1.results || []), ...(b2.results || [])]);
      } catch (err) {
        setError(err.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, [selectedLocality]);

  const handleLocalityChange = (loc) => {
    if (loc === 'All Localities') {
      searchParams.delete('locality');
    } else {
      searchParams.set('locality', loc);
    }
    setSearchParams(searchParams);
  };

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

      {/* Locality Filter */}
      <div className="bg-white p-4 rounded-2xl border border-warm-200 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs text-warm-500 font-medium">Filter by Locality:</span>
          <select
            value={selectedLocality}
            onChange={(e) => handleLocalityChange(e.target.value)}
            className="px-3 py-1.5 text-sm bg-warm-50 border border-warm-200 rounded-xl capitalize"
          >
            {LOCALITIES.map((loc) => (
              <option key={loc} value={loc} className="capitalize">
                {loc === 'malad west' ? '★ Malad West (Assigned)' : loc}
              </option>
            ))}
          </select>
        </div>
        <span className="text-xs text-warm-500">
          Showing <strong className="text-warm-900">{projects.length}</strong> projects
        </span>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 mx-auto text-ivy-600 animate-spin mb-3" />
          <p className="text-sm text-warm-600">Gathering Mumbai builder projects...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <Link
              key={p.project_id}
              to={`/projects/${p.project_id}`}
              className="bg-white rounded-3xl border border-warm-200 p-6 flex flex-col justify-between hover:shadow-lg hover:border-ivy-300 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[11px] font-semibold text-ivy-700 uppercase tracking-wider">
                      {p.developer_name || 'Premier Developer'}
                    </span>
                    <h3 className="text-lg font-bold text-warm-900 leading-tight group-hover:text-ivy-800 transition-colors">
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

                <div className="bg-warm-50 p-3.5 rounded-2xl mb-4 border border-warm-100">
                  <span className="text-[11px] text-warm-500 block">Unit Price Range</span>
                  <span className="text-lg font-extrabold text-warm-900">
                    {formatProjectPriceRange(p.price_min, p.price_max)}
                  </span>
                  <span className="text-[10px] text-warm-400 block mt-0.5">
                    Area: {p.min_area_sqft} - {p.max_area_sqft} sq ft
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-warm-600 mb-4">
                  <div>• Total Towers: <strong>{p.total_towers || 1}</strong></div>
                  <div>• Total Units: <strong>{p.total_units || '-'}</strong></div>
                  <div>• Floors: <strong>{p.total_floors || '-'}</strong></div>
                  <div>• Active Listings: <strong className="text-ivy-800">{p.total_listings}</strong></div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-warm-100 flex items-center justify-between text-xs text-warm-500">
                <span>Possession: {p.possession_date || '2027'}</span>
                <span className="font-semibold text-ivy-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Project <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}