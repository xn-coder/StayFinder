
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Globe, Euro, DollarSign, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const topDestinations = [
    "Australia", "United States", "Indonesia", "Thailand", "United Kingdom", "Spain",
    "Malaysia", "Italy", "Portugal", "France", "New Zealand", "Mexico",
];

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
      <footer className="bg-gradient-to-br from-gradient-from via-gradient-via to-gradient-to text-white">
        <div className="max-w-7xl mx-auto px-6 pt-10 pb-8 border-b border-teal-300/30">
            <h3 className="text-2xl font-bold mb-6 text-[#aef0f4]">
                Inspiration for future getaways
            </h3>
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-4 text-sm">
                {topDestinations.map((destination) => (
                    <div key={destination}>
                        <div className="hover:text-[#d0f4f7] cursor-pointer transition duration-200 font-semibold">
                            {destination}
                        </div>
                        <div className="text-[#c8edf0cc] hover:text-white cursor-pointer text-xs">
                            Hotels & Resorts
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h3 className="font-semibold mb-4 uppercase text-xs tracking-wide text-[#aef0f4]">Support</h3>
            <ul className="space-y-3 text-[#c8edf0cc]">
              {footerLinks.Support.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="hover:text-white hover:underline underline-offset-2 cursor-pointer transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 uppercase text-xs tracking-wide text-[#aef0f4]">Hosting</h3>
            <ul className="space-y-3 text-[#c8edf0cc]">
              {footerLinks.Hosting.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="hover:text-white hover:underline underline-offset-2 cursor-pointer transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 uppercase text-xs tracking-wide text-[#aef0f4]">StayFinder</h3>
            <ul className="space-y-3 text-[#c8edf0cc]">
              {footerLinks.StayFinder.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="hover:text-white hover:underline underline-offset-2 cursor-pointer transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 border-t border-teal-300/30">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm py-6">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-[#c8edf0cc] mb-4 md:mb-0">
                    <span>© {new Date().getFullYear()} StayFinder, Inc.</span>
                    <Link href="#" className="hover:text-white">Privacy</Link>
                    <Link href="#" className="hover:text-white">Terms</Link>
                    <Link href="#" className="hover:text-white">Sitemap</Link>
                    <Link href="#" className="hover:text-white">Company details</Link>
                </div>
                <div className="flex items-center gap-4 text-[#d0f4f7]">
                    <Button variant="link" className="text-current p-0 h-auto font-semibold" onClick={() => setIsLangCurrencyOpen(true)}>
                        <Globe className="mr-2 h-4 w-4" />
                        {languageName}
                    </Button>
                    <Button variant="link" className="text-current p-0 h-auto font-semibold" onClick={() => setIsLangCurrencyOpen(true)}>
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
