import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/cart.service';
import { Product } from '../../core/product.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartItems$: Observable<Product[]>; // reactive cart items
  shipping = 5000;

  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.cartItems$;
  }

  ngOnInit(): void {}

  increaseQuantity(item: Product): void {
    this.cartService.increaseQuantity(item);
  }

  decreaseQuantity(item: Product): void {
    this.cartService.decreaseQuantity(item);
  }

  removeItem(item: Product): void {
    this.cartService.removeFromCart(item);
  }

  getTotal(items: Product[]): number {
    return items.reduce((sum, item) => sum + (item.currentPrice * (item.qty || 1)), 0);
  }
}
