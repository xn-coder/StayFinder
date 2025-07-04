"use client";

import { useState } from "react";
import { Wand2, Loader2 } from "lucide-react";
import {
  recommendProperties,
  type PropertyRecommendationInput,
  type PropertyRecommendationOutput,
} from "@/ai/flows/property-recommendation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export function AiRecommendations({ initialInput }: { initialInput: PropertyRecommendationInput }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<PropertyRecommendationOutput | null>(null);
  const { toast } = useToast();

  const getRecommendations = async () => {
    setLoading(true);
    setRecommendations(null);
    try {
      const result = await recommendProperties(initialInput);
      if (result && result.recommendations.length > 0) {
        setRecommendations(result);
        setOpen(true);
      } else {
         toast({
          title: "No AI Recommendations",
          description: "The AI couldn't find any specific recommendations for your search. Try different criteria!",
        });
      }
    } catch (error) {
      console.error("Failed to get AI recommendations:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get AI recommendations. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={getRecommendations} disabled={loading} className="w-full">
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Wand2 className="mr-2 h-4 w-4" />
        )}
        Get AI Recommendations
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[825px]">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">AI Recommendations</DialogTitle>
            <DialogDescription>
              Based on your search, here are a few properties you might love.
            </DialogDescription>
          </DialogHeader>
          {recommendations && recommendations.recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto p-1">
              {recommendations.recommendations.map((prop) => (
                <Link key={prop.propertyId} href="#">
                    <div className="border rounded-lg p-4 hover:bg-accent transition-colors">
                        <div className="relative h-40 w-full rounded-md overflow-hidden mb-4">
                           <Image src={prop.photoUrl} alt={prop.propertyName} layout="fill" objectFit="cover" data-ai-hint="property interior"/>
                        </div>
                        <h4 className="font-semibold font-headline">{prop.propertyName}</h4>
                        <p className="text-sm text-muted-foreground">${prop.pricePerNight}/night</p>
                        <p className="text-sm mt-2">{prop.propertyDescription}</p>
                    </div>
                </Link>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertTitle>No Recommendations Found</AlertTitle>
              <AlertDescription>
                The AI assistant could not find any properties matching your exact criteria.
              </AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
