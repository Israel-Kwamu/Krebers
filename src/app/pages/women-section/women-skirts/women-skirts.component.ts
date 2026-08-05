import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/core/product.service';
import { CartService } from 'src/app/core/cart.service';
import { WishlistService } from 'src/app/core/wishlist.service';
import { Product } from 'src/app/core/product.model';

@Component({
  selector: 'app-women-skirts',
  templateUrl: './women-skirts.component.html',
  styleUrls: ['./women-skirts.component.css']
})
export class WomenSkirtsComponent implements OnInit {

  womenSkirts: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) { }

  ngOnInit(): void {
    this.womenSkirts = this.productService.getProducts().filter(product =>
      product.category === 'Women' && product.subCategory?.toLowerCase() === 'skirts'
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
