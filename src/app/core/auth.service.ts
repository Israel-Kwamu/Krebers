import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastService } from './toast.service';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserOrder {
  id?: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  items: any[];
  total: number;
  status: string; // 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  paymentStatus?: string; // 'Paid' | 'Pending Verification' | 'Refunded' | 'Failed'
  trackingNumber?: string;
  carrier?: string;
  shippingAddress: any;
  paymentMethod: string;
  transferReference?: string;
  transferSenderName?: string;
  transferSenderBank?: string;
  bankName?: string;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

export interface LocalUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  password?: string;
}

const USERS_STORAGE_KEY = 'krebers_users_db';
const SESSION_STORAGE_KEY = 'krebers_active_session';
const ORDERS_STORAGE_KEY = 'krebers_orders_db';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<LocalUser | null>(null);
  public currentUser$: Observable<LocalUser | null> = this.currentUserSubject.asObservable();

  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  public userProfile$: Observable<UserProfile | null> = this.userProfileSubject.asObservable();

  constructor(private toastService: ToastService) {
    this.restoreSession();
  }

  private restoreSession(): void {
    if (typeof window === 'undefined') return;
    try {
      const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (storedSession) {
        const user: LocalUser = JSON.parse(storedSession);
        this.currentUserSubject.next(user);
        this.loadUserProfile(user.uid);
      }
    } catch (e) {
      console.error('Error restoring local session:', e);
    }
  }

  get user(): LocalUser | null {
    return this.currentUserSubject.value;
  }

  get userProfile(): UserProfile | null {
    return this.userProfileSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  // Google Sign-In (Local Simulation)
  async googleSignIn(): Promise<void> {
    const demoGoogleUser: LocalUser = {
      uid: 'google_user_' + Math.random().toString(36).substring(2, 9),
      email: 'alex.google@example.com',
      displayName: 'Alex Johnson',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };

    this.saveUserAndSetSession(demoGoogleUser);
    this.toastService.showCustomToast(`Welcome back, ${demoGoogleUser.displayName}! 👋`);
  }

  // Email/Password Login
  async emailSignIn(email: string, pass: string): Promise<void> {
    if (!email || !pass) {
      throw new Error('Please provide both email and password.');
    }

    const users = this.getStoredUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      if (existing.password && existing.password !== pass) {
        this.toastService.showCustomToast('Incorrect password. Please try again.');
        throw new Error('Incorrect password.');
      }
      this.setSession(existing);
      this.toastService.showCustomToast(`Welcome back, ${existing.displayName || email}! 👋`);
      return;
    }

    // Auto-create local account if logging in for the first time
    const newUid = 'usr_' + Date.now();
    const newUser: LocalUser = {
      uid: newUid,
      email: email,
      displayName: email.split('@')[0],
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      password: pass
    };

    this.saveUserAndSetSession(newUser);
    this.toastService.showCustomToast(`Welcome to Krebers, ${newUser.displayName}! 🎉`);
  }

  // Email/Password Registration
  async emailSignUp(email: string, pass: string, name: string): Promise<void> {
    if (!email || !pass) {
      throw new Error('Please provide email and password.');
    }

    const users = this.getStoredUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      this.toastService.showCustomToast('An account with this email already exists.');
      throw new Error('An account with this email already exists.');
    }

    const displayName = name || email.split('@')[0];
    const newUser: LocalUser = {
      uid: 'usr_' + Date.now(),
      email: email,
      displayName: displayName,
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      password: pass
    };

    this.saveUserAndSetSession(newUser);
    this.toastService.showCustomToast(`Account created successfully! Welcome, ${displayName}! 🎉`);
  }

  // Password Reset
  async resetPassword(email: string): Promise<void> {
    if (!email) {
      this.toastService.showCustomToast('Please enter your email address first.');
      return;
    }
    this.toastService.showCustomToast(`Password reset link sent to ${email}. Check your inbox! 📩`);
  }

  // Sign Out
  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      const user = this.user;
      
      // Clear all active user keys
      if (user) {
        localStorage.removeItem(`krebers_cart_${user.uid}`);
        localStorage.removeItem(`krebers_wishlist_${user.uid}`);
      }

      // Clear guest and generic keys to fully wipe previous actions
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem('cart');
      localStorage.removeItem('krebers_cart_guest');
      localStorage.removeItem('krebers_wishlist');
      localStorage.removeItem('krebers_wishlist_guest');
      localStorage.removeItem('krebers_recently_viewed');
    }
    this.currentUserSubject.next(null);
    this.userProfileSubject.next(null);
    this.toastService.showCustomToast('Logged out successfully.');
  }

  // Update Profile Data
  async updateProfileData(data: Partial<UserProfile>): Promise<void> {
    const user = this.user;
    if (!user) return;

    const currentProfile = this.userProfileSubject.value || {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };

    const updatedProfile: UserProfile = {
      ...currentProfile,
      ...data,
      updatedAt: new Date().toISOString()
    };

    if (data.displayName) {
      user.displayName = data.displayName;
    }

    this.saveUserProfile(updatedProfile);
    this.userProfileSubject.next(updatedProfile);

    // Update session user
    this.setSession(user);
    this.toastService.showCustomToast('Profile updated successfully! ✨');
  }

  // Save Order
  async saveOrder(orderData: Omit<UserOrder, 'createdAt'>): Promise<string> {
    const user = this.user;
    if (!user) throw new Error('User must be logged in to save orders');

    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const profile = this.userProfile;
    const isOnlinePayment = ['paystack', 'flutterwave', 'card'].includes(orderData.paymentMethod.toLowerCase());

    const newOrder: UserOrder = {
      ...orderData,
      id: orderId,
      userName: profile?.displayName || user.displayName || 'Customer',
      userEmail: profile?.email || user.email,
      paymentStatus: orderData.paymentStatus || (isOnlinePayment ? 'Paid' : 'Pending Verification'),
      status: orderData.status || 'Pending',
      createdAt: new Date().toISOString()
    };

    const orders = this.getStoredOrders();
    orders.unshift(newOrder);
    this.saveOrdersToStorage(orders);

    return orderId;
  }

  // Get User Orders
  async getUserOrders(): Promise<UserOrder[]> {
    const user = this.user;
    if (!user) return [];

    const orders = this.getStoredOrders();
    return orders.filter(o => o.userId === user.uid);
  }

  // Admin: Get All Orders
  getAllOrders(): UserOrder[] {
    return this.getStoredOrders();
  }

  // Admin: Get All Registered Users
  getAllRegisteredUsers(): LocalUser[] {
    return this.getStoredUsers();
  }

  // Admin: Update Order Status & Tracking
  updateOrderStatus(orderId: string, status: string, trackingNumber?: string, carrier?: string, notes?: string): void {
    const orders = this.getStoredOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].status = status;
      if (trackingNumber !== undefined) orders[idx].trackingNumber = trackingNumber;
      if (carrier !== undefined) orders[idx].carrier = carrier;
      if (notes !== undefined) orders[idx].notes = notes;
      orders[idx].updatedAt = new Date().toISOString();
      this.saveOrdersToStorage(orders);
      this.toastService.showCustomToast(`Order ${orderId} updated to ${status}! 📦`);
    }
  }

  // Admin: Update Payment Status
  updatePaymentStatus(orderId: string, paymentStatus: string, notes?: string): void {
    const orders = this.getStoredOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].paymentStatus = paymentStatus;
      if (notes) orders[idx].notes = notes;
      orders[idx].updatedAt = new Date().toISOString();
      this.saveOrdersToStorage(orders);
      this.toastService.showCustomToast(`Payment for ${orderId} updated to ${paymentStatus}! 💳`);
    }
  }

  private saveOrdersToStorage(orders: UserOrder[]): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
      } catch (e) {
        console.error('Error saving orders to localStorage:', e);
      }
    }
  }

  // Helper Methods for LocalStorage
  private getStoredUsers(): LocalUser[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveUserAndSetSession(user: LocalUser): void {
    const users = this.getStoredUsers();
    const idx = users.findIndex(u => u.uid === user.uid || u.email.toLowerCase() === user.email.toLowerCase());
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...user };
    } else {
      users.push(user);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
    this.setSession(user);

    // Initialize or load profile
    this.loadUserProfile(user.uid, user);
  }

  private setSession(user: LocalUser): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  private loadUserProfile(uid: string, fallbackUser?: LocalUser): void {
    if (typeof window === 'undefined') return;
    try {
      const profileKey = `krebers_profile_${uid}`;
      const stored = localStorage.getItem(profileKey);
      if (stored) {
        this.userProfileSubject.next(JSON.parse(stored));
      } else {
        const u = fallbackUser || this.user;
        const initialProfile: UserProfile = {
          uid: uid,
          email: u?.email || '',
          displayName: u?.displayName || 'User',
          photoURL: u?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.saveUserProfile(initialProfile);
        this.userProfileSubject.next(initialProfile);
      }
    } catch (e) {
      console.error('Error loading user profile:', e);
    }
  }

  private saveUserProfile(profile: UserProfile): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`krebers_profile_${profile.uid}`, JSON.stringify(profile));
    } catch (e) {
      console.error('Error saving user profile:', e);
    }
  }

  clearAllUserData(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([]));
      localStorage.removeItem(SESSION_STORAGE_KEY);
      this.currentUserSubject.next(null);
      this.userProfileSubject.next(null);

      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('krebers_profile_') || key.startsWith('krebers_cart_') || key.startsWith('krebers_wishlist_') || key === 'cart' || key === 'krebers_wishlist' || key === 'krebers_recently_viewed')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (e) {
      console.error('Error clearing all user data:', e);
    }
  }

  private getStoredOrders(): UserOrder[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error loading orders:', e);
    }

    // Default Seed Orders for Admin Demonstration
    const sampleOrders: UserOrder[] = [
      {
        id: 'ORD-892301',
        userId: 'usr_sample_1',
        userName: 'Adesuwa Olowe',
        userEmail: 'adesuwa@example.com',
        items: [
          { name: 'Traditional Agbada Embroidery Set', qty: 1, currentPrice: 65000, image: 'assets/img/krebers.jpg' },
          { name: 'Classic White Oxford Shirt', qty: 2, currentPrice: 18000, image: 'assets/img/header-img.png' }
        ],
        total: 101000,
        status: 'Processing',
        paymentStatus: 'Paid',
        paymentMethod: 'Paystack (Card)',
        trackingNumber: 'GIG-99812-LA',
        carrier: 'GIG Logistics',
        shippingAddress: {
          firstName: 'Adesuwa',
          lastName: 'Olowe',
          street: '14 Admiralty Way, Lekki Phase 1',
          city: 'Lagos',
          state: 'Lagos State',
          country: 'Nigeria',
          phone: '+234 803 123 4567'
        },
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 'ORD-771209',
        userId: 'usr_sample_2',
        userName: 'Babatunde Raji',
        userEmail: 'b.raji@example.com',
        items: [
          { name: 'Premium Genuine Leather Jacket', qty: 1, currentPrice: 45000, image: 'assets/img/krebers.jpg' }
        ],
        total: 45000,
        status: 'Shipped',
        paymentStatus: 'Paid',
        paymentMethod: 'Bank Transfer',
        trackingNumber: 'DHL-48192039',
        carrier: 'DHL Express',
        shippingAddress: {
          firstName: 'Babatunde',
          lastName: 'Raji',
          street: '8 Maitama Avenue',
          city: 'Abuja',
          state: 'FCT',
          country: 'Nigeria',
          phone: '+234 802 987 6543'
        },
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
      },
      {
        id: 'ORD-654102',
        userId: 'usr_sample_3',
        userName: 'Chioma Nwosu',
        userEmail: 'chioma.nwosu@example.com',
        items: [
          { name: 'Floral Print Silk Evening Gown', qty: 1, currentPrice: 38000, image: 'assets/img/header-img.png' },
          { name: 'Cozy Fleece Cropped Hoodie', qty: 1, currentPrice: 16500, image: 'assets/img/krebers-1.png' }
        ],
        total: 54500,
        status: 'Pending',
        paymentStatus: 'Paid',
        paymentMethod: 'Direct Bank Transfer',
        shippingAddress: {
          firstName: 'Chioma',
          lastName: 'Nwosu',
          street: '22 Trans-Amadi Road',
          city: 'Port Harcourt',
          state: 'Rivers State',
          country: 'Nigeria',
          phone: '+234 814 555 1212'
        },
        createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString()
      },
      {
        id: 'ORD-510042',
        userId: 'usr_sample_4',
        userName: 'Emeka Okafor',
        userEmail: 'emeka.o@example.com',
        items: [
          { name: 'Slim Fit Chino Pants', qty: 2, currentPrice: 21000, image: 'assets/img/krebers-1.png' }
        ],
        total: 42000,
        status: 'Delivered',
        paymentStatus: 'Paid',
        paymentMethod: 'Flutterwave',
        trackingNumber: 'RED-882190',
        carrier: 'Red Star Express',
        shippingAddress: {
          firstName: 'Emeka',
          lastName: 'Okafor',
          street: '5 Bodija Estate',
          city: 'Ibadan',
          state: 'Oyo State',
          country: 'Nigeria',
          phone: '+234 701 444 3322'
        },
        createdAt: new Date(Date.now() - 86400000 * 8).toISOString()
      }
    ];

    this.saveOrdersToStorage(sampleOrders);
    return sampleOrders;
  }
}
