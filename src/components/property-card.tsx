'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import type { Property } from '@/types';
import { useSettings } from '@/hooks/use-settings';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { currencySymbol } = useSettings();

  if (!property || !property.image1) {
    return null;
  }

  return (
    <Link href={`/property/${property.id}`} className="group block text-sm">
      <div className="relative mb-2 overflow-hidden rounded-xl">
        <Image
          src={property.image1}
          alt={`Photo of ${property.name}`}
          data-ai-hint="hotel room"
          width={800}
          height={800}
          className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
       <div className="flex justify-between">
        <h3 className="font-semibold truncate pr-2">{property.name}</h3>
        <div className="flex items-center gap-1 shrink-0">
            <Star className="h-4 w-4" />
            <span>{property.rating > 0 ? property.rating.toFixed(1) : "New"}</span>
        </div>
      </div>
      <div className="flex justify-between text-muted-foreground">
        <p className="truncate">{property.location}</p>
        <p>
            <span className="font-semibold text-foreground">{currencySymbol}{property.pricePerNight.toLocaleString()}</span>
            <span> / night</span>
        </p>
      </div>
    </Link>
  );
}
