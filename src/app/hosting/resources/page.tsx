
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const resourceCategories = [
  {
    title: 'Your EasyStays tools',
    articles: [
      {
        title: 'Exploring your new hosting tools',
        image: 'https://placehold.co/600x400.png',
        hint: 'hosting tools',
      },
      {
        title: 'Introducing EasyStays Services',
        image: 'https://placehold.co/600x400.png',
        hint: 'service listing',
      },
      {
        title: 'Introducing EasyStays Experiences',
        image: 'https://placehold.co/600x400.png',
        hint: 'horse riding',
      },
    ],
  },
  {
    title: 'Expanding your business',
    articles: [
      {
        title: 'Pricing your place',
        image: 'https://placehold.co/600x400.png',
        hint: 'pricing guide',
      },
      {
        title: 'Using quick replies to save time',
        image: 'https://placehold.co/600x400.png',
        hint: 'messaging guests',
      },
      {
        title: 'Updating your availability',
        image: 'https://placehold.co/600x400.png',
        hint: 'availability calendar',
      },
    ],
  },
  {
    title: 'Make hosting easier',
    articles: [
      {
        title: 'Finding the right co-host',
        image: 'https://placehold.co/600x400.png',
        hint: 'cohost profiles',
      },
      {
        title: 'Simplifying check-in & checkout',
        image: 'https://placehold.co/600x400.png',
        hint: 'check-in process',
      },
      {
        title: 'Cleaning like a pro',
        image: 'https://placehold.co/600x400.png',
        hint: 'cleaning tips',
      },
    ],
  },
   {
    title: 'Deliver 5-star hospitality',
    articles: [
      {
        title: 'Using guest reviews to improve',
        image: 'https://placehold.co/600x400.png',
        hint: 'guest reviews',
      },
      {
        title: 'Refreshing your listing',
        image: 'https://placehold.co/600x400.png',
        hint: 'listing details',
      },
      {
        title: 'How to become a Superhost',
        image: 'https://placehold.co/600x400.png',
        hint: 'superhost guide',
      },
    ],
  },
  {
    title: 'Safety and policies',
    articles: [
        {
        title: 'Avoiding cancellations',
        image: 'https://placehold.co/600x400.png',
        hint: 'cancellation policy',
      },
      {
        title: 'How EasyStays protects hosts',
        image: 'https://placehold.co/600x400.png',
        hint: 'host protection',
      },
      {
        title: 'Safety guidelines for hosts',
        image: 'https://placehold.co/600x400.png',
        hint: 'safety guidelines',
      },
    ],
  },
];

export default function HostingResourcesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="bg-muted/40 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold font-headline">Resource Centre</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Hi there, what do you want to learn?
              </p>
              <div className="mt-6 max-w-lg mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search articles and more" className="h-12 pl-12 text-base bg-background" />
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto space-y-16">
            {resourceCategories.map((category) => (
              <section key={category.title}>
                <h2 className="text-2xl md:text-3xl font-bold font-headline mb-8">{category.title}</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {category.articles.map((article) => (
                    <Link href="#" key={article.title} className="group block">
                      <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                        <div className="relative h-48 w-full">
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={article.hint}
                          />
                        </div>
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold leading-snug">{article.title}</CardTitle>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
