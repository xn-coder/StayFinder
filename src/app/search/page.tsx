import { Header } from "@/components/layout/header";
import { SearchResults } from "@/components/search-results";
import { Suspense } from "react";

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <SearchResults searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}
