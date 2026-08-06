import { Component, AfterViewInit } from '@angular/core';
import { ProductService } from 'src/app/core/product.service';
import { Product } from 'src/app/core/product.model';
import { CartService } from 'src/app/core/cart.service';
import { WishlistService } from 'src/app/core/wishlist.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {

  sideProducts?: Product;
  allProducts: Product[] = [];
  displayedProducts: Product[] = [];
  activeFilter: 'all' | 'new' | 'featured' | 'top' = 'all';
  product: any;

  // Quick View Modal State
  quickViewProduct: Product | null = null;
  quickViewQty: number = 1;
  selectedQuickViewImg: string = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    public wishlistService: WishlistService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.sideProducts = this.allProducts.find(p => p.id === 177);
  }

  loadProducts(): void {
    this.allProducts = this.productService.getProducts();
    this.applyFilter('all');
  }

  /** ============================
   *  FILTERING (USES tags[])
   *  ============================ */
  applyFilter(filter: 'all' | 'new' | 'featured' | 'top'): void {
    this.activeFilter = filter;

    if (filter === 'all') {
      this.displayedProducts = this.allProducts.filter(
        p => p.tags && p.tags.length > 0
      );
      return;
    }

    this.displayedProducts = this.allProducts.filter(
      p => p.tags?.includes(filter)
    );
  }

  /** ============================
   *  EMPTY SECTION GUARDS
   *  ============================ */
  hasTag(tag: 'new' | 'featured' | 'top'): boolean {
    return this.allProducts.some(p => p.tags?.includes(tag));
  }

  hasCategory(category: 'Men' | 'Women' | 'Kids'): boolean {
    return this.allProducts.some(p => p.category === category);
  }

  /** ============================
   *  CART
   *  ============================ */
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  openQuickView(product: Product, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.quickViewProduct = product;
    this.quickViewQty = 1;
    this.selectedQuickViewImg = product.images?.[0] || '';
  }

  closeQuickView(): void {
    this.quickViewProduct = null;
  }

  addToCartFromQuickView(): void {
    if (this.quickViewProduct && this.quickViewQty > 0) {
      this.cartService.addToCart(this.quickViewProduct, this.quickViewQty);
      this.closeQuickView();
    }
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



  ngAfterViewInit(): void {
    if (typeof $ !== 'undefined' && $.fn && $.fn.owlCarousel && $('.header-carousel').length) {
      try {
        $('.header-carousel').owlCarousel({
          loop: true,
          margin: 0,
          nav: true,
          dots: false,
          autoplay: true,
          autoplayTimeout: 4000,
          smartSpeed: 900,
          items: 1,
          navText: [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
          ]
        });
      } catch (e) {
        console.warn('Owl Carousel error in HomeComponent:', e);
      }
    }
  }
}
