import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Currency {
  code: string;       // e.g. 'NGN', 'USD', 'EUR', 'GBP', 'CAD'
  name: string;       // e.g. 'Nigerian Naira'
  symbol: string;     // e.g. '₦', '$', '€', '£', 'CA$'
  rateToNgn: number;  // 1 unit of currency in NGN (e.g., 1 USD = 1500 NGN)
  flag: string;       // e.g. '🇳🇬', '🇺🇸', '🇪🇺', '🇬🇧', '🇨🇦'
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private readonly STORAGE_KEY = 'krebers_active_currency';

  // Base currency prices in product data are always in NGN
  public readonly currencies: Currency[] = [
    { code: 'NGN', name: 'Naira', symbol: '₦', rateToNgn: 1, flag: '🇳🇬' },
    { code: 'USD', name: 'Dollar', symbol: '$', rateToNgn: 1500, flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', rateToNgn: 1620, flag: '🇪🇺' },
    { code: 'GBP', name: 'Pound', symbol: '£', rateToNgn: 1900, flag: '🇬🇧' },
    { code: 'CAD', name: 'Dollar', symbol: 'CA$', rateToNgn: 1100, flag: '🇨🇦' }
  ];

  private activeCurrencySubject = new BehaviorSubject<Currency>(this.currencies[0]);
  public activeCurrency$: Observable<Currency> = this.activeCurrencySubject.asObservable();

  public lastUpdatedLiveRate: Date | null = null;
  public isLive: boolean = false;

  constructor() {
    this.loadSavedCurrency();
    this.fetchLiveExchangeRates();
  }

  private loadSavedCurrency(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const savedCode = localStorage.getItem(this.STORAGE_KEY);
        if (savedCode) {
          const found = this.currencies.find(c => c.code === savedCode);
          if (found) {
            this.activeCurrencySubject.next(found);
          }
        }
      } catch (e) {
        console.error('Failed to load saved currency preference', e);
      }
    }
  }

  /**
   * Fetches real-time, live exchange rates from open exchange rate endpoints.
   * Updates currency rates dynamically and notifies subscribers.
   */
  public async fetchLiveExchangeRates(): Promise<void> {
    try {
      // Endpoint 1: Open ER API (Base USD)
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();

      if (data && data.rates && data.rates.NGN) {
        const usdInNgn = data.rates.NGN; // NGN per 1 USD
        
        this.currencies.forEach(c => {
          if (c.code === 'USD') {
            c.rateToNgn = usdInNgn;
          } else if (c.code !== 'NGN' && data.rates[c.code]) {
            // 1 unit of currency in NGN = usdInNgn / rates[code]
            c.rateToNgn = usdInNgn / data.rates[c.code];
          }
        });

        this.lastUpdatedLiveRate = new Date();
        this.isLive = true;

        // Re-notify subscribers with updated active currency object
        const activeCode = this.activeCurrencySubject.value.code;
        const currentActive = this.currencies.find(c => c.code === activeCode) || this.currencies[0];
        this.activeCurrencySubject.next(currentActive);
      }
    } catch (error) {
      console.warn('Primary exchange rate API failed, trying fallback endpoint...', error);
      this.fetchFallbackExchangeRates();
    }
  }

  private async fetchFallbackExchangeRates(): Promise<void> {
    try {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (!res.ok) return;
      const data = await res.json();

      if (data && data.rates && data.rates.NGN) {
        const usdInNgn = data.rates.NGN;
        this.currencies.forEach(c => {
          if (c.code === 'USD') {
            c.rateToNgn = usdInNgn;
          } else if (c.code !== 'NGN' && data.rates[c.code]) {
            c.rateToNgn = usdInNgn / data.rates[c.code];
          }
        });

        this.lastUpdatedLiveRate = new Date();
        this.isLive = true;

        const activeCode = this.activeCurrencySubject.value.code;
        const currentActive = this.currencies.find(c => c.code === activeCode) || this.currencies[0];
        this.activeCurrencySubject.next(currentActive);
      }
    } catch (e) {
      console.error('All live exchange rate endpoints failed, using built-in baseline rates', e);
    }
  }

  setCurrency(code: string): void {
    const target = this.currencies.find(c => c.code === code);
    if (target) {
      this.activeCurrencySubject.next(target);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.STORAGE_KEY, code);
      }
    }
  }

  getActiveCurrency(): Currency {
    return this.activeCurrencySubject.value;
  }

  // Convert NGN amount to target currency amount
  convert(amountInNgn: number, currencyCode?: string): { amount: number; formatted: string; symbol: string } {
    const curr = currencyCode 
      ? (this.currencies.find(c => c.code === currencyCode) || this.activeCurrencySubject.value)
      : this.activeCurrencySubject.value;

    if (!amountInNgn || isNaN(amountInNgn)) {
      return { amount: 0, formatted: `${curr.symbol}0`, symbol: curr.symbol };
    }

    const convertedAmount = amountInNgn / curr.rateToNgn;
    const decimals = curr.code === 'NGN' ? 0 : 2;

    const formattedNum = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(convertedAmount);

    return {
      amount: convertedAmount,
      formatted: `${curr.symbol}${formattedNum}`,
      symbol: curr.symbol
    };
  }
}

