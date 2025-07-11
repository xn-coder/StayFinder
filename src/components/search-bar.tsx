
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { addDays, format, isValid, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, MapPin, Users, Search as SearchIcon, Plus, Minus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Suspense } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface SearchBarProps {
    className?: string;
}

function SearchBarWrapper({ className }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getValidDate = (dateString: string | null) => {
      if (!dateString) return undefined;
      const parsed = parseISO(dateString);
      return isValid(parsed) ? parsed : undefined;
  };

  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState(2);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();

  useEffect(() => {
      setLocation(searchParams.get('location') || '');
      setGuests(searchParams.get('guests') ? Number(searchParams.get('guests')) : 2);
      setCheckIn(getValidDate(searchParams.get('from')));
      setCheckOut(getValidDate(searchParams.get('to')));
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (checkIn) params.append('from', format(checkIn, 'yyyy-MM-dd'));
    if (checkOut) params.append('to', format(checkOut, 'yyyy-MM-dd'));
    if (guests > 0) params.append('guests', String(guests));
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className={cn("bg-background p-1.5 rounded-full shadow-md border w-full max-w-2xl mx-auto", className)}>
      <div className="flex flex-col md:flex-row items-stretch md:divide-x md:divide-border">
        
        <div className="flex-1 px-4 py-2 flex items-center gap-3 hover:bg-muted/50 rounded-full">
          <div className="flex flex-col text-left w-full">
            <Label htmlFor="location" className="text-xs font-semibold text-foreground px-1">Where</Label>
            <Input
              id="location"
              placeholder="Search destinations"
              className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-1 text-foreground placeholder:text-muted-foreground text-base"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <Popover>
            <PopoverTrigger asChild>
                <button className="flex-1 px-4 py-2 flex items-center gap-3 text-left hover:bg-muted/50 rounded-full">
                    <div className="flex-1">
                        <div className="text-xs font-semibold">Check in</div>
                        <div className="text-sm text-muted-foreground">
                          {checkIn ? format(checkIn, "MMM d") : 'Add dates'}
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="text-xs font-semibold">Check out</div>
                        <div className="text-sm text-muted-foreground">
                          {checkOut ? format(checkOut, "MMM d") : 'Add dates'}
                        </div>
                    </div>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={checkIn}
                selected={{ from: checkIn, to: checkOut }}
                onSelect={(range) => {
                  setCheckIn(range?.from);
                  setCheckOut(range?.to);
                }}
                numberOfMonths={2}
                disabled={(date: Date) => date < new Date(new Date().setHours(0,0,0,0))}
              />
            </PopoverContent>
          </Popover>

        <div className="flex-1 pl-4 pr-2 py-2 flex items-center gap-3 justify-between hover:bg-muted/50 rounded-full">
            <div className="flex items-center gap-3 flex-1">
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="text-left w-full">
                            <div className="text-xs font-semibold text-foreground">Who</div>
                            <div className="text-base text-muted-foreground">
                              {guests > 0 ? `${guests} guest${guests > 1 ? 's' : ''}` : 'Add guests'}
                            </div>
                        </button>
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
            <Button size="icon" onClick={handleSearch} className="rounded-full h-10 w-10 flex-shrink-0">
                <SearchIcon className="h-5 w-5" />
                <span className="sr-only">Search</span>
            </Button>
        </div>

      </div>
    </div>
  );
}

export function SearchBar({ className }: SearchBarProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <SearchBarWrapper className={className} />
    </Suspense>
  );
}
