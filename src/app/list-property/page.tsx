
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { ListPropertyForm } from '@/components/list-property-form';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ListChecks, Star, CircleDollarSign, PartyPopper, Building } from 'lucide-react';

const ListPropertyIntro = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <div className="w-full max-w-6xl">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        {/* Left Column */}
        <div className="text-left">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 text-primary">
            It's easy to get started on StayFinder
          </h1>
        </div>
        
        {/* Right Column */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent flex-shrink-0">
                <ListChecks className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">1. Tell us about your place</h3>
                <p className="mt-1 text-muted-foreground">Share some basic info, such as where it is and how many guests can stay.</p>
              </div>
          </div>
          <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent flex-shrink-0">
                  <Star className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">2. Make it stand out</h3>
                <p className="mt-1 text-muted-foreground">Add 5 or more photos plus a title and description – we’ll help you out.</p>
              </div>
          </div>
          <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent flex-shrink-0">
                  <CircleDollarSign className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">3. Finish up and publish</h3>
                <p className="mt-1 text-muted-foreground">Choose a starting price, verify a few details, then publish your listing.</p>
              </div>
          </div>
          <div className="flex justify-end mt-12">
             <Button onClick={onGetStarted}>
              <PartyPopper className="mr-2" />
              Let's Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default function ListPropertyPage() {
  const { user, switchToHostRole } = useAuth();
  const router = useRouter();
  const [isFormStarted, setIsFormStarted] = useState(false);

  useEffect(() => {
    if (user === undefined) return;

    if (!user) {
      router.push('/login?redirect=/list-property');
    }
  }, [user, router]);
  
  const BecomeAHostPrompt = () => (
    <div className="text-center p-8 max-w-lg">
      <Building className="mx-auto h-16 w-16 text-primary mb-4" />
      <h1 className="text-3xl font-bold font-headline mb-4">Want to start hosting?</h1>
      <p className="text-muted-foreground mb-6">
        It's easy to get started. By becoming a host, you can list your properties and earn money. Click the button below to update your account to a host role.
      </p>
      <Button onClick={() => switchToHostRole(user!.id)} size="lg">
        Become a Host
      </Button>
    </div>
  );

  if (user === undefined || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading or redirecting...</p>
      </div>
    );
  }

  if (user.role === 'user') {
    return (
      <div className="flex flex-col h-screen bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <BecomeAHostPrompt />
        </main>
      </div>
    );
  }

  if (user.role === 'super-admin') {
      router.push('/admin');
      return (
        <div className="flex h-screen items-center justify-center">
          <p>Redirecting...</p>
        </div>
      );
  }

  if (user.verificationStatus !== 'verified') {
    return (
      <div className="flex flex-col h-screen bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center">
            <div className="text-center p-8 max-w-md">
                <ShieldCheck className="mx-auto h-16 w-16 text-primary mb-4" />
                <h1 className="text-2xl font-bold font-headline mb-2">Verify Your Identity to Host</h1>
                <p className="text-muted-foreground mb-6">
                    For the safety of our community, we require hosts to verify their identity before listing a property.
                </p>
                <Button onClick={() => router.push('/account/settings')}>
                    Go to Account Settings
                </Button>
            </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        {isFormStarted ? (
          <ListPropertyForm />
        ) : (
          <ListPropertyIntro onGetStarted={() => setIsFormStarted(true)} />
        )}
      </main>
    </div>
  );
}
