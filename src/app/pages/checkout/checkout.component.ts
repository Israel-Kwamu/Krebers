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
  paymentMethod: string = '';

  // Direct Bank Transfer Details
  transferSenderName: string = '';
  transferSenderBank: string = '';
  transferReference: string = '';
  bankDetails = {
    bankName: 'Providus Bank',
    accountNumber: '5401920391',
    accountName: 'Krebers Limited'
  };

  popularBanks: string[] = [
    'GTBank (Guaranty Trust)',
    'Access Bank',
    'Zenith Bank',
    'First Bank of Nigeria',
    'UBA (United Bank for Africa)',
    'OPay',
    'Moniepoint',
    'Kuda Microfinance Bank',
    'Stanbic IBTC',
    'FCMB',
    'Sterling Bank',
    'Wema Bank / ALAT',
    'Fidelity Bank',
    'Union Bank',
    'Other Bank'
  ];

  copiedAccountState: boolean = false;
  copiedAmountState: boolean = false;

  copyAccountNumber(): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.bankDetails.accountNumber);
    }
    this.copiedAccountState = true;
    this.toastService.showCustomToast('📋 Account Number 5401920391 copied to clipboard!');
    setTimeout(() => {
      this.copiedAccountState = false;
    }, 3000);
  }

  copyTransferAmount(): void {
    const totalAmount = this.getTotal().toString();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(totalAmount);
    }
    this.copiedAmountState = true;
    this.toastService.showCustomToast(`📋 Amount (₦${this.getTotal().toLocaleString()}) copied!`);
    setTimeout(() => {
      this.copiedAmountState = false;
    }, 3000);
  }
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

  async completeOrder(paymentStatus: string, reference?: string): Promise<void> {
    this.isPlacingOrder = true;
    try {
      const orderId = await this.authService.saveOrder({
        userId: this.authService.user!.uid,
        items: this.cartItems,
        total: this.getTotal(),
        status: 'Processing',
        paymentStatus: paymentStatus,
        paymentMethod: this.paymentMethod,
        transferSenderName: this.paymentMethod === 'Direct Bank Transfer' ? this.transferSenderName : undefined,
        transferSenderBank: this.paymentMethod === 'Direct Bank Transfer' ? this.transferSenderBank : undefined,
        transferReference: this.paymentMethod === 'Direct Bank Transfer' ? this.transferReference : reference,
        bankName: this.paymentMethod === 'Direct Bank Transfer' ? this.bankDetails.bankName : undefined,
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

  async payWithPaystack(): Promise<void> {
    try {
      // First attempt: dynamic import of npm package
      const PaystackPopModule = await import('@paystack/inline-js');
      const PaystackPop = (PaystackPopModule as any).default || (PaystackPopModule as any).PaystackPop || (PaystackPopModule as any);
      
      const amountInKobo = this.getTotal() * 100;
      const paymentRef = 'KRB-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

      this.toastService.showCustomToast('🔒 Opening Paystack secure payment window...');

      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: (window as any).PAYSTACK_PUBLIC_KEY || 'pk_test_c6fa202860d5b3d683777f98fb6ebbb56e05391e',
        email: this.email || 'customer@krebers.com',
        amount: amountInKobo,
        currency: 'NGN',
        ref: paymentRef,
        onSuccess: async (transaction: any) => {
          this.toastService.showCustomToast('✅ Payment authorized successfully! Finalizing order...');
          await this.completeOrder('Paid', transaction.reference || paymentRef);
        },
        onCancel: () => {
          this.isPlacingOrder = false;
          this.toastService.showCustomToast('⚠️ Payment cancelled by user.');
        }
      });
    } catch (err) {
      console.warn('Could not load Paystack from npm bundle, falling back to CDN script loading...', err);
      this.loadPaystackCDNAndPay();
    }
  }

  loadPaystackCDNAndPay(): void {
    if ((window as any).PaystackPop) {
      this.executePaystackPopup();
      return;
    }

    this.toastService.showCustomToast('🔄 Loading secure payment gateway...');
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v2/inline.js';
    script.async = true;
    script.onload = () => {
      this.executePaystackPopup();
    };
    script.onerror = () => {
      this.isPlacingOrder = false;
      this.toastService.showCustomToast('❌ Failed to load Paystack payment gateway. Please check your internet connection.');
    };
    document.body.appendChild(script);
  }

  executePaystackPopup(): void {
    try {
      const PaystackPop = (window as any).PaystackPop;
      const amountInKobo = this.getTotal() * 100;
      const paymentRef = 'KRB-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

      if (PaystackPop && typeof PaystackPop.setup !== 'function') {
        const paystack = new PaystackPop();
        paystack.newTransaction({
          key: (window as any).PAYSTACK_PUBLIC_KEY || 'pk_test_c6fa202860d5b3d683777f98fb6ebbb56e05391e',
          email: this.email || 'customer@krebers.com',
          amount: amountInKobo,
          currency: 'NGN',
          ref: paymentRef,
          onSuccess: async (transaction: any) => {
            this.toastService.showCustomToast('✅ Payment authorized successfully! Finalizing order...');
            await this.completeOrder('Paid', transaction.reference || paymentRef);
          },
          onCancel: () => {
            this.isPlacingOrder = false;
            this.toastService.showCustomToast('⚠️ Payment cancelled by user.');
          }
        });
      } else {
        const handler = PaystackPop.setup({
          key: (window as any).PAYSTACK_PUBLIC_KEY || 'pk_test_c6fa202860d5b3d683777f98fb6ebbb56e05391e',
          email: this.email || 'customer@krebers.com',
          amount: amountInKobo,
          currency: 'NGN',
          ref: paymentRef,
          callback: async (response: any) => {
            this.toastService.showCustomToast('✅ Payment authorized successfully! Finalizing order...');
            await this.completeOrder('Paid', response.reference || paymentRef);
          },
          onClose: () => {
            this.isPlacingOrder = false;
            this.toastService.showCustomToast('⚠️ Payment cancelled by user.');
          }
        });
        handler.openIframe();
      }
    } catch (err) {
      this.isPlacingOrder = false;
      console.error('Paystack execution error:', err);
      this.toastService.showCustomToast('❌ Payment system error. Please select Direct Bank Transfer.');
    }
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

    if (!this.paymentMethod) {
      this.toastService.showCustomToast('Please select a payment method.');
      return;
    }

    if (this.paymentMethod === 'Direct Bank Transfer') {
      if (!this.transferSenderName) {
        this.toastService.showCustomToast('Please enter your Account Name for transfer verification.');
        return;
      }
      this.isPlacingOrder = true;
      await this.completeOrder('Pending Verification');
    } else if (this.paymentMethod === 'Card / Paystack Online') {
      this.isPlacingOrder = true;
      await this.payWithPaystack();
    } else {
      this.isPlacingOrder = true;
      await this.completeOrder('Paid');
    }
  }
}

