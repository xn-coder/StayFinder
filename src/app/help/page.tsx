
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I book a property?",
      answer: "To book a property, simply navigate to the property's page, select your desired dates in the booking form, specify the number of guests, and click 'Book Now'. You'll be guided through the payment process."
    },
    {
      question: "How do I list my own property?",
      answer: "To become a host, click on 'List your property' in the header. If you're not already a host, you'll be prompted to sign up. Then, you can follow the step-by-step form to list your property."
    },
    {
      question: "What is the cancellation policy?",
      answer: "Cancellation policies vary by property and are set by the host. You can find the specific cancellation policy for a property on its details page before you book."
    },
    {
      question: "How can I contact a host?",
      answer: "For privacy and security, direct contact information is not shared before a booking is confirmed. After your booking is confirmed, you will receive the host's contact details."
    },
    {
      question: "How does the admin approval process work for new listings?",
      answer: "When a host submits a new property listing, it enters a 'pending' state. Our super-admin team will review the listing for quality and accuracy. The listing will then be 'approved' and made public, or 'rejected' with feedback provided to the host."
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="relative h-80 flex items-center justify-center text-white text-center px-4">
          <Image
              src="https://placehold.co/1600x600.png"
              alt="Person on a laptop looking for help"
              fill
              className="object-cover"
              data-ai-hint="support contact"
              priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10">
              <h1 className="text-5xl font-bold font-headline">Help Center</h1>
              <p className="mt-4 text-lg max-w-2xl mx-auto">
                  Have questions? We're here to help. Find answers to common questions below.
              </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
