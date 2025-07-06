
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useProperties } from "@/hooks/use-properties";
import { useToast } from "@/hooks/use-toast";
import type { Booking } from "@/types";
import { cn } from "@/lib/utils";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";

interface ReviewDialogProps {
  booking: Booking | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const reviewSchema = z.object({
    rating: z.number().min(1, "Rating is required.").max(5),
    comment: z.string().min(10, "Comment must be at least 10 characters.").max(500, "Comment cannot exceed 500 characters."),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export function ReviewDialog({ booking, isOpen, onOpenChange }: ReviewDialogProps) {
  const { addReviewAndRating } = useProperties();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const ratingValue = form.watch("rating");

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };
  
  const onSubmit = async (data: ReviewFormValues) => {
    if (!booking) return;
    setLoading(true);

    try {
      await addReviewAndRating(booking.id, booking.property.id, data.rating, data.comment);
      toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback.",
      });
      handleClose();
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Could not submit your review. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave a review for {booking.property.name}</DialogTitle>
          <DialogDescription>
            Share your experience to help other travelers.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div 
                                    className="flex justify-center gap-1 py-2"
                                    onMouseLeave={() => setHoverRating(0)}
                                >
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={cn(
                                                "h-8 w-8 cursor-pointer transition-colors",
                                                (hoverRating || ratingValue) >= star
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-muted-foreground"
                                            )}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onClick={() => field.onChange(star)}
                                        />
                                    ))}
                                </div>
                            </FormControl>
                            <FormMessage className="text-center" />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                        <FormItem>
                             <FormControl>
                                <Textarea
                                    placeholder="Tell us about your stay..."
                                    className="h-32 resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Review
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
