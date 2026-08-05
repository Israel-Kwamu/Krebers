import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/core/product.service';
import { CartService } from 'src/app/core/cart.service';
import { WishlistService } from 'src/app/core/wishlist.service';
import { Product } from 'src/app/core/product.model';

@Component({
  selector: 'app-men-pants',
  templateUrl: './men-pants.component.html',
  styleUrls: ['./men-pants.component.css']
})
export class MenPantsComponent implements OnInit {

  menPants: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) { }

  ngOnInit(): void {
    this.menPants = this.productService.getProducts().filter(product =>
      product.category === 'Men' && product.subCategory?.toLowerCase() === 'pants'
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
