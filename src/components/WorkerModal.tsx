import React from 'react';
import {
  X,
  Star,
  CheckCircle,
  Briefcase,
  MapPin,
  Clock,
  ShieldCheck,
  Languages,
  Award,
  MessageSquarePlus,
  ArrowRight,
} from 'lucide-react';
import { Worker } from '../types';
import { WorkerAvatar } from './WorkerAvatar';

interface WorkerModalProps {
  worker: Worker | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (worker: Worker) => void;
  onOpenReviewModal: (worker: Worker) => void;
}

export const WorkerModal: React.FC<WorkerModalProps> = ({
  worker,
  isOpen,
  onClose,
  onBook,
  onOpenReviewModal,
}) => {
  if (!isOpen || !worker) return null;

  // Calculate average aspect scores from worker's reviews
  const reviewsWithAspects = worker.reviews.filter((r) => r.aspectRatings);
  const aspectAverages = {
    punctuality:
      reviewsWithAspects.reduce((acc, r) => acc + (r.aspectRatings?.punctuality || 5), 0) /
      (reviewsWithAspects.length || 1),
    quality:
      reviewsWithAspects.reduce((acc, r) => acc + (r.aspectRatings?.quality || 5), 0) /
      (reviewsWithAspects.length || 1),
    cleanliness:
      reviewsWithAspects.reduce((acc, r) => acc + (r.aspectRatings?.cleanliness || 5), 0) /
      (reviewsWithAspects.length || 1),
    politeness:
      reviewsWithAspects.reduce((acc, r) => acc + (r.aspectRatings?.politeness || 5), 0) /
      (reviewsWithAspects.length || 1),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              {worker.category} Pro
            </span>
            {worker.verified && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Verified & Background Checked
              </span>
            )}
          </div>
          <button
            id="close-worker-modal-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Pro Profile Hero */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100">
            <div className="relative">
              <WorkerAvatar
                name={worker.name}
                category={worker.category}
                initials={worker.initials}
                badgeColor={worker.badgeColor}
                size="xl"
              />
              <span className="absolute -bottom-2 -right-2 bg-slate-900 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow">
                ★ {worker.rating.toFixed(2)}
              </span>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {worker.name}
                </h2>
                {worker.workerType === 'normal' ? (
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md">
                    Local Neighborhood Worker
                  </span>
                ) : (
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                    Certified Specialist
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {worker.experienceYears} Years Experience • Local Neighborhood Area
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                  <span>{worker.jobsCompleted}+ Successful Jobs</span>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{worker.distanceKm} km away (~{worker.etaMinutes}m ETA)</span>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                  <Languages className="w-3.5 h-3.5 text-slate-500" />
                  <span>{worker.languages.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* About Bio */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Professional Background</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
              {worker.bio}
            </p>
          </div>

          {/* Specialties & Badges */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Verified Skills & Tools</h3>
            <div className="flex flex-wrap gap-2">
              {worker.specialties.map((spec, i) => (
                <span
                  key={i}
                  className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 px-3 py-1 rounded-lg"
                >
                  ✓ {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Trust Guarantee Badges */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200/60 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">UrbanFix Trust & Guarantee</h4>
                <p className="text-[11px] text-slate-600">
                  Includes 30-Day Revisit Warranty, Zero-Hidden-Charges policy & ₹10,000 property coverage.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Rating & Review Breakdown */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/70">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Ratings & Performance</h3>
                <p className="text-xs text-slate-500">Based on {worker.reviewsCount} verified customer jobs</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-slate-900 flex items-center gap-1">
                  <Star className="w-6 h-6 fill-amber-400 text-amber-500 inline" />
                  {worker.rating.toFixed(2)}
                </div>
                <span className="text-[11px] font-semibold text-emerald-600">99.4% Positive Feedback</span>
              </div>
            </div>

            {/* Aspect Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200">
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-center">
                <div className="text-xs font-bold text-slate-800">
                  {aspectAverages.punctuality.toFixed(1)} / 5.0
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Punctuality</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-center">
                <div className="text-xs font-bold text-slate-800">
                  {aspectAverages.quality.toFixed(1)} / 5.0
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Work Quality</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-center">
                <div className="text-xs font-bold text-slate-800">
                  {aspectAverages.cleanliness.toFixed(1)} / 5.0
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Cleanliness</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-center">
                <div className="text-xs font-bold text-slate-800">
                  {aspectAverages.politeness.toFixed(1)} / 5.0
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Politeness</div>
              </div>
            </div>
          </div>

          {/* Customer Reviews List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Verified Customer Reviews ({worker.reviews.length})
              </h3>
              <button
                id="open-review-form-btn"
                onClick={() => onOpenReviewModal(worker)}
                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>Write a Review</span>
              </button>
            </div>

            <div className="space-y-3">
              {worker.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                        {rev.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">{rev.userName}</span>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                            Verified User
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block">{rev.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.round(rev.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    "{rev.comment}"
                  </p>

                  <div className="text-[11px] text-slate-400 font-medium pt-1">
                    Booked Service: <span className="text-slate-600 font-semibold">{rev.serviceName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Bottom Fixed CTA */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <span className="text-lg font-black text-slate-900">₹{worker.hourlyRate}</span>
            <span className="text-xs text-slate-500 font-medium"> / hr service fee</span>
          </div>

          <button
            id="book-this-worker-cta-btn"
            onClick={() => onBook(worker)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white text-sm font-bold rounded-2xl shadow-md shadow-slate-900/10 transition-colors"
          >
            <span>Book with {worker.name.split(' ')[0]}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
