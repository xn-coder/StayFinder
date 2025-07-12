
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
import { Separator } from './ui/separator';

interface SearchBarProps {
    className?: string;
}

const Counter = ({ title, subtitle, value, onUpdate, min = 0 }: { title: string; subtitle: string; value: number; onUpdate: (newValue: number) => void, min?: number }) => (
    <div className="flex items-center justify-between">
        <div>
            <p className="font-medium">{title}</p>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
            <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => onUpdate(Math.max(min, value - 1))}
                disabled={value <= min}
            >
                <Minus className="h-4 w-4" />
            </Button>
            <span className="w-5 text-center text-lg font-medium tabular-nums">
                {value}
            </span>
            <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => onUpdate(value + 1)}
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    </div>
);

function SearchBarWrapper({ className }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getValidDate = (dateString: string | null) => {
      if (!dateString) return undefined;
      const parsed = parseISO(dateString);
      return isValid(parsed) ? parsed : undefined;
  };

  const [location, setLocation] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  
  const totalGuests = adults + children;

  useEffect(() => {
      setLocation(searchParams.get('location') || '');
      setAdults(searchParams.get('guests') ? Number(searchParams.get('guests')) : 2);
      // For simplicity, we'll only load the main guest count.
      // A more complex implementation could store/load all guest types.
      setChildren(0);
      setInfants(0);
      setPets(0);
      setCheckIn(getValidDate(searchParams.get('from')));
      setCheckOut(getValidDate(searchParams.get('to')));
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (checkIn) params.append('from', format(checkIn, 'yyyy-MM-dd'));
    if (checkOut) params.append('to', format(checkOut, 'yyyy-MM-dd'));
    if (totalGuests > 0) params.append('guests', String(totalGuests));
    if (pets > 0) params.append('pets', String(pets)); // Can be used for filtering later
    router.push(`/search?${params.toString()}`);
  };

  const guestSummary = () => {
    if (totalGuests === 0) return 'Add guests';
    let summary = `${totalGuests} guest${totalGuests > 1 ? 's' : ''}`;
    if (infants > 0) summary += `, ${infants} infant${infants > 1 ? 's' : ''}`;
    if (pets > 0) summary += `, ${pets} pet${pets > 1 ? 's' : ''}`;
    return summary;
  }

  return (
    <div className={cn("bg-background p-1.5 rounded-full shadow-lg border w-full max-w-3xl mx-auto", className)}>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] items-center">
        
        {/* Location */}
        <div className="group relative">
          <Popover>
            <PopoverTrigger asChild>
                <button className="w-full text-left px-4 py-2 hover:bg-muted/50 rounded-full">
                  <Label htmlFor="location" className="text-xs font-semibold text-foreground px-1">Where</Label>
                  <p className="text-sm text-muted-foreground truncate pr-1">
                      {location || 'Search destinations'}
                  </p>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="p-2">
                <Label htmlFor="location-input" className="text-sm font-medium">Search destinations</Label>
                 <Input
                    id="location-input"
                    placeholder="e.g. Paris, France"
                    className="mt-2 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-1 text-foreground placeholder:text-muted-foreground text-base"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
              </div>
            </PopoverContent>
          </Popover>
           <Separator orientation="vertical" className="absolute right-0 top-1/2 -translate-y-1/2 h-8 hidden md:block group-hover:hidden"/>
        </div>

        {/* Dates */}
         <Popover>
            <PopoverTrigger asChild>
                <button className="group relative w-full flex items-stretch text-left hover:bg-muted/50 rounded-full">
                    <div className="flex-1 px-4 py-2">
                        <div className="text-xs font-semibold">Check in</div>
                        <div className="text-sm text-muted-foreground">
                          {checkIn ? format(checkIn, "MMM d") : 'Add dates'}
                        </div>
                    </div>
                     <Separator orientation="vertical" className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 h-8 hidden md:block group-hover:hidden"/>
                    <div className="flex-1 px-4 py-2">
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

        {/* Guests and Search Button */}
        <div className="pl-4 pr-2 py-2 flex items-center gap-3 justify-between hover:bg-muted/50 rounded-full">
            <Popover>
                <PopoverTrigger asChild>
                    <button className="text-left w-full">
                        <div className="text-xs font-semibold text-foreground">Who</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {guestSummary()}
                        </div>
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <Counter title="Adults" subtitle="Ages 13 or above" value={adults} onUpdate={setAdults} min={1}/>
                      <Separator />
                      <Counter title="Children" subtitle="Ages 2–12" value={children} onUpdate={setChildren} />
                      <Separator />
                      <Counter title="Infants" subtitle="Under 2" value={infants} onUpdate={setInfants} />
                      <Separator />
                      <Counter title="Pets" subtitle="Bringing a service animal?" value={pets} onUpdate={setPets} />
                    </div>
                </PopoverContent>
            </Popover>
            <Button size="icon" onClick={handleSearch} className="rounded-full h-12 w-12 flex-shrink-0">
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
