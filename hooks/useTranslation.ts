import { i18n } from '@/lib/i18n';
import { useEffect, useState } from 'react';

export function useTranslation() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const listener = () => forceUpdate({});
    i18n.addListener(listener);
    return () => i18n.removeListener(listener);
  }, []);

  return {
    t: (key: string) => {
      try {
        return i18n.t(key);
      } catch (error) {
        console.warn(`Translation key "${key}" not found, returning key as fallback`);
        return key;
      }
    },
    i18n: {
      language: i18n.getLanguage(),
      changeLanguage: async (langCode: string) => await i18n.changeLanguage(langCode),
    },
  };
} 