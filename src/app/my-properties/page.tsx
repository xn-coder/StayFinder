
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { MyPropertiesList } from '@/components/my-properties/my-properties-list';
import { Header } from '@/components/layout/header';
import { Input } from '@/components/ui/input';
import { Search, MessageSquare, BookOpenCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MyPropertiesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

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
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
            <div>
                <h1 className="text-4xl font-bold font-headline">Host Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your property listings, bookings, and inquiries.
                </p>
            </div>
             <div className="relative w-full sm:w-auto sm:min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search your properties..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
        </div>
         <div className="flex gap-4 mb-8">
            <Link href="/bookings" className="w-full">
                <Button variant="outline" className="w-full">
                    <BookOpenCheck className="mr-2" />
                    Manage Bookings
                </Button>
            </Link>
             <Link href="/inquiries" className="w-full">
                <Button variant="outline" className="w-full">
                    <MessageSquare className="mr-2" />
                    Manage Inquiries
                </Button>
            </Link>
        </div>
        <MyPropertiesList searchTerm={searchTerm} />
      </main>
    </div>
  );
}
