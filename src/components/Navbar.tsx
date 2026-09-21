import React from 'react';
import {
  Wrench,
  Sparkles,
  CalendarCheck,
  HardDrive,
  PhoneCall,
  MapPin,
  ChevronDown,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { User } from 'firebase/auth';

interface NavbarProps {
  activeTab: 'services' | 'workers' | 'bookings' | 'drive';
  setActiveTab: (tab: 'services' | 'workers' | 'bookings' | 'drive') => void;
  activeBookingsCount: number;
  user: User | null;
  onGoogleSignIn: () => void;
  onLogout: () => void;
  isLoggingIn: boolean;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  onOpenEmergency: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeBookingsCount,
  user,
  onGoogleSignIn,
  onLogout,
  isLoggingIn,
  selectedCity,
  setSelectedCity,
  onOpenEmergency,
}) => {
  const [cityDropdownOpen, setCityDropdownOpen] = React.useState(false);
  const cities = [
    'Delhi NCR (Connaught Place / Gurgaon)',
    'Mumbai (Bandra / Andheri)',
    'Bengaluru (Indiranagar / Koramangala)',
    'Hyderabad (Hitec City)',
    'Pune (Koregaon Park)',
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & City Selector */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              id="brand-logo-btn"
              onClick={() => setActiveTab('services')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md shadow-slate-900/15 group-hover:bg-blue-600 transition-colors">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight text-slate-900">
                    Local<span className="text-blue-600">Help</span>
                  </span>
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                  Trusted Local Home Services
                </p>
              </div>
            </button>

            {/* City Dropdown */}
            <div className="relative">
              <button
                id="city-selector-btn"
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white text-xs font-medium text-slate-700 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span className="max-w-[120px] sm:max-w-none truncate">{selectedCity}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {cityDropdownOpen && (
                <div className="absolute left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Your Service Area
                  </div>
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                        selectedCity === city
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {city}
                      {selectedCity === city && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              id="nav-services-btn"
              onClick={() => setActiveTab('services')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'services'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Services
            </button>

            <button
              id="nav-workers-btn"
              onClick={() => setActiveTab('workers')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'workers'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Wrench className="w-4 h-4" />
              Find Professionals
            </button>

            <button
              id="nav-bookings-btn"
              onClick={() => setActiveTab('bookings')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 relative ${
                activeTab === 'bookings'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              My Bookings
              {activeBookingsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-blue-600 text-white">
                  {activeBookingsCount}
                </span>
              )}
            </button>

            <button
              id="nav-drive-btn"
              onClick={() => setActiveTab('drive')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'drive'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <HardDrive className="w-4 h-4 text-emerald-600" />
              Drive Receipts
            </button>
          </nav>

          {/* Right Action: Emergency & Google Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Emergency Hotline Button */}
            <button
              id="emergency-dispatch-btn"
              onClick={onOpenEmergency}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 animate-pulse text-rose-600" />
              <span>30-Min Emergency</span>
            </button>

            {/* Google Authentication Control */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="flex items-center gap-2">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full border border-slate-300"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      {user.displayName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="hidden xl:block text-left">
                    <p className="text-xs font-bold text-slate-900 leading-tight">
                      {user.displayName || 'Account'}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                      <HardDrive className="w-2.5 h-2.5" /> Drive Connected
                    </p>
                  </div>
                </div>
                <button
                  id="user-logout-btn"
                  onClick={onLogout}
                  title="Sign out"
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="gsi-sign-in-button"
                onClick={onGoogleSignIn}
                disabled={isLoggingIn}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                <span>{isLoggingIn ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 bg-white py-2 px-2">
        <button
          onClick={() => setActiveTab('services')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-2 rounded ${
            activeTab === 'services' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Services
        </button>
        <button
          onClick={() => setActiveTab('workers')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-2 rounded ${
            activeTab === 'workers' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <Wrench className="w-4 h-4" />
          Pros
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-2 rounded relative ${
            activeTab === 'bookings' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          Bookings
          {activeBookingsCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-blue-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('drive')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-2 rounded ${
            activeTab === 'drive' ? 'text-emerald-600' : 'text-slate-500'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          Drive
        </button>
      </div>
    </header>
  );
};
