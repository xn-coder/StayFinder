
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Globe, Home, Facebook, Instagram, Youtube, CreditCard, Star, Apple } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageCurrencyDialog } from '../language-currency-dialog';
import { useSettings } from '@/hooks/use-settings';
import type { Currency } from '@/types';
import Image from 'next/image';

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
  EasyStays: [
    { title: 'Newsroom', href: '/newsroom' },
    { title: 'Careers', href: '#' },
    { title: 'Contact Us', href: '/contact-us' },
    { title: 'Privacy Policy', href: '/privacy-policy' },
  ],
};

const currencyToText: Record<Currency, string> = {
    INR: 'INR',
    USD: 'USD',
    EUR: 'EUR'
}

export function Footer() {
  const [isLangCurrencyOpen, setIsLangCurrencyOpen] = useState(false);
  const { languageName, currency } = useSettings();

  return (
    <>
      <footer className="bg-gradient-to-br from-[#031f2d] via-[#0c4d52] to-[#155e63] text-white text-sm font-medium relative overflow-hidden">
        
        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-6 py-12 z-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Brand */}
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                  <Home className="h-8 w-8 text-white" />
                  <span className="font-bold font-headline text-2xl text-white">EasyStays</span>
              </Link>
              <p className="text-[#c8edf0cc] text-sm">
                  Your next adventure is just a stay away.
              </p>
            </div>

            {/* Column 2: Support Links */}
            <div>
              <h4 className="font-semibold mb-3 text-[#aef0f4] uppercase text-xs tracking-wide">
                Support
              </h4>
              <ul className="space-y-2 text-[#c8edf0cc]">
                {footerLinks.Support.map((link) => (
                  <li key={link.title}>
                    <Link href={link.href} className="hover:text-white hover:underline underline-offset-2 cursor-pointer">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Hosting Links */}
            <div>
              <h4 className="font-semibold mb-3 text-[#aef0f4] uppercase text-xs tracking-wide">
                Hosting
              </h4>
              <ul className="space-y-2 text-[#c8edf0cc]">
                {footerLinks.Hosting.map((link) => (
                  <li key={link.title}>
                    <Link href={link.href} className="hover:text-white hover:underline underline-offset-2 cursor-pointer">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: EasyStays Links */}
            <div>
              <h4 className="font-semibold mb-3 text-[#aef0f4] uppercase text-xs tracking-wide">
                EasyStays
              </h4>
              <ul className="space-y-2 text-[#c8edf0cc]">
                {footerLinks.EasyStays.map((link) => (
                  <li key={link.title}>
                    <Link href={link.href} className="hover:text-white hover:underline underline-offset-2 cursor-pointer">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto px-6 py-6 border-t border-teal-300/30 flex flex-wrap justify-between items-center text-xs text-[#c8edf0cc] z-10 relative">
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} EasyStays, Inc.</span>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
             <Button variant="ghost" className="text-[#c8edf0cc] p-0 h-auto font-semibold hover:text-white" onClick={() => setIsLangCurrencyOpen(true)}>
                <Globe className="mr-2 h-4 w-4" />
                {languageName}
            </Button>
            <Button variant="ghost" className="text-[#c8edf0cc] p-0 h-auto font-semibold hover:text-white" onClick={() => setIsLangCurrencyOpen(true)}>
                <span className="font-bold mr-1">{currencyToText[currency]}</span>
            </Button>
            <div className="flex gap-3 text-lg">
              <Facebook className="hover:text-blue-200 cursor-pointer" />
              <Instagram className="hover:text-pink-300 cursor-pointer" />
              <Youtube className="hover:text-red-300 cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
      <LanguageCurrencyDialog isOpen={isLangCurrencyOpen} onOpenChange={setIsLangCurrencyOpen} />
    </>
  );
}
