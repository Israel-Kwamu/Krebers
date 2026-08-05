import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/core/product.service';
import { CartService } from 'src/app/core/cart.service';
import { WishlistService } from 'src/app/core/wishlist.service';
import { Product } from 'src/app/core/product.model';

@Component({
  selector: 'app-kids-native',
  templateUrl: './kids-native.component.html',
  styleUrls: ['./kids-native.component.css']
})
export class KidsNativeComponent implements OnInit {

  kidsNative: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) { }

  ngOnInit(): void {
    this.kidsNative = this.productService.getProducts().filter(product =>
      product.category === 'Kids' &&
      product.subCategory?.toLowerCase() === 'native'
    );
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
  }

  toggleWishlist(product: Product, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.wishlistService.toggleWishlist(product);
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }

}
