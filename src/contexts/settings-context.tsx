
'use client';

import React, { createContext, useState, ReactNode, useMemo, useEffect } from 'react';
import type { Currency, Language } from '@/types';
import { useAuth } from '@/hooks/use-auth';

export const currencySymbols: Record<Currency, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
};

export const languageNames: Record<Language, string> = {
  'en-IN': 'English (IN)',
  'es': 'Español',
  'fr': 'Français',
};


interface AuthModalState {
  isOpen: boolean;
  view: 'login' | 'signup';
}

interface SettingsContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  currencySymbol: string;
  languageName: string;
  authModalState: AuthModalState;
  setAuthModalState: (state: AuthModalState) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { user, updateUser } = useAuth();
  
  const [language, setLanguage] = useState<Language>('en-IN');
  const [currency, setCurrency] = useState<Currency>('INR');
  const [authModalState, setAuthModalState] = useState<AuthModalState>({ isOpen: false, view: 'login' });
  
  useEffect(() => {
    if (user) {
      if (user.language && languageNames[user.language]) {
        setLanguage(user.language);
      }
      if (user.currency && currencySymbols[user.currency]) {
        setCurrency(user.currency);
      }
    } else {
      const storedLanguage = localStorage.getItem('appLanguage') as Language;
      const storedCurrency = localStorage.getItem('appCurrency') as Currency;
      if (storedLanguage && languageNames[storedLanguage]) {
        setLanguage(storedLanguage);
      }
      if (storedCurrency && currencySymbols[storedCurrency]) {
        setCurrency(storedCurrency);
      }
    }
  }, [user]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    if (user && updateUser) {
      updateUser(user.id, { language: lang });
    } else {
      localStorage.setItem('appLanguage', lang);
    }
  };
  
  const handleSetCurrency = (curr: Currency) => {
    setCurrency(curr);
    if (user && updateUser) {
      updateUser(user.id, { currency: curr });
    } else {
      localStorage.setItem('appCurrency', curr);
    }
  };

  const currencySymbol = useMemo(() => currencySymbols[currency], [currency]);
  const languageName = useMemo(() => languageNames[language], [language]);

  const value = {
    language,
    setLanguage: handleSetLanguage,
    currency,
    setCurrency: handleSetCurrency,
    currencySymbol,
    languageName,
    authModalState,
    setAuthModalState,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
