
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function CancellationPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="relative h-80 flex items-center justify-center text-white text-center px-4">
          <Image
            src="https://placehold.co/1600x600.png"
            alt="Calendar with dates crossed out"
            fill
            className="object-cover"
            data-ai-hint="calendar schedule"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10">
            <h1 className="text-5xl font-bold font-headline">Cancellation Policies</h1>
            <p className="mt-4 text-lg max-w-2xl mx-auto">
              Understand your options for changing or cancelling your booking.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold font-headline">How Cancellations Work</h2>
              <p className="mt-2 text-muted-foreground text-lg">
                Cancellation policies are set by hosts and vary from property to property. You can always find the detailed cancellation policy on the property details page before you book.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold font-headline mb-6 text-center">Common Policy Types</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Flexible</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Full refund 1 day prior to arrival. No refund for cancellations made within 24 hours of check-in.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Moderate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Full refund for cancellations made within 48 hours of booking, if the check-in date is at least 14 days away. 50% refund for cancellations made at least 7 days before check-in. No refunds for cancellations made within 7 days of check-in.
                    </p>
                  </CardContent>
                </Card>
                 <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Strict</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Full refund for cancellations made within 48 hours of booking, if the check-in date is at least 14 days away. No refunds thereafter. Guests can also get a full refund if they cancel within 48 hours of booking.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="text-center p-6 bg-accent rounded-lg">
              <h3 className="text-xl font-semibold">Always Check Before You Book</h3>
              <p className="mt-2 text-accent-foreground">
                The specific cancellation policy applicable to your stay is shown during booking and in your trip details. By booking, you agree to the host's cancellation policy.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
