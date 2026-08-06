import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/product.service';
import { CartService } from '../../core/cart.service';
import { WishlistService } from '../../core/wishlist.service';
import { RecentlyViewedService } from '../../core/recently-viewed.service';
import { AuthService } from '../../core/auth.service';
import { Product, Review } from '../../core/product.model';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit {

  product?: Product;
  quantity = 1;
  recentlyViewed: Product[] = [];
  selectedSize: string = '';
  selectedColor: string = '';

  // Review form state
  newUserName: string = '';
  newUserEmail: string = '';
  newReviewComment: string = '';
  newRating: number = 5;
  hoverRating: number = 0;
  photoPreview: string | null = null;
  reviewSubmittedMsg: string = '';
  submittingReview: boolean = false;

  // Active Tab ('description' | 'reviews')
  activeTab: 'description' | 'reviews' = 'description';

  // Photo modal preview
  modalPhotoUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    public cartService: CartService,
    public wishlistService: WishlistService,
    private recentlyViewedService: RecentlyViewedService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    // Auto populate review user info if logged in
    this.authService.userProfile$.subscribe(prof => {
      if (prof) {
        if (!this.newUserName && prof.displayName) {
          this.newUserName = prof.displayName;
        }
        if (!this.newUserEmail && prof.email) {
          this.newUserEmail = prof.email;
        }
      }
    });

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        const id = Number(idParam);
        this.product = this.productService.getProductById(id);
        if (this.product) {
          // Track recently viewed
          this.recentlyViewedService.addProduct(this.product);
          // Initialize selected size and color
          if (this.product.sizes && this.product.sizes.length) {
            this.selectedSize = this.product.sizes[0];
          } else {
            this.selectedSize = this.product.size;
          }
          if (this.product.color && this.product.color.length) {
            this.selectedColor = this.product.color[0];
          }
        }
      }
    });

    // Subscribe to recently viewed items
    this.recentlyViewedService.recentlyViewed$.subscribe(items => {
      // Exclude current product from recently viewed list if present
      this.recentlyViewed = items.filter(p => p.id !== this.product?.id);
    });
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  addToCart(): void {
    if (this.product && this.quantity > 0) {
      const cartProduct: Product = {
        ...this.product,
        selectedSize: this.selectedSize,
        selectedColor: this.selectedColor
      };
      this.cartService.addToCart(cartProduct, this.quantity);
    }
  }

  toggleWishlist(): void {
    if (this.product) {
      this.wishlistService.toggleWishlist(this.product);
    }
  }

  isInWishlist(): boolean {
    return !!(this.product && this.wishlistService.isInWishlist(this.product.id));
  }

  selectImage(img: string): void {
    if (!this.product) return;
    const index = this.product.images.indexOf(img);
    if (index > -1) {
      this.product.images.unshift(this.product.images.splice(index, 1)[0]);
    }
  }

  increaseQty(): void {
    this.quantity++;
  }

  decreaseQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // --- REVIEW RATING HANDLERS ---
  setRating(rating: number): void {
    this.newRating = rating;
  }

  setHoverRating(rating: number): void {
    this.hoverRating = rating;
  }

  // --- PHOTO FEEDBACK HANDLER ---
  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Basic size check (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please choose a smaller image.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(): void {
    this.photoPreview = null;
  }

  // --- SUBMIT REVIEW ---
  submitReview(): void {
    if (!this.product) return;

    if (!this.newUserName.trim() || !this.newReviewComment.trim()) {
      alert('Please fill in your name and review comment.');
      return;
    }

    this.submittingReview = true;

    const newRev: Review = {
      user: this.newUserName.trim(),
      email: this.newUserEmail.trim(),
      comment: this.newReviewComment.trim(),
      rating: this.newRating,
      photoUrl: this.photoPreview || undefined,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      verified: true
    };

    const updatedProduct = this.productService.addReview(this.product.id, newRev);
    if (updatedProduct) {
      this.product = updatedProduct;
    }

    // Reset Form
    this.newUserName = '';
    this.newUserEmail = '';
    this.newReviewComment = '';
    this.newRating = 5;
    this.hoverRating = 0;
    this.photoPreview = null;
    this.submittingReview = false;

    this.reviewSubmittedMsg = 'Thank you! Your review and photo feedback have been published.';
    setTimeout(() => {
      this.reviewSubmittedMsg = '';
    }, 5000);
  }

  openPhotoModal(url: string): void {
    this.modalPhotoUrl = url;
  }

  closePhotoModal(): void {
    this.modalPhotoUrl = null;
  }
}
