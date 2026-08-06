import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserProfile, UserOrder } from '../../core/auth.service';
import { CartService } from '../../core/cart.service';
import { WishlistService } from '../../core/wishlist.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  activeTab: 'profile' | 'orders' | 'wishlist' = 'profile';

  profile: UserProfile = {
    uid: '',
    email: '',
    displayName: '',
    photoURL: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'Nigeria',
    zipCode: ''
  };

  orders: UserOrder[] = [];
  loadingOrders: boolean = false;
  isSaving: boolean = false;

  // Tracking & Receipt state
  selectedTrackOrder: UserOrder | null = null;
  selectedReceiptOrder: UserOrder | null = null;

  constructor(
    public authService: AuthService,
    public cartService: CartService,
    public wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/auth']);
      }
    });

    this.authService.userProfile$.subscribe(prof => {
      if (prof) {
        this.profile = { ...prof };
      }
    });

    this.loadOrders();
  }

  async loadOrders(): Promise<void> {
    this.loadingOrders = true;
    this.orders = await this.authService.getUserOrders();
    this.loadingOrders = false;
  }

  openOrderTracker(order: UserOrder): void {
    this.selectedTrackOrder = order;
  }

  closeOrderTracker(): void {
    this.selectedTrackOrder = null;
  }

  openReceiptModal(order: UserOrder): void {
    this.selectedReceiptOrder = order;
  }

  closeReceiptModal(): void {
    this.selectedReceiptOrder = null;
  }

  printReceipt(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }

  async saveProfile(): Promise<void> {
    this.isSaving = true;
    try {
      await this.authService.updateProfileData({
        displayName: this.profile.displayName,
        phone: this.profile.phone,
        address: this.profile.address,
        city: this.profile.city,
        state: this.profile.state,
        country: this.profile.country,
        zipCode: this.profile.zipCode
      });
    } catch (e) {
      console.error(e);
    } finally {
      this.isSaving = false;
    }
  }

  async reorderItems(order: UserOrder): Promise<void> {
    if (order.items && order.items.length > 0) {
      order.items.forEach(item => {
        this.cartService.addToCart(item);
      });
      this.router.navigate(['/cart']);
    }
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/']);
  }
}
