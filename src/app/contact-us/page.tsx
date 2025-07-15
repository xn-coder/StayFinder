
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function ContactUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header />
      <main className="flex-grow">
        <div className="py-16 text-center px-4">
          <h1 className="text-5xl font-bold font-headline">Get in Touch</h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question, feedback, or need assistance, our team is here to help.
          </p>
        </div>

        <div className="container mx-auto px-4 pb-16">
            <Card className="max-w-6xl mx-auto overflow-hidden">
                <div className="grid md:grid-cols-2">
                    {/* Left side: Form */}
                    <div className="p-8 md:p-12">
                        <h2 className="text-3xl font-headline font-semibold mb-6">Send us a message</h2>
                        <form className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" placeholder="John" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" placeholder="Doe" />
                            </div>
                            </div>
                            <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="you@example.com" />
                            </div>
                            <div className="space-y-2">
                            <Label htmlFor="message">Your Message</Label>
                            <Textarea id="message" placeholder="Tell us how we can help..." className="min-h-[150px]" />
                            </div>
                            <Button type="submit" size="lg">Send Message</Button>
                        </form>
                    </div>

                    {/* Right side: Info */}
                    <div className="bg-muted/50 p-8 md:p-12 space-y-12">
                        <div className="relative h-64 w-full rounded-lg overflow-hidden border">
                            <Image 
                                src="https://placehold.co/800x600.png"
                                alt="Map showing office location"
                                layout="fill"
                                objectFit="cover"
                                data-ai-hint="city map"
                            />
                        </div>
                        <div>
                            <h3 className="text-2xl font-headline font-semibold mb-6">Our Information</h3>
                            <div className="space-y-6 text-muted-foreground">
                            <div className="flex items-start gap-4">
                                <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                                <div>
                                <h4 className="font-semibold text-foreground">Email</h4>
                                <a href="mailto:support@stayfinder.com" className="hover:underline">support@stayfinder.com</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                                <div>
                                <h4 className="font-semibold text-foreground">Phone</h4>
                                <a href="tel:+15551234567" className="hover:underline">+1 (555) 123-4567</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                                <div>
                                <h4 className="font-semibold text-foreground">Office</h4>
                                <p>123 StayFinder Lane, Silicon Valley, CA 94043, USA</p>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
