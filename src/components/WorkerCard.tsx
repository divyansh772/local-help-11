import React from 'react';
import {
  Star,
  CheckCircle,
  MapPin,
  Clock,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Worker } from '../types';
import { WorkerAvatar } from './WorkerAvatar';

interface WorkerCardProps {
  worker: Worker;
  onViewProfile: (worker: Worker) => void;
  onBookWorker: (worker: Worker) => void;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({
  worker,
  onViewProfile,
  onBookWorker,
}) => {
  return (
    <div
      id={`worker-card-${worker.id}`}
      className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Avatar, Name, Verification, Rating */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className="relative flex-shrink-0">
            <WorkerAvatar
              name={worker.name}
              category={worker.category}
              initials={worker.initials}
              badgeColor={worker.badgeColor}
              size="lg"
            />
            {worker.verified && (
              <span
                title="Verified & Background Checked Pro"
                className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-0.5 rounded-full ring-2 ring-white"
              >
                <CheckCircle className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h3 className="text-base font-bold text-slate-900 truncate">{worker.name}</h3>
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-lg text-xs font-bold text-amber-900">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{worker.rating.toFixed(2)}</span>
                <span className="text-slate-400 font-normal">({worker.reviewsCount})</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className="text-xs font-semibold capitalize text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {worker.category}
              </span>
              {worker.workerType === 'normal' ? (
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100/90 px-1.5 py-0.5 rounded">
                  Local Worker
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                  Specialist
                </span>
              )}
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-600 font-medium">
                {worker.experienceYears} yrs exp.
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-slate-400" />
                <span>{worker.jobsCompleted}+ jobs</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{worker.distanceKm} km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Badges / Availability */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {worker.isAvailableToday ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Available Today ({worker.etaMinutes}m ETA)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">
              <Clock className="w-3 h-3" /> Next Slot: Tomorrow
            </span>
          )}

          {worker.badges.slice(0, 2).map((badge, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700"
            >
              <ShieldCheck className="w-3 h-3 text-blue-500" />
              {badge}
            </span>
          ))}
        </div>

        {/* Bio Snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
          {worker.bio}
        </p>

        {/* Specialties Chips */}
        <div className="flex flex-wrap gap-1 mb-4">
          {worker.specialties.slice(0, 3).map((spec, i) => (
            <span
              key={i}
              className="text-[10px] font-medium bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full"
            >
              {spec}
            </span>
          ))}
          {worker.specialties.length > 3 && (
            <span className="text-[10px] font-medium text-slate-400 px-1 py-0.5">
              +{worker.specialties.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Bottom Footer: Price & CTA */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div>
          <span className="text-sm font-black text-slate-900">₹{worker.hourlyRate}</span>
          <span className="text-[11px] text-slate-500 font-medium"> / hr visit</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id={`view-profile-btn-${worker.id}`}
            onClick={() => onViewProfile(worker)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Reviews ({worker.reviewsCount})
          </button>
          <button
            id={`book-worker-btn-${worker.id}`}
            onClick={() => onBookWorker(worker)}
            className="flex items-center gap-1 px-3.5 py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
          >
            <span>Book</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
