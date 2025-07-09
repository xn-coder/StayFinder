
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star } from 'lucide-react';
import type { Property } from '@/types';
import { useSettings } from '@/hooks/use-settings';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Suspense } from 'react';

interface PropertyCardProps {
  property: Property;
  className?: string;
}

function PropertyCardWrapper({ property, className }: PropertyCardProps) {
  const { currencySymbol } = useSettings();
  const { user, toggleWishlist, isInWishlist } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!property || !property.image1) {
    return null;
  }
  
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      const redirectPath = pathname + '?' + searchParams.toString();
      router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }
    toggleWishlist(property.id);
  };

  return (
    <Link href={`/property/${property.id}`} className={cn("group block", className)}>
      <div className="relative mb-2 overflow-hidden rounded-xl">
        {property.rating >= 4.9 && <Badge variant="outline" className="absolute top-3 left-3 z-10 bg-white/95 border-transparent text-gray-900 text-xs font-semibold rounded-full shadow-md">Guest favourite</Badge>}
        <Image
          src={property.image1}
          alt={`Photo of ${property.name}`}
          data-ai-hint="hotel room"
          width={800}
          height={800}
          className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-xl"
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 z-10"
          onClick={handleWishlistToggle}
        >
          <Heart className={cn(
              "h-5 w-5 text-white",
              user && isInWishlist(property.id) ? 'fill-red-500 stroke-red-500' : 'fill-none'
          )} />
        </Button>
      </div>
      
      <div className="text-sm space-y-0.5">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold truncate pr-2">{property.name}</h3>
          <div className="flex items-center gap-1 shrink-0">
              <Star className="h-4 w-4" />
              <span>{property.rating > 0 ? property.rating.toFixed(2) : "New"}</span>
          </div>
        </div>
        <p className="text-muted-foreground truncate">{property.location}</p>
        <p className="mt-1">
            <span className="font-semibold">{currencySymbol}{property.pricePerNight.toLocaleString()}</span>
            <span className="text-muted-foreground"> night</span>
        </p>
      </div>
    </Link>
  );
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  <Suspense fallback={<div>Loading...</div>}>
      <PropertyCardWrapper className={className} property={property} />
  </Suspense>
}
