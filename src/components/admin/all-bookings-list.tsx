
'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileText } from 'lucide-react';
import { InvoiceDialog } from '../bookings/invoice-dialog';

export function AllBookingsList() {
  const { bookings, loading } = useProperties();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [bookings]);

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
      <TableCell><Skeleton className="h-5 w-1/2" /></TableCell>
      <TableCell><Skeleton className="h-5 w-1/2" /></TableCell>
      <TableCell><Skeleton className="h-5 w-2/3" /></TableCell>
      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
      <TableCell className="text-right"><Skeleton className="h-8 w-24" /></TableCell>
    </TableRow>
  )

  return (
    <>
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Host</TableHead>
            <TableHead>Guest</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
             Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
          ) : sortedBookings.length > 0 ? (
            sortedBookings.map(booking => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.property.name}</TableCell>
                <TableCell>{booking.property.host?.name || 'Unknown Host'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={booking.guest.avatar} alt={booking.guest.name} />
                      <AvatarFallback>{booking.guest.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{booking.guest.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                    {format(new Date(booking.dateRange.from), 'MMM d')} - {format(new Date(booking.dateRange.to), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(booking.status)} className="capitalize">
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedBooking(booking)}
                    >
                        <FileText className="mr-2 h-4 w-4" />
                        Invoice
                    </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
             <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                    No bookings have been made yet.
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
    </>
  );
}
