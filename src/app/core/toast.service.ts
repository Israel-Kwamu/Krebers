import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'danger';
  title: string;
  message: string;
  image?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();

  show(toast: Omit<Toast, 'id'>): void {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5);
    const newToast: Toast = { ...toast, id, duration: toast.duration || 3500 };

    const current = [...this.toastsSubject.value, newToast];
    this.toastsSubject.next(current);

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, newToast.duration);
    }
  }

  showCartAdd(productName: string, image?: string): void {
    this.show({
      type: 'success',
      title: 'Added to Cart!',
      message: `${productName} is now in your shopping cart.`,
      image
    });
  }

  showWishlistToggle(productName: string, added: boolean, image?: string): void {
    if (added) {
      this.show({
        type: 'info',
        title: 'Saved to Wishlist!',
        message: `${productName} was added to your favorites.`,
        image
      });
    } else {
      this.show({
        type: 'warning',
        title: 'Removed from Wishlist',
        message: `${productName} was removed from your favorites.`,
        image
      });
    }
  }

  remove(id: string): void {
    const current = this.toastsSubject.value.filter(t => t.id !== id);
    this.toastsSubject.next(current);
  }

  clearAll(): void {
    this.toastsSubject.next([]);
  }
}
