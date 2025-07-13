import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { currencies, exchangeRateManager, getCurrencySymbol } from './exchangeRate';

interface CurrencyContextType {
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => Promise<void>;
  convertPrice: (usdPrice: number) => number;
  formatPrice: (usdPrice: number) => string;
  getCurrencySymbol: (currencyCode: string) => string;
  currencies: typeof currencies;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCY_KEY = '@app_currency';

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [selectedCurrency, setSelectedCurrencyState] = useState('USD');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeCurrency = async () => {
      try {
        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Currency initialization timeout')), 5000)
        );
        
        const initPromise = (async () => {
          // Fetch exchange rates first
          await exchangeRateManager.fetchExchangeRates();
          
          // Load saved currency
          const savedCurrency = await AsyncStorage.getItem(CURRENCY_KEY);
          if (savedCurrency && currencies.find(c => c.code === savedCurrency)) {
            setSelectedCurrencyState(savedCurrency);
          }
        })();
        
        await Promise.race([initPromise, timeoutPromise]);
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize currency:', error);
        setIsInitialized(true);
      }
    };

    initializeCurrency();

    // Listen for exchange rate updates
    const listener = () => {
      // Re-render when exchange rates change
    };
    exchangeRateManager.addListener(listener);
    
    return () => exchangeRateManager.removeListener(listener);
  }, []);

  const setSelectedCurrency = async (currency: string) => {
    try {
      setSelectedCurrencyState(currency);
      await AsyncStorage.setItem(CURRENCY_KEY, currency);
    } catch (error) {
      console.error('Failed to save currency preference:', error);
    }
  };

  const convertPrice = (usdPrice: number): number => {
    return exchangeRateManager.convertPrice(usdPrice, selectedCurrency);
  };

  const formatPrice = (usdPrice: number): string => {
    const convertedPrice = convertPrice(usdPrice);
    return exchangeRateManager.formatPrice(convertedPrice, selectedCurrency);
  };

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0FDF4' }}>
        <Text style={{ fontSize: 16, color: '#64748B' }}>
          Loading currency settings...
        </Text>
      </View>
    );
  }

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        setSelectedCurrency,
        convertPrice,
        formatPrice,
        getCurrencySymbol,
        currencies,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
} 