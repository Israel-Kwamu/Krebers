import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.model';
import { ToastService } from './toast.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistSubject = new BehaviorSubject<Product[]>([]);
  public wishlist$ = this.wishlistSubject.asObservable();

  constructor(
    private toastService: ToastService,
    private authService: AuthService
  ) {
    this.loadWishlist();

    // Reload wishlist on auth change
    this.authService.currentUser$.subscribe(() => {
      this.loadWishlist();
    });
  }

  private getStorageKey(): string {
    const user = this.authService.user;
    return user ? `krebers_wishlist_${user.uid}` : 'krebers_wishlist_guest';
  }

  private loadWishlist(): void {
    if (typeof window !== 'undefined') {
      try {
        const key = this.getStorageKey();
        const stored = localStorage.getItem(key) || localStorage.getItem('krebers_wishlist');
        if (stored) {
          const items: Product[] = JSON.parse(stored);
          this.wishlistSubject.next(items);
        } else {
          this.wishlistSubject.next([]);
        }
      } catch (e) {
        console.error('Error loading wishlist from storage', e);
      }
    }
  }

  private saveWishlist(items: Product[]): void {
    this.wishlistSubject.next(items);
    if (typeof window !== 'undefined') {
      try {
        const key = this.getStorageKey();
        localStorage.setItem(key, JSON.stringify(items));
        localStorage.setItem('krebers_wishlist', JSON.stringify(items));
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
