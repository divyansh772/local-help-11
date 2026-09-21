export type ServiceCategory = 'cleaning' | 'plumbing' | 'electrical' | 'carpentry';

export interface ServiceItem {
  id: string;
  category: ServiceCategory;
  name: string;
  description: string;
  basePrice: number;
  durationMinutes: number;
  popular?: boolean;
  iconName: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  serviceCategory: ServiceCategory;
  serviceName: string;
  aspectRatings?: {
    punctuality: number;
    quality: number;
    cleanliness: number;
    politeness: number;
  };
}

export interface Worker {
  id: string;
  name: string;
  avatar?: string;
  initials?: string;
  badgeColor?: string;
  category: ServiceCategory;
  specialties: string[];
  rating: number;
  reviewsCount: number;
  jobsCompleted: number;
  hourlyRate: number;
  experienceYears: number;
  verified: boolean;
  distanceKm: number;
  etaMinutes: number;
  isAvailableToday: boolean;
  bio: string;
  reviews: Review[];
  languages: string[];
  badges: string[];
  workerType?: 'normal' | 'specialist';
}

export type BookingStatus = 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  workerId: string;
  workerName: string;
  workerAvatar?: string;
  workerInitials?: string;
  workerBadgeColor?: string;
  workerCategory: ServiceCategory;
  serviceName: string;
  date: string;
  timeSlot: string;
  status: BookingStatus;
  otp: string;
  address: {
    street: string;
    flatNumber: string;
    city: string;
    pincode: string;
    instructions?: string;
  };
  pricing: {
    basePrice: number;
    partsAddonPrice: number;
    safetyFee: number;
    discount: number;
    total: number;
  };
  driveFileId?: string;
  driveFileUrl?: string;
  driveFileName?: string;
  createdAt: string;
  rated?: boolean;
  ratingGiven?: number;
}
