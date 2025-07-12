
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

  const { topRatedStays, uniqueStays, newlyAddedStays } = useMemo(() => {
    const approvedProperties = properties.filter(p => p.status === 'approved');

    const topRated = [...approvedProperties]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
    
    const uniqueTypes = ['Castle', 'Tree house', 'Boat', 'Houseboat', 'Yurt', 'Barn', 'Cabin', 'Windmill'];
    const unique = approvedProperties
      .filter(p => uniqueTypes.includes(p.type))
      .slice(0, 10);

    // Sort by creation time (assuming properties have it) or just take the last few as a proxy
    const newlyAdded = [...approvedProperties].reverse().slice(0, 10);
    
    return { topRatedStays: topRated, uniqueStays: unique, newlyAddedStays: newlyAdded };
  }, [properties]);


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow space-y-12 py-8 bg-muted/20">
        {loading ? (
          <>
            <PropertySectionSkeleton title="Top-rated Stays" />
            <PropertySectionSkeleton title="Unique Stays" />
            <PropertySectionSkeleton title="Newly Added" />
          </>
        ) : (
            <>
                <PropertySection title="Top-rated Stays" properties={topRatedStays} />
                <PropertySection title="Unique Stays" properties={uniqueStays} />
                <PropertySection title="Newly Added Stays" properties={newlyAddedStays} />
            </>
        )}
      </main>
      <Footer />
    </div>
  );
}
