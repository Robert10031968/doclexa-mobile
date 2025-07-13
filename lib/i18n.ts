import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules, Platform } from 'react-native';

// Import translation files
import de from '../app/locales/de.json';
import en from '../app/locales/en.json';
import es from '../app/locales/es.json';
import fr from '../app/locales/fr.json';
import pl from '../app/locales/pl.json';
import pt from '../app/locales/pt.json';

const resources: Record<string, any> = {
  en: en,
  pl: pl,
  es: es,
  de: de,
  fr: fr,
  pt: pt,
};

const LANGUAGE_KEY = '@app_language';

// Get device locale
const getDeviceLocale = (): string => {
  const deviceLocale =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0]
      : NativeModules.I18nManager.localeIdentifier;

  if (deviceLocale) {
    const locale = deviceLocale.split('_')[0]; // Get language code only
    const supportedLanguages = Object.keys(resources);
    if (supportedLanguages.includes(locale)) {
      return locale;
    }
  }
  return 'en'; // Default fallback
};

class I18n {
  private currentLanguage: string = 'en'; // Start with default
  private listeners: Array<() => void> = [];
  private initialized: boolean = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Try to load saved language
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage && resources[savedLanguage]) {
        this.currentLanguage = savedLanguage;
      } else {
        // Use device locale as fallback
        this.currentLanguage = getDeviceLocale();
        // Save the device locale
        await AsyncStorage.setItem(LANGUAGE_KEY, this.currentLanguage);
      }
    } catch (error) {
      console.warn('Failed to load saved language:', error);
      this.currentLanguage = getDeviceLocale();
    }
    
    this.initialized = true;
    this.notifyListeners();
  }

  getLanguage(): string {
    return this.currentLanguage;
  }

  async changeLanguage(langCode: string): Promise<void> {
    if (resources[langCode]) {
      this.currentLanguage = langCode;
      try {
        await AsyncStorage.setItem(LANGUAGE_KEY, langCode);
      } catch (error) {
        console.warn('Failed to save language preference:', error);
      }
      this.notifyListeners();
    }
  }

  t(key: string): string {
    const lang = this.currentLanguage;
    const translations = resources[lang] || resources['en'];
    return translations[key] || key;
  }

  addListener(callback: () => void): void {
    this.listeners.push(callback);
  }

  removeListener(callback: () => void): void {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback());
  }
}

export const i18n = new I18n();
export default i18n; 