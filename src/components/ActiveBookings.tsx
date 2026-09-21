import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  HardDrive,
  Star,
  ExternalLink,
  RotateCcw,
  XCircle,
  Phone,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Booking, Worker } from '../types';
import { WorkerAvatar } from './WorkerAvatar';
import { uploadReceiptToDrive } from '../services/driveService';
import { getAccessToken } from '../services/firebaseAuth';
import { User } from 'firebase/auth';

interface ActiveBookingsProps {
  bookings: Booking[];
  onOpenReviewModal: (workerId: string, bookingId: string) => void;
  onUpdateBookingStatus: (bookingId: string, newStatus: Booking['status']) => void;
  onCancelBooking: (bookingId: string) => void;
  onReceiptUploadedToDrive: (bookingId: string, fileId: string, fileUrl?: string) => void;
  user: User | null;
  onGoogleSignIn: () => void;
  workers: Worker[];
}

export const ActiveBookings: React.FC<ActiveBookingsProps> = ({
  bookings,
  onOpenReviewModal,
  onUpdateBookingStatus,
  onCancelBooking,
  onReceiptUploadedToDrive,
  user,
  onGoogleSignIn,
  workers,
}) => {
  const [syncingBookingId, setSyncingBookingId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ id: string; text: string; type: 'success' | 'error' } | null>(null);

  const handleUploadToDrive = async (booking: Booking) => {
    const token = getAccessToken();
    if (!token || !user) {
      onGoogleSignIn();
      return;
    }

    setSyncingBookingId(booking.id);
    try {
      const result = await uploadReceiptToDrive(booking, token);
      onReceiptUploadedToDrive(booking.id, result.fileId, result.webViewLink);
      setFeedbackMsg({
        id: booking.id,
        text: '✅ Receipt successfully backed up to Google Drive!',
        type: 'success',
      });
    } catch (err: any) {
      console.error('Drive upload failed:', err);
      setFeedbackMsg({
        id: booking.id,
        text: `Failed to upload: ${err.message}`,
        type: 'error',
      });
    } finally {
      setSyncingBookingId(null);
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            Confirmed & Assigned
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-spin" />
            Service In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">No Active Bookings</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
          You haven't scheduled any home services yet. Browse our verified cleaners, plumbers, and electricians to book.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Your Home Service Bookings</h2>
          <p className="text-xs text-slate-500">
            Track real-time progress, share start OTPs, and access Google Drive receipts
          </p>
        </div>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {bookings.length} Total Records
        </span>
      </div>

      <div className="space-y-5">
        {bookings.map((booking) => {
          const workerData = workers.find((w) => w.id === booking.workerId);

          return (
            <div
              key={booking.id}
              id={`booking-card-${booking.id}`}
              className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              {/* Header: ID, Date, Status */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {booking.id}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Created on {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>{getStatusBadge(booking.status)}</div>
              </div>

              {/* Main Info Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {/* Pro info */}
                <div className="flex items-start gap-3">
                  <WorkerAvatar
                    name={booking.workerName}
                    category={booking.workerCategory}
                    initials={workerData?.initials}
                    badgeColor={workerData?.badgeColor}
                    size="md"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{booking.workerName}</h4>
                    <span className="text-xs font-semibold capitalize text-blue-600">
                      Verified {booking.workerCategory}
                    </span>
                    {workerData && (
                      <div className="flex items-center gap-1 text-[11px] text-amber-600 mt-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{workerData.rating.toFixed(2)} rating</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Service & Slot */}
                <div className="space-y-1">
                  <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">
                    Service Details
                  </span>
                  <div className="text-xs font-bold text-slate-900">{booking.serviceName}</div>
                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{booking.address.flatNumber}, {booking.address.street}</span>
                  </div>
                </div>

                {/* OTP & Cost */}
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/70 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                      Doorstep Start OTP
                    </span>
                    <span className="text-xl font-mono font-black text-slate-900 tracking-wider">
                      {booking.otp}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Give to pro upon arrival</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                      Total Paid
                    </span>
                    <span className="text-lg font-black text-slate-900">
                      ₹{booking.pricing.total.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold block">
                      30-Day Covered
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Simulation Bar for active bookings */}
              {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/60">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-700">Real-time Service Progress</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          onUpdateBookingStatus(
                            booking.id,
                            booking.status === 'confirmed' ? 'in_progress' : 'completed'
                          )
                        }
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-white border border-slate-200 px-2 py-0.5 rounded-lg shadow-2xs hover:bg-blue-50 transition-colors"
                      >
                        Advance Step: {booking.status === 'confirmed' ? 'Start Service' : 'Complete Job'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div
                      className={`p-2 rounded-xl border ${
                        booking.status === 'confirmed'
                          ? 'bg-blue-50 border-blue-300 font-bold text-blue-800 ring-1 ring-blue-400'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      }`}
                    >
                      1. Pro Assigned
                    </div>
                    <div
                      className={`p-2 rounded-xl border ${
                        booking.status === 'in_progress'
                          ? 'bg-amber-50 border-amber-300 font-bold text-amber-800 animate-pulse'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}
                    >
                      2. Work in Progress
                    </div>
                    <div className="p-2 rounded-xl border bg-white border-slate-200 text-slate-400">
                      3. Finished & Verified
                    </div>
                  </div>
                </div>
              )}

              {/* Feedback messages */}
              {feedbackMsg && feedbackMsg.id === booking.id && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold ${
                    feedbackMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {feedbackMsg.text}
                </div>
              )}

              {/* Action Bar */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                {/* Google Drive Status / Sync Button */}
                <div className="flex items-center gap-2">
                  {booking.driveFileId ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
                        Saved in Google Drive
                      </span>
                      {booking.driveFileUrl && (
                        <a
                          href={booking.driveFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline"
                        >
                          <span>Open in Drive</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <button
                      id={`upload-drive-btn-${booking.id}`}
                      onClick={() => handleUploadToDrive(booking)}
                      disabled={syncingBookingId === booking.id}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50"
                    >
                      <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                      <span>
                        {syncingBookingId === booking.id
                          ? 'Uploading to Drive...'
                          : 'Save Receipt to Google Drive'}
                      </span>
                    </button>
                  )}
                </div>

                {/* Rating & Review or Cancel controls */}
                <div className="flex items-center gap-2">
                  {booking.status === 'completed' && (
                    <button
                      id={`rate-booking-btn-${booking.id}`}
                      onClick={() => onOpenReviewModal(booking.workerId, booking.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold rounded-xl transition-colors"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{booking.rated ? `Rated ★${booking.ratingGiven}` : 'Rate & Review'}</span>
                    </button>
                  )}

                  {booking.status === 'confirmed' && (
                    <button
                      id={`cancel-booking-btn-${booking.id}`}
                      onClick={() => onCancelBooking(booking.id)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-800 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      Cancel Free
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
