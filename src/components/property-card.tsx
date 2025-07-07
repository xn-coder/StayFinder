
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

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
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
    <Link href={`/property/${property.id}`} className="group block text-sm">
      <div className="relative mb-2 overflow-hidden rounded-xl">
        {property.rating >= 4.9 && <Badge className="absolute top-3 left-3 z-10">Guest Favourite</Badge>}
        <Image
          src={property.image1}
          alt={`Photo of ${property.name}`}
          data-ai-hint="hotel room"
          width={800}
          height={800}
          className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/30 hover:bg-black/50 text-white hover:text-white z-10"
          onClick={handleWishlistToggle}
        >
          <Heart className={cn("h-5 w-5 transition-colors", user && isInWishlist(property.id) ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-white')} />
        </Button>
      </div>
      
       <div className="flex justify-between font-semibold">
        <h3 className="truncate pr-2">{property.name}</h3>
        <div className="flex items-center gap-1 shrink-0">
            <Star className="h-4 w-4" />
            <span>{property.rating > 0 ? property.rating.toFixed(1) : "New"}</span>
        </div>
      </div>
       <p className="text-muted-foreground truncate">{property.location}</p>
      <p className="mt-1">
          <span className="font-semibold text-foreground">{currencySymbol}{property.pricePerNight.toLocaleString()}</span>
          <span className="text-muted-foreground"> / night</span>
      </p>
    </Link>
  );
}
