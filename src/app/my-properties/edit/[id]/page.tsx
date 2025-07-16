

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useProperties } from '@/hooks/use-properties';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import type { Property } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const { getPropertyById, updateProperty, loading: propertiesLoading } = useProperties();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [property, setProperty] = useState<Property | null | undefined>(undefined);
  const [formData, setFormData] = useState({ name: '', description: '', pricePerNight: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const propertyId = params.id as string;

  useEffect(() => {
    if (!propertiesLoading) {
      const prop = getPropertyById(propertyId);
      if (prop) {
        setProperty(prop);
        setFormData({
          name: prop.name,
          description: prop.description,
          pricePerNight: prop.pricePerNight,
        });
      } else {
        setProperty(null); // Property not found
      }
    }
  }, [propertyId, propertiesLoading, getPropertyById]);

  useEffect(() => {
    if (!authLoading && property && user?.id !== property?.host.id) {
      toast({ variant: 'destructive', title: "Unauthorized", description: "You can only edit your own properties." });
      router.push('/hosting/dashboard');
    }
  }, [user, property, authLoading, router, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'pricePerNight' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    setIsSubmitting(true);
    await updateProperty(propertyId, formData);
    toast({ title: "Success", description: "Property updated successfully." });
    setIsSubmitting(false);
    router.push('/hosting/dashboard');
  };

  const isLoading = authLoading || propertiesLoading || property === undefined;
  
  if (isLoading) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <Skeleton className="h-8 w-48 mb-6" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-24 ml-auto" />
                    </CardContent>
                </Card>
            </main>
        </div>
    )
  }

  if (property === null) {
      router.push('/404');
      return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2" /> Back to Host Dashboard
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Edit "{property.name}"</CardTitle>
            <CardDescription>Update the details for your property listing.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Property Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className="min-h-32" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricePerNight">Price per Night</Label>
                <Input id="pricePerNight" name="pricePerNight" type="number" value={formData.pricePerNight} onChange={handleInputChange} />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
