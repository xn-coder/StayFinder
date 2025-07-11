
'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { helpTopics, homeHostHelpTopics, experienceHostHelpTopics, serviceHostHelpTopics, travelAdminHelpTopics } from '@/lib/dummy-data';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const TopicCategoryGrid = ({ topics }: { topics: { category: string; links: { title: string; href: string }[] }[] }) => (
    <div className="grid md:grid-cols-3 gap-x-8 gap-y-12 py-12">
        {topics.map((category) => (
            <div key={category.category}>
                <h2 className="text-xl font-semibold mb-4">{category.category}</h2>
                <ul className="space-y-3">
                    {category.links.map((link) => (
                        <li key={link.title}>
                            <Link href={link.href} className="text-muted-foreground hover:text-primary hover:underline">
                                {link.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        ))}
    </div>
);

const allHelpContent = [
  ...helpTopics.flatMap(category => category.links.map(link => ({ title: link.title, content: category.category, href: link.href }))),
  ...homeHostHelpTopics.flatMap(category => category.links.map(link => ({ title: link.title, content: category.category, href: link.href }))),
  ...experienceHostHelpTopics.flatMap(category => category.links.map(link => ({ title: link.title, content: category.category, href: link.href }))),
  ...serviceHostHelpTopics.flatMap(category => category.links.map(link => ({ title: link.title, content: category.category, href: link.href }))),
  ...travelAdminHelpTopics.flatMap(category => category.links.map(link => ({ title: link.title, content: category.category, href: link.href })))
];


export default function AllTopicsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResults = useMemo(() => {
    if (!searchTerm) {
      return [];
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return allHelpContent.filter(item => 
      item.title.toLowerCase().includes(lowercasedTerm) ||
      item.content.toLowerCase().includes(lowercasedTerm)
    );
  }, [searchTerm]);


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-background">
        <div className="border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Help Centre</h1>
                 <div className="relative w-full max-w-sm">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input 
                      placeholder="Search how-tos and more" 
                      className="h-12 pl-12 rounded-full text-base border border-border shadow-sm hover:shadow-md transition-shadow"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
        </div>
        
        <div className="container mx-auto px-4 pt-6 pb-12">
          <div className="max-w-5xl mx-auto">
            <div className="text-sm text-muted-foreground mb-6">
                <Link href="/" className="hover:underline">Home</Link>
                {' > '}
                <Link href="/help" className="hover:underline">Help Centre</Link>
                {' > '}
                <span>All topics</span>
            </div>

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
                          <p className="text-muted-foreground text-sm">{item.content}</p>
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
                <h2 className="text-4xl font-bold font-headline mb-2">All topics</h2>
                <p className="text-muted-foreground mb-8 text-lg">Browse our full library of help topics.</p>
                
                <Tabs defaultValue="guest">
                    <TabsList className="w-full justify-start overflow-x-auto scrollbar-hide sm:w-auto sm:justify-center">
                        <TabsTrigger value="guest">Guest</TabsTrigger>
                        <TabsTrigger value="host">Home host</TabsTrigger>
                        <TabsTrigger value="experience-host">Experience host</TabsTrigger>
                        <TabsTrigger value="service-host">Service host</TabsTrigger>
                        <TabsTrigger value="travel-admin">Travel admin</TabsTrigger>
                    </TabsList>
                    <TabsContent value="guest">
                      <TopicCategoryGrid topics={helpTopics} />
                    </TabsContent>
                    <TabsContent value="host">
                        <TopicCategoryGrid topics={homeHostHelpTopics} />
                    </TabsContent>
                    <TabsContent value="experience-host">
                        <TopicCategoryGrid topics={experienceHostHelpTopics} />
                    </TabsContent>
                    <TabsContent value="service-host">
                        <TopicCategoryGrid topics={serviceHostHelpTopics} />
                    </TabsContent>
                    <TabsContent value="travel-admin">
                        <TopicCategoryGrid topics={travelAdminHelpTopics} />
                    </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
