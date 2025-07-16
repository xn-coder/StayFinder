
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page is being redirected to /hosting/inquiries
export default function HostInquiriesRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/hosting/inquiries');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Redirecting to host inquiries...</p>
    </div>
  );
}
