
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { BookingsList } from '@/components/bookings/bookings-list';

export default function HostBookingsPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) return; 

    if (!user || user.role !== 'host') {
      router.push('/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'host') {
    return (
       <div className="flex h-screen items-center justify-center">
          <p>Loading or redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
            <h1 className="text-4xl font-bold font-headline">My Bookings</h1>
            <p className="text-muted-foreground mt-2">
                Manage bookings from guests for your properties.
            </p>
        </div>
        <BookingsList />
      </main>
    </div>
  );
}
