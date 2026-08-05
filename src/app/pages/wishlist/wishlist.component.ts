import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../core/wishlist.service';
import { CartService } from '../../core/cart.service';
import { Product } from '../../core/product.model';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistItems: Product[] = [];

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.wishlistService.wishlist$.subscribe(items => {
      this.wishlistItems = items;
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
  }

  removeFromWishlist(productId: number): void {
    this.wishlistService.removeFromWishlist(productId);
  }

  clearWishlist(): void {
    this.wishlistService.clearWishlist();
  }
}
