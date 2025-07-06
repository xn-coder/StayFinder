
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { helpTopics, homeHostHelpTopics, experienceHostHelpTopics, serviceHostHelpTopics, travelAdminHelpTopics } from '@/lib/dummy-data';

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

// Combine all searchable content
const allSearchableContent = [
  ...faqs.map(faq => ({ title: faq.question, content: faq.answer, href: `/help#${faq.question.replace(/\s+/g, '-')}` })),
  ...helpTopics.flatMap(category => category.links.map(link => ({ title: link.title, content: category.category, href: link.href }))),
  ...homeHostHelpTopics.flatMap(category => category.links.map(link => ({ title: link.title, content: category.category, href: link.href }))),
  ...experienceHostHelpTopics.flatMap(category => category.links.map(link => ({ title: link.title, content: category.category, href: link.href }))),
  ...serviceHostHelpTopics.flatMap(category => category.links.map(link => ({ title: link.title, content: category.category, href: link.href }))),
  ...travelAdminHelpTopics.flatMap(category => category.links.map(link => ({ title: link.title, content: category.category, href: link.href })))
];


export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResults = useMemo(() => {
    if (!searchTerm) {
      return [];
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return allSearchableContent.filter(item => 
      item.title.toLowerCase().includes(lowercasedTerm) ||
      item.content.toLowerCase().includes(lowercasedTerm)
    );
  }, [searchTerm]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="relative h-96 flex items-center justify-center text-white text-center px-4">
          <Image
              src="https://placehold.co/1600x600.png"
              alt="Person on a laptop looking for help"
              fill
              className="object-cover"
              data-ai-hint="support contact"
              priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 w-full max-w-2xl">
              <h1 className="text-5xl font-bold font-headline">Help Center</h1>
              <p className="mt-4 text-lg max-w-2xl mx-auto">
                  Have questions? We're here to help.
              </p>
              <div className="mt-8 max-w-xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search for answers..." 
                  className="h-14 pl-12 text-base bg-background/90 text-foreground backdrop-blur-sm rounded-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto">
              {searchTerm ? (
                <div>
                  <h2 className="text-3xl font-bold text-center mb-8">
                    {filteredResults.length > 0 ? `Search results for "${searchTerm}"` : 'No results found'}
                  </h2>
                  {filteredResults.length > 0 ? (
                    <div className="space-y-4">
                      {filteredResults.map((item, index) => (
                        <Link href={item.href} key={index}>
                          <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                            <p className="text-muted-foreground text-sm line-clamp-2">{item.content}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                     <p className="text-center text-muted-foreground">
                        We couldn't find any articles for your search. Try different keywords.
                     </p>
                  )}
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                  <Accordion type="single" collapsible className="w-full">
                      {faqs.map((faq, index) => (
                          <AccordionItem value={`item-${index}`} key={index} id={faq.question.replace(/\s+/g, '-')}>
                              <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                              <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                                  {faq.answer}
                              </AccordionContent>
                          </AccordionItem>
                      ))}
                  </Accordion>
                </>
              )}
               <div className="text-center mt-12">
                    <p className="text-muted-foreground">Can't find what you're looking for?</p>
                     <Link href="/help/all-topics" className="text-primary font-semibold hover:underline">
                        Browse all topics
                    </Link>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
