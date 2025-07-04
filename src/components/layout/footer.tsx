
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Globe, IndianRupee, DollarSign, Euro } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LanguageCurrencyDialog } from '../language-currency-dialog';
import { useSettings } from '@/hooks/use-settings';
import type { Currency } from '@/types';

const footerLinks = {
  Support: [
    { title: 'Help Centre', href: '/help' },
    { title: 'Get help with a safety issue', href: '/support/safety' },
    { title: 'AirCover', href: '#' },
    { title: 'Anti-discrimination', href: '#' },
    { title: 'Disability support', href: '#' },
    { title: 'Cancellation options', href: '/cancellation-policy' },
    { title: 'Report neighbourhood concern', href: '#' },
  ],
  Hosting: [
    { title: 'StayFinder your home', href: '/list-property' },
    { title: 'AirCover for Hosts', href: '#' },
    { title: 'Hosting resources', href: '/hosting/resources' },
    { title: 'Community forum', href: '#' },
    { title: 'Hosting responsibly', href: '#' },
  ],
  StayFinder: [
    { title: 'Newsroom', href: '#' },
    { title: 'New features', href: '#' },
    { title: 'Careers', href: '#' },
    { title: 'Investors', href: '#' },
    { title: 'Emergency stays', href: '#' },
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
      <footer className="bg-muted border-t">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-3">
                {footerLinks.Support.map((link) => (
                  <li key={link.title}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Hosting</h3>
              <ul className="space-y-3">
                {footerLinks.Hosting.map((link) => (
                  <li key={link.title}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">StayFinder</h3>
              <ul className="space-y-3">
                {footerLinks.StayFinder.map((link) => (
                  <li key={link.title}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <Separator className="my-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground mb-4 md:mb-0">
              <span>© {new Date().getFullYear()} StayFinder, Inc.</span>
              <Link href="#" className="hover:text-foreground">Privacy</Link>
              <Link href="#" className="hover:text-foreground">Terms</Link>
              <Link href="#" className="hover:text-foreground">Sitemap</Link>
              <Link href="#" className="hover:text-foreground">Company details</Link>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setIsLangCurrencyOpen(true)}>
                <Globe className="mr-2 h-4 w-4" />
                {languageName}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsLangCurrencyOpen(true)}>
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
