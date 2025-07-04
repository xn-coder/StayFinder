'use client';

import React, { createContext, useState, ReactNode, useMemo, useEffect } from 'react';
import type { Currency, Language } from '@/types';

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


interface SettingsContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  currencySymbol: string;
  languageName: string;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en-IN');
  const [currency, setCurrency] = useState<Currency>('INR');
  
  useEffect(() => {
    const storedLanguage = localStorage.getItem('appLanguage') as Language;
    const storedCurrency = localStorage.getItem('appCurrency') as Currency;
    if (storedLanguage && languageNames[storedLanguage]) {
      setLanguage(storedLanguage);
    }
    if (storedCurrency && currencySymbols[storedCurrency]) {
      setCurrency(storedCurrency);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    localStorage.setItem('appLanguage', lang);
    setLanguage(lang);
  };
  
  const handleSetCurrency = (curr: Currency) => {
    localStorage.setItem('appCurrency', curr);
    setCurrency(curr);
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
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
