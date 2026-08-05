import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Product } from "./product.model";
import { ToastService } from "./toast.service";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItemsSubject = new BehaviorSubject<Product[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private toastService: ToastService) {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItemsSubject.next(JSON.parse(savedCart));
    }
  }

  // Get cart items
  getCartItems(): Product[] {
    return this.cartItemsSubject.getValue();
  }

  // MAIN ADD FUNCTION (used everywhere)
  addToCart(product: Product, quantity: number = 1): void {
    const items = this.getCartItems();
    const existing = items.find(p => p.id === product.id);

    if (existing) {
      existing.qty = (existing.qty || 1) + quantity;
    } else {
      items.push({ ...product, qty: quantity });
    }

    this.updateCart(items);
    this.toastService.showCartAdd(product.name, product.images?.[0]);
  }

  removeFromCart(product: Product): void {
    const items = this.getCartItems().filter(p => p.id !== product.id);
    this.updateCart(items);
  }

  increaseQuantity(product: Product): void {
    const items = this.getCartItems();
    const existing = items.find(p => p.id === product.id);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
      this.updateCart(items);
    }
  }

  decreaseQuantity(product: Product): void {
    const items = this.getCartItems();
    const existing = items.find(p => p.id === product.id);
    if (existing && existing.qty! > 1) {
      existing.qty -= 1;
      this.updateCart(items);
    }
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
    localStorage.setItem('cart', JSON.stringify(items));
  }
}
