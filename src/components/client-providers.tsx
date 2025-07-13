'use client';

import { AuthProvider } from '@/contexts/auth-context';
import { PropertyProvider } from '@/contexts/property-context';
import { SettingsProvider } from '@/contexts/settings-context';
import { AuthDialog } from '@/components/auth/auth-dialog';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SettingsProvider>
        <PropertyProvider>
          {children}
          <AuthDialog />
        </PropertyProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
