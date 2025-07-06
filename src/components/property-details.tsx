'use client';

import { useState } from "react";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { useProperties } from "@/hooks/use-properties";
import { Header } from "@/components/layout/header";
import { BookingForm } from "@/components/booking-form";
import { InquiryForm } from "@/components/inquiry-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  Star, MapPin, Bed, Bath, Users, Wifi, Wind, Car, UtensilsCrossed, Waves, 
  Flame, Building2, ArrowUpSquare, Dumbbell, Sprout, Dog, WashingMachine, 
  Anchor, Tv, MessageSquare, Heart
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Property } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const amenityIcons: Record<string, LucideIcon> = {
  'WiFi': Wifi,
  'Air conditioning': Wind,
  'Free parking': Car,
  'Kitchen': UtensilsCrossed,
  'Pool': Waves,
  'Beach access': Waves,
  'Indoor fireplace': Flame,
  'Hot tub': Bath,
  'City view': Building2,
  'Elevator': ArrowUpSquare,
  'Gym': Dumbbell,
  'Garden': Sprout,
  'Pet friendly': Dog,
  'Washer': WashingMachine,
  'Boat slip': Anchor,
  'TV': Tv,
  'Rooftop access': ArrowUpSquare,
  'Lake access': Waves,
  'Balcony': Building2,
  'Dishwasher': UtensilsCrossed,
};

function PropertyDetailsClient({ property }: { property: Property}) {
  const { user, toggleWishlist, isInWishlist } = useAuth();
  const [isİnquiryFormOpen, setIsInquiryFormOpen] = useState(false);
  const router = useRouter();

  if (!property) {
    notFound();
  }
  
  const handleWishlistToggle = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    toggleWishlist(property.id);
  };
  
  const galleryImages = [property.image2, property.image3, property.image4, property.image1].filter(Boolean);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">{property.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 text-primary" />
                <span className="font-medium">{property.rating > 0 ? `${property.rating} (${property.reviewsCount} reviews)` : 'New'}</span>
              </div>
              <span className="hidden sm:inline">·</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-5 h-5" />
                <span>{property.location}</span>
              </div>
            </div>
          </div>
          {user && (
            <Button
              variant="outline"
              size="lg"
              onClick={handleWishlistToggle}
              className="flex-shrink-0"
            >
              <Heart className={cn("mr-2 h-5 w-5", isInWishlist(property.id) ? 'text-red-500 fill-red-500' : 'text-foreground')} />
              <span>{isInWishlist(property.id) ? 'Saved' : 'Save'}</span>
            </Button>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-2 h-[300px] md:h-[550px] rounded-2xl overflow-hidden">
            <div className="md:col-span-2 md:row-span-2 relative">
                 <Image src={property.image1} alt={`Main photo of ${property.name}`} fill className="object-cover" data-ai-hint="property interior"/>
            </div>
            {galleryImages.slice(0, 4).map((img, index) => (
                <div key={index} className="relative hidden md:block">
                    <Image src={img} alt={`Photo ${index + 2} of ${property.name}`} fill className="object-cover" data-ai-hint="house detail" />
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mt-8 md:mt-12">
            <div className="lg:col-span-2">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-headline font-semibold">{property.type} hosted by {property.host.name}</h2>
                        <div className="flex items-center gap-x-4 gap-y-2 text-muted-foreground mt-2 flex-wrap">
                            <div className="flex items-center gap-2"><Users className="w-5 h-5" /><span>{property.maxGuests} guests</span></div>
                            <div className="flex items-center gap-2"><Bed className="w-5 h-5" /><span>{property.beds} beds</span></div>
                            <div className="flex items-center gap-2"><Bath className="w-5 h-5" /><span>{property.baths} baths</span></div>
                        </div>
                    </div>
                     <Avatar className="h-16 w-16">
                        <AvatarImage src={property.host.avatar} alt={property.host.name} />
                        <AvatarFallback>{property.host.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>

                <Separator className="my-8" />
                
                {user && user.id !== property.host.id && (
                  <>
                    <Button variant="outline" onClick={() => setIsInquiryFormOpen(true)}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Host
                    </Button>
                    <Separator className="my-8" />
                  </>
                )}

                <p className="text-foreground/90 leading-loose">{property.description}</p>
                
                <Separator className="my-8" />

                <div>
                    <h3 className="text-xl font-headline font-semibold mb-4">What this place offers</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
                        {property.amenities.map(amenity => {
                            const Icon = amenityIcons[amenity] || Tv;
                            return (
                                <div key={amenity} className="flex items-center gap-3">
                                    <Icon className="w-6 h-6 text-primary/80"/>
                                    <span>{amenity}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>

            <div className="lg:col-span-1">
                <div className="sticky top-24">
                   <BookingForm property={property} />
                </div>
            </div>
        </div>
      </main>
      <InquiryForm property={property} isOpen={isİnquiryFormOpen} onOpenChange={setIsInquiryFormOpen} />
    </div>
  );
}

const PropertyDetailsSkeleton = () => (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2" />
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-2 h-[300px] md:h-[550px]">
            <Skeleton className="md:col-span-2 md:row-span-2 w-full h-full rounded-2xl" />
            <Skeleton className="w-full h-full rounded-2xl hidden md:block" />
            <Skeleton className="w-full h-full rounded-2xl hidden md:block" />
            <Skeleton className="w-full h-full rounded-2xl hidden md:block" />
            <Skeleton className="w-full h-full rounded-2xl hidden md:block" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mt-8 md:mt-12">
            <div className="lg:col-span-2 space-y-8">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
            <div className="lg:col-span-1">
                 <Skeleton className="h-96 w-full" />
            </div>
        </div>
      </main>
    </div>
)


export function PropertyDetails({ propertyId }: { propertyId: string }) {
  const { getPropertyById, loading } = useProperties();
  
  if (loading) {
    return <PropertyDetailsSkeleton />;
  }
  
  const property = getPropertyById(propertyId);

  if (!property) {
    notFound();
  }

  return <PropertyDetailsClient property={property} />;
}
