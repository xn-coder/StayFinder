
'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, FileText, Contact } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InvoiceDialog } from './invoice-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import Image from 'next/image';

export function BookingsList() {
  const { user } = useAuth();
  const { bookings, updateBookingStatus, loading } = useProperties();
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [viewingDocumentUrl, setViewingDocumentUrl] = useState<string | null>(null);

  const hostBookings = useMemo(() => {
    if (!user) return [];
    return bookings
      .filter(booking => booking.property.host.id === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [user, bookings]);

  const handleStatusChange = (id: string, newStatus: 'confirmed' | 'cancelled') => {
    updateBookingStatus(id, newStatus);
    toast({
      title: `Booking ${newStatus}`,
      description: `The booking has been ${newStatus}.`,
    });
  };

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
      <TableCell><Skeleton className="h-5 w-2/3" /></TableCell>
      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
      <TableCell className="text-right"><Skeleton className="h-8 w-24" /></TableCell>
    </TableRow>
  )

  if (!user) return null;

  return (
    <>
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Guest</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
             Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : hostBookings.length > 0 ? (
            hostBookings.map(booking => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.property.name}</TableCell>
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
                    {format(new Date(booking.dateRange.from), 'MMM d, yyyy')} - {format(new Date(booking.dateRange.to), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(booking.status)} className="capitalize">
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                        {booking.status === 'confirmed' && booking.guest.verificationStatus === 'verified' && booking.guest.identityDocumentUrl && (
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => setViewingDocumentUrl(booking.guest.identityDocumentUrl!)}
                            >
                                <Contact className="mr-2 h-4 w-4" />
                                View Guest ID
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedBooking(booking)}
                        >
                            <FileText className="mr-2 h-4 w-4" />
                            Invoice
                        </Button>
                        {booking.status === 'pending' && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(booking.id, 'confirmed')}
                            >
                                <Check className="mr-2 h-4 w-4" />
                                Confirm
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleStatusChange(booking.id, 'cancelled')}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                        </>
                        )}
                    </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
             <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                    You have no bookings yet.
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
    <Dialog open={!!viewingDocumentUrl} onOpenChange={(isOpen) => !isOpen && setViewingDocumentUrl(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Guest Identity Document</DialogTitle>
            <DialogDescription>Verified identity document for your guest.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 relative h-[60vh]">
            {viewingDocumentUrl && (
              <Image 
                src={viewingDocumentUrl} 
                alt="Identity Document" 
                layout="fill" 
                objectFit="contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
