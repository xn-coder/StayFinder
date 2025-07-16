
'use client';

import { useMemo } from 'react';
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PropertyCard } from "@/components/property-card";
import { useProperties } from "@/hooks/use-properties";
import { Skeleton } from "@/components/ui/skeleton";
import type { Property } from "@/types";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const PropertySectionSkeleton = ({ title }: { title: string }) => (
  <section>
    <div className="container mx-auto px-4">
      <Skeleton className="h-8 w-64 mb-6" />
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-1/2 sm:w-1/3 md:w-1/5 lg:w-1/6 flex-shrink-0">
            <div className="space-y-2">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const PropertySection = ({ title, properties }: { title: string; properties: Property[];}) => {
  if (properties.length === 0) {
      return null;
  }

  return (
    <section>
        <Carousel
            opts={{
                align: "start",
                dragFree: true,
            }}
            className="w-full"
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-4">
                    <Link href="#" className="group">
                        <h2 className="text-2xl font-bold font-headline flex items-center gap-1">
                            {title}
                            <ChevronRight className="h-7 w-7 transition-transform group-hover:translate-x-1" />
                        </h2>
                    </Link>
                    <div className="hidden md:flex items-center gap-2">
                        <CarouselPrevious className="relative static translate-x-0 translate-y-0 rounded-full" />
                        <CarouselNext className="relative static translate-x-0 translate-y-0 rounded-full" />
                    </div>
                </div>
                <CarouselContent className="-ml-4">
                    {properties.map((property) => (
                        <CarouselItem key={property.id} className="basis-[45%] sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4">
                            <PropertyCard
                                property={property}
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </div>
        </Carousel>
    </section>
  );
};


export default function Home() {
  const { properties, loading } = useProperties();

  const { topRatedStays, newlyAddedStays, cityStays, countryStays, beachStays, apartmentStays, villaStays, cabinStays, petFriendlyStays, luxuryStays, guestFavourites, roomStays } = useMemo(() => {
    const approvedProperties = properties.filter(p => p.status === 'approved');

    const topRated = [...approvedProperties]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
    
    const newlyAdded = [...approvedProperties].sort((a, b) => (b.id > a.id ? 1 : -1)).slice(0, 10);
    
    const city = approvedProperties.filter(p => p.location.includes('New York') || p.location.includes('Tokyo') || p.location.includes('Paris')).slice(0,10);
    const country = approvedProperties.filter(p => p.location.includes('Tuscany') || p.location.includes('Aspen')).slice(0,10);
    const beach = approvedProperties.filter(p => p.location.includes('Malibu') || p.location.includes('Miami')).slice(0,10);
    const apartments = approvedProperties.filter(p => p.type === 'Apartment').slice(0,10);
    const villas = approvedProperties.filter(p => p.type === 'Villa').slice(0,10);
    const cabins = approvedProperties.filter(p => p.type === 'Cabin').slice(0,10);
    const petFriendly = approvedProperties.filter(p => p.amenities.includes('Pet friendly')).slice(0,10);
    const luxury = approvedProperties.filter(p => p.pricePerNight > 50000).slice(0,10);
    const favourites = approvedProperties.filter(p => p.rating >= 4.9).slice(0,10);
    const rooms = approvedProperties.filter(p => p.privacyType === 'room').slice(0,10);
    
    return { 
        topRatedStays: topRated, 
        newlyAddedStays: newlyAdded,
        cityStays: city,
        countryStays: country,
        beachStays: beach,
        apartmentStays: apartments,
        villaStays: villas,
        cabinStays: cabins,
        petFriendlyStays: petFriendly,
        luxuryStays: luxury,
        guestFavourites: favourites,
        roomStays: rooms,
    };
  }, [properties]);


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow space-y-12 py-8 bg-muted/20">
        {loading ? (
          <>
            <PropertySectionSkeleton title="Top-rated Stays" />
            <PropertySectionSkeleton title="Guest Favourites" />
            <PropertySectionSkeleton title="Newly Added" />
            <PropertySectionSkeleton title="City Escapes" />
            <PropertySectionSkeleton title="Countryside Retreats" />
            <PropertySectionSkeleton title="Beachfront Bliss" />
            <PropertySectionSkeleton title="Rooms" />
            <PropertySectionSkeleton title="Modern Apartments" />
            <PropertySectionSkeleton title="Luxury Villas" />
            <PropertySectionSkeleton title="Cozy Cabins" />
            <PropertySectionSkeleton title="Pet-Friendly Homes" />
            <PropertySectionSkeleton title="Luxury Collection" />
          </>
        ) : (
            <>
                <PropertySection title="Top-rated Stays" properties={topRatedStays} />
                <PropertySection title="Guest Favourites" properties={guestFavourites} />
                <PropertySection title="Newly Added Stays" properties={newlyAddedStays} />
                <PropertySection title="City Escapes" properties={cityStays} />
                <PropertySection title="Countryside Retreats" properties={countryStays} />
                <PropertySection title="Beachfront Bliss" properties={beachStays} />
                <PropertySection title="Rooms" properties={roomStays} />
                <PropertySection title="Modern Apartments" properties={apartmentStays} />
                <PropertySection title="Luxury Villas" properties={villaStays} />
                <PropertySection title="Cozy Cabins" properties={cabinStays} />
                <PropertySection title="Pet-Friendly Homes" properties={petFriendlyStays} />
                <PropertySection title="Luxury Collection" properties={luxuryStays} />
            </>
        )}
      </main>
      <Footer />
    </div>
  );
}
