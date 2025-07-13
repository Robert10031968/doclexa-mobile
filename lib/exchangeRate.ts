import { supabase } from './supabase';

export interface ExchangeRate {
  id: number;
  currency_code: string;
  rate_to_usd: number;
  created_at?: string;
  updated_at?: string;
}

export interface Currency {
  code: string;
  name: string;
  flag: string;
  symbol: string;
}

export const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', symbol: '$' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', symbol: '€' },
  { code: 'PLN', name: 'Polish Złoty', flag: '🇵🇱', symbol: 'zł' },
  { code: 'MXN', name: 'Mexican Peso', flag: '🇲🇽', symbol: 'MX$' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', symbol: 'CA$' },
];

// Centralized function to get currency symbol
export function getCurrencySymbol(currencyCode: string): string {
  const currency = currencies.find(c => c.code === currencyCode);
  return currency?.symbol || currencyCode;
}

class ExchangeRateManager {
  private rates: Map<string, number> = new Map();
  private listeners: Array<() => void> = [];

  async fetchExchangeRates(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('exchange_rates')
        .select('*')
        .order('currency_code');

      if (error) {
        throw error;
      }

      // Clear existing rates
      this.rates.clear();
      
      // Add USD as base currency (rate = 1)
      this.rates.set('USD', 1);

      // Add fetched rates
      if (data) {
        data.forEach((rate: ExchangeRate) => {
          this.rates.set(rate.currency_code, rate.rate_to_usd);
        });
      }

      this.notifyListeners();
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      // Set default rates if fetch fails
      this.rates.set('USD', 1);
      this.rates.set('EUR', 0.85);
      this.rates.set('PLN', 3.8);
      this.rates.set('MXN', 20.5);
      this.rates.set('GBP', 0.73);
      this.rates.set('CAD', 1.35);
      this.notifyListeners();
    }
  }

  getRate(currencyCode: string): number {
    return this.rates.get(currencyCode) || 1;
  }

  convertPrice(usdPrice: number, targetCurrency: string): number {
    const rate = this.getRate(targetCurrency);
    return usdPrice * rate;
  }

  formatPrice(price: number, currencyCode: string): string {
    const symbol = getCurrencySymbol(currencyCode);
    
    // Format based on currency
    switch (currencyCode) {
      case 'USD':
      case 'CAD':
        return `${symbol}${price.toFixed(2)}`;
      case 'EUR':
        return `${price.toFixed(2)}${symbol}`;
      case 'PLN':
        return `${price.toFixed(2)} ${symbol}`;
      case 'MXN':
        return `${symbol}${price.toFixed(2)}`;
      case 'GBP':
        return `${symbol}${price.toFixed(2)}`;
      default:
        return `${symbol}${price.toFixed(2)}`;
    }
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

export const exchangeRateManager = new ExchangeRateManager(); 