
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { newsArticles } from '@/lib/dummy-data';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const featuredArticle = newsArticles[0];
const otherArticles = newsArticles.slice(1);

export default function NewsroomPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">
              StayFinder Newsroom: Stories and updates
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Subscribe to learn about new product features, the latest in travel technology, and updates from our team.
            </p>
            <div className="mt-8 max-w-sm mx-auto flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-11 text-base"
              />
              <Button type="submit" size="lg">Subscribe</Button>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold font-headline mb-8">Recent blog posts</h2>
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Featured Article */}
              <Link href={featuredArticle.href} className="group">
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-6">
                  <Image
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint={featuredArticle.hint}
                  />
                </div>
                <p className="text-sm font-semibold text-primary mb-2">{`${featuredArticle.author} • ${featuredArticle.date}`}</p>
                <h3 className="text-2xl font-bold font-headline flex justify-between items-start">
                  {featuredArticle.title}
                  <ArrowRight className="h-7 w-7 transition-transform group-hover:translate-x-1 flex-shrink-0" />
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {featuredArticle.description}
                </p>
                <div className="mt-6 flex gap-2">
                  {featuredArticle.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="font-medium">{tag}</Badge>
                  ))}
                </div>
              </Link>
              
              {/* Other Articles */}
              <div className="space-y-10">
                {otherArticles.map((article) => (
                  <Link href={article.href} key={article.id} className="group flex flex-col sm:flex-row gap-6 items-start">
                    <div className="relative aspect-video sm:aspect-square w-full sm:w-40 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint={article.hint}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary mb-2">{`${article.author} • ${article.date}`}</p>
                      <h3 className="text-lg font-bold font-headline">
                        {article.title}
                      </h3>
                      <p className="mt-2 text-muted-foreground text-sm leading-relaxed line-clamp-2">
                        {article.description}
                      </p>
                       <div className="mt-4 flex gap-2">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs font-medium">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
