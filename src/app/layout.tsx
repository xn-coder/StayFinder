import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth-context';
import { PropertyProvider } from '@/contexts/property-context';
import { SettingsProvider } from '@/contexts/settings-context';

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
        <SettingsProvider>
          <AuthProvider>
            <PropertyProvider>
              {children}
              <Toaster />
            </PropertyProvider>
          </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
