import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly STORAGE_KEY = 'krebers_wishlist';
  private wishlistSubject = new BehaviorSubject<Product[]>([]);
  public wishlist$ = this.wishlistSubject.asObservable();

  constructor(private toastService: ToastService) {
    this.loadWishlist();
  }

  private loadWishlist(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const items: Product[] = JSON.parse(stored);
          this.wishlistSubject.next(items);
        }
      } catch (e) {
        console.error('Error loading wishlist from storage', e);
      }
    }
  }

  private saveWishlist(items: Product[]): void {
    this.wishlistSubject.next(items);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error('Error saving wishlist to storage', e);
      }
    }
  }

  getWishlistItems(): Product[] {
    return this.wishlistSubject.value;
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistSubject.value.some(item => item.id === productId);
  }

  toggleWishlist(product: Product): boolean {
    const current = [...this.wishlistSubject.value];
    const index = current.findIndex(item => item.id === product.id);
    let added = false;

    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(product);
      added = true;
    }

    this.saveWishlist(current);
    this.toastService.showWishlistToggle(product.name, added, product.images?.[0]);
    return added;
  }

  removeFromWishlist(productId: number): void {
    const current = this.wishlistSubject.value.filter(item => item.id !== productId);
    this.saveWishlist(current);
  }

  clearWishlist(): void {
    this.saveWishlist([]);
  }
}
