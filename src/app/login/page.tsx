
'use client';

import { useEffect } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { setAuthModalState } = useSettings();
  const router = useRouter();

  useEffect(() => {
    // Open the auth modal and then replace the history state to the homepage
    // so the user doesn't see a blank page.
    setAuthModalState({ isOpen: true, view: 'login' });
    router.replace('/');
  }, [setAuthModalState, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}
