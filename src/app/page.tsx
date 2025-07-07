
'use client';

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PropertyCard } from "@/components/property-card";
import { useProperties } from "@/hooks/use-properties";
import { Skeleton } from "@/components/ui/skeleton";
import type { Property } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const PropertySection = ({ title, properties, loading }: { title: string; properties: Property[]; loading: boolean; }) => {
  if (loading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="flex space-x-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-60 flex-shrink-0 space-y-2">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold font-headline">{title}</h2>
            <div className="flex gap-2">
              <CarouselPrevious className="static -translate-y-0" />
              <CarouselNext className="static -translate-y-0" />
            </div>
          </div>
          <CarouselContent className="-ml-4">
            {properties.map((property) => (
              <CarouselItem key={property.id} className="pl-4 basis-auto md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                <PropertyCard property={property} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};


export default function Home() {
  const { properties, loading } = useProperties();
  
  const approvedProperties = properties.filter(p => p.status === 'approved');

  const featuredProperties = approvedProperties.slice(0, 10);
  
  const topRatedProperties = approvedProperties
    .filter(p => p.rating >= 4.9)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  const uniqueStays = approvedProperties.filter(
    p =>
      [ 'Tree house', 'Riad', 'Castle', 'Boat', 'Yurt', 'Cave', 'Windmill', 'Dome', 'Barn', 'Tiny home' ].includes(p.type)
  ).slice(0, 10);

  const cityGetaways = approvedProperties.filter(
    p =>
      [ 'New York, New York', 'Paris, France', 'London, United Kingdom', 'Shibuya, Tokyo, Japan', 'Sydney, Australia' ].includes(p.location)
  ).slice(0, 10);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-8">
        <PropertySection title="Featured Stays" properties={featuredProperties} loading={loading} />
        <PropertySection title="Top-Rated Homes" properties={topRatedProperties} loading={loading} />
        <PropertySection title="Unique Stays" properties={uniqueStays} loading={loading} />
        <PropertySection title="City Getaways" properties={cityGetaways} loading={loading} />
      </main>
      <Footer />
    </div>
  );
}
