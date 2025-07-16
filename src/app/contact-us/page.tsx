
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, User, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function ContactUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Header />
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-5xl">
          <Card className="overflow-hidden shadow-2xl rounded-2xl">
            <div className="grid md:grid-cols-2">
              {/* Form Section */}
              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold font-headline mb-2">Send us a message</h2>
                <p className="text-muted-foreground mb-8">Our team will get back to you shortly.</p>
                <form className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="flex items-center gap-x-2 rounded-md border border-input bg-background px-3 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <Input id="firstName" placeholder="John" className="h-9 w-full border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                       <div className="flex items-center gap-x-2 rounded-md border border-input bg-background px-3 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <Input id="lastName" placeholder="Doe" className="h-9 w-full border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-x-2 rounded-md border border-input bg-background px-3 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Input id="email" type="email" placeholder="you@example.com" className="h-9 w-full border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Your Message</Label>
                     <div className="flex items-start gap-x-2 rounded-md border border-input bg-background px-3 py-2 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <Textarea id="message" placeholder="Tell us how we can help..." className="min-h-[140px] border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none" />
                    </div>
                  </div>
                  <Button type="submit" size="lg" className="w-full sm:w-auto">Send Message</Button>
                </form>
              </div>

              {/* Info Section */}
              <div className="bg-primary text-primary-foreground p-8 md:p-12 flex flex-col justify-center rounded-r-2xl">
                 <h2 className="text-3xl font-bold font-headline mb-4">Contact Information</h2>
                 <p className="text-primary-foreground/80 mb-8">
                    Find us at our office or get in touch through email or phone.
                 </p>
                 <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <Mail className="h-6 w-6 text-primary-foreground/80 mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold">Email</h4>
                            <a href="mailto:support@stayfinder.com" className="text-primary-foreground/80 hover:underline">support@stayfinder.com</a>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <Phone className="h-6 w-6 text-primary-foreground/80 mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold">Phone</h4>
                            <a href="tel:+15551234567" className="text-primary-foreground/80 hover:underline">+1 (555) 123-4567</a>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <MapPin className="h-6 w-6 text-primary-foreground/80 mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold">Office</h4>
                            <p className="text-primary-foreground/80">123 StayFinder Lane, Silicon Valley</p>
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
