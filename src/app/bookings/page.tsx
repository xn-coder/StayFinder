
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page is being redirected to /hosting/bookings
export default function HostBookingsRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/hosting/bookings');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Redirecting to host bookings...</p>
    </div>
  );
}
