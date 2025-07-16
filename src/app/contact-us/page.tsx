
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline">Send us a message</CardTitle>
                        <CardDescription>Our team will get back to you shortly.</CardDescription>
                    </CardHeader>
                    <CardContent>
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
                            <Button type="submit" size="lg" className="w-full sm:w-auto">Send Message</Button>
                        </form>

                        <Separator className="my-8" />

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                            <div className="flex flex-col items-center">
                                <Mail className="h-8 w-8 text-primary mb-2" />
                                <h4 className="font-semibold">Email</h4>
                                <a href="mailto:support@stayfinder.com" className="text-muted-foreground hover:underline">support@stayfinder.com</a>
                            </div>
                            <div className="flex flex-col items-center">
                                <Phone className="h-8 w-8 text-primary mb-2" />
                                <h4 className="font-semibold">Phone</h4>
                                <a href="tel:+15551234567" className="text-muted-foreground hover:underline">+1 (555) 123-4567</a>
                            </div>
                            <div className="flex flex-col items-center">
                                <MapPin className="h-8 w-8 text-primary mb-2" />
                                <h4 className="font-semibold">Office</h4>
                                <p className="text-muted-foreground">123 StayFinder Lane, Silicon Valley</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
