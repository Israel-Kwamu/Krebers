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
  items: any[];
  total: number;
  status: string;
  shippingAddress: any;
  paymentMethod: string;
  createdAt: string;
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
    const newOrder: UserOrder = {
      ...orderData,
      id: orderId,
      createdAt: new Date().toISOString()
    };

    const orders = this.getStoredOrders();
    orders.unshift(newOrder);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    }

    return orderId;
  }

  // Get User Orders
  async getUserOrders(): Promise<UserOrder[]> {
    const user = this.user;
    if (!user) return [];

    const orders = this.getStoredOrders();
    return orders.filter(o => o.userId === user.uid);
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

  private getStoredOrders(): UserOrder[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(ORDERS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}
