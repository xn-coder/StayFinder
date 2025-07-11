import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactUsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="bg-muted/40">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-5xl font-bold font-headline">Contact Us</h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              We're here to help. Whether you have a question, a suggestion, or need support, our team is ready to assist you.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
            
            {/* Contact Form */}
            <div>
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

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-headline font-semibold mb-4">Our Information</h3>
                <div className="space-y-4 text-muted-foreground">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Email</h4>
                      <p>support@stayfinder.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Phone</h4>
                      <p>+1 (555) 123-4567</p>
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
               <div>
                <h3 className="text-2xl font-headline font-semibold mb-4">Find Help Faster</h3>
                <div className="space-y-3">
                   <Button asChild variant="outline" className="w-full justify-start text-base h-auto py-3">
                    <a href="/help">
                        Visit our Help Center &rarr;
                    </a>
                   </Button>
                    <Button asChild variant="outline" className="w-full justify-start text-base h-auto py-3">
                    <a href="/cancellation-policy">
                        Read our Cancellation Policy &rarr;
                    </a>
                   </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
