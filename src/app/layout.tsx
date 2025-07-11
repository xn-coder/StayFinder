import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth-context';
import { PropertyProvider } from '@/contexts/property-context';
import { SettingsProvider } from '@/contexts/settings-context';
import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { AuthDialog } from '@/components/auth/auth-dialog';

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
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Lato:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <SettingsProvider>
            <PropertyProvider>
              <AnnouncementBar />
              {children}
              <Toaster />
              <AuthDialog />
            </PropertyProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
