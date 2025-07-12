'use client';

import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import type { Property, PropertyStatus, Booking, BookingStatus, User, PrivacyType, Inquiry, InquiryStatus } from '@/types';
import { properties as initialProperties } from '@/lib/dummy-data';
import { db } from '@/lib/firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  Timestamp,
  getDocs,
  writeBatch,
  query,
  orderBy,
  runTransaction,
  deleteDoc
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';


interface PropertyContextType {
  properties: Property[];
  addProperty: (data: Omit<Property, 'id'>) => Promise<void>;
  updateProperty: (id: string, data: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  updatePropertyStatus: (id: string, status: PropertyStatus) => void;
  getPropertyById: (id: string) => Property | undefined;
  bookings: Booking[];
  addBooking: (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt' | 'invoiceId'>) => void;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  inquiries: Inquiry[];
  addInquiry: (inquiryData: Omit<Inquiry, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  updateInquiryStatus: (id: string, status: InquiryStatus) => void;
  addReviewAndRating: (bookingId: string, propertyId: string, rating: number, comment: string) => Promise<void>;
  loading: boolean;
  error: string | null; // Added for better error feedback
}

export const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Added error state

  useEffect(() => {
    if (!db) {
      console.log("Firestore is not initialized. Skipping data fetching.");
      setError("Database connection is not configured.");
      setLoading(false);
      return;
    }

    // This function handles the initial fetch and sets up real-time listeners.
    const initializeData = async () => {
      try {
        // 1. Explicitly fetch initial properties data
        const propertiesCollection = collection(db, 'properties');
        let propertiesSnapshot = await getDocs(propertiesCollection);
        
        // 2. Seed the database if it's empty on first load
        if (propertiesSnapshot.empty) {
          console.log('No properties found, seeding database...');
          const batch = writeBatch(db);
          initialProperties.forEach(property => {
            const docRef = doc(db, 'properties', property.id);
            batch.set(docRef, property);
          });
          await batch.commit();
          console.log('Database seeded.');
          // Re-fetch the data after seeding
          propertiesSnapshot = await getDocs(propertiesCollection);
        }

        // 3. Populate state with the initial data
        const initialProps: Property[] = [];
        propertiesSnapshot.forEach(doc => {
            initialProps.push({ id: doc.id, ...doc.data() } as Property);
        });
        setProperties(initialProps);

      } catch (err) {
        console.error("Error during initial properties fetch/seed: ", err);
        setError("Failed to load property data.");
      } finally {
        // 4. Set loading to false after the initial load is complete
        setLoading(false);
      }

      // 5. Now, set up real-time listeners for subsequent updates
      const unsubscribeProperties = onSnapshot(query(collection(db, 'properties')), (snapshot) => {
          const updatedProps: Property[] = [];
          snapshot.forEach(doc => {
              updatedProps.push({ id: doc.id, ...doc.data() } as Property);
          });
          setProperties(updatedProps);
      }, (err) => {
          console.error("Error with properties listener: ", err);
          setError("Lost connection to properties data.");
      });

      const unsubscribeBookings = onSnapshot(query(collection(db, 'bookings'), orderBy('createdAt', 'desc')), (snapshot) => {
          const newBookings: Booking[] = [];
          snapshot.forEach(doc => {
              const data = doc.data();
              newBookings.push({
                  id: doc.id,
                  ...data,
                  dateRange: {
                      from: (data.dateRange.from as Timestamp).toDate(),
                      to: (data.dateRange.to as Timestamp).toDate(),
                  },
                  createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
              } as Booking);
          });
          setBookings(newBookings);
      }, (err) => {
          console.error("Error with bookings listener: ", err);
      });

      const unsubscribeInquiries = onSnapshot(query(collection(db, 'inquiries'), orderBy('createdAt', 'desc')), (snapshot) => {
          const newInquiries: Inquiry[] = [];
          snapshot.forEach(doc => {
              const data = doc.data();
              newInquiries.push({
                  id: doc.id,
                  ...data,
                  createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
              } as Inquiry);
          });
          setInquiries(newInquiries);
      }, (err) => {
          console.error("Error with inquiries listener: ", err);
      });

      // Return a cleanup function to unsubscribe from listeners on component unmount
      return () => {
        unsubscribeProperties();
        unsubscribeBookings();
        unsubscribeInquiries();
      };
    };
    
    let cleanup = () => {};
    initializeData().then(cleanupFn => {
        if (cleanupFn) {
            cleanup = cleanupFn;
        }
    });

    return () => {
      cleanup();
    };
  }, []);
  
  const addProperty = useCallback(async (data: Omit<Property, 'id'>) => {
    if (!db) return;
    try {
      await addDoc(collection(db, 'properties'), data);
    } catch (error)
 {
      console.error("Error adding property: ", error);
    }
  }, []);
  
  const updateProperty = useCallback(async (id: string, data: Partial<Property>) => {
    if (!db) return;
    const propertyDocRef = doc(db, 'properties', id);
    try {
      await updateDoc(propertyDocRef, data);
    } catch (error) {
      console.error("Error updating property: ", error);
    }
  }, []);
  
  const deleteProperty = useCallback(async (id: string) => {
    if (!db) return;
    const propertyDocRef = doc(db, 'properties', id);
    try {
      await deleteDoc(propertyDocRef);
    } catch (error) {
      console.error("Error deleting property: ", error);
    }
  }, []);
  
  const updatePropertyStatus = useCallback(async (id: string, status: PropertyStatus) => {
    if (!db) return;
    const propertyDocRef = doc(db, 'properties', id);
    try {
        await updateDoc(propertyDocRef, { status });
    } catch (error) {
        console.error("Error updating property status: ", error);
    }
  }, []);

  const getPropertyById = useCallback((id: string) => {
      return properties.find(p => p.id === id);
  }, [properties]);

  const addBooking = useCallback(async (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt' | 'invoiceId'>) => {
    if (!db) return;
    const newBooking = {
        ...bookingData,
        invoiceId: `INV-${Date.now()}-${uuidv4().slice(0, 4)}`,
        status: 'pending' as BookingStatus,
        createdAt: Timestamp.now(),
        dateRange: {
            from: Timestamp.fromDate(bookingData.dateRange.from),
            to: Timestamp.fromDate(bookingData.dateRange.to),
        }
    };
    try {
        await addDoc(collection(db, 'bookings'), newBooking);
    } catch (error) {
        console.error("Error adding booking: ", error);
    }
  }, []);

  const updateBookingStatus = useCallback(async (id: string, status: BookingStatus) => {
    if (!db) return;
    const bookingDocRef = doc(db, 'bookings', id);
    try {
      await updateDoc(bookingDocRef, { status });
    } catch(error) {
      console.error("Error updating booking status: ", error);
    }
  }, []);

  const addInquiry = useCallback(async (inquiryData: Omit<Inquiry, 'id' | 'status' | 'createdAt'>) => {
    if (!db) return;
    const newInquiry = {
        ...inquiryData,
        status: 'pending' as InquiryStatus,
        createdAt: Timestamp.now(),
    };
    try {
        await addDoc(collection(db, 'inquiries'), newInquiry);
    } catch (error) {
        console.error("Error adding inquiry: ", error);
    }
  }, []);

  const updateInquiryStatus = useCallback(async (id: string, status: InquiryStatus) => {
    if (!db) return;
    const inquiryDocRef = doc(db, 'inquiries', id);
    try {
        await updateDoc(inquiryDocRef, { status });
    } catch (error) {
        console.error("Error updating inquiry status: ", error);
    }
  }, []);
  
  const addReviewAndRating = useCallback(async (bookingId: string, propertyId: string, rating: number, comment: string) => {
    if (!db) return;
    const propertyDocRef = doc(db, 'properties', propertyId);
    const bookingDocRef = doc(db, 'bookings', bookingId);

    try {
      await runTransaction(db, async (transaction) => {
        const propertyDoc = await transaction.get(propertyDocRef);
        if (!propertyDoc.exists()) {
          throw new Error("Property does not exist!");
        }
        
        const propertyData = propertyDoc.data();
        const currentRating = propertyData.rating || 0;
        const reviewsCount = propertyData.reviewsCount || 0;

        const newReviewsCount = reviewsCount + 1;
        const newAverageRating = ((currentRating * reviewsCount) + rating) / newReviewsCount;
        
        transaction.update(propertyDocRef, {
          rating: parseFloat(newAverageRating.toFixed(2)),
          reviewsCount: newReviewsCount,
        });

        transaction.update(bookingDocRef, { reviewed: true });
      });
    } catch (e) {
      console.error("Review transaction failed: ", e);
      throw e;
    }
  }, []);


  const value = {
      properties,
      addProperty,
      updateProperty,
      deleteProperty,
      updatePropertyStatus,
      getPropertyById,
      bookings,
      addBooking,
      updateBookingStatus,
      inquiries,
      addInquiry,
      updateInquiryStatus,
      addReviewAndRating,
      loading,
      error,
  }

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
}