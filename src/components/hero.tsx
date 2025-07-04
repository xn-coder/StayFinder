'use client';

import { SearchBar } from './search-bar';
import Image from 'next/image';

export function Hero() {

  return (
    <section className="relative h-[500px] flex items-center justify-center text-white">
       <Image
          src="https://placehold.co/1600x800.png"
          alt="Scenic view of a modern house"
          fill
          className="object-cover z-0"
          data-ai-hint="vacation rental"
          priority
        />
        <div className="absolute inset-0 bg-black/40 z-10" />
      <div className="relative z-20 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold font-headline drop-shadow-lg mb-4">
          Find Your Next Perfect Stay
        </h1>
        <p className="text-lg md:text-xl mb-8 drop-shadow-md">
          Discover amazing places to stay, from cozy cabins to luxury villas.
        </p>
        
        <SearchBar className="mt-8" />

      </div>
    </section>
  );
}
