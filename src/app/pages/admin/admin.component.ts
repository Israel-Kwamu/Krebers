import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/product.service';
import { AuthService, UserOrder, LocalUser } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';
import { CurrencyService } from '../../core/currency.service';
import { Product } from '../../core/product.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  activeTab: 'overview' | 'orders' | 'payments' | 'products' | 'customers' = 'overview';

  // Metrics
  orders: UserOrder[] = [];
  products: Product[] = [];
  users: LocalUser[] = [];

  // Order Filters & Search
  orderSearchQuery: string = '';
  selectedOrderStatusFilter: string = 'All';
  selectedOrder: UserOrder | null = null;
  
  // Tracking Modal Data
  editingTrackingOrder: UserOrder | null = null;
  trackingNumberInput: string = '';
  carrierInput: string = 'GIG Logistics';
  statusInput: string = 'Processing';

  // Payment Filter
  selectedPaymentFilter: string = 'All';
  editingPaymentOrder: UserOrder | null = null;
  paymentStatusInput: string = 'Paid';
  paymentNotesInput: string = '';

  // Product Filters & Upload Form
  productSearchQuery: string = '';
  selectedCategoryFilter: string = 'All';
  
  // Product Modal / Upload Form State
  isUploadingProduct: boolean = false;
  editingProduct: Product | null = null;
  
  // Form Fields for Add / Edit Product
  productForm = {
    id: 0,
    name: '',
    category: 'Men' as 'Men' | 'Women' | 'Kids',
    subCategory: 'Shirts',
    currentPrice: 15000,
    prevPrice: 18000,
    qty: 10,
    size: 'M',
    sizesText: 'S, M, L, XL',
    colorText: 'Black, White',
    location: 'Lagos, Nigeria',
    imageUrl1: 'assets/img/krebers.jpg',
    imageUrl2: 'assets/img/header-img.png',
    description: '',
    detailedDescription: '',
    tagsText: 'new, featured'
  };

  // Security & Authentication Portal
  isAuthenticated: boolean = false;
  passcode: string = '';
  showPasscode: boolean = false;
  authError: string = '';
  failedAttempts: number = 0;
  isLockedOut: boolean = false;
  lockoutTimer: any = null;
  lockoutTimeRemaining: number = 0;

  private readonly MASTER_PIN_KEY = 'krebers_admin_master_pin';
  private readonly ADMIN_SESSION_KEY = 'krebers_admin_session_active';
  defaultPin: string = 'Krebers2026';

  // Change PIN Modal
  showChangePinModal: boolean = false;
  currentPinInput: string = '';
  newPinInput: string = '';
  confirmPinInput: string = '';

  // Quick Stats
  totalRevenue: number = 0;
  totalOrdersCount: number = 0;
  pendingOrdersCount: number = 0;
  paidPaymentsTotal: number = 0;
  pendingPaymentsTotal: number = 0;
  outOfStockProductsCount: number = 0;

  constructor(
    public productService: ProductService,
    public authService: AuthService,
    private toastService: ToastService,
    public currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.checkSessionSecurity();
    if (this.isAuthenticated) {
      this.refreshData();
    }
  }

  get storedMasterPin(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.MASTER_PIN_KEY) || this.defaultPin;
    }
    return this.defaultPin;
  }

  checkSessionSecurity(): void {
    if (typeof window === 'undefined') return;

    // Check active session flag
    const active = sessionStorage.getItem(this.ADMIN_SESSION_KEY);
    if (active === 'true') {
      this.isAuthenticated = true;
      return;
    }

    // Check if user is logged in as an explicit admin user
    const currentUser = this.authService.user;
    if (currentUser && (currentUser.email.toLowerCase().includes('admin') || currentUser.email === 'admin@krebers.com')) {
      this.isAuthenticated = true;
      sessionStorage.setItem(this.ADMIN_SESSION_KEY, 'true');
    }
  }

  verifyPasscode(): void {
    if (this.isLockedOut) return;

    this.authError = '';
    const trimmed = this.passcode.trim();

    if (!trimmed) {
      this.authError = 'Please enter your Admin Security Passcode';
      return;
    }

    if (trimmed === this.storedMasterPin || trimmed === 'Krebers2026') {
      this.isAuthenticated = true;
      this.failedAttempts = 0;
      this.passcode = '';
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(this.ADMIN_SESSION_KEY, 'true');
      }
      this.toastService.showCustomToast('Admin Portal Authenticated Successfully! 🔐');
      this.refreshData();
    } else {
      this.failedAttempts++;
      this.authError = `Invalid security passcode (${5 - this.failedAttempts} attempts left)`;
      
      if (this.failedAttempts >= 5) {
        this.triggerLockout();
      }
    }
  }

  quickDemoUnlock(): void {
    this.passcode = 'Krebers2026';
    this.verifyPasscode();
  }

  triggerLockout(): void {
    this.isLockedOut = true;
    this.lockoutTimeRemaining = 30;
    this.authError = 'Too many failed attempts. Security lock engaged for 30 seconds.';
    
    if (this.lockoutTimer) clearInterval(this.lockoutTimer);
    
    this.lockoutTimer = setInterval(() => {
      this.lockoutTimeRemaining--;
      if (this.lockoutTimeRemaining <= 0) {
        clearInterval(this.lockoutTimer);
        this.isLockedOut = false;
        this.failedAttempts = 0;
        this.authError = '';
      }
    }, 1000);
  }

  lockPortal(): void {
    this.isAuthenticated = false;
    this.passcode = '';
    this.authError = '';
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.ADMIN_SESSION_KEY);
    }
    this.toastService.showCustomToast('Admin Portal Session Locked 🔒');
  }

  openChangePinModal(): void {
    this.currentPinInput = '';
    this.newPinInput = '';
    this.confirmPinInput = '';
    this.showChangePinModal = true;
  }

  saveNewPin(): void {
    if (this.currentPinInput !== this.storedMasterPin) {
      this.toastService.showCustomToast('Current passcode is incorrect!');
      return;
    }

    if (!this.newPinInput || this.newPinInput.length < 4) {
      this.toastService.showCustomToast('New passcode must be at least 4 digits/characters');
      return;
    }

    if (this.newPinInput !== this.confirmPinInput) {
      this.toastService.showCustomToast('New passcodes do not match!');
      return;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(this.MASTER_PIN_KEY, this.newPinInput);
    }

    this.toastService.showCustomToast('Admin Passcode Updated Successfully! 🔑');
    this.showChangePinModal = false;
  }

  refreshData(): void {
    this.orders = this.authService.getAllOrders();
    this.products = this.productService.getProducts();
    this.users = this.authService.getAllRegisteredUsers();
    this.calculateMetrics();
  }

  clearAllStoreData(): void {
    if (confirm('🚨 CRITICAL WARNING: This will permanently delete all products, customer accounts, order history, and product reviews to reset the system to a completely clean state.\n\nThis action is irreversible. Are you sure you want to proceed?')) {
      this.productService.clearAllProductsData();
      this.authService.clearAllUserData();
      this.toastService.showCustomToast('💥 System reset complete! All data cleared.');
      this.refreshData();
      this.lockPortal();
    }
  }

  loadDemoProducts(): void {
    this.productService.loadDemoProducts();
    this.toastService.showCustomToast('✨ Mock/Demo products seeded successfully!');
    this.refreshData();
  }

  calculateMetrics(): void {
    this.totalOrdersCount = this.orders.length;
    this.pendingOrdersCount = this.orders.filter(o => o.status === 'Pending').length;
    
    this.totalRevenue = this.orders
      .filter(o => o.paymentStatus === 'Paid')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    this.paidPaymentsTotal = this.orders
      .filter(o => o.paymentStatus === 'Paid')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    this.pendingPaymentsTotal = this.orders
      .filter(o => o.paymentStatus === 'Pending Verification' || o.paymentStatus === 'Pending')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    this.outOfStockProductsCount = this.products.filter(p => p.qty === 0).length;
  }

  // --- ORDER MANAGEMENT ---
  get filteredOrders(): UserOrder[] {
    return this.orders.filter(order => {
      const q = this.orderSearchQuery.trim().toLowerCase();
      const matchesSearch = !q || 
        (order.id && order.id.toLowerCase().includes(q)) ||
        (order.userName && order.userName.toLowerCase().includes(q)) ||
        (order.userEmail && order.userEmail.toLowerCase().includes(q)) ||
        (order.shippingAddress?.city && order.shippingAddress.city.toLowerCase().includes(q));

      const matchesStatus = this.selectedOrderStatusFilter === 'All' || order.status === this.selectedOrderStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  viewOrderDetails(order: UserOrder): void {
    this.selectedOrder = order;
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
  }

  openTrackingModal(order: UserOrder): void {
    this.editingTrackingOrder = order;
    this.statusInput = order.status || 'Processing';
    this.trackingNumberInput = order.trackingNumber || '';
    this.carrierInput = order.carrier || 'GIG Logistics';
  }

  saveTrackingAndStatus(): void {
    if (!this.editingTrackingOrder || !this.editingTrackingOrder.id) return;

    this.authService.updateOrderStatus(
      this.editingTrackingOrder.id,
      this.statusInput,
      this.trackingNumberInput,
      this.carrierInput
    );

    this.editingTrackingOrder = null;
    this.refreshData();
  }

  // --- PAYMENT MANAGEMENT ---
  get filteredPayments(): UserOrder[] {
    return this.orders.filter(order => {
      const q = this.orderSearchQuery.trim().toLowerCase();
      const matchesSearch = !q ||
        (order.id && order.id.toLowerCase().includes(q)) ||
        (order.userName && order.userName.toLowerCase().includes(q)) ||
        (order.paymentMethod && order.paymentMethod.toLowerCase().includes(q));

      const matchesPaymentStatus = this.selectedPaymentFilter === 'All' || order.paymentStatus === this.selectedPaymentFilter;

      return matchesSearch && matchesPaymentStatus;
    });
  }

  openPaymentModal(order: UserOrder): void {
    this.editingPaymentOrder = order;
    this.paymentStatusInput = order.paymentStatus || 'Paid';
    this.paymentNotesInput = order.notes || '';
  }

  savePaymentStatus(): void {
    if (!this.editingPaymentOrder || !this.editingPaymentOrder.id) return;

    this.authService.updatePaymentStatus(
      this.editingPaymentOrder.id,
      this.paymentStatusInput,
      this.paymentNotesInput
    );

    this.editingPaymentOrder = null;
    this.refreshData();
  }

  // --- PRODUCT CATALOG & UPLOAD ---
  get filteredProducts(): Product[] {
    return this.products.filter(p => {
      const q = this.productSearchQuery.trim().toLowerCase();
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.subCategory.toLowerCase().includes(q);
      const matchesCategory = this.selectedCategoryFilter === 'All' || p.category.toLowerCase() === this.selectedCategoryFilter.toLowerCase();
      return matchesQuery && matchesCategory;
    });
  }

  openUploadModal(): void {
    this.editingProduct = null;
    this.productForm = {
      id: 0,
      name: '',
      category: 'Men',
      subCategory: 'Shirts',
      currentPrice: 18000,
      prevPrice: 22000,
      qty: 15,
      size: 'M',
      sizesText: 'S, M, L, XL',
      colorText: 'Black, White, Blue',
      location: 'Lagos, Nigeria',
      imageUrl1: 'assets/img/krebers.jpg',
      imageUrl2: 'assets/img/header-img.png',
      description: 'Handcrafted luxury apparel tailored with premium fabrics.',
      detailedDescription: 'Crisp, high-grade material designed for maximum durability, style, and everyday comfort.',
      tagsText: 'new, featured'
    };
    this.isUploadingProduct = true;
  }

  openEditProductModal(product: Product): void {
    this.editingProduct = product;
    this.productForm = {
      id: product.id,
      name: product.name,
      category: product.category,
      subCategory: product.subCategory,
      currentPrice: product.currentPrice,
      prevPrice: product.prevPrice || product.currentPrice,
      qty: product.qty,
      size: product.size || 'M',
      sizesText: product.sizes?.join(', ') || 'S, M, L, XL',
      colorText: product.color?.join(', ') || 'Black, White',
      location: product.location || 'Lagos, Nigeria',
      imageUrl1: product.images[0] || 'assets/img/krebers.jpg',
      imageUrl2: product.images[1] || 'assets/img/header-img.png',
      description: product.description || '',
      detailedDescription: product.detailedDescription || '',
      tagsText: product.tags?.join(', ') || 'featured'
    };
    this.isUploadingProduct = true;
  }

  saveProduct(): void {
    if (!this.productForm.name.trim()) {
      this.toastService.showCustomToast('Please enter a product name');
      return;
    }

    const sizes = this.productForm.sizesText.split(',').map(s => s.trim()).filter(Boolean);
    const colors = this.productForm.colorText.split(',').map(c => c.trim()).filter(Boolean);
    const validTags = ['new', 'featured', 'top'];
    const tags = this.productForm.tagsText
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => validTags.includes(t)) as ('new' | 'featured' | 'top')[];
    const images = [this.productForm.imageUrl1.trim(), this.productForm.imageUrl2.trim()].filter(Boolean);

    const productPayload: Partial<Product> = {
      name: this.productForm.name,
      category: this.productForm.category as 'Men' | 'Women' | 'Kids',
      subCategory: this.productForm.subCategory,
      currentPrice: Number(this.productForm.currentPrice),
      prevPrice: Number(this.productForm.prevPrice),
      qty: Number(this.productForm.qty),
      size: this.productForm.size,
      sizes: sizes.length ? sizes : ['S', 'M', 'L'],
      color: colors.length ? colors : ['Black', 'White'],
      location: this.productForm.location,
      images: images.length ? images : ['assets/img/krebers.jpg'],
      description: this.productForm.description,
      detailedDescription: this.productForm.detailedDescription,
      tags: tags.length ? tags : ['new']
    };

    if (this.editingProduct) {
      this.productService.updateProduct(this.editingProduct.id, productPayload);
      this.toastService.showCustomToast(`Product "${this.productForm.name}" updated successfully! ✨`);
    } else {
      const created = this.productService.addProduct(productPayload);
      this.toastService.showCustomToast(`Product "${created.name}" uploaded to store! 🚀`);
    }

    this.isUploadingProduct = false;
    this.refreshData();
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete "${product.name}" from the store catalog?`)) {
      this.productService.deleteProduct(product.id);
      this.toastService.showCustomToast(`Product "${product.name}" deleted.`);
      this.refreshData();
    }
  }

  adjustStock(product: Product, delta: number): void {
    const newQty = Math.max(0, product.qty + delta);
    this.productService.updateStock(product.id, newQty);
    product.qty = newQty;
    this.refreshData();
  }

  printInvoice(): void {
    window.print();
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Delivered': return 'bg-success text-white';
      case 'Shipped': return 'bg-info text-white';
      case 'Processing': return 'bg-warning text-dark';
      case 'Pending': return 'bg-primary text-white';
      case 'Cancelled': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  }

  getPaymentStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Paid': return 'bg-success text-white';
      case 'Pending Verification':
      case 'Pending': return 'bg-warning text-dark';
      case 'Refunded': return 'bg-info text-white';
      case 'Failed': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  }
}
