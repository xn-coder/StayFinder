import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { ClientProviders } from '@/components/client-providers';

export const metadata: Metadata = {
  title: 'StayFinder',
  description: 'Find your next stay',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ClientProviders>
          <AnnouncementBar />
          {children}
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  );
}
