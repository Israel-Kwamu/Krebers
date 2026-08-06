import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../core/cart.service';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';
import { Product } from '../../core/product.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
  cartItems: Product[] = [];

  firstName: string = '';
  lastName: string = '';
  companyName: string = '';
  address: string = '';
  city: string = '';
  country: string = 'Nigeria';
  zipCode: string = '';
  phone: string = '';
  email: string = '';
  notes: string = '';
  paymentMethod: string = 'Card / Paystack Online';

  // Coupon / Promo Code State
  couponInput: string = '';
  appliedCoupon: { code: string; discountPercent: number; name: string } | null = null;

  isPlacingOrder: boolean = false;

  constructor(
    private cartService: CartService,
    public authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();

    // Auto-fill form if user is logged in
    this.authService.userProfile$.subscribe(profile => {
      if (profile) {
        if (profile.displayName) {
          const parts = profile.displayName.split(' ');
          this.firstName = parts[0] || '';
          this.lastName = parts.slice(1).join(' ') || '';
        }
        this.email = profile.email || '';
        this.phone = profile.phone || '';
        this.address = profile.address || '';
        this.city = profile.city || '';
        this.country = profile.country || 'Nigeria';
        this.zipCode = profile.zipCode || '';
      }
    });
  }

  getSubtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.currentPrice || 0) * (item.qty || 1), 0);
  }

  getShipping(): number {
    if (this.cartItems.length === 0) return 0;
    if (this.appliedCoupon?.code === 'FREESHIP') return 0;
    return 5000; // fixed standard shipping cost
  }

  getDiscountAmount(): number {
    if (!this.appliedCoupon) return 0;
    const sub = this.getSubtotal();
    return Math.round(sub * (this.appliedCoupon.discountPercent / 100));
  }

  getTotal(): number {
    const sub = this.getSubtotal();
    const ship = this.getShipping();
    const disc = this.getDiscountAmount();
    return Math.max(0, sub + ship - disc);
  }

  applyCoupon(): void {
    if (!this.couponInput.trim()) return;
    const code = this.couponInput.trim().toUpperCase();

    if (code === 'KREBERS10' || code === 'WELCOME10') {
      this.appliedCoupon = { code, discountPercent: 10, name: '10% Welcome Discount' };
      this.toastService.showCustomToast('🎉 Promo code KREBERS10 applied! 10% discount off subtotal.');
    } else if (code === 'VIP20' || code === 'KREBERS20') {
      this.appliedCoupon = { code, discountPercent: 20, name: '20% VIP Member Savings' };
      this.toastService.showCustomToast('🌟 VIP Promo applied! 20% discount off subtotal.');
    } else if (code === 'FREESHIP') {
      this.appliedCoupon = { code, discountPercent: 0, name: 'Free Standard Shipping' };
      this.toastService.showCustomToast('🚚 Free shipping promo applied!');
    } else {
      this.toastService.showCustomToast('❌ Invalid promo code. Try "KREBERS10" or "VIP20".');
    }
  }

  removeCoupon(): void {
    this.appliedCoupon = null;
    this.couponInput = '';
    this.toastService.showCustomToast('Promo code removed.');
  }

  async placeOrder(): Promise<void> {
    if (this.cartItems.length === 0) {
      this.toastService.showCustomToast('Your cart is empty!');
      return;
    }

    if (!this.authService.isLoggedIn) {
      this.toastService.showCustomToast('Please sign in to place your order securely.');
      this.router.navigate(['/auth']);
      return;
    }

    if (!this.firstName || !this.address || !this.phone) {
      this.toastService.showCustomToast('Please fill in required billing details (First Name, Address, Phone).');
      return;
    }

    this.isPlacingOrder = true;
    try {
      const orderId = await this.authService.saveOrder({
        userId: this.authService.user!.uid,
        items: this.cartItems,
        total: this.getTotal(),
        status: 'Processing',
        paymentMethod: this.paymentMethod,
        shippingAddress: {
          name: `${this.firstName} ${this.lastName}`.trim(),
          address: this.address,
          city: this.city,
          country: this.country,
          zipCode: this.zipCode,
          phone: this.phone,
          email: this.email,
          notes: this.notes
        }
      });

      this.cartService.clearCart();
      this.toastService.showCustomToast(`🎉 Order #${orderId.substring(0, 8)} placed successfully!`);
      this.router.navigate(['/profile']);
    } catch (e: any) {
      console.error('Order error:', e);
      this.toastService.showCustomToast('Failed to place order. Please try again.');
    } finally {
      this.isPlacingOrder = false;
    }
  }
}

