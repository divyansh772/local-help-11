import React, { useState } from 'react';
import {
  Sparkles,
  Wrench,
  Zap,
  Hammer,
  Clock,
  CheckCircle2,
  ArrowRight,
  Search,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import { SERVICE_CATEGORIES, SERVICE_ITEMS } from '../data/mockData';
import { ServiceCategory, ServiceItem } from '../types';

interface ServiceCategoriesProps {
  selectedCategory: ServiceCategory;
  onSelectCategory: (cat: ServiceCategory) => void;
  onBookService: (service: ServiceItem) => void;
  onFindProsForCategory: (cat: ServiceCategory) => void;
}

export const ServiceCategories: React.FC<ServiceCategoriesProps> = ({
  selectedCategory,
  onSelectCategory,
  onBookService,
  onFindProsForCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const getCategoryIcon = (id: ServiceCategory) => {
    switch (id) {
      case 'cleaning':
        return <Sparkles className="w-5 h-5 text-emerald-600" />;
      case 'plumbing':
        return <Wrench className="w-5 h-5 text-blue-600" />;
      case 'electrical':
        return <Zap className="w-5 h-5 text-amber-600" />;
      case 'carpentry':
        return <Hammer className="w-5 h-5 text-orange-600" />;
    }
  };

  const filteredServices = SERVICE_ITEMS.filter((item) => {
    const matchesCategory = item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    return searchQuery.trim() !== '' ? matchesSearch : matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Hero Service Banner with Quick Search */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white p-6 sm:p-10 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Background Checked & Insured Technicians
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-3">
            Expert Home Services, <br className="hidden sm:inline" />
            <span className="text-blue-400">Delivered to Your Doorstep.</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mb-6 leading-relaxed">
            Book top-rated cleaners, licensed plumbers, and electricians in minutes. Standard upfront pricing, real-time tracking, and automated Google Drive warranty backups.
          </p>

          {/* Search bar */}
          <div className="relative flex items-center max-w-lg">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              id="service-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search e.g. deep cleaning, leaking tap, fan repair, lock..."
              className="w-full pl-12 pr-28 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 px-2 py-1 text-xs text-slate-300 hover:text-white bg-white/10 rounded-lg"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Decorative backdrop shapes */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-10 bottom-4 w-60 h-60 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
      </div>

      {/* Category Pills Selector */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Explore Service Categories</h2>
          <button
            id="view-category-pros-btn"
            onClick={() => onFindProsForCategory(selectedCategory)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View Available Pros <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {SERVICE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id && !searchQuery;
            return (
              <button
                key={cat.id}
                id={`category-btn-${cat.id}`}
                onClick={() => {
                  setSearchQuery('');
                  onSelectCategory(cat.id);
                }}
                className={`p-4 sm:p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-white shadow-sm' : 'bg-slate-100 group-hover:bg-white'
                    }`}
                  >
                    {getCategoryIcon(cat.id)}
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div className="text-sm font-bold text-slate-900">{cat.name}</div>
                <div className="text-xs text-slate-500 line-clamp-2 mt-1 leading-snug">
                  {cat.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : `${SERVICE_CATEGORIES.find((c) => c.id === selectedCategory)?.name} Packages`}
            </h3>
            <p className="text-xs text-slate-500">
              Certified experts, fixed upfront quotes & 30-day warranty guarantee
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            {filteredServices.length} options
          </span>
        </div>

        {filteredServices.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">No services found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              We couldn't find matching services for "{searchQuery}". Try searching for cleaning, tap leak, wiring, or carpentry.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {service.category}
                      </span>
                      {service.popular && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          <Tag className="w-3 h-3" /> Most Booked
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-slate-900">₹{service.basePrice}</span>
                      <span className="text-[11px] text-slate-400 block font-medium">Standard Fix</span>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-1.5">{service.name}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 font-medium pb-4 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>~{service.durationMinutes} mins</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Equipment Included</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                      <span>30-Day Cover</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    onClick={() => onFindProsForCategory(service.category)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 py-2 px-1 underline-offset-4 hover:underline"
                  >
                    View Top Pros
                  </button>
                  <button
                    id={`book-service-btn-${service.id}`}
                    onClick={() => onBookService(service)}
                    className="flex-1 max-w-[170px] flex items-center justify-center gap-1.5 py-2.5 px-4 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                  >
                    <span>Instant Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
