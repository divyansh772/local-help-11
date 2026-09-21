import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Star,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
  Users,
  Award,
} from 'lucide-react';
import { Worker, ServiceCategory } from '../types';
import { WorkerCard } from './WorkerCard';

interface WorkersProfilesSectionProps {
  workers: Worker[];
  onViewProfile: (worker: Worker) => void;
  onBookWorker: (worker: Worker) => void;
  onNavigateToAllWorkers: (category?: ServiceCategory) => void;
}

export const WorkersProfilesSection: React.FC<WorkersProfilesSectionProps> = ({
  workers,
  onViewProfile,
  onBookWorker,
  onNavigateToAllWorkers,
}) => {
  const [selectedTrade, setSelectedTrade] = useState<'all' | ServiceCategory>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'normal' | 'specialist'>('all');

  const categories: { id: 'all' | ServiceCategory; label: string }[] = [
    { id: 'all', label: 'All Trades' },
    { id: 'cleaning', label: 'Cleaning' },
    { id: 'plumbing', label: 'Plumbing' },
    { id: 'electrical', label: 'Electrical' },
    { id: 'carpentry', label: 'Carpentry' },
  ];

  const filtered = workers.filter((w) => {
    const matchesTrade = selectedTrade === 'all' ? true : w.category === selectedTrade;
    const matchesType =
      selectedType === 'all'
        ? true
        : selectedType === 'normal'
        ? w.workerType === 'normal'
        : w.workerType !== 'normal';
    return matchesTrade && matchesType;
  });

  // Take up to 6 on the homepage preview so the page stays balanced, with a clear view-all button
  const displayWorkers = filtered.slice(0, 6);

  return (
    <section id="workers-profiles-section" className="space-y-6 pt-4 border-t border-slate-200">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Independent Worker Profiles</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Directly browse and hire background-checked Indian workers, everyday local mistris, and certified technicians without agency markups. Verified customer ratings, transparent hourly pricing in ₹ INR, and skill-first profiles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="browse-all-workers-link-btn"
            onClick={() => onNavigateToAllWorkers(selectedTrade === 'all' ? undefined : selectedTrade)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm group"
          >
            <span>Browse All {workers.length} Professionals</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Filter Tabs & Trust Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        {/* Trade Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => {
            const count =
              cat.id === 'all'
                ? workers.filter((w) =>
                    selectedType === 'all'
                      ? true
                      : selectedType === 'normal'
                      ? w.workerType === 'normal'
                      : w.workerType !== 'normal'
                  ).length
                : workers.filter(
                    (w) =>
                      w.category === cat.id &&
                      (selectedType === 'all'
                        ? true
                        : selectedType === 'normal'
                        ? w.workerType === 'normal'
                        : w.workerType !== 'normal')
                  ).length;

            return (
              <button
                key={cat.id}
                id={`worker-section-filter-${cat.id}`}
                onClick={() => setSelectedTrade(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedTrade === cat.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    selectedTrade === cat.id
                      ? 'bg-slate-800 text-slate-200'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Worker Type Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            id="worker-type-filter-all"
            onClick={() => setSelectedType('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              selectedType === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Pros
          </button>
          <button
            id="worker-type-filter-normal"
            onClick={() => setSelectedType('normal')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
              selectedType === 'normal'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-800 hover:text-amber-950'
            }`}
          >
            <span>Normal Workers</span>
            <span className="text-[9px] opacity-90">(From ₹129/hr)</span>
          </button>
          <button
            id="worker-type-filter-specialist"
            onClick={() => setSelectedType('specialist')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              selectedType === 'specialist'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Specialists
          </button>
        </div>
      </div>

      {/* Workers Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayWorkers.map((worker) => (
          <WorkerCard
            key={worker.id}
            worker={worker}
            onViewProfile={onViewProfile}
            onBookWorker={onBookWorker}
          />
        ))}
      </div>

      {/* Bottom Action Footer if more pros available */}
      {filtered.length > displayWorkers.length && (
        <div className="text-center pt-2">
          <button
            id="view-more-workers-btn"
            onClick={() => onNavigateToAllWorkers(selectedTrade === 'all' ? undefined : selectedTrade)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow"
          >
            <span>View {filtered.length - displayWorkers.length} More {selectedTrade === 'all' ? '' : selectedTrade} Professionals in Directory</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};
