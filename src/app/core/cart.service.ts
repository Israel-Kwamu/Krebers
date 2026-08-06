import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Product } from "./product.model";
import { ToastService } from "./toast.service";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItemsSubject = new BehaviorSubject<Product[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(
    private toastService: ToastService,
    private authService: AuthService
  ) {
    this.loadCart();

    // Reload cart if active user changes
    this.authService.currentUser$.subscribe((user) => {
      this.loadCart();
    });
  }

  private getStorageKey(): string {
    const user = this.authService.user;
    return user ? `krebers_cart_${user.uid}` : 'krebers_cart_guest';
  }

  private loadCart(): void {
    if (typeof window === 'undefined') return;
    try {
      const key = this.getStorageKey();
      const savedCart = localStorage.getItem(key) || localStorage.getItem('cart');
      if (savedCart) {
        this.cartItemsSubject.next(JSON.parse(savedCart));
      } else {
        this.cartItemsSubject.next([]);
      }
    } catch (e) {
      console.error('Error loading cart:', e);
    }
  }

  // Get cart items
  getCartItems(): Product[] {
    return this.cartItemsSubject.getValue();
  }

  // MAIN ADD FUNCTION (used everywhere)
  addToCart(product: Product, quantity: number = 1): void {
    const selectedSize = product.selectedSize || (product.sizes && product.sizes.length ? product.sizes[0] : product.size);
    const selectedColor = product.selectedColor || (product.color && product.color.length ? product.color[0] : undefined);

    const items = [...this.getCartItems()];
    const existing = items.find(p => 
      p.id === product.id && 
      p.selectedSize === selectedSize && 
      p.selectedColor === selectedColor
    );

    if (existing) {
      existing.qty = (existing.qty || 1) + quantity;
    } else {
      items.push({ 
        ...product, 
        selectedSize, 
        selectedColor, 
        qty: quantity 
      });
    }

    this.updateCart(items);
    
    let displayName = product.name;
    const details: string[] = [];
    if (selectedSize) details.push(`Size: ${selectedSize}`);
    if (selectedColor) details.push(`Color: ${selectedColor}`);
    if (details.length) {
      displayName += ` (${details.join(', ')})`;
    }
    this.toastService.showCartAdd(displayName, product.images?.[0]);
  }

  removeFromCart(product: Product): void {
    const items = this.getCartItems().filter(p => 
      !(p.id === product.id && 
        p.selectedSize === product.selectedSize && 
        p.selectedColor === product.selectedColor)
    );
    this.updateCart(items);
  }

  increaseQuantity(product: Product): void {
    const items = [...this.getCartItems()];
    const existing = items.find(p => 
      p.id === product.id && 
      p.selectedSize === product.selectedSize && 
      p.selectedColor === product.selectedColor
    );
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
      this.updateCart(items);
    }
  }

  decreaseQuantity(product: Product): void {
    const items = [...this.getCartItems()];
    const existing = items.find(p => 
      p.id === product.id && 
      p.selectedSize === product.selectedSize && 
      p.selectedColor === product.selectedColor
    );
    if (existing && existing.qty! > 1) {
      existing.qty -= 1;
      this.updateCart(items);
    }
  }

  clearCart(): void {
    this.updateCart([]);
  }

  getCartCount(): BehaviorSubject<number> {
    const countSubject = new BehaviorSubject<number>(0);
    this.cartItems$.subscribe(items => {
      countSubject.next(items.reduce((sum, p) => sum + (p.qty || 1), 0));
    });
    return countSubject;
  }

  getCartTotal(): BehaviorSubject<number> {
    const totalSubject = new BehaviorSubject<number>(0);
    this.cartItems$.subscribe(items => {
      const total = items.reduce((sum, p) => sum + p.currentPrice * (p.qty || 1), 0);
      totalSubject.next(total);
    });
    return totalSubject;
  }

  private updateCart(items: Product[]): void {
    this.cartItemsSubject.next(items);
    if (typeof window !== 'undefined') {
      const key = this.getStorageKey();
      localStorage.setItem(key, JSON.stringify(items));
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }
}
