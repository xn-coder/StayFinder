
'use client';

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PropertyCard } from "@/components/property-card";
import { useProperties } from "@/hooks/use-properties";
import { Skeleton } from "@/components/ui/skeleton";
import type { Property } from "@/types";

const PropertySection = ({ title, properties, loading }: { title: string; properties: Property[]; loading: boolean; }) => {
  if (loading) {
    return (
      <section>
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-64 mb-8" />
           <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-80 flex-shrink-0 space-y-2">
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
    <section>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold font-headline mb-4">{title}</h2>
        <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
          {properties.map((property) => (
            <div key={property.id} className="w-80 flex-shrink-0">
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
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
      <main className="flex-grow space-y-8 py-8">
        {(loading || featuredProperties.length > 0) && <PropertySection title="Featured Stays" properties={featuredProperties} loading={loading} />}
        {(loading || topRatedProperties.length > 0) && <PropertySection title="Top-Rated Homes" properties={topRatedProperties} loading={loading} />}
        {(loading || uniqueStays.length > 0) && <PropertySection title="Unique Stays" properties={uniqueStays} loading={loading} />}
        {(loading || cityGetaways.length > 0) && <PropertySection title="City Getaways" properties={cityGetaways} loading={loading} />}
      </main>
      <Footer />
    </div>
  );
}
