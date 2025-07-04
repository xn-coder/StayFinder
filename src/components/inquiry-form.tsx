"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MessageSquare } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useProperties } from "@/hooks/use-properties";
import type { Property } from "@/types";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter, usePathname } from "next/navigation";

const inquirySchema = z.object({
  message: z.string().min(10, "Message must be at least 10 characters.").max(500, "Message cannot exceed 500 characters."),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

interface InquiryFormProps {
  property: Property;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InquiryForm({ property, isOpen, onOpenChange }: InquiryFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const { addInquiry } = useProperties();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (data: InquiryFormValues) => {
    if (!user) {
      router.push(`/login?redirect=${pathname}`);
      return;
    }

    if (user.id === property.host.id) {
      toast({
        variant: "destructive",
        title: "Cannot Inquire",
        description: "You cannot send an inquiry for your own property.",
      });
      return;
    }

    setLoading(true);
    await addInquiry({
      property: {
        id: property.id,
        name: property.name,
        host: property.host,
      },
      guest: user,
      message: data.message,
    });
    setLoading(false);

    toast({
      title: "Inquiry Sent!",
      description: "The host has been notified of your inquiry.",
    });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact Host</DialogTitle>
          <DialogDescription>
            Send a message to {property.host.name} about "{property.name}".
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ask a question about the property, availability, or special requests..."
                      className="h-32 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MessageSquare className="mr-2 h-4 w-4" />
                )}
                Send Inquiry
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
