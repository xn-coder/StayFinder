

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page is being redirected to /hosting/dashboard
export default function MyPropertiesRedirectPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/hosting/dashboard');
    }, [router]);

    return (
        <div className="flex h-screen items-center justify-center">
            <p>Redirecting to your host dashboard...</p>
        </div>
    );
}
