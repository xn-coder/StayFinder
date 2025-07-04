"use client";

import { useState, useMemo } from "react";
import { allAmenities } from "@/lib/dummy-data";
import { useProperties } from "@/hooks/use-properties";
import { useSettings } from "@/hooks/use-settings";
import { PropertyCard } from "@/components/property-card";
import { AiRecommendations } from "@/components/ai-recommendations";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { Property } from "@/types";
import { SearchBar } from "./search-bar";

export function SearchResults({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { location, from, to, guests } = searchParams;
  const { properties, loading } = useProperties();
  const { currencySymbol } = useSettings();
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  const initialGuests = guests ? parseInt(guests as string, 10) : 2;
  
  const initialRecommendationsInput = {
    location: location as string || "any",
    checkInDate: from as string || new Date().toISOString().split('T')[0],
    checkOutDate: to as string || new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
    numberOfGuests: Number(guests) || 2,
    priceRangeMin: priceRange[0],
    priceRangeMax: priceRange[1],
  };

  const filteredProperties = useMemo(() => {
    const approvedProperties = properties.filter(p => p.status === 'approved');

    return approvedProperties.filter((property: Property) => {
      const locationMatch = location
        ? property.location.toLowerCase().includes((location as string).toLowerCase())
        : true;
      
      const guestsMatch = guests ? property.maxGuests >= Number(guests) : true;
      
      const priceMatch =
        property.pricePerNight >= priceRange[0] &&
        property.pricePerNight <= priceRange[1];

      const amenitiesMatch =
        selectedAmenities.length > 0
          ? selectedAmenities.every((amenity) =>
              property.amenities.includes(amenity)
            )
          : true;

      return locationMatch && guestsMatch && priceMatch && amenitiesMatch;
    });
  }, [properties, location, guests, priceRange, selectedAmenities]);

  const handleAmenityChange = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };
  
  const ResultsSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
         <div key={i} className="space-y-2">
            <Skeleton className="h-52 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-1/4 lg:w-1/5">
        <div className="sticky top-24">
          <h2 className="text-xl font-headline font-semibold mb-4">Filters</h2>
          
          <div className="space-y-6">
            <div>
              <Label className="font-semibold">Price Range</Label>
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>{currencySymbol}{priceRange[0].toLocaleString()}</span>
                <span>{currencySymbol}{priceRange[1] === 100000 ? '100,000+' : priceRange[1].toLocaleString()}</span>
              </div>
              <Slider
                value={priceRange}
                min={0}
                max={100000}
                step={1000}
                onValueChange={setPriceRange}
                className="mt-2"
              />
            </div>

            <Separator />
            
            <div>
              <Label className="font-semibold">Amenities</Label>
              <div className="space-y-2 mt-2">
                {allAmenities.slice(0, 6).map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={selectedAmenities.includes(amenity)}
                      onCheckedChange={() => handleAmenityChange(amenity)}
                    />
                    <Label htmlFor={amenity} className="font-normal">{amenity}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <AiRecommendations initialInput={initialRecommendationsInput}/>
          </div>
        </div>
      </aside>

      <section className="w-full md:w-3/4 lg:w-4/5">
         <div className="mb-8">
            <SearchBar 
                initialLocation={location as string | undefined}
                initialCheckIn={from as string | undefined}
                initialCheckOut={to as string | undefined}
                initialGuests={initialGuests}
                className="mt-0 shadow-md border"
            />
        </div>
        <h1 className="text-3xl font-headline font-bold mb-6">
          {location ? `Stays in ${location}` : 'Available Stays'}
        </h1>
        {loading ? (
            <ResultsSkeleton />
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold">No properties found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your filters or search criteria.</p>
          </div>
        )}
      </section>
    </div>
  );
}
