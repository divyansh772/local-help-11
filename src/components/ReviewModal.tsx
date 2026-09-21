import React, { useState } from 'react';
import {
  X,
  Star,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ThumbsUp,
} from 'lucide-react';
import { Worker, Review } from '../types';
import { WorkerAvatar } from './WorkerAvatar';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: Worker | null;
  bookingId?: string;
  onSubmitReview: (workerId: string, review: Review, bookingId?: string) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  worker,
  bookingId,
  onSubmitReview,
}) => {
  if (!isOpen || !worker) return null;

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [punctuality, setPunctuality] = useState<number>(5);
  const [quality, setQuality] = useState<number>(5);
  const [cleanliness, setCleanliness] = useState<number>(5);
  const [politeness, setPoliteness] = useState<number>(5);
  const [userName, setUserName] = useState('Satisfied Resident');
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const ratingDescriptions: Record<number, string> = {
    1: 'Poor - Did not meet expectations',
    2: 'Fair - Needs improvement',
    3: 'Good - Standard service delivered',
    4: 'Great - Very satisfied with the outcome',
    5: 'Exceptional - Outstanding craft & courtesy',
  };

  const currentDisplayRating = hoverRating || rating;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      userName: userName.trim() || 'Verified Customer',
      rating,
      date: 'Just now',
      serviceCategory: worker.category,
      serviceName: `${worker.category.toUpperCase()} Home Service`,
      comment:
        comment.trim() ||
        'Excellent, professional service. On time and fixed everything quickly.',
      aspectRatings: {
        punctuality,
        quality,
        cleanliness,
        politeness,
      },
    };

    onSubmitReview(worker.id, newReview, bookingId);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <WorkerAvatar
              name={worker.name}
              category={worker.category}
              initials={worker.initials}
              badgeColor={worker.badgeColor}
              size="sm"
            />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Rate & Review {worker.name}</h3>
              <p className="text-[11px] text-slate-500 capitalize">
                Verified {worker.category} Professional
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Thank You for Your Feedback!</h4>
            <p className="text-xs text-slate-500">
              Your verified rating helps our community reward high-quality service professionals.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
            {/* Overall Star Rating */}
            <div className="text-center py-2 bg-slate-50 rounded-2xl border border-slate-200/80 p-4">
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Overall Service Rating
              </label>

              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= currentDisplayRating
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <span className="text-xs font-semibold text-slate-600 block mt-2">
                {ratingDescriptions[currentDisplayRating]}
              </span>
            </div>

            {/* Granular Aspect Ratings */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Detailed Performance Metrics
              </label>

              {[
                { label: 'Punctuality & Arrival', val: punctuality, setVal: setPunctuality },
                { label: 'Quality & Craftsmanship', val: quality, setVal: setQuality },
                { label: 'Cleanliness & Shoe Covers', val: cleanliness, setVal: setCleanliness },
                { label: 'Courtesy & Clear Explanation', val: politeness, setVal: setPoliteness },
              ].map((aspect, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs py-1.5 px-3 bg-white border border-slate-200/80 rounded-xl"
                >
                  <span className="text-slate-700 font-medium">{aspect.label}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => aspect.setVal(s)}
                        className="p-0.5"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            s <= aspect.val
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* User Name */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Your Display Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. David C."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Review Comment */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Share Your Experience with {worker.name}
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the fix? Did the pro arrive on time? Were they polite and clean?"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                id="submit-review-btn"
                className="w-full py-3 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Submit Verified Review</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
