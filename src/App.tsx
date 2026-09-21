/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Wrench,
  Zap,
  Hammer,
  Filter,
  Search,
  SlidersHorizontal,
  HardDrive,
  CalendarCheck,
  ShieldCheck,
  Star,
  CheckCircle2,
  ArrowUpDown,
  PhoneCall,
} from 'lucide-react';
import { User } from 'firebase/auth';

import {
  ServiceCategory,
  ServiceItem,
  Worker,
  Booking,
  Review,
} from './types';
import { WORKERS, SERVICE_ITEMS, INITIAL_BOOKINGS } from './data/mockData';
import {
  initAuth,
  googleSignIn,
  logout,
  setCachedToken,
} from './services/firebaseAuth';

import { Navbar } from './components/Navbar';
import { ServiceCategories } from './components/ServiceCategories';
import { WorkerCard } from './components/WorkerCard';
import { WorkerModal } from './components/WorkerModal';
import { BookingModal } from './components/BookingModal';
import { ActiveBookings } from './components/ActiveBookings';
import { DriveReceiptsModal } from './components/DriveReceiptsModal';
import { ReviewModal } from './components/ReviewModal';
import { SafetyBanner, EmergencyModal } from './components/SafetyBanner';
import { WorkersProfilesSection } from './components/WorkersProfilesSection';

export default function App() {
  // Navigation & Category state
  const [activeTab, setActiveTab] = useState<'services' | 'workers' | 'bookings' | 'drive'>('services');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('cleaning');
  const [selectedCity, setSelectedCity] = useState('Delhi NCR (Connaught Place / Gurgaon)');

  // Pros Filter & Search state
  const [proCategoryFilter, setProCategoryFilter] = useState<'all' | ServiceCategory>('all');
  const [proWorkerTypeFilter, setProWorkerTypeFilter] = useState<'all' | 'normal' | 'specialist'>('all');
  const [proSortBy, setProSortBy] = useState<'rating' | 'jobs' | 'price' | 'distance'>('rating');
  const [proSearchQuery, setProSearchQuery] = useState('');
  const [availableOnlyFilter, setAvailableOnlyFilter] = useState(false);

  // Data state with local persistence
  const [workers, setWorkers] = useState<Worker[]>(() => {
    try {
      const saved = localStorage.getItem('localhelp_workers_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= WORKERS.length) {
          return parsed;
        }
      }
      return WORKERS;
    } catch {
      return WORKERS;
    }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem('localhelp_bookings_v4');
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('localhelp_workers_v4', JSON.stringify(workers));
    } catch (e) {
      console.error('Failed to save workers to storage:', e);
    }
  }, [workers]);

  useEffect(() => {
    try {
      localStorage.setItem('localhelp_bookings_v4', JSON.stringify(bookings));
    } catch (e) {
      console.error('Failed to save bookings to storage:', e);
    }
  }, [bookings]);

  // Google Authentication state
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (authenticatedUser, token) => {
        setUser(authenticatedUser);
        setCachedToken(token);
      },
      () => {
        // Not authenticated
        setUser(null);
        setCachedToken(null);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const { user: authedUser, accessToken } = await googleSignIn();
      setUser(authedUser);
      setCachedToken(accessToken);
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
      setAuthError(err.message || 'Google sign-in could not be completed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  // Modals state
  const [selectedWorkerForProfile, setSelectedWorkerForProfile] = useState<Worker | null>(null);
  const [selectedWorkerForBooking, setSelectedWorkerForBooking] = useState<Worker | null>(null);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServiceItem | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewTargetWorker, setReviewTargetWorker] = useState<Worker | null>(null);
  const [reviewTargetBookingId, setReviewTargetBookingId] = useState<string | undefined>(undefined);

  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // Handlers
  const handleOpenBookingForService = (service: ServiceItem) => {
    setSelectedServiceForBooking(service);
    // Find best pro matching this category
    const matchingWorker = workers.find((w) => w.category === service.category);
    setSelectedWorkerForBooking(matchingWorker || null);
    setIsBookingModalOpen(true);
  };

  const handleOpenBookingForWorker = (worker: Worker) => {
    setSelectedWorkerForBooking(worker);
    const matchingService = SERVICE_ITEMS.find((s) => s.category === worker.category);
    setSelectedServiceForBooking(matchingService || null);
    setIsBookingModalOpen(true);
  };

  const handleBookingConfirmed = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handleUpdateBookingStatus = (bookingId: string, newStatus: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );
  };

  const handleReceiptUploaded = (bookingId: string, fileId: string, url?: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              driveFileId: fileId,
              driveFileUrl: url,
              driveFileName: `UrbanFix_Receipt_${b.id}.html`,
            }
          : b
      )
    );
  };

  const handleOpenReviewModal = (worker: Worker, bookingId?: string) => {
    setReviewTargetWorker(worker);
    setReviewTargetBookingId(bookingId);
    setIsReviewModalOpen(true);
  };

  const handleOpenReviewForWorkerId = (workerId: string, bookingId: string) => {
    const worker = workers.find((w) => w.id === workerId);
    if (worker) {
      handleOpenReviewModal(worker, bookingId);
    }
  };

  const handleSubmitReview = (workerId: string, review: Review, bookingId?: string) => {
    setWorkers((prevWorkers) =>
      prevWorkers.map((w) => {
        if (w.id === workerId) {
          const updatedReviews = [review, ...w.reviews];
          const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
          const newAvgRating = Number((totalRating / updatedReviews.length).toFixed(2));

          return {
            ...w,
            rating: newAvgRating,
            reviewsCount: updatedReviews.length,
            reviews: updatedReviews,
          };
        }
        return w;
      })
    );

    if (bookingId) {
      setBookings((prevBookings) =>
        prevBookings.map((b) =>
          b.id === bookingId
            ? { ...b, rated: true, ratingGiven: review.rating }
            : b
        )
      );
    }

    // Also update current active modal pro if open
    if (selectedWorkerForProfile && selectedWorkerForProfile.id === workerId) {
      setSelectedWorkerForProfile((prev) => {
        if (!prev) return null;
        const updatedReviews = [review, ...prev.reviews];
        const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
        return {
          ...prev,
          rating: Number((totalRating / updatedReviews.length).toFixed(2)),
          reviewsCount: updatedReviews.length,
          reviews: updatedReviews,
        };
      });
    }
  };

  const handleSelectEmergencyCategory = (cat: 'plumbing' | 'electrical') => {
    setSelectedCategory(cat);
    setProCategoryFilter(cat);
    setActiveTab('workers');
  };

  // Filtered workers logic
  const filteredWorkers = workers
    .filter((w) => {
      const matchesCategory =
        proCategoryFilter === 'all' || w.category === proCategoryFilter;
      const matchesSearch =
        proSearchQuery.trim() === '' ||
        w.name.toLowerCase().includes(proSearchQuery.toLowerCase()) ||
        w.specialties.some((s) => s.toLowerCase().includes(proSearchQuery.toLowerCase())) ||
        w.bio.toLowerCase().includes(proSearchQuery.toLowerCase());
      const matchesAvailable = !availableOnlyFilter || w.isAvailableToday;
      const matchesType =
        proWorkerTypeFilter === 'all'
          ? true
          : proWorkerTypeFilter === 'normal'
          ? w.workerType === 'normal'
          : w.workerType !== 'normal';

      return matchesCategory && matchesSearch && matchesAvailable && matchesType;
    })
    .sort((a, b) => {
      if (proSortBy === 'rating') return b.rating - a.rating;
      if (proSortBy === 'jobs') return b.jobsCompleted - a.jobsCompleted;
      if (proSortBy === 'price') return a.hourlyRate - b.hourlyRate;
      if (proSortBy === 'distance') return a.distanceKm - b.distanceKm;
      return 0;
    });

  const activeBookingsCount = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'in_progress'
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeBookingsCount={activeBookingsCount}
        user={user}
        onGoogleSignIn={handleGoogleSignIn}
        onLogout={handleLogout}
        isLoggingIn={isLoggingIn}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
      />

      {/* Auth notification toast if sign-in error */}
      {authError && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-xs py-2 px-4 text-center">
          Notice: {authError}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* VIEW 1: Home Services Catalog */}
        {activeTab === 'services' && (
          <div className="space-y-10">
            <ServiceCategories
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
              }}
              onBookService={handleOpenBookingForService}
              onFindProsForCategory={(cat) => {
                setProCategoryFilter(cat);
                setActiveTab('workers');
              }}
            />

            {/* Workers Profiles Showcase Section */}
            <WorkersProfilesSection
              workers={workers}
              onViewProfile={(w) => setSelectedWorkerForProfile(w)}
              onBookWorker={(w) => handleOpenBookingForWorker(w)}
              onNavigateToAllWorkers={(category) => {
                if (category) {
                  setProCategoryFilter(category);
                } else {
                  setProCategoryFilter('all');
                }
                setActiveTab('workers');
              }}
            />

            {/* Safety & Trust Promises */}
            <SafetyBanner onOpenEmergency={() => setIsEmergencyModalOpen(true)} />
          </div>
        )}

        {/* VIEW 2: Verified Workers Directory */}
        {activeTab === 'workers' && (
          <div className="space-y-6">
            {/* Header with Title & Filter Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Verified Local Professionals
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Background checked, 4.8+ rated pros ready for real-time dispatch in {selectedCity}
                </p>
              </div>

              {/* Search Pro Box */}
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={proSearchQuery}
                  onChange={(e) => setProSearchQuery(e.target.value)}
                  placeholder="Search pro name or skill..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filter Pills and Sort Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'All Trades' },
                  { id: 'cleaning', label: 'Cleaning' },
                  { id: 'plumbing', label: 'Plumbing' },
                  { id: 'electrical', label: 'Electrical' },
                  { id: 'carpentry', label: 'Carpentry' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setProCategoryFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      proCategoryFilter === tab.id
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}

                <span className="text-slate-300 mx-1">|</span>

                {/* Worker Tier Toggle */}
                <button
                  onClick={() => setProWorkerTypeFilter('all')}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    proWorkerTypeFilter === 'all'
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Tiers
                </button>
                <button
                  onClick={() => setProWorkerTypeFilter('normal')}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                    proWorkerTypeFilter === 'normal'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200/60'
                  }`}
                >
                  <span>Normal Workers (₹129-₹249/hr)</span>
                </button>
                <button
                  onClick={() => setProWorkerTypeFilter('specialist')}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    proWorkerTypeFilter === 'specialist'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Specialists
                </button>
              </div>

              {/* Sorting & Availability Toggle */}
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={availableOnlyFilter}
                    onChange={(e) => setAvailableOnlyFilter(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Available Today Only</span>
                </label>

                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-400 font-medium">Sort:</span>
                  <select
                    value={proSortBy}
                    onChange={(e) => setProSortBy(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="rating">Highest Rating</option>
                    <option value="jobs">Most Completed Jobs</option>
                    <option value="distance">Nearest Distance / ETA</option>
                    <option value="price">Lowest Hourly Rate</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Workers Grid */}
            {filteredWorkers.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">No matching professionals</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  Try clearing your search query or enabling all categories.
                </p>
                <button
                  onClick={() => {
                    setProSearchQuery('');
                    setProCategoryFilter('all');
                    setAvailableOnlyFilter(false);
                  }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredWorkers.map((worker) => (
                  <WorkerCard
                    key={worker.id}
                    worker={worker}
                    onViewProfile={(w) => setSelectedWorkerForProfile(w)}
                    onBookWorker={(w) => handleOpenBookingForWorker(w)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: Active Bookings & Tracking */}
        {activeTab === 'bookings' && (
          <ActiveBookings
            bookings={bookings}
            onOpenReviewModal={handleOpenReviewForWorkerId}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onCancelBooking={handleCancelBooking}
            onReceiptUploadedToDrive={handleReceiptUploaded}
            user={user}
            onGoogleSignIn={handleGoogleSignIn}
            workers={workers}
          />
        )}

        {/* VIEW 4: Google Drive Receipts & Warranties */}
        {activeTab === 'drive' && (
          <DriveReceiptsModal
            user={user}
            onGoogleSignIn={handleGoogleSignIn}
            bookings={bookings}
            onReceiptUploaded={handleReceiptUploaded}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900">Local Help</span>
            <span>• The Trusted Home Services Network</span>
          </div>
          <div className="flex items-center gap-4">
            <span>🛡️ 30-Day Guarantee</span>
            <span>⚡ Real-time Dispatch</span>
            <span>📂 Google Drive Cloud Receipts</span>
          </div>
        </div>
      </footer>

      {/* Worker Profile & Reviews Modal */}
      <WorkerModal
        worker={selectedWorkerForProfile}
        isOpen={!!selectedWorkerForProfile}
        onClose={() => setSelectedWorkerForProfile(null)}
        onBook={(w) => {
          setSelectedWorkerForProfile(null);
          handleOpenBookingForWorker(w);
        }}
        onOpenReviewModal={(w) => {
          handleOpenReviewModal(w);
        }}
      />

      {/* Real-time Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        selectedWorker={selectedWorkerForBooking}
        selectedService={selectedServiceForBooking}
        user={user}
        onGoogleSignIn={handleGoogleSignIn}
        onBookingConfirmed={handleBookingConfirmed}
      />

      {/* Review & Rating Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setReviewTargetWorker(null);
          setReviewTargetBookingId(undefined);
        }}
        worker={reviewTargetWorker}
        bookingId={reviewTargetBookingId}
        onSubmitReview={handleSubmitReview}
      />

      {/* 30-Min Rapid Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onSelectEmergencyService={handleSelectEmergencyCategory}
      />
    </div>
  );
}
