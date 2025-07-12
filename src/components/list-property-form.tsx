
"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  Loader2, Building2, MapPin, Users, Bed, Bath, Sparkles, Home, Pencil, PartyPopper, Minus, Plus, Image as ImageIcon, Warehouse, BedDouble, Ship, Caravan, Castle, Mountain, Box, Tractor, Hotel, Tent, TowerControl, TreePine, Wind, ThumbsUp, Zap, ShieldCheck, ShieldQuestion, Percent, Video, Signal, Crosshair
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { allAmenities } from "@/lib/dummy-data";
import { useProperties } from "@/hooks/use-properties";
import { useAuth } from "@/hooks/use-auth";
import { useSettings } from "@/hooks/use-settings";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { User, PrivacyType, Property } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string(),
  role: z.enum(['user', 'host', 'super-admin']),
});

const listPropertySchema = z.object({
  type: z.string().min(1, "You must select a property type."),
  privacyType: z.enum(['entire-place', 'room', 'shared-room'], {
    required_error: "You must select a privacy type."
  }),
  location: z.string().min(5, "Location must be at least 5 characters."),
  maxGuests: z.coerce.number().min(1, "Must accommodate at least 1 guest."),
  bedrooms: z.coerce.number().min(0, "Bedrooms can't be negative."),
  beds: z.coerce.number().min(1, "Must have at least 1 bed."),
  baths: z.coerce.number().min(1, "Must have at least 1 bath."),
  amenities: z.array(z.string()).min(1, "Select at least one amenity."),
  image1: z.string({ required_error: "First image is required." }).min(1),
  image2: z.string({ required_error: "Second image is required." }).min(1),
  image3: z.string({ required_error: "Third image is required." }).min(1),
  image4: z.string({ required_error: "Fourth image is required." }).min(1),
  name: z.string().min(5, "Property name must be at least 5 characters."),
  highlights: z.array(z.string()).max(2, "You can select up to 2 highlights.").optional(),
  description: z.string().min(20, "Description must be at least 20 characters."),
  pricePerNight: z.coerce.number().min(10, "Price must be at least 10."),
  bookingPolicy: z.enum(['review-first', 'instant-book'], { required_error: "You must select a booking policy." }),
  host: userSchema,
  status: z.enum(['pending', 'approved', 'rejected']),
  rating: z.number(),
  reviewsCount: z.number(),
  firstGuestChoice: z.enum(['any', 'experienced']).optional(),
  weekendPremium: z.coerce.number().min(0).optional(),
  discounts: z.object({
    newListingPromotion: z.boolean(),
    lastMinute: z.coerce.number().min(0).max(100),
    weekly: z.coerce.number().min(0).max(100),
    monthly: z.coerce.number().min(0).max(100),
  }).optional(),
  safetyDetails: z.object({
    hasCamera: z.boolean(),
    hasNoiseMonitor: z.boolean(),
    hasWeapon: z.boolean(),
  }).optional(),
});

type ListPropertyFormValues = z.infer<typeof listPropertySchema>;

const propertyTypes = [
    { type: 'House', icon: Home },
    { type: 'Flat/apartment', icon: Building2 },
    { type: 'Barn', icon: Warehouse },
    { type: 'Bed & breakfast', icon: BedDouble },
    { type: 'Boat', icon: Ship },
    { type: 'Cabin', icon: Home },
    { type: 'Campervan/motorhome', icon: Caravan },
    { type: 'Casa particular', icon: Home },
    { type: 'Castle', icon: Castle },
    { type: 'Cave', icon: Mountain },
    { type: 'Container', icon: Box },
    { type: 'Cycladic home', icon: Home },
    { type: 'Dammuso', icon: Home },
    { type: 'Dome', icon: Home },
    { type: 'Earth home', icon: Home },
    { type: 'Farm', icon: Tractor },
    { type: 'Guest house', icon: Hotel },
    { type: 'Hotel', icon: Hotel },
    { type: 'Houseboat', icon: Ship },
    { type: 'Kezhan', icon: Home },
    { type: 'Minsu', icon: Home },
    { type: 'Riad', icon: Home },
    { type: 'Ryokan', icon: Hotel },
    { type: 'Shepherd’s hut', icon: Home },
    { type: 'Tent', icon: Tent },
    { type: 'Tiny home', icon: Home },
    { type: 'Tower', icon: TowerControl },
    { type: 'Tree house', icon: TreePine },
    { type: 'Windmill', icon: Wind },
    { type: 'Yurt', icon: Tent },
];

const Counter = ({ title, value, onUpdate }: { title: string, value: number, onUpdate: (value: number) => void}) => (
    <div className="flex items-center justify-between py-4">
      <span className="text-lg text-foreground">{title}</span>
      <div className="flex items-center gap-4">
        <Button type="button" variant="outline" size="icon" className="rounded-full" onClick={() => onUpdate(Math.max(0, value - 1))} disabled={value <= 0}>
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-xl font-bold w-8 text-center">{value}</span>
        <Button type="button" variant="outline" size="icon" className="rounded-full" onClick={() => onUpdate(value + 1)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
);

const StepContainer = (({ title, description, children }: { title: string, description?: string, children: React.ReactNode }) => {
    return (
        <div className="w-full animate-in fade-in-50 duration-500">
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-2">{title}</h2>
            {description && <p className="text-muted-foreground mb-8 text-lg">{description}</p>}
            {children}
        </div>
    )
});
StepContainer.displayName = "StepContainer";

export function ListPropertyForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { addProperty } = useProperties();
  const { user } = useAuth();
  const { currencySymbol } = useSettings();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<ListPropertyFormValues>>({
    pricePerNight: 1500,
    maxGuests: 4,
    bedrooms: 1,
    beds: 1,
    baths: 1,
    amenities: [],
    highlights: [],
    bookingPolicy: 'review-first',
    firstGuestChoice: 'any',
    weekendPremium: 3,
    discounts: {
      newListingPromotion: true,
      lastMinute: 4,
      weekly: 10,
      monthly: 20,
    },
    safetyDetails: {
      hasCamera: false,
      hasNoiseMonitor: false,
      hasWeapon: false,
    },
  });

  const totalSteps = 16;

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.type) {
          toast({ variant: 'destructive', title: 'Please select a property type.' });
          return false;
        }
        break;
      case 2:
        if (!formData.privacyType) {
          toast({ variant: 'destructive', title: 'Please select a privacy type.' });
          return false;
        }
        break;
      case 3:
        if (!formData.location || formData.location.length < 5) {
          toast({ variant: 'destructive', title: 'Location is required', description: 'Please enter a location of at least 5 characters.' });
          return false;
        }
        break;
      case 4:
        if ((formData.maxGuests ?? 0) < 1) {
          toast({ variant: 'destructive', title: 'Invalid guest count', description: 'Must accommodate at least 1 guest.' });
          return false;
        }
        if ((formData.beds ?? 0) < 1) {
          toast({ variant: 'destructive', title: 'Invalid bed count', description: 'Must have at least 1 bed.' });
          return false;
        }
        if ((formData.baths ?? 0) < 1) {
          toast({ variant: 'destructive', title: 'Invalid bathroom count', description: 'Must have at least 1 bathroom.' });
          return false;
        }
        break;
      case 5:
        if (!formData.amenities || formData.amenities.length < 1) {
          toast({ variant: 'destructive', title: 'Select amenities', description: 'Please select at least one amenity.' });
          return false;
        }
        break;
      case 6:
        const uploadedImagesCount = [formData.image1, formData.image2, formData.image3, formData.image4].filter(Boolean).length;
        if (uploadedImagesCount < 4) {
          toast({ variant: 'destructive', title: 'Upload photos', description: 'Please upload at least 4 photos.' });
          return false;
        }
        break;
      case 7:
        if (!formData.name || formData.name.length < 5) {
          toast({ variant: 'destructive', title: 'Property name is required', description: 'Please enter a name of at least 5 characters.' });
          return false;
        }
        break;
      case 9:
        if (!formData.description || formData.description.length < 20) {
          toast({ variant: 'destructive', title: 'Description is required', description: 'Please enter a description of at least 20 characters.' });
          return false;
        }
        break;
      case 10:
        if ((formData.pricePerNight ?? 0) < 10) {
          toast({ variant: 'destructive', title: 'Invalid price', description: 'Price must be at least 10.' });
          return false;
        }
        break;
      default:
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, totalSteps));
    }
  };
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleUpdateData = (newData: Partial<ListPropertyFormValues>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };
  
  const handleAmenityToggle = (amenity: string) => {
    const currentAmenities = formData.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    handleUpdateData({ amenities: newAmenities });
  };
  
  const handleHighlightToggle = (highlight: string) => {
    const currentHighlights = formData.highlights || [];
    if (currentHighlights.includes(highlight)) {
      handleUpdateData({ highlights: currentHighlights.filter(h => h !== highlight) });
    } else if (currentHighlights.length < 2) {
      handleUpdateData({ highlights: [...currentHighlights, highlight] });
    } else {
      toast({
        variant: 'destructive',
        title: 'Limit Reached',
        description: 'You can only select up to 2 highlights.',
      });
    }
  };
  
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) { // 1MB limit
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload an image smaller than 1MB.',
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          const imageKeys: (keyof Pick<ListPropertyFormValues, 'image1' | 'image2' | 'image3' | 'image4'>)[] = ['image1', 'image2', 'image3', 'image4'];
          const firstEmptySlot = imageKeys.find(key => !formData[key]);

          if (firstEmptySlot) {
              handleUpdateData({ [firstEmptySlot]: result });
              toast({
                  title: 'Image Added!',
                  description: 'Your image has been successfully added for preview.',
              });
          } else {
              toast({
                  variant: 'destructive',
                  title: 'Limit Reached',
                  description: 'You can only upload up to 4 photos.',
              });
          }
        }
      };
      reader.onerror = () => {
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: 'There was an error reading the image file.',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    imageInputRef.current?.click();
  };

  const onSubmit = async () => {
    if (!user) {
      toast({ variant: "destructive", title: "Not authenticated" });
      return;
    }
    
    const finalData = {
      ...formData,
      host: user,
      status: 'pending',
      rating: 0,
      reviewsCount: 0,
    };
    
    const result = listPropertySchema.safeParse(finalData);
    if (!result.success) {
      const firstError = result.error.errors[0];
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: `Please complete all required fields. The '${firstError.path.join('.')}' field has an error: ${firstError.message}`,
      });
      return;
    }

    setLoading(true);
    const { highlights, ...propertyData } = result.data;
    await addProperty(propertyData as Omit<Property, 'id'>);
    toast({
      title: "Property Submitted!",
      description: "Your property is now pending review. You can see it in 'My Properties'.",
    });
    setLoading(false);
    router.push("/my-properties");
  };
  
  const getStageInfo = (currentStep: number): { name: string, number: number } => {
    if (currentStep <= 4) return { name: "Stage 1: Tell us about your place", number: 1 };
    if (currentStep <= 9) return { name: "Stage 2: Make it stand out", number: 2 };
    return { name: "Stage 3: Finish up and publish", number: 3 };
  };

  const stageInfo = getStageInfo(step);
  
  const uploadedImages = [formData.image1, formData.image2, formData.image3, formData.image4].filter(Boolean) as string[];

  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <StepContainer title="Which of these best describes your place?">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto pr-3">
              {propertyTypes.map(({ type, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => {
                    handleUpdateData({ type: type as any });
                    nextStep();
                  }}
                  className={cn(
                    "p-4 border-2 rounded-lg transition-all duration-200 flex flex-col items-start gap-3 h-32 justify-between hover:shadow-lg hover:border-primary",
                    formData.type === type
                      ? "border-primary bg-accent shadow-md"
                      : "border-border bg-card hover:bg-muted/50"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-8 h-8",
                      formData.type === type
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                  <span className="font-semibold text-left text-lg">{type}</span>
                </button>
              ))}
            </div>
          </StepContainer>
        );
      case 2:
        return (
          <StepContainer title="What type of place will guests have?">
            <div className="space-y-4">
                <button onClick={() => { handleUpdateData({ privacyType: 'entire-place' }); nextStep(); }} className={cn("p-6 border-2 rounded-lg w-full text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex justify-between items-center", formData.privacyType === 'entire-place' ? 'border-primary bg-accent shadow-lg' : 'border-border bg-background hover:border-primary')}>
                    <div>
                        <h3 className="font-bold text-xl">An entire place</h3>
                        <p className="text-muted-foreground mt-1">Guests have the whole place to themselves.</p>
                    </div>
                    <Home className="w-10 h-10 text-muted-foreground" />
                </button>
                <button onClick={() => { handleUpdateData({ privacyType: 'room' }); nextStep(); }} className={cn("p-6 border-2 rounded-lg w-full text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex justify-between items-center", formData.privacyType === 'room' ? 'border-primary bg-accent shadow-lg' : 'border-border bg-background hover:border-primary')}>
                    <div>
                        <h3 className="font-bold text-xl">A room</h3>
                        <p className="text-muted-foreground mt-1">Guests have their own room in a home, plus access to shared spaces.</p>
                    </div>
                    <Bed className="w-10 h-10 text-muted-foreground" />
                </button>
                <button onClick={() => { handleUpdateData({ privacyType: 'shared-room' }); nextStep(); }} className={cn("p-6 border-2 rounded-lg w-full text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex justify-between items-center", formData.privacyType === 'shared-room' ? 'border-primary bg-accent shadow-lg' : 'border-border bg-background hover:border-primary')}>
                    <div>
                        <h3 className="font-bold text-xl">A shared room</h3>
                        <p className="text-muted-foreground mt-1">Guests sleep in a room with others and share the entire space.</p>
                    </div>
                    <Users className="w-10 h-10 text-muted-foreground" />
                </button>
            </div>
          </StepContainer>
        );
      case 3:
        return (
          <StepContainer title="Where's your place located?" description="Your address is only shared with guests after they’ve made a reservation.">
             <MapPin className="w-16 h-16 text-primary mx-auto mb-4"/>
             <Input 
                type="text" 
                placeholder="e.g. Mumbai, India" 
                value={formData.location || ''}
                onChange={e => handleUpdateData({ location: e.target.value })}
                className="h-14 text-lg border-2"
             />
          </StepContainer>
        );
      case 4:
        return (
            <StepContainer title="Share some basics about your place" description="You'll add more details later, such as bed types.">
                <Counter title="Max Guests" value={formData.maxGuests!} onUpdate={val => handleUpdateData({ maxGuests: val })} />
                <Counter title="Bedrooms" value={formData.bedrooms!} onUpdate={val => handleUpdateData({ bedrooms: val })} />
                <Counter title="Beds" value={formData.beds!} onUpdate={val => handleUpdateData({ beds: val })} />
                <Counter title="Bathrooms" value={formData.baths!} onUpdate={val => handleUpdateData({ baths: val })} />
            </StepContainer>
        );
      case 5:
         return (
            <StepContainer title="Tell guests what your place has to offer" description="You can add more amenities after you publish.">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto pr-2">
                    {allAmenities.map(amenity => (
                        <button key={amenity} onClick={() => handleAmenityToggle(amenity)} className={cn("p-4 border-2 rounded-lg text-left hover:border-primary transition-colors flex items-center gap-3", (formData.amenities || []).includes(amenity) ? 'border-primary bg-primary/10' : 'border-border')}>
                           <span className="font-semibold">{amenity}</span>
                        </button>
                    ))}
                </div>
            </StepContainer>
         )
      case 6:
        return (
          <StepContainer title="Next, let's add some photos" description="Upload at least 4 photos to continue. You can always add more later.">
             <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageFileChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />
             <div className="border-2 border-dashed rounded-lg p-12 text-center">
                 <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4"/>
                 <Button type="button" onClick={handleUploadClick}>Upload Photos</Button>
             </div>
             <div className="mt-4 grid grid-cols-3 gap-4">
                {uploadedImages.map((img, i) => (
                    <div key={i} className="relative h-24 w-full rounded-md overflow-hidden">
                        <img src={img} alt={`property image ${i+1}`} className="object-cover w-full h-full"/>
                    </div>
                ))}
             </div>
          </StepContainer>
        );
      case 7:
        return (
          <StepContainer title="Now, let's give it a name" description="Short and sweet works best!">
             <Pencil className="w-16 h-16 text-primary mx-auto mb-4"/>
             <Input 
                type="text" 
                placeholder="e.g. Cozy Beachfront Cottage"
                value={formData.name || ''}
                onChange={e => handleUpdateData({ name: e.target.value })}
                className="h-14 text-lg border-2"
             />
          </StepContainer>
        );
      case 8:
        return (
          <StepContainer title="Next, let's describe your house" description="Choose up to 2 highlights. We'll use these to get your description started.">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Peaceful', 'Unique', 'Family-friendly', 'Stylish', 'Central', 'Spacious'].map(highlight => (
                <button
                  key={highlight}
                  onClick={() => handleHighlightToggle(highlight)}
                  className={cn(
                    "p-4 border-2 rounded-lg text-center font-semibold hover:border-primary transition-colors",
                    (formData.highlights || []).includes(highlight) ? 'border-primary bg-primary/10' : 'border-border'
                  )}
                >
                  {highlight}
                </button>
              ))}
            </div>
          </StepContainer>
        );
      case 9:
        return (
            <StepContainer title="Create your description" description="Share what makes your place special.">
                <Textarea
                    placeholder="You'll have a great time at this comfortable place to stay."
                    value={formData.description || ''}
                    onChange={e => handleUpdateData({ description: e.target.value })}
                    className="h-56 resize-none border-2"
                />
            </StepContainer>
        );
      case 10:
        const basePrice = formData.pricePerNight || 0;
        const guestFee = basePrice * 0.14;
        const guestPrice = basePrice + guestFee;
        const hostEarning = basePrice * 0.97;
        return (
          <StepContainer title="Now, set your weekday base price" description={`Tip: You can set a different price for weekends.`}>
             <div className="flex justify-center items-baseline h-24">
                <span className="text-8xl font-bold font-mono text-muted-foreground">{currencySymbol}</span>
                <Input
                    type="number"
                    value={formData.pricePerNight || ''}
                    onChange={e => handleUpdateData({ pricePerNight: Number(e.target.value) })}
                    onWheel={e => (e.target as HTMLElement).blur()}
                    className="h-24 flex-1 text-8xl font-bold font-mono bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-foreground text-left"
                />
             </div>
             <div className="mt-6 border-t pt-4 space-y-2 text-muted-foreground max-w-sm mx-auto">
                <div className="flex justify-between"><span>Base price</span><span>{currencySymbol}{basePrice.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Guest service fee</span><span>{currencySymbol}{guestFee.toLocaleString()}</span></div>
                <div className="flex justify-between font-bold text-foreground"><span>Guest price before taxes</span><span>{currencySymbol}{guestPrice.toLocaleString()}</span></div>
                <Separator className="my-2"/>
                <div className="flex justify-between font-bold text-foreground"><span>You earn</span><span>{currencySymbol}{hostEarning.toLocaleString()}</span></div>
             </div>
          </StepContainer>
        );
      case 11:
        const weekendPrice = (formData.pricePerNight || 0) * (1 + (formData.weekendPremium || 0) / 100);
        return (
            <StepContainer title="Set a weekend price" description="Add a premium for Fridays and Saturdays.">
                <div className="text-center">
                    <h3 className="text-4xl font-bold">{currencySymbol}{weekendPrice.toLocaleString()}</h3>
                    <p className="text-muted-foreground">Guest price before taxes: {currencySymbol}{(weekendPrice * 1.14).toLocaleString()}</p>
                </div>
                <div className="mt-8 max-w-sm mx-auto">
                    <Label>Weekend premium (Tip: Try 3%)</Label>
                    <div className="flex items-center gap-4 mt-2">
                        <Slider
                            value={[formData.weekendPremium || 0]}
                            onValueChange={([val]) => handleUpdateData({ weekendPremium: val })}
                            max={99}
                            step={1}
                        />
                         <span className="font-bold text-lg">{formData.weekendPremium || 0}%</span>
                    </div>
                </div>
            </StepContainer>
        )
      case 12:
        return (
            <StepContainer title="Choose who to welcome for your first reservation" description="After your first guest, anyone can book your place.">
                <div className="space-y-4">
                    <button onClick={() => { handleUpdateData({ firstGuestChoice: 'any' }); nextStep(); }} className={cn("p-6 border-2 rounded-lg w-full text-left hover:border-primary transition-colors flex justify-between items-center", formData.firstGuestChoice === 'any' ? 'border-primary bg-primary/10' : 'border-border')}>
                        <div>
                            <h3 className="font-bold text-lg">Any StayFinder guest</h3>
                            <p className="text-muted-foreground">Get reservations faster when you welcome anyone from the community.</p>
                        </div>
                        <Users className="w-8 h-8 text-muted-foreground" />
                    </button>
                    <button onClick={() => { handleUpdateData({ firstGuestChoice: 'experienced' }); nextStep(); }} className={cn("p-6 border-2 rounded-lg w-full text-left hover:border-primary transition-colors flex justify-between items-center", formData.firstGuestChoice === 'experienced' ? 'border-primary bg-primary/10' : 'border-border')}>
                        <div>
                            <h3 className="font-bold text-lg">An experienced guest</h3>
                            <p className="text-muted-foreground">Welcome someone with a good track record on StayFinder.</p>
                        </div>
                        <ShieldCheck className="w-8 h-8 text-muted-foreground" />
                    </button>
                </div>
            </StepContainer>
        )
      case 13:
        const discounts = formData.discounts!;
        return (
          <StepContainer title="Add discounts" description="Help your place stand out to get booked faster and earn your first reviews.">
            <div className="space-y-4">

              <div className="p-4 border rounded-lg flex justify-between items-center">
                <div>
                  <Label className="font-semibold">New listing promotion</Label>
                  <p className="text-sm text-muted-foreground mt-1">Offer 20% off your first 3 bookings</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-bold text-lg text-primary">20%</span>
                    <Switch
                        checked={discounts.newListingPromotion}
                        onCheckedChange={(checked) => handleUpdateData({ discounts: { ...discounts, newListingPromotion: checked } })}
                    />
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <Label className="font-semibold">Last-minute discount</Label>
                    <p className="text-sm text-muted-foreground mt-1">For stays booked 14 days or less before arrival</p>
                  </div>
                  <div className="text-right">
                      <span className="text-3xl font-bold">{discounts.lastMinute}</span>
                      <span className="text-muted-foreground">%</span>
                  </div>
                </div>
                <Slider
                  value={[discounts.lastMinute]}
                  onValueChange={([val]) => handleUpdateData({ discounts: { ...discounts, lastMinute: val } })}
                  max={99} step={1}
                  className="mt-4"
                />
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <Label className="font-semibold">Weekly discount</Label>
                    <p className="text-sm text-muted-foreground mt-1">For stays of 7 nights or more</p>
                  </div>
                  <div className="text-right">
                      <span className="text-3xl font-bold">{discounts.weekly}</span>
                      <span className="text-muted-foreground">%</span>
                  </div>
                </div>
                <Slider
                  value={[discounts.weekly]}
                  onValueChange={([val]) => handleUpdateData({ discounts: { ...discounts, weekly: val } })}
                  max={99} step={1}
                  className="mt-4"
                />
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <Label className="font-semibold">Monthly discount</Label>
                    <p className="text-sm text-muted-foreground mt-1">For stays of 28 nights or more</p>
                  </div>
                  <div className="text-right">
                      <span className="text-3xl font-bold">{discounts.monthly}</span>
                      <span className="text-muted-foreground">%</span>
                  </div>
                </div>
                <Slider
                  value={[discounts.monthly]}
                  onValueChange={([val]) => handleUpdateData({ discounts: { ...discounts, monthly: val } })}
                  max={99} step={1}
                  className="mt-4"
                />
              </div>

            </div>
          </StepContainer>
        )
      case 14:
        const safety = formData.safetyDetails!;
        return (
          <StepContainer title="Share safety details" description="Does your place have any of these?">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <Label htmlFor="camera-switch" className="flex items-center gap-2"><Video /> Exterior security camera</Label>
                <Switch
                  id="camera-switch"
                  checked={safety.hasCamera}
                  onCheckedChange={(checked) => handleUpdateData({ safetyDetails: { ...safety, hasCamera: checked } })}
                />
              </div>
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <Label htmlFor="noise-switch" className="flex items-center gap-2"><Signal /> Noise decibel monitor</Label>
                <Switch
                  id="noise-switch"
                  checked={safety.hasNoiseMonitor}
                  onCheckedChange={(checked) => handleUpdateData({ safetyDetails: { ...safety, hasNoiseMonitor: checked } })}
                />
              </div>
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <Label htmlFor="weapon-switch" className="flex items-center gap-2"><Crosshair /> Weapon(s) on property</Label>
                <Switch
                  id="weapon-switch"
                  checked={safety.hasWeapon}
                  onCheckedChange={(checked) => handleUpdateData({ safetyDetails: { ...safety, hasWeapon: checked } })}
                />
              </div>
            </div>
             <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <h4 className="font-semibold text-foreground mb-2">Important things to know</h4>
                <p>Security cameras that monitor indoor spaces are not allowed even if they’re turned off. All exterior security cameras must be disclosed. Be sure to comply with your local laws.</p>
            </div>
          </StepContainer>
        )
      case 15:
        return (
          <StepContainer title="Pick your booking settings" description="You can change this at any time.">
            <div className="space-y-4">
                <button onClick={() => handleUpdateData({ bookingPolicy: 'review-first' })} className={cn("p-6 border-2 rounded-lg w-full text-left hover:border-primary transition-colors flex justify-between items-center", formData.bookingPolicy === 'review-first' ? 'border-primary bg-primary/10' : 'border-border')}>
                    <div>
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          Approve your first 5 bookings
                          <Badge variant="secondary">Recommended</Badge>
                        </h3>
                        <p className="text-muted-foreground mt-1">Start by reviewing reservation requests, then switch to Instant Book so guests can book automatically.</p>
                    </div>
                    <ThumbsUp className="w-8 h-8 text-muted-foreground" />
                </button>
                <button onClick={() => handleUpdateData({ bookingPolicy: 'instant-book' })} className={cn("p-6 border-2 rounded-lg w-full text-left hover:border-primary transition-colors flex justify-between items-center", formData.bookingPolicy === 'instant-book' ? 'border-primary bg-primary/10' : 'border-border')}>
                    <div>
                        <h3 className="font-bold text-lg">Use Instant Book</h3>
                        <p className="text-muted-foreground mt-1">Let guests who meet your requirements book automatically.</p>
                    </div>
                    <Zap className="w-8 h-8 text-muted-foreground" />
                </button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              <a href="#" className="underline">Learn more</a> about the differences.
            </p>
          </StepContainer>
        );
       case 16:
        return (
            <StepContainer title="You're all set!" description="Review your information and publish your listing.">
                <div className="text-center p-8">
                    <PartyPopper className="w-24 h-24 text-primary mx-auto mb-4" />
                    <p className="text-lg">Click the submit button to put your listing live.</p>
                </div>
            </StepContainer>
        )
      default: return null;
    }
  };
  
  return (
    <div className="w-full max-w-4xl p-4">
      <div className="w-full mb-8">
        <Progress value={(step / totalSteps) * 100} className="w-full h-2" />
      </div>
      
      <div className="min-h-[450px] flex items-center justify-center">
        {renderContent()}
      </div>

      <div className="mt-8 flex items-center">
        <Button onClick={prevStep} disabled={step === 1} className="h-12 px-6">Back</Button>
        <div className="flex-grow"></div>
        {step < totalSteps && (
          <Button onClick={nextStep} className="h-12 px-8">
            Next
          </Button>
        )}
        {step === totalSteps && (
          <Button onClick={onSubmit} disabled={loading} className="h-12 px-8">
            {loading ? <Loader2 className="animate-spin" /> : <PartyPopper className="mr-2" />}
            Submit Listing
          </Button>
        )}
      </div>
    </div>
  );
}
