import React from 'react';
import {
  ShieldCheck,
  Award,
  Sparkles,
  PhoneCall,
  Clock,
  AlertTriangle,
  X,
  ArrowRight,
} from 'lucide-react';

interface SafetyBannerProps {
  onOpenEmergency: () => void;
}

export const SafetyBanner: React.FC<SafetyBannerProps> = ({ onOpenEmergency }) => {
  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <div className="md:col-span-3 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>The Local Help Customer Promise</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            High Standards. Verified Professionals. Zero Worry.
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-emerald-400">
                ✓
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">Full Background Check</h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Government ID verified and criminal record cleared for all technicians.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-blue-400">
                ✓
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">30-Day Revisit Warranty</h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  If the same issue recurs within 30 days, we fix it completely free of charge.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-amber-400">
                ✓
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">Fixed Upfront Quotes</h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  No surprise bills or doorstep price negotiations. Guaranteed digital receipt.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 30-min Emergency Quick Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl text-center space-y-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 mx-auto">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Emergency Breakdown?</h4>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Water leak flooding or power blackout? Get instant dispatch in 30 mins.
            </p>
          </div>
          <button
            id="emergency-banner-dispatch-btn"
            onClick={onOpenEmergency}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency Dispatch</span>
          </button>
        </div>
      </div>

      <div className="absolute -left-20 -bottom-20 w-60 h-60 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
    </div>
  );
};

export const EmergencyModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelectEmergencyService: (category: 'plumbing' | 'electrical') => void;
}> = ({ isOpen, onClose, onSelectEmergencyService }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-rose-200 overflow-hidden my-auto p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-rose-600">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <PhoneCall className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">30-Min Rapid Emergency Response</h3>
              <p className="text-[10px] text-slate-500">Fast-track dispatch for home emergencies</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Emergency response units are pre-stationed across Metro City. Choose your urgent issue to route the nearest technician immediately with acoustic leak sensors and high-voltage circuit gear:
        </p>

        <div className="space-y-2.5">
          <button
            onClick={() => {
              onSelectEmergencyService('plumbing');
              onClose();
            }}
            className="w-full text-left p-4 rounded-2xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/80 transition-colors flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-black text-blue-900 block">
                🚨 Major Burst Pipe or Overflowing Drain
              </span>
              <span className="text-[11px] text-blue-700">
                Nearest master plumber dispatched (~18 mins ETA)
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-600" />
          </button>

          <button
            onClick={() => {
              onSelectEmergencyService('electrical');
              onClose();
            }}
            className="w-full text-left p-4 rounded-2xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/80 transition-colors flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-black text-amber-900 block">
                ⚡ Sparks, Burning Smell or Complete MCB Blackout
              </span>
              <span className="text-[11px] text-amber-700">
                Licensed electrician dispatched with isolation diagnostic (~15 mins ETA)
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-600" />
          </button>
        </div>

        <div className="text-center pt-2 text-[11px] text-slate-400">
          Local Help 24/7 Helpline: <strong>1-800-LOCAL-HELP (Toll Free)</strong>
        </div>
      </div>
    </div>
  );
};
