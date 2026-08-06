import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../core/product.service';
import { CartService } from '../../core/cart.service';
import { WishlistService } from '../../core/wishlist.service';
import { CurrencyService, Currency } from '../../core/currency.service';
import { ThemeService } from '../../core/theme.service';
import { AuthService } from '../../core/auth.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Product } from '../../core/product.model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  searchQuery: string = '';
  searchCategory: string = '';
  suggestions: Product[] = [];
  searchControl: FormControl = new FormControl('');
  showSuggestions: boolean = false;

  cartCount: number = 0;
  cartTotal: number = 0;
  wishlistCount: number = 0;

  activeCurrency!: Currency;
  currencies: Currency[] = [];

  constructor(
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    public currencyService: CurrencyService,
    public themeService: ThemeService,
    public authService: AuthService,
    private eRef: ElementRef
  ) { }

  ngOnInit(): void {
    // Live search listener with debounce
    this.searchControl.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(value => this.getSuggestions(value || ''))
    ).subscribe(results => {
      this.suggestions = results;
      const val = (this.searchControl.value || '').trim();
      this.showSuggestions = val.length > 0;
    });

    // Live cart updates
    this.cartService.cartItems$.subscribe(items => {
      this.cartCount = items.reduce((sum, item) => sum + (item.qty || 1), 0);
      this.cartTotal = items.reduce((sum, item) => sum + (item.currentPrice * (item.qty || 1)), 0);
    });

    // Live wishlist updates
    this.wishlistService.wishlist$.subscribe(items => {
      this.wishlistCount = items.length;
    });

    // Live FX Currency updates
    this.currencies = this.currencyService.currencies;
    this.currencyService.activeCurrency$.subscribe(curr => {
      this.activeCurrency = curr;
    });

    // Close dropdowns on routing changes
    this.router.events.subscribe(() => {
      this.closeAllDropdowns();
    });
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/']);
  }

  selectCurrency(code: string): void {
    this.currencyService.setCurrency(code);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  // Hide suggestions and close active dropdowns when clicking outside/selecting
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // 1. Suggestions list click-out
    if (!this.eRef.nativeElement.contains(target)) {
      this.showSuggestions = false;
    }

    // 2. Dropdown behavior:
    // If a selection has been made (clicked an item inside .dropdown-menu or click a routerLink / dropdown-item)
    // OR if clicked completely outside any active dropdown container.
    const clickedInsideDropdownToggle = target.closest('[data-bs-toggle="dropdown"]');
    const clickedInsideDropdownMenu = target.closest('.dropdown-menu');

    if (clickedInsideDropdownMenu) {
      // Clicked on a dropdown selection item! Close the dropdown.
      // Delay slightly to allow the click or navigation to register before hiding
      setTimeout(() => {
        this.closeAllDropdowns();
      }, 150);
    } else if (!clickedInsideDropdownToggle) {
      // Clicked outside both the toggle button and the dropdown menu. Close everything!
      this.closeAllDropdowns();
    }
  }

  closeAllDropdowns(): void {
    // 1. Close via Bootstrap's instance API if available
    const dropdownEls = document.querySelectorAll('[data-bs-toggle="dropdown"]');
    dropdownEls.forEach(el => {
      try {
        // @ts-ignore
        const instance = (window as any).bootstrap?.Dropdown?.getInstance(el);
        if (instance) {
          instance.hide();
        }
      } catch (e) {}
    });

    // 2. Fallback: Force clear all classes and attributes for 100% guarantee
    const showEls = document.querySelectorAll('.dropdown-menu.show, .dropdown-toggle.show, [data-bs-toggle="dropdown"].show, .dropdown.show');
    showEls.forEach(el => {
      el.classList.remove('show');
    });
    
    const expandedEls = document.querySelectorAll('[aria-expanded="true"]');
    expandedEls.forEach(el => {
      el.setAttribute('aria-expanded', 'false');
    });

    // Also close the collapsed collections sidebar "allCat" if opened
    const allCat = document.getElementById('allCat');
    if (allCat && allCat.classList.contains('show')) {
      allCat.classList.remove('show');
    }
  }

  // Manual search execution (search button or Enter)
  performSearch(): void {
    const query = (this.searchQuery || this.searchControl.value || '').trim().toLowerCase();
    this.showSuggestions = false;

    this.router.navigate(['/shop'], {
      queryParams: {
        q: query ? query : null,
        cat: this.searchCategory ? this.searchCategory : null
      }
    });
  }

  // Auto-suggestions generator
  getSuggestions(query: string): Observable<Product[]> {
    const q = query.trim().toLowerCase();
    if (!q) return of([]);

    const allProducts = this.productService.getProducts();
    const filtered = allProducts.filter(product => {
      const matchName = product.name.toLowerCase().includes(q);
      const matchCategoryName = product.category.toLowerCase().includes(q);
      const matchSubCategory = product.subCategory.toLowerCase().includes(q);
      const matchColor = product.color?.some(c => c.toLowerCase().includes(q));

      const matchesQuery = matchName || matchCategoryName || matchSubCategory || matchColor;

      const matchesSelectedCategory =
        !this.searchCategory ||
        product.category.toLowerCase() === this.searchCategory.toLowerCase();

      return matchesQuery && matchesSelectedCategory;
    });

    return of(filtered.slice(0, 6)); // Top 6 suggestions
  }

  // Click on a suggestion item
  selectSuggestion(product: Product): void {
    this.showSuggestions = false;
    this.router.navigate(['/product', product.id]);
  }

  // Clear search field
  clearSearch(): void {
    this.searchQuery = '';
    this.searchControl.setValue('');
    this.suggestions = [];
    this.showSuggestions = false;
  }
}


