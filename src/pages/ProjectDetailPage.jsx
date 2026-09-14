import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { formatProjectPriceRange } from '../utils/dataFixer';
import PropertyCard from '../components/PropertyCard';
import {
  Building2,
  MapPin,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [projectListings, setProjectListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProject() {
      setLoading(true);
      setError(null);
      try {
        // Calls GET /v1/projects/{project_id}
        const data = await api.getProject(id);
        setProject(data);

        // Fetch matching listings (filtered client-side because server ignores ?project_id=)
        try {
          const res = await api.getListings({ limit: 50 });
          const matches = (res.results || []).filter((l) => l.project_id === id);
          setProjectListings(matches);
        } catch (e) {
          console.warn('Could not fetch project listings', e);
        }
      } catch (err) {
        console.error('Failed to load project', err);
        setError(err.message || 'Project not found');
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <Loader2 className="w-8 h-8 mx-auto text-ivy-600 animate-spin mb-3" />
        <p className="text-sm text-warm-600">Retrieving builder project specifications...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-amber-500 mb-3" />
        <h2 className="text-xl font-bold text-warm-900">Project Not Found</h2>
        <p className="text-sm text-warm-500 mt-1 mb-4">{error || 'This project does not exist.'}</p>
        <Link to="/projects" className="inline-flex items-center px-4 py-2 bg-ivy-600 text-white rounded-xl text-sm font-semibold">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center space-x-2 text-xs text-warm-500 mb-6">
        <Link to="/projects" className="hover:text-warm-800 transition-colors">Projects</Link>
        <span>/</span>
        <span className="capitalize">{project.locality}</span>
        <span>/</span>
        <span className="text-warm-800 font-medium truncate">{project.apartment_name}</span>
      </nav>

      <div className="bg-white rounded-3xl border border-warm-200 p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-warm-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-ivy-100 text-ivy-800">
                {project.developer_name || 'Premier Builder'}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase ${
                project.project_status === 'ready to move'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {project.project_status || 'Under Construction'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-warm-900 tracking-tight">
              {project.apartment_name}
            </h1>
            <div className="flex items-center text-sm text-warm-500 mt-1">
              <MapPin className="w-4 h-4 mr-1 text-ivy-600" />
              <span className="capitalize">{project.locality}, Mumbai</span>
              <span className="mx-2 text-warm-300">·</span>
              <span className="font-mono text-xs">RERA: {project.rera_number || 'Registered'}</span>
            </div>
          </div>

          <div className="bg-warm-50 p-4 rounded-2xl border border-warm-200/80 text-left md:text-right">
            <span className="text-[11px] text-warm-500 block">Unit Price Range</span>
            <div className="text-2xl font-extrabold text-warm-900">
              {formatProjectPriceRange(project.price_min, project.price_max)}
            </div>
            <span className="text-xs text-warm-400 block mt-0.5">
              Area: {project.min_area_sqft} - {project.max_area_sqft} sq ft
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-warm-100 text-sm">
          <div className="bg-warm-50/70 p-3.5 rounded-2xl">
            <span className="text-xs text-warm-500 block mb-1">Total Towers</span>
            <div className="font-bold text-warm-900 flex items-center gap-1">
              <Building2 className="w-4 h-4 text-ivy-600" />
              <span>{project.total_towers || 1} Towers</span>
            </div>
          </div>

          <div className="bg-warm-50/70 p-3.5 rounded-2xl">
            <span className="text-xs text-warm-500 block mb-1">Total Units</span>
            <div className="font-bold text-warm-900 flex items-center gap-1">
              <Layers className="w-4 h-4 text-ivy-600" />
              <span>{project.total_units || '-'} Residences</span>
            </div>
          </div>

          <div className="bg-warm-50/70 p-3.5 rounded-2xl">
            <span className="text-xs text-warm-500 block mb-1">Floors per Tower</span>
            <div className="font-bold text-warm-900 flex items-center gap-1">
              <span>{project.total_floors || '-'} Floors</span>
            </div>
          </div>

          <div className="bg-warm-50/70 p-3.5 rounded-2xl">
            <span className="text-xs text-warm-500 block mb-1">Possession Date</span>
            <div className="font-bold text-warm-900 flex items-center gap-1">
              <Calendar className="w-4 h-4 text-ivy-600" />
              <span>{project.possession_date || '2027'}</span>
            </div>
          </div>
        </div>

        {project.amenities && project.amenities.length > 0 && (
          <div className="pt-6">
            <h4 className="font-bold text-warm-900 text-sm mb-3">Project Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {project.amenities.map((a) => (
                <span key={a} className="px-3 py-1 bg-warm-100 text-warm-700 rounded-xl text-xs capitalize flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-ivy-600" />
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Available Units in this Project */}
      <section className="mt-8">
        <h3 className="text-xl font-bold text-warm-900 mb-4">
          Available Listings in {project.apartment_name} ({projectListings.length})
        </h3>
        {projectListings.length === 0 ? (
          <p className="text-sm text-warm-500 bg-white p-6 rounded-2xl border border-warm-200">
            No resale units currently available in this project batch.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {projectListings.map((l) => (
              <PropertyCard key={l.listing_id} listing={l} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}