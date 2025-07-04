"use client";

import { useRef } from 'react';
import { format, differenceInDays } from 'date-fns';
import type { Booking, Property } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import { Button } from '../ui/button';
import { Printer } from 'lucide-react';
import { useProperties } from '@/hooks/use-properties';
import { useSettings } from '@/hooks/use-settings';

interface InvoiceDialogProps {
  booking: Booking;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvoiceDialog({ booking, isOpen, onOpenChange }: InvoiceDialogProps) {
  const { getPropertyById } = useProperties();
  const { currencySymbol } = useSettings();
  const property = getPropertyById(booking.property.id);
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!property) return null;

  const numberOfNights = differenceInDays(booking.dateRange.to, booking.dateRange.from);
  const baseCost = numberOfNights * property.pricePerNight;
  const serviceFee = baseCost * 0.1;

  const handlePrint = () => {
    const printContent = invoiceRef.current;
    if (printContent) {
      const originalContents = document.body.innerHTML;
      const printContents = printContent.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // To restore event listeners, etc.
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <div ref={invoiceRef}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Invoice</DialogTitle>
            <DialogDescription>
              Invoice ID: {booking.invoiceId}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Billed To</h3>
                <p>{booking.guest.name}</p>
                <p>Role: {booking.guest.role}</p>
              </div>
              <div>
                <h3 className="font-semibold">From</h3>
                <p>{booking.property.host.name}</p>
                <p>StayFinder Host</p>
              </div>
            </div>

            <Separator />
            
            <div>
              <h3 className="font-semibold">Booking Details</h3>
              <p><strong>Property:</strong> {booking.property.name}</p>
              <p><strong>Dates:</strong> {format(booking.dateRange.from, 'PPP')} to {format(booking.dateRange.to, 'PPP')}</p>
              <p><strong>Guests:</strong> {booking.guests}</p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{currencySymbol}{property.pricePerNight.toLocaleString()} x {numberOfNights} nights</span>
                  <span>{currencySymbol}{baseCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee (10%)</span>
                  <span>{currencySymbol}{serviceFee.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{currencySymbol}{booking.totalCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Separator />

             <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-semibold">Payment Method</h3>
                    <p>{booking.paymentMethod}</p>
                </div>
                 <div>
                    <h3 className="font-semibold">Status</h3>
                    <p className="capitalize font-medium">{booking.status}</p>
                </div>
             </div>
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button onClick={handlePrint} variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print Invoice
          </Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
