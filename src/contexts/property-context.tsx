
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
  orderBy
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';


interface PropertyContextType {
  properties: Property[];
  addProperty: (data: Omit<Property, 'id'>) => Promise<void>;
  updatePropertyStatus: (id: string, status: PropertyStatus) => void;
  getPropertyById: (id: string) => Property | undefined;
  bookings: Booking[];
  addBooking: (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt' | 'invoiceId'>) => void;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  inquiries: Inquiry[];
  addInquiry: (inquiryData: Omit<Inquiry, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  updateInquiryStatus: (id: string, status: InquiryStatus) => void;
  loading: boolean;
}

export const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupFirestore = async () => {
      try {
        const propertiesCollection = collection(db, 'properties');
        const snapshot = await getDocs(propertiesCollection);
        if (snapshot.empty) {
          console.log('No properties found, seeding database...');
          const batch = writeBatch(db);
          initialProperties.forEach(property => {
            const docRef = doc(db, 'properties', property.id);
            batch.set(docRef, property);
          });
          await batch.commit();
          console.log('Database seeded.');
        }

        const unsubscribeProperties = onSnapshot(query(collection(db, 'properties')), (snapshot) => {
            const props: Property[] = [];
            snapshot.forEach(doc => {
                props.push({ id: doc.id, ...doc.data() } as Property);
            });
            setProperties(props);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching properties: ", error);
            setLoading(false);
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
        }, (error) => {
            console.error("Error fetching bookings: ", error);
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
        }, (error) => {
            console.error("Error fetching inquiries: ", error);
        });

        return () => {
          unsubscribeProperties();
          unsubscribeBookings();
          unsubscribeInquiries();
        };

      } catch (error) {
        console.error("Error during Firestore setup: ", error);
        setLoading(false);
        return () => {};
      }
    };
    
    let cleanupPromise = setupFirestore();

    return () => {
      cleanupPromise.then(cleanup => cleanup());
    };
  }, []);
  
  const addProperty = useCallback(async (data: Omit<Property, 'id'>) => {
    try {
      await addDoc(collection(db, 'properties'), data);
    } catch (error)
 {
      console.error("Error adding property: ", error);
    }
  }, []);
  
  const updatePropertyStatus = useCallback(async (id: string, status: PropertyStatus) => {
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
    const bookingDocRef = doc(db, 'bookings', id);
    try {
      await updateDoc(bookingDocRef, { status });
    } catch(error) {
      console.error("Error updating booking status: ", error);
    }
  }, []);

  const addInquiry = useCallback(async (inquiryData: Omit<Inquiry, 'id' | 'status' | 'createdAt'>) => {
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
    const inquiryDocRef = doc(db, 'inquiries', id);
    try {
        await updateDoc(inquiryDocRef, { status });
    } catch (error) {
        console.error("Error updating inquiry status: ", error);
    }
  }, []);


  const value = {
      properties,
      addProperty,
      updatePropertyStatus,
      getPropertyById,
      bookings,
      addBooking,
      updateBookingStatus,
      inquiries,
      addInquiry,
      updateInquiryStatus,
      loading,
  }

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
}
