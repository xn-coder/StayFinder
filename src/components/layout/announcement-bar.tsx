'use client';

import { Megaphone, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function AnnouncementBar() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="relative bg-primary">
      <div className="mx-auto max-w-7xl px-3 py-3 sm:px-6 lg:px-8">
        <div className="pr-16 sm:px-16 sm:text-center">
          <p className="font-medium text-primary-foreground">
            <Megaphone className="mr-2 inline h-5 w-5" aria-hidden="true" />
            <span className="md:hidden">We have an important announcement!</span>
            <span className="hidden md:inline">Big news! We're excited to announce our new summer travel deals.</span>
            <span className="ml-2 inline-block">
              <Link href="#" className="underline font-bold">
                Learn more <span aria-hidden="true">&rarr;</span>
              </Link>
            </span>
          </p>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:items-start sm:pt-1 sm:pr-2">
          <button
            type="button"
            className="flex rounded-md p-2 hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-white"
            onClick={() => setIsOpen(false)}
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
