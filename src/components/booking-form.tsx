
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addDays, format, differenceInDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Calendar as CalendarIcon, Loader2, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useProperties } from "@/hooks/use-properties";
import { useSettings } from "@/hooks/use-settings";
import type { Property } from "@/types";
import { useRouter, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import Link from "next/link";

const bookingSchema = z.object({
  dateRange: z.object({
    from: z.date({ required_error: "A check-in date is required." }),
    to: z.date({ required_error: "A check-out date is required." }),
  }),
  guests: z.coerce.number().min(1, "At least one guest is required."),
  paymentMethod: z.enum(["Credit Card", "PayPal"], {
    required_error: "Please select a payment method.",
  }),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export function BookingForm({ property }: { property: Property }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const { addBooking } = useProperties();
  const { currencySymbol } = useSettings();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isVerified = user?.verificationStatus === 'verified';

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      dateRange: {
        from: new Date(),
        to: addDays(new Date(), 7),
      },
      guests: 2,
    },
  });

  const watchDateRange = form.watch("dateRange");
  const numberOfNights = watchDateRange?.from && watchDateRange?.to ? differenceInDays(watchDateRange.to, watchDateRange.from) : 0;
  const totalCost = numberOfNights * property.pricePerNight;
  const serviceFee = totalCost * 0.1;

  const onSubmit = async (data: BookingFormValues) => {
    if (!user) {
      router.push(`/login?redirect=${pathname}`);
      return;
    }

    if (!isVerified) {
       toast({
        variant: "destructive",
        title: "Account Not Verified",
        description: "Please verify your identity in your account settings before booking.",
      });
      return;
    }
    
    if (user.id === property.host.id) {
       toast({
        variant: "destructive",
        title: "Cannot Book",
        description: "You cannot book your own property.",
      });
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

    addBooking({
        property: {
            id: property.id,
            name: property.name,
            host: property.host
        },
        guest: user,
        dateRange: data.dateRange,
        guests: data.guests,
        totalCost: totalCost + serviceFee,
        paymentMethod: data.paymentMethod,
    });

    toast({
      title: "Booking Request Sent!",
      description: "The host has been notified of your booking request.",
    });
    setLoading(false);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">
          <span className="text-2xl font-bold">{currencySymbol}{property.pricePerNight.toLocaleString()}</span> / night
        </CardTitle>
        <CardDescription>Enter your dates and guest count to book.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-12 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                           <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value?.from ? (
                            field.value.to ? (
                              <>
                                {format(field.value.from, "LLL dd, y")} -{" "}
                                {format(field.value.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(field.value.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={field.value.from}
                        selected={field.value}
                        onSelect={field.onChange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="guests"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Guests</FormLabel>
                    <FormControl>
                        <Input 
                        type="number" 
                        min={1} 
                        max={property.maxGuests}
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))}
                        className="h-12"
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Payment</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Credit Card">Credit Card</SelectItem>
                                <SelectItem value="PayPal">PayPal</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
             </div>
            
            {numberOfNights > 0 && (
                <div className="space-y-2 pt-2 text-sm">
                    <div className="flex justify-between">
                        <span>{currencySymbol}{property.pricePerNight.toLocaleString()} x {numberOfNights} nights</span>
                        <span>{currencySymbol}{totalCost.toLocaleString()}</span>
                    </div>
                     <div className="flex justify-between">
                        <span>Service fee</span>
                        <span>{currencySymbol}{serviceFee.toLocaleString()}</span>
                    </div>
                     <div className="flex justify-between font-bold pt-2 border-t">
                        <span>Total</span>
                        <span>{currencySymbol}{(totalCost + serviceFee).toLocaleString()}</span>
                    </div>
                </div>
            )}

            {user && !isVerified && (
              <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertDescription>
                  You must <Link href="/account/settings" className="font-semibold underline">verify your identity</Link> before you can book a property.
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full h-12 text-lg" disabled={loading || (!!user && !isVerified)}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {user && !isVerified ? 'Verification Required' : 'Book Now'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
