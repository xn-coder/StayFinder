
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Globe, Euro, DollarSign, IndianRupee, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageCurrencyDialog } from '../language-currency-dialog';
import { useSettings } from '@/hooks/use-settings';
import type { Currency } from '@/types';

const footerLinks = {
  Support: [
    { title: 'Help Centre', href: '/help' },
    { title: 'Get help with a safety issue', href: '/support/safety' },
    { title: 'Cancellation options', href: '/cancellation-policy' },
    { title: 'Report neighborhood concern', href: '#' },
  ],
  Hosting: [
    { title: 'List your property', href: '/list-property' },
    { title: 'Hosting resources', href: '/hosting/resources' },
    { title: 'Community forum', href: '#' },
    { title: 'Hosting responsibly', href: '#' },
  ],
  StayFinder: [
    { title: 'Newsroom', href: '/newsroom' },
    { title: 'Careers', href: '#' },
    { title: 'Contact Us', href: '/contact-us' },
    { title: 'Privacy Policy', href: '/privacy-policy' },
  ],
};

const CurrencyIcon = ({ currency }: { currency: Currency }) => {
    switch (currency) {
        case 'USD': return <DollarSign className="mr-1 h-4 w-4" />;
        case 'EUR': return <Euro className="mr-1 h-4 w-4" />;
        case 'INR': return <IndianRupee className="mr-1 h-4 w-4" />;
        default: return <IndianRupee className="mr-1 h-4 w-4" />;
    }
}

export function Footer() {
  const [isLangCurrencyOpen, setIsLangCurrencyOpen] = useState(false);
  const { languageName, currency } = useSettings();

  return (
    <>
      <footer className="bg-background border-t">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-base">
          <div className="md:col-span-1">
             <Link href="/" className="flex items-center gap-2 mb-4">
                <Home className="h-8 w-8 text-primary" />
                <span className="font-bold font-headline text-2xl text-primary">StayFinder</span>
            </Link>
            <p className="text-muted-foreground text-sm">
                Your next adventure is just a stay away.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Support</h3>
            <ul className="space-y-3 text-muted-foreground">
              {footerLinks.Support.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="hover:text-primary hover:underline underline-offset-2 cursor-pointer transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Hosting</h3>
            <ul className="space-y-3 text-muted-foreground">
              {footerLinks.Hosting.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="hover:text-primary hover:underline underline-offset-2 cursor-pointer transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-foreground">StayFinder</h3>
            <ul className="space-y-3 text-muted-foreground">
              {footerLinks.StayFinder.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="hover:text-primary hover:underline underline-offset-2 cursor-pointer transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 border-t">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm py-6">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground mb-4 md:mb-0">
                    <span>© {new Date().getFullYear()} StayFinder, Inc.</span>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="text-muted-foreground p-0 h-auto font-semibold hover:text-primary" onClick={() => setIsLangCurrencyOpen(true)}>
                        <Globe className="mr-2 h-4 w-4" />
                        {languageName}
                    </Button>
                    <Button variant="ghost" className="text-muted-foreground p-0 h-auto font-semibold hover:text-primary" onClick={() => setIsLangCurrencyOpen(true)}>
                        <CurrencyIcon currency={currency} />
                        {currency}
                    </Button>
                </div>
            </div>
        </div>
      </footer>
      <LanguageCurrencyDialog isOpen={isLangCurrencyOpen} onOpenChange={setIsLangCurrencyOpen} />
    </>
  );
}
