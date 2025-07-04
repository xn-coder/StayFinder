
'use client';

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/hero";
import { PropertyCard } from "@/components/property-card";
import { useProperties } from "@/hooks/use-properties";
import { Skeleton } from "@/components/ui/skeleton";
import type { Property } from "@/types";

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

  const PropertiesSkeleton = () => (
    <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide p-1">
      {Array.from({ length: 5 }).map((_, i) => (
         <div key={i} className="w-60 flex-shrink-0 space-y-2">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        
        {/* Featured Stays */}
        <section className="py-12 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-8 text-center">Featured Stays</h2>
            {loading ? (
              <PropertiesSkeleton />
            ) : featuredProperties.length > 0 ? (
              <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                {featuredProperties.map((property) => (
                  <div key={property.id} className="w-60 flex-shrink-0">
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
            ) : (
               <div className="text-center py-16">
                  <h3 className="text-2xl font-semibold">No featured properties available</h3>
                  <p className="text-muted-foreground mt-2">Check back later or try a new search.</p>
                </div>
            )}
          </div>
        </section>

        {/* Top-Rated Homes */}
        {!loading && topRatedProperties.length > 0 && (
          <section className="py-12 md:py-16 bg-muted/40">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold font-headline mb-8 text-center">Top-Rated Homes</h2>
              <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                {topRatedProperties.map((property) => (
                  <div key={property.id} className="w-60 flex-shrink-0">
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Unique Stays */}
        {!loading && uniqueStays.length > 0 && (
          <section className="py-12 md:py-16 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold font-headline mb-8 text-center">Unique Stays</h2>
              <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                {uniqueStays.map((property) => (
                  <div key={property.id} className="w-60 flex-shrink-0">
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* City Getaways */}
        {!loading && cityGetaways.length > 0 && (
          <section className="py-12 md:py-16 bg-muted/40">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold font-headline mb-8 text-center">City Getaways</h2>
                <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                  {cityGetaways.map((property) => (
                    <div key={property.id} className="w-60 flex-shrink-0">
                      <PropertyCard property={property} />
                    </div>
                  ))}
                </div>
            </div>
          </section>
        )}

      </main>
      <Footer />
    </div>
  );
}
