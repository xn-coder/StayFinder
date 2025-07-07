

export type UserRole = 'user' | 'host' | 'super-admin';

export type PropertyStatus = 'pending' | 'approved' | 'rejected';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export type InquiryStatus = 'pending' | 'accepted' | 'rejected';

export type PrivacyType = 'entire-place' | 'room' | 'shared-room';

export type Currency = 'INR' | 'USD' | 'EUR';
export type Language = 'en-IN' | 'es' | 'fr';

export type UserVerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  role: UserRole;
  verificationStatus: UserVerificationStatus;
  identityDocumentUrl?: string;
  wishlist?: string[];
  isDisabled?: boolean;
  language?: Language;
  currency?: Currency;
};

export type Property = {
  id:string;
  name:string;
  location: string;
  pricePerNight: number;
  description: string;
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  amenities: string[];
  rating: number;
  reviewsCount: number;
  host: User;
  type: string;
  privacyType: PrivacyType;
  bedrooms: number;
  beds: number;
  baths: number;
  maxGuests: number;
  status: PropertyStatus;
  bookingPolicy: 'review-first' | 'instant-book';
  firstGuestChoice?: 'any' | 'experienced';
  weekendPremium?: number;
  discounts?: {
    newListingPromotion: boolean;
    lastMinute: number;
    weekly: number;
    monthly: number;
  };
  safetyDetails?: {
    hasCamera: boolean;
    hasNoiseMonitor: boolean;
    hasWeapon: boolean;
  };
};

export type Booking = {
  id: string;
  invoiceId: string;
  property: Pick<Property, 'id' | 'name' | 'host'>;
  guest: User;
  dateRange: {
    from: Date;
    to: Date;
  };
  guests: number;
  totalCost: number;
  paymentMethod: 'Credit Card' | 'PayPal';
  status: BookingStatus;
  createdAt: string;
  reviewed?: boolean;
};

export type Inquiry = {
  id: string;
  property: Pick<Property, 'id' | 'name' | 'host'>;
  guest: User;
  message: string;
  status: InquiryStatus;
  createdAt: string;
};
