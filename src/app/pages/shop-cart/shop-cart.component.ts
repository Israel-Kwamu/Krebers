import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../core/product.service';
import { CartService } from '../../core/cart.service';
import { WishlistService } from '../../core/wishlist.service';
import { Product } from '../../core/product.model';

@Component({
  selector: 'app-shop',
  templateUrl: './shop-cart.component.html',
  styleUrls: ['./shop-cart.component.css']
})
export class ShopComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];

  // Active Filter States
  searchQuery: string = '';
  selectedCategory: string = '';
  selectedSubCategory: string = '';
  
  readonly ABSOLUTE_MIN_PRICE: number = 0;
  readonly ABSOLUTE_MAX_PRICE: number = 100000;
  selectedMinPrice: number = 0;
  selectedMaxPrice: number = 100000;

  selectedSizes: string[] = [];
  selectedColors: string[] = [];
  inStockOnly: boolean = false;

  // Sorting
  selectedSort: string = 'featured'; // 'featured', 'price-low', 'price-high', 'rating', 'newest'

  // Quick View Modal State
  quickViewProduct: Product | null = null;
  quickViewQty: number = 1;
  selectedQuickViewImg: string = '';

  // Available options
  availableSubCategories: string[] = [];
  availableColors: string[] = [];
  availableSizes: string[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    public wishlistService: WishlistService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1️⃣ Fetch all base products
    this.products = this.productService.getProducts();

    // Load available filter options from service
    this.availableColors = this.productService.getAllColors();
    this.availableSizes = ['S', 'M', 'L', 'XL', 'XXL', '30', '32', '34'];
    this.updateAvailableSubCategories();

    // 2️⃣ Listen to URL Query Parameters
    this.route.queryParams.subscribe(params => {
      this.searchQuery = (params['q'] || '').trim();
      this.selectedCategory = (params['cat'] || '').trim();
      if (params['subcat']) {
        this.selectedSubCategory = params['subcat'].trim();
      }
      this.updateAvailableSubCategories();
      this.applyFilters();
    });
  }

  updateAvailableSubCategories(): void {
    this.availableSubCategories = this.productService.getSubCategories(this.selectedCategory);
  }

  // ---------------------------
  // MAIN MULTI-FILTER & SORT
  // ---------------------------
  applyFilters(): void {
    let result = [...this.products];

    // 1. Search Query Filter
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
        p.color?.some(c => c.toLowerCase().includes(q))
      );
    }

    // 2. Category Filter
    if (this.selectedCategory) {
      result = result.filter(p => p.category.toLowerCase() === this.selectedCategory.toLowerCase());
    }

    // 3. SubCategory Filter
    if (this.selectedSubCategory) {
      result = result.filter(p => p.subCategory?.toLowerCase() === this.selectedSubCategory.toLowerCase());
    }

    // 4. Price Range Filter
    const min = this.selectedMinPrice ?? 0;
    const max = this.selectedMaxPrice ?? 100000;
    result = result.filter(p => p.currentPrice >= min && p.currentPrice <= max);

    // 5. Size Filter (Matches any selected size)
    if (this.selectedSizes.length > 0) {
      result = result.filter(p => p.size && this.selectedSizes.includes(p.size));
    }

    // 6. Color Filter (Matches any selected color)
    if (this.selectedColors.length > 0) {
      result = result.filter(p =>
        p.color?.some(c => this.selectedColors.map(sc => sc.toLowerCase()).includes(c.toLowerCase()))
      );
    }

    // 7. In-Stock Availability Filter
    if (this.inStockOnly) {
      result = result.filter(p => p.qty > 0);
    }

    // 8. Smart Sorting Logic
    switch (this.selectedSort) {
      case 'price-low':
        result.sort((a, b) => a.currentPrice - b.currentPrice);
        break;
      case 'price-high':
        result.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.sort((a, b) => {
          const aIsNew = a.tags?.includes('new') ? 1 : 0;
          const bIsNew = b.tags?.includes('new') ? 1 : 0;
          if (aIsNew !== bIsNew) return bIsNew - aIsNew;
          return b.id - a.id;
        });
        break;
      case 'featured':
      default:
        result.sort((a, b) => {
          const aFeat = a.tags?.includes('featured') ? 1 : 0;
          const bFeat = b.tags?.includes('featured') ? 1 : 0;
          return bFeat - aFeat;
        });
        break;
    }

    this.filteredProducts = result;
  }

  // ---------------------------
  // FILTER EVENT HANDLERS
  // ---------------------------
  selectCategory(category: string): void {
    if (this.selectedCategory === category) {
      this.selectedCategory = ''; // toggle off
    } else {
      this.selectedCategory = category;
    }
    this.selectedSubCategory = ''; // Reset subcategory when category changes
    this.updateAvailableSubCategories();
    this.applyFilters();
  }

  selectSubCategory(subCat: string): void {
    if (this.selectedSubCategory === subCat) {
      this.selectedSubCategory = ''; // toggle off
    } else {
      this.selectedSubCategory = subCat;
    }
    this.applyFilters();
  }

  toggleSize(size: string): void {
    const idx = this.selectedSizes.indexOf(size);
    if (idx > -1) {
      this.selectedSizes.splice(idx, 1);
    } else {
      this.selectedSizes.push(size);
    }
    this.applyFilters();
  }

  toggleColor(color: string): void {
    const idx = this.selectedColors.indexOf(color);
    if (idx > -1) {
      this.selectedColors.splice(idx, 1);
    } else {
      this.selectedColors.push(color);
    }
    this.applyFilters();
  }

  toggleInStock(): void {
    this.inStockOnly = !this.inStockOnly;
    this.applyFilters();
  }

  onPriceChange(): void {
    if (this.selectedMinPrice < 0) this.selectedMinPrice = 0;
    if (this.selectedMaxPrice > this.ABSOLUTE_MAX_PRICE) this.selectedMaxPrice = this.ABSOLUTE_MAX_PRICE;
    if (this.selectedMinPrice > this.selectedMaxPrice) {
      this.selectedMinPrice = this.selectedMaxPrice;
    }
    this.applyFilters();
  }

  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedSort = target.value;
    this.applyFilters();
  }

  // ---------------------------
  // REMOVE INDIVIDUAL ACTIVE FILTERS
  // ---------------------------
  clearSearchQuery(): void {
    this.searchQuery = '';
    this.router.navigate(['/shop'], { queryParams: { q: null }, queryParamsHandling: 'merge' });
    this.applyFilters();
  }

  clearCategory(): void {
    this.selectedCategory = '';
    this.selectedSubCategory = '';
    this.updateAvailableSubCategories();
    this.applyFilters();
  }

  clearSubCategory(): void {
    this.selectedSubCategory = '';
    this.applyFilters();
  }

  clearPriceRange(): void {
    this.selectedMinPrice = 0;
    this.selectedMaxPrice = this.ABSOLUTE_MAX_PRICE;
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedSubCategory = '';
    this.selectedMinPrice = 0;
    this.selectedMaxPrice = this.ABSOLUTE_MAX_PRICE;
    this.selectedSizes = [];
    this.selectedColors = [];
    this.inStockOnly = false;
    this.selectedSort = 'featured';

    this.updateAvailableSubCategories();
    this.router.navigate(['/shop']);
    this.applyFilters();
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
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

  hasActiveFilters(): boolean {
    return !!(
      this.searchQuery ||
      this.selectedCategory ||
      this.selectedSubCategory ||
      this.selectedMinPrice > 0 ||
      this.selectedMaxPrice < this.ABSOLUTE_MAX_PRICE ||
      this.selectedSizes.length > 0 ||
      this.selectedColors.length > 0 ||
      this.inStockOnly
    );
  }

  // Color hex code helper for swatch display
  getColorHex(colorName: string): string {
    const name = colorName.toLowerCase();
    const colorMap: { [key: string]: string } = {
      black: '#1e293b',
      white: '#ffffff',
      blue: '#2563eb',
      red: '#dc2626',
      pink: '#ec4899',
      green: '#16a34a',
      navy: '#1e3a8a',
      beige: '#f5f5dc',
      brown: '#78350f',
      yellow: '#eab308'
    };
    return colorMap[name] || '#94a3b8';
  }
}

