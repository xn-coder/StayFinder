'use client';

import { useContext } from 'react';
import { SettingsContext } from '@/contexts/settings-context';

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
