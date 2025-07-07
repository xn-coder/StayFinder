
'use client';

import { useMemo, useState } from 'react';
import { format, isPast } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { useProperties } from '@/hooks/use-properties';
import type { Booking, BookingStatus } from '@/types';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Eye, Star } from 'lucide-react';
import { InvoiceDialog } from '../bookings/invoice-dialog';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReviewDialog } from './review-dialog';

export function MyBookingsList() {
  const { user } = useAuth();
  const { bookings, loading } = useProperties();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  const userBookings = useMemo(() => {
    if (!user) return [];
    return bookings
      .filter(booking => booking.guest.id === user.id)
      .sort((a, b) => new Date(a.dateRange.from).getTime() - new Date(b.dateRange.from).getTime());
  }, [user, bookings]);

  const filteredBookings = useMemo(() => {
    switch (activeTab) {
      case 'upcoming':
        // A booking is upcoming if it's pending, OR confirmed and not yet finished.
        return userBookings.filter(b => b.status === 'pending' || (b.status === 'confirmed' && !isPast(b.dateRange.to)));
      case 'completed':
        // A booking is completed if it's confirmed and its end date is in the past.
        return userBookings.filter(b => b.status === 'confirmed' && isPast(b.dateRange.to));
      case 'cancelled':
        // A booking is cancelled if its status is 'cancelled'.
        return userBookings.filter(b => b.status === 'cancelled');
      default:
        return [];
    }
  }, [userBookings, activeTab]);

  const statusVariant = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  const SkeletonRow = () => (
    <TableRow>
      <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
      <TableCell><Skeleton className="h-5 w-2/3" /></TableCell>
      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
      <TableCell className="text-right">
        <div className="flex gap-2 justify-end">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
      </TableCell>
    </TableRow>
  )

  if (loading) {
     return (
        <div className="border rounded-lg">
            <Tabs defaultValue="upcoming" className="mb-6">
                <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto bg-primary/5 p-1 rounded-xl">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
            </Tabs>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
                </TableBody>
            </Table>
        </div>
     )
  }

  return (
    <>
      <Tabs defaultValue="upcoming" onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto bg-primary/5 p-1 rounded-xl h-auto" style={{ background: '#155e63'}}>
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-background data-[state=inactive]:text-white data-[state=active]:text-foreground">Upcoming</TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-background data-[state=inactive]:text-white data-[state=active]:text-foreground">Completed</TabsTrigger>
              <TabsTrigger value="cancelled" className="data-[state=active]:bg-background data-[state=inactive]:text-white data-[state=active]:text-foreground">Cancelled</TabsTrigger>
          </TabsList>
      </Tabs>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map(booking => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.property.name}</TableCell>
                  <TableCell>
                      {format(new Date(booking.dateRange.from), 'MMM d, yyyy')} - {format(new Date(booking.dateRange.to), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(booking.status)} className="capitalize">
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                          <Link href={`/property/${booking.property.id}`}>
                              <Button variant="outline" size="sm">
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Property
                              </Button>
                          </Link>
                          <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedBooking(booking)}
                          >
                              <FileText className="mr-2 h-4 w-4" />
                              Invoice
                          </Button>
                          {activeTab === 'completed' && !booking.reviewed && (
                            <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => setReviewingBooking(booking)}
                            >
                                <Star className="mr-2 h-4 w-4" />
                                Leave Review
                            </Button>
                        )}
                      </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    {activeTab === 'upcoming' && "You have no upcoming bookings."}
                    {activeTab === 'completed' && "You have no completed bookings."}
                    {activeTab === 'cancelled' && "You have no cancelled bookings."}
                  </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {selectedBooking && (
          <InvoiceDialog 
              booking={selectedBooking} 
              isOpen={!!selectedBooking}
              onOpenChange={(isOpen) => {
                  if (!isOpen) {
                      setSelectedBooking(null);
                  }
              }}
          />
      )}
      <ReviewDialog
        booking={reviewingBooking}
        isOpen={!!reviewingBooking}
        onOpenChange={(isOpen) => {
            if (!isOpen) {
                setReviewingBooking(null);
            }
        }}
      />
    </>
  );
}
