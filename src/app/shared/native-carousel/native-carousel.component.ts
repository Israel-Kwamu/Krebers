import { Component, Input, OnInit, OnDestroy, HostListener, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-native-carousel',
  templateUrl: './native-carousel.component.html',
  styleUrls: ['./native-carousel.component.css']
})
export class NativeCarouselComponent implements OnInit, OnDestroy {
  @Input() items: any[] = [];
  @Input() itemsPerPage: number = 3;
  @Input() autoPlay: boolean = true;
  @Input() interval: number = 4000;
  @Input() showNav: boolean = true;
  @Input() showDots: boolean = true;

  currentIndex: number = 0;
  private timer: any;

  // Touch gesture tracking
  private touchStartX: number = 0;
  private touchEndX: number = 0;
  private minSwipeDistance: number = 40;

  @ViewChild('carouselTrack') carouselTrack?: ElementRef;

  ngOnInit(): void {
    this.updateItemsPerPage();
    if (this.autoPlay) {
      this.startAutoplay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateItemsPerPage();
  }

  private updateItemsPerPage(): void {
    if (typeof window === 'undefined') return;
    const width = window.innerWidth;
    if (width < 576) {
      this.itemsPerPage = 1;
    } else if (width < 992) {
      this.itemsPerPage = Math.min(2, this.items.length);
    } else if (width < 1200) {
      this.itemsPerPage = Math.min(3, this.items.length);
    }
  }

  get maxIndex(): number {
    return Math.max(0, this.items.length - this.itemsPerPage);
  }

  get pages(): number[] {
    const totalPages = Math.ceil(this.items.length / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  get currentPage(): number {
    return Math.floor(this.currentIndex / this.itemsPerPage);
  }

  next(): void {
    if (this.currentIndex >= this.maxIndex) {
      this.currentIndex = 0;
    } else {
      this.currentIndex = Math.min(this.currentIndex + 1, this.maxIndex);
    }
    this.resetAutoplay();
  }

  prev(): void {
    if (this.currentIndex <= 0) {
      this.currentIndex = this.maxIndex;
    } else {
      this.currentIndex = Math.max(0, this.currentIndex - 1);
    }
    this.resetAutoplay();
  }

  goToPage(pageIndex: number): void {
    this.currentIndex = Math.min(pageIndex * this.itemsPerPage, this.maxIndex);
    this.resetAutoplay();
  }

  // Touch Gesture Listeners
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
    this.stopAutoplay();
  }

  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
    if (this.autoPlay) {
      this.startAutoplay();
    }
  }

  private handleSwipe(): void {
    const distance = this.touchStartX - this.touchEndX;
    if (Math.abs(distance) >= this.minSwipeDistance) {
      if (distance > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }

  startAutoplay(): void {
    this.stopAutoplay();
    if (this.items.length <= this.itemsPerPage) return;
    this.timer = setInterval(() => {
      this.next();
    }, this.interval);
  }

  stopAutoplay(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private resetAutoplay(): void {
    if (this.autoPlay) {
      this.startAutoplay();
    }
  }

  get trackTransform(): string {
    const slideWidthPercent = 100 / this.itemsPerPage;
    const offset = -(this.currentIndex * slideWidthPercent);
    return `translateX(${offset}%)`;
  }
}
