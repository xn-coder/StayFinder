
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addDays, format, isValid, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, MapPin, Users, Search as SearchIcon, Plus, Minus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface SearchBarProps {
    initialLocation?: string;
    initialCheckIn?: string;
    initialCheckOut?: string;
    initialGuests?: number;
    className?: string;
}

export function SearchBar({
    initialLocation = '',
    initialCheckIn,
    initialCheckOut,
    initialGuests = 2,
    className
}: SearchBarProps) {
  const router = useRouter();
  const [location, setLocation] = useState(initialLocation);
  const [guests, setGuests] = useState(initialGuests);
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const getValidDate = (dateString: string | undefined) => {
      if (!dateString) return undefined;
      const parsed = parseISO(dateString);
      return isValid(parsed) ? parsed : undefined;
    };

    setLocation(initialLocation);
    setGuests(initialGuests);

    const checkInDate = getValidDate(initialCheckIn);
    const checkOutDate = getValidDate(initialCheckOut);

    const defaultCheckIn = new Date();
    
    setCheckIn(checkInDate || defaultCheckIn);
    setCheckOut(checkOutDate || addDays(checkInDate || defaultCheckIn, 7));
  }, [initialLocation, initialCheckIn, initialCheckOut, initialGuests]);


  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (checkIn) params.append('from', format(checkIn, 'yyyy-MM-dd'));
    if (checkOut) params.append('to', format(checkOut, 'yyyy-MM-dd'));
    params.append('guests', String(guests));
    router.push(`/search?${params.toString()}`);
  };

  const handleCheckInSelect = (date: Date | undefined) => {
    setCheckIn(date);
    if (date && checkOut && date >= checkOut) {
      setCheckOut(addDays(date, 1));
    } else if (!checkOut && date) {
      setCheckOut(addDays(date, 7));
    }
  };

  return (
    <div className={cn("bg-background/95 p-2 rounded-full shadow-2xl max-w-4xl mx-auto backdrop-blur-sm", className)}>
      <div className="flex flex-col md:flex-row items-stretch md:divide-x md:divide-border">
        
        <div className="flex-1 px-4 py-2 flex items-center gap-3">
          <MapPin className="text-muted-foreground" />
          <div className="flex flex-col text-left">
            <Label htmlFor="location" className="text-xs font-semibold text-foreground">Location</Label>
            <Input
              id="location"
              placeholder="Where are you going?"
              className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-0 text-foreground placeholder:text-muted-foreground text-base"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="px-4 py-2 flex items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'ghost'}
                className="w-full justify-start text-left font-normal text-foreground h-auto p-0 hover:bg-transparent"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-semibold">Check-in</span>
                  <span className={cn('text-base', !checkIn && 'text-muted-foreground')}>
                    {checkIn ? format(checkIn, 'MMM dd') : 'Add date'}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={handleCheckInSelect}
                disabled={{ before: new Date() }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="px-4 py-2 flex items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'ghost'}
                disabled={!checkIn}
                className="w-full justify-start text-left font-normal text-foreground h-auto p-0 hover:bg-transparent"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-semibold">Check-out</span>
                  <span className={cn('text-base', !checkOut && 'text-muted-foreground')}>
                    {checkOut ? format(checkOut, 'MMM dd') : 'Add date'}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                disabled={{ before: checkIn ? addDays(checkIn, 1) : new Date() }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex-1 pl-4 pr-2 py-2 flex items-center gap-3 justify-between">
            <div className="flex items-center gap-3 flex-1">
                <Users className="text-muted-foreground" />
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className="justify-start text-left font-normal text-foreground h-auto p-0 hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
                            <div className="flex flex-col text-left">
                                <Label className="text-xs font-semibold text-foreground">Guests</Label>
                                <span className="text-base text-foreground">
                                    {guests} guest{guests > 1 ? 's' : ''}
                                </span>
                            </div>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">Guests</h4>
                            <p className="text-sm text-muted-foreground">
                              How many guests are coming?
                            </p>
                          </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-base">Adults</Label>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-full"
                                        onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                                        disabled={guests <= 1}
                                    >
                                        <Minus className="h-4 w-4" />
                                        <span className="sr-only">Decrease guests</span>
                                    </Button>
                                    <span className="w-8 text-center text-lg font-medium text-foreground">{guests}</span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-full"
                                        onClick={() => setGuests(prev => prev + 1)}
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span className="sr-only">Increase guests</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <Button size="icon" onClick={handleSearch} className="rounded-full h-12 w-12 flex-shrink-0">
                <SearchIcon className="h-5 w-5" />
                <span className="sr-only">Search</span>
            </Button>
        </div>

      </div>
    </div>
  );
}
