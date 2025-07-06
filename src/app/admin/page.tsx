
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { PropertyApprovalList } from '@/components/admin/property-approval-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AllBookingsList } from '@/components/admin/all-bookings-list';
import { IdentityVerificationList } from '@/components/admin/identity-verification-list';
import { AllUsersList } from '@/components/admin/verified-users-list';

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user === undefined) return; 

        if (!user || user.role !== 'super-admin') {
            router.push('/login');
        }
    }, [user, router]);

    if (!user || user.role !== 'super-admin') {
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
                    <h1 className="text-4xl font-bold font-headline">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage property listings, host approvals, and view all bookings.
                    </p>
                </div>
                <Tabs defaultValue="properties">
                    <TabsList className="grid w-full grid-cols-4 max-w-2xl">
                        <TabsTrigger value="properties">Property Approvals</TabsTrigger>
                        <TabsTrigger value="bookings">All Bookings</TabsTrigger>
                        <TabsTrigger value="verification">Identity Verification</TabsTrigger>
                        <TabsTrigger value="verified-users">All Users</TabsTrigger>
                    </TabsList>
                    <TabsContent value="properties" className="mt-6">
                        <PropertyApprovalList />
                    </TabsContent>
                    <TabsContent value="bookings" className="mt-6">
                        <AllBookingsList />
                    </TabsContent>
                    <TabsContent value="verification" className="mt-6">
                        <IdentityVerificationList />
                    </TabsContent>
                    <TabsContent value="verified-users" className="mt-6">
                        <AllUsersList />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
