import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/cart.service';
import { Product } from '../../core/product.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
  cartItems: Product[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
  }

  getSubtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.currentPrice || 0) * (item.qty || 1), 0);
  }

  getShipping(): number {
    return 5000; // fixed shipping cost
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShipping();
  }
}
