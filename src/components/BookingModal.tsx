import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Tag,
  ArrowRight,
  HardDrive,
  Sparkles,
  Phone,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User } from 'firebase/auth';
import { Worker, ServiceItem, Booking } from '../types';
import { WorkerAvatar } from './WorkerAvatar';
import { SERVICE_ITEMS } from '../data/mockData';
import { uploadReceiptToDrive } from '../services/driveService';
import { getAccessToken } from '../services/firebaseAuth';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedWorker?: Worker | null;
  selectedService?: ServiceItem | null;
  user: User | null;
  onGoogleSignIn: () => void;
  onBookingConfirmed: (newBooking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedWorker,
  selectedService,
  user,
  onGoogleSignIn,
  onBookingConfirmed,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 'success'>(1);
  const [chosenServiceId, setChosenServiceId] = useState<string>(
    selectedService?.id || 'clean-1'
  );
  const [includePartsKit, setIncludePartsKit] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('In 30 mins (Express Dispatch)');
  const [selectedDate, setSelectedDate] = useState('Today');
  
  // Address form
  const [flatNumber, setFlatNumber] = useState('Apt 502, Tower B');
  const [street, setStreet] = useState('742 Highland Vista Blvd');
  const [city, setCity] = useState('Metro City');
  const [pincode, setPincode] = useState('94016');
  const [instructions, setInstructions] = useState('Ring bell #502, lift is right of lobby');
  
  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  // Google Drive auto-sync
  const [saveToDrive, setSaveToDrive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [driveUploadError, setDriveUploadError] = useState<string | null>(null);

  const activeService =
    SERVICE_ITEMS.find((s) => s.id === chosenServiceId) || SERVICE_ITEMS[0];

  const basePrice = activeService.basePrice;
  const partsFee = includePartsKit ? 120 : 0;
  const safetyFee = 49;
  const subtotal = basePrice + partsFee + safetyFee;
  const total = Math.max(0, subtotal - appliedDiscount);

  const availableSlots = [
    { label: '⚡ In 30 mins (Express Dispatch)', note: 'Fastest arrival pro' },
    { label: '11:30 AM - 12:30 PM', note: 'Morning slot' },
    { label: '02:00 PM - 03:00 PM', note: 'Afternoon slot' },
    { label: '04:30 PM - 05:30 PM', note: 'Evening slot' },
    { label: '07:00 PM - 08:00 PM', note: 'Night slot' },
  ];

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'URBAN15') {
      const discountVal = Math.round(subtotal * 0.15);
      setAppliedDiscount(discountVal);
      setCouponMessage('🎉 Promo code URBAN15 applied! 15% saved.');
    } else if (couponCode.trim().toUpperCase() === 'FIRSTFIX') {
      setAppliedDiscount(100);
      setCouponMessage('🎉 Welcome bonus: ₹100.00 off!');
    } else {
      setCouponMessage('❌ Invalid coupon. Try "URBAN15" for 15% off.');
    }
  };

  const handleCompleteBooking = async () => {
    setIsSubmitting(true);
    setDriveUploadError(null);

    const bookingId = `UBX-${Math.floor(10000 + Math.random() * 90000)}`;
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: Booking = {
      id: bookingId,
      workerId: selectedWorker?.id || 'w-clean-1',
      workerName: selectedWorker?.name || 'Rajesh Sharma',
      workerAvatar: selectedWorker?.avatar,
      workerInitials: selectedWorker?.initials || 'RS',
      workerBadgeColor: selectedWorker?.badgeColor || 'bg-emerald-700',
      workerCategory: selectedWorker?.category || activeService.category,
      serviceName: activeService.name,
      date: selectedDate === 'Today' ? `Today, ${selectedSlot.split(' ')[0]}` : `Tomorrow, ${selectedSlot.split(' ')[0]}`,
      timeSlot: selectedSlot,
      status: 'confirmed',
      otp: otp,
      address: {
        flatNumber,
        street,
        city,
        pincode,
        instructions,
      },
      pricing: {
        basePrice,
        partsAddonPrice: partsFee,
        safetyFee,
        discount: appliedDiscount,
        total,
      },
      createdAt: new Date().toISOString(),
    };

    // If user is authenticated with Google Drive and opted in, upload receipt
    const token = getAccessToken();
    if (user && token && saveToDrive) {
      try {
        const driveResult = await uploadReceiptToDrive(newBooking, token);
        newBooking.driveFileId = driveResult.fileId;
        newBooking.driveFileUrl = driveResult.webViewLink;
        newBooking.driveFileName = driveResult.fileName;
      } catch (err: any) {
        console.error('Google Drive receipt upload failed:', err);
        setDriveUploadError(err.message || 'Receipt could not sync to Google Drive');
      }
    }

    setCreatedBooking(newBooking);
    onBookingConfirmed(newBooking);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }

    setIsSubmitting(false);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded">
              {step === 'success' ? 'Confirmed' : `Step ${step} of 4`}
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              {step === 1 && 'Confirm Service & Add-ons'}
              {step === 2 && 'Select Date & Real-time Slot'}
              {step === 3 && 'Service Address & Instructions'}
              {step === 4 && 'Review Order & Price'}
              {step === 'success' && 'Booking Confirmed!'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-5">
          {/* Step 1: Service and Options */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Select Home Service Package
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {SERVICE_ITEMS.filter((s) =>
                    selectedWorker ? s.category === selectedWorker.category : true
                  ).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setChosenServiceId(item.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                        chosenServiceId === item.id
                          ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-500">~{item.durationMinutes} mins</div>
                      </div>
                      <span className="text-xs font-black text-slate-900">₹{item.basePrice}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              <div className="pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Optional Consumables & Fast-Track
                </label>
                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={includePartsKit}
                    onChange={(e) => setIncludePartsKit(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1 text-xs">
                    <span className="font-bold text-slate-900 block">
                      Include Standard Replacement / Cleaning Material Kit (+₹120)
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Technician brings pre-certified spare washers, heavy solvents, or replacement fuses.
                    </span>
                  </div>
                </label>
              </div>

              {/* Assigned Worker Banner */}
              {selectedWorker && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <WorkerAvatar
                    name={selectedWorker.name}
                    category={selectedWorker.category}
                    initials={selectedWorker.initials}
                    badgeColor={selectedWorker.badgeColor}
                    size="md"
                  />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-900">{selectedWorker.name}</div>
                    <div className="text-[11px] text-slate-500">
                      ★ {selectedWorker.rating.toFixed(2)} • {selectedWorker.jobsCompleted}+ jobs completed
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Direct Booking
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Date & Slot */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Day selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Select Day</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Today', 'Tomorrow'].map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(day)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                        selectedDate === day
                          ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Real-time Time Slots */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Choose Real-time Arrival Slot
                </label>
                <div className="space-y-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.label}
                      onClick={() => setSelectedSlot(slot.label)}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                        selectedSlot === slot.label
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold ring-1 ring-blue-600'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>{slot.label}</span>
                      </div>
                      <span className="text-[11px] font-normal text-slate-400">{slot.note}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Address & Instructions */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Flat / House No.
                  </label>
                  <input
                    type="text"
                    value={flatNumber}
                    onChange={(e) => setFlatNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. Apt 4B"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Pincode / Zip
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. 94016"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Street Address & Landmark
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. 742 Evergreen Terrace"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Metro City"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Technician Door Access Instructions
                </label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Ring buzzer #4, park at visitor slot #12"
                />
              </div>
            </div>
          )}

          {/* Step 4: Transparent Price Review & Google Drive Sync */}
          {step === 4 && (
            <div className="space-y-4">
              {/* Summary Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between font-bold text-slate-900 pb-2 border-b border-slate-200">
                  <span>{activeService.name}</span>
                  <span>₹{basePrice.toFixed(2)}</span>
                </div>
                {includePartsKit && (
                  <div className="flex justify-between text-slate-600">
                    <span>Spare Parts & Consumables Kit</span>
                    <span>₹120.00</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Safety, Sanitation & Insurance Fee</span>
                  <span>₹{safetyFee.toFixed(2)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{appliedDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-blue-600">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Coupon Input */}
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon (e.g. URBAN15)"
                    className="flex-1 px-3 py-2 text-xs uppercase font-mono tracking-wider border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    id="apply-coupon-btn"
                    onClick={handleApplyCoupon}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p className="text-[11px] font-semibold text-blue-600 mt-1">{couponMessage}</p>
                )}
              </div>

              {/* Google Drive Integration Checkbox */}
              <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs space-y-2">
                <div className="flex items-start gap-2.5">
                  <HardDrive className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="font-bold text-slate-900 block">
                      Google Drive Receipt & Warranty Auto-Backup
                    </span>
                    <span className="text-slate-600 text-[11px] leading-tight block mt-0.5">
                      Instantly archive your digital invoice, OTP verification pass, and 30-day warranty card in your Google Drive.
                    </span>
                  </div>
                </div>

                {user ? (
                  <label className="flex items-center gap-2 cursor-pointer pt-1 font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={saveToDrive}
                      onChange={(e) => setSaveToDrive(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Save copy to {user.email}'s Drive</span>
                  </label>
                ) : (
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Sign in to enable 1-click Drive saving</span>
                    <button
                      onClick={onGoogleSignIn}
                      className="text-[11px] font-bold text-blue-600 hover:underline"
                    >
                      Sign in with Google
                    </button>
                  </div>
                )}
              </div>

              {/* Safety guarantee badge */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Zero cancellation fee up to 2 hours before scheduled slot.</span>
              </div>
            </div>
          )}

          {/* Success Screen */}
          {step === 'success' && createdBooking && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Service Scheduled Successfully!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Booking ID: <span className="font-mono font-bold text-slate-800">{createdBooking.id}</span>
                </p>
              </div>

              {/* Doorstep Verification OTP */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl max-w-xs mx-auto shadow-md">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
                  Doorstep Verification OTP
                </span>
                <span className="text-3xl font-black tracking-widest text-emerald-400 font-mono">
                  {createdBooking.otp}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">
                  Share this 4-digit code with {createdBooking.workerName} upon doorstep arrival.
                </p>
              </div>

              {/* Google Drive Status Banner */}
              {createdBooking.driveFileId ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold">Receipt Saved to Google Drive!</span>
                  </div>
                  {createdBooking.driveFileUrl && (
                    <a
                      href={createdBooking.driveFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] transition-colors"
                    >
                      Open in Drive
                    </a>
                  )}
                </div>
              ) : driveUploadError ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2 text-left">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Booking confirmed! Google Drive notice: {driveUploadError}</span>
                </div>
              ) : null}

              <div className="text-xs text-slate-600 text-left bg-slate-50 p-3 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-semibold">{createdBooking.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Scheduled:</span>
                  <span className="font-semibold">{createdBooking.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Professional:</span>
                  <span className="font-semibold">{createdBooking.workerName}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {step === 'success' ? (
            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow"
            >
              Done & View My Bookings
            </button>
          ) : (
            <>
              {step > 1 ? (
                <button
                  onClick={() => setStep((step - 1) as any)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200/60 transition-colors"
                >
                  Back
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200/60 transition-colors"
                >
                  Cancel
                </button>
              )}

              {step < 4 ? (
                <button
                  onClick={() => setStep((step + 1) as any)}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow transition-colors"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  id="confirm-booking-final-btn"
                  onClick={handleCompleteBooking}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Confirming...' : `Pay ₹${total.toFixed(2)} & Book`}</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
