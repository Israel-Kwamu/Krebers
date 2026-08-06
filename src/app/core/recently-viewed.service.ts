import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RecentlyViewedService {
  private readonly STORAGE_KEY = 'krebers_recently_viewed';
  private readonly MAX_ITEMS = 10;
  private recentlyViewedSubject = new BehaviorSubject<Product[]>([]);
  public recentlyViewed$: Observable<Product[]> = this.recentlyViewedSubject.asObservable();

  constructor(private authService: AuthService) {
    this.loadRecentlyViewed();

    // Reload or clear recently viewed when auth changes (e.g. on logout)
    this.authService.currentUser$.subscribe(() => {
      this.loadRecentlyViewed();
    });
  }

  private loadRecentlyViewed(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const items: Product[] = JSON.parse(stored);
          this.recentlyViewedSubject.next(items);
        } else {
          this.recentlyViewedSubject.next([]);
        }
      } catch (e) {
        console.error('Error loading recently viewed items', e);
      }
    }
  }

  private saveRecentlyViewed(items: Product[]): void {
    this.recentlyViewedSubject.next(items);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error('Error saving recently viewed items', e);
      }
    }
  }

  addProduct(product: Product): void {
    if (!product || !product.id) return;
    let current = [...this.recentlyViewedSubject.value];

    // Remove if already present so it moves to top
    current = current.filter(item => item.id !== product.id);

    // Add to beginning
    current.unshift(product);

    // Limit length
    if (current.length > this.MAX_ITEMS) {
      current = current.slice(0, this.MAX_ITEMS);
    }

    this.saveRecentlyViewed(current);
  }

  getRecentlyViewed(): Product[] {
    return this.recentlyViewedSubject.value;
  }

  clearRecentlyViewed(): void {
    this.saveRecentlyViewed([]);
  }
}
