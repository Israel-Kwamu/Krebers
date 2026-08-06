import { Injectable } from '@angular/core';
import { Product, Review } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly REVIEWS_KEY = 'krebers_product_reviews';

  private products: Product[] = [
    {
      id: 177,
      name: 'Premium Genuine Leather Jacket',
      size: 'L',
      sizes: ['S', 'M', 'L', 'XL'],
      currentPrice: 45000,
      prevPrice: 55000,
      images: [
        'assets/img/krebers.jpg',
        'assets/img/krebers-1.png',
        'assets/img/header-img.png'
      ],
      category: 'Men',
      subCategory: 'Hoodies',
      color: ['Black', 'Brown'],
      location: 'Lagos, Nigeria',
      qty: 10,
      description: 'Handcrafted luxury genuine leather jacket with sleek modern finish.',
      detailedDescription: 'Crafted from 100% full-grain leather, this jacket provides optimal warmth, durability, and a classic silhouette suitable for formal and casual outings.',
      reviews: [
        { user: 'Alex M.', comment: 'Superior quality leather!', rating: 5, date: 'May 10, 2026', verified: true },
        { user: 'Sarah K.', comment: 'Fits perfectly.', rating: 4.5, date: 'Jun 2, 2026', verified: true }
      ],
      rating: 4.8,
      tags: ['featured', 'top']
    },
    {
      id: 101,
      name: 'Classic White Oxford Shirt',
      size: 'M',
      sizes: ['S', 'M', 'L', 'XL'],
      currentPrice: 18000,
      prevPrice: 22000,
      images: [
        'assets/img/header-img.png',
        'assets/img/krebers.jpg'
      ],
      category: 'Men',
      subCategory: 'Shirts',
      color: ['White', 'Light Blue'],
      location: 'Lagos, Nigeria',
      qty: 15,
      description: 'Crisp cotton Oxford shirt tailored for everyday elegance.',
      detailedDescription: '100% breathable cotton Oxford shirt with a button-down collar and polished tailored fit.',
      reviews: [
        { user: 'David O.', comment: 'Great fit for business casual.', rating: 5, date: 'Apr 18, 2026', verified: true }
      ],
      rating: 4.7,
      tags: ['new', 'featured']
    },
    {
      id: 102,
      name: 'Slim Fit Chino Pants',
      size: '32',
      sizes: ['30', '32', '34', '36'],
      currentPrice: 21000,
      prevPrice: 25000,
      images: [
        'assets/img/krebers-1.png',
        'assets/img/header-img.png'
      ],
      category: 'Men',
      subCategory: 'Pants',
      color: ['Navy', 'Beige'],
      location: 'Abuja, Nigeria',
      qty: 12,
      description: 'Versatile slim-fit stretch chinos for all-day comfort.',
      detailedDescription: 'Durable cotton blend chinos with slight stretch, featuring side slant pockets and back welt pockets.',
      reviews: [],
      rating: 4.5,
      tags: ['featured']
    },
    {
      id: 103,
      name: 'Traditional Agbada Embroidery Set',
      size: 'XL',
      sizes: ['M', 'L', 'XL', 'XXL'],
      currentPrice: 65000,
      prevPrice: 75000,
      images: [
        'assets/img/krebers.jpg',
        'assets/img/header-img.png'
      ],
      category: 'Men',
      subCategory: 'Native',
      color: ['Blue', 'White'],
      location: 'Lagos, Nigeria',
      qty: 8,
      description: 'Exquisite handcrafted embroidery native wear set for grand occasions.',
      detailedDescription: 'Premium polished cotton native fabric detailed with rich traditional embroidery patterns.',
      reviews: [
        { user: 'Chidi E.', comment: 'Stunning embroidery, got so many compliments!', rating: 5, date: 'Jul 14, 2026', verified: true }
      ],
      rating: 4.9,
      tags: ['top', 'featured']
    },
    {
      id: 104,
      name: 'Urban Graphic Cotton T-Shirt',
      size: 'L',
      sizes: ['S', 'M', 'L', 'XL'],
      currentPrice: 12500,
      prevPrice: 15000,
      images: [
        'assets/img/header-img.png',
        'assets/img/krebers.jpg'
      ],
      category: 'Men',
      subCategory: 'T-Shirts',
      color: ['Black', 'Red', 'White'],
      location: 'Lagos, Nigeria',
      qty: 20,
      description: 'Soft heavyweight cotton tee featuring minimal urban chest graphic.',
      detailedDescription: '100% combed cotton, drop-shoulder casual relaxed fit tee.',
      reviews: [],
      rating: 4.3,
      tags: ['new']
    },
    {
      id: 105,
      name: 'Fleece Heavyweight Pullover Hoodie',
      size: 'XXL',
      sizes: ['M', 'L', 'XL', 'XXL'],
      currentPrice: 28000,
      prevPrice: 34000,
      images: [
        'assets/img/krebers-1.png',
        'assets/img/krebers.jpg'
      ],
      category: 'Men',
      subCategory: 'Hoodies',
      color: ['Green', 'Black'],
      location: 'Lagos, Nigeria',
      qty: 0, // Out of stock item for testing filter
      description: 'Cozy thermal fleece lined hoodie with kangaroo pouch pocket.',
      detailedDescription: 'Heavy double-knit cotton fleece keeps you warm with double-lined hood and sturdy drawstrings.',
      reviews: [
        { user: 'Michael B.', comment: 'Super warm hoodie!', rating: 4.8, date: 'May 20, 2026', verified: true }
      ],
      rating: 4.8,
      tags: ['top']
    },
    {
      id: 201,
      name: 'Floral Print Silk Evening Gown',
      size: 'S',
      sizes: ['XS', 'S', 'M', 'L'],
      currentPrice: 38000,
      prevPrice: 45000,
      images: [
        'assets/img/header-img.png',
        'assets/img/krebers-1.png'
      ],
      category: 'Women',
      subCategory: 'Gowns',
      color: ['Red', 'Pink'],
      location: 'Lagos, Nigeria',
      qty: 14,
      description: 'Flowing floral silk evening dress with elegant waist tie.',
      detailedDescription: 'Delicate floral pattern gown crafted with lightweight breathable silk, designed to flatter any silhouette.',
      reviews: [
        { user: 'Grace A.', comment: 'Felt like a queen wearing this gown.', rating: 5, date: 'Jun 11, 2026', verified: true }
      ],
      rating: 4.9,
      tags: ['new', 'top']
    },
    {
      id: 202,
      name: 'Cozy Fleece Cropped Hoodie',
      size: 'M',
      sizes: ['S', 'M', 'L'],
      currentPrice: 16500,
      prevPrice: 20000,
      images: [
        'assets/img/krebers-1.png',
        'assets/img/krebers.jpg'
      ],
      category: 'Women',
      subCategory: 'Hoodies',
      color: ['Pink', 'White'],
      location: 'Ibadan, Nigeria',
      qty: 20,
      description: 'Ultra-soft fleece hoodie featuring a stylish crop hem.',
      detailedDescription: 'Soft brushed fleece lined hoodie with drawstring hood and relaxed sleeves for ultimate chill vibes.',
      reviews: [],
      rating: 4.6,
      tags: ['new']
    },
    {
      id: 203,
      name: 'High-Waist Pleated Midi Skirt',
      size: 'M',
      sizes: ['S', 'M', 'L'],
      currentPrice: 19500,
      prevPrice: 24000,
      images: [
        'assets/img/krebers.jpg',
        'assets/img/header-img.png'
      ],
      category: 'Women',
      subCategory: 'Skirts',
      color: ['Black', 'Green'],
      location: 'Lagos, Nigeria',
      qty: 18,
      description: 'Chic midi pleated skirt with stretch waistband.',
      detailedDescription: 'Fluid accordion pleats with a subtle sheen, perfect for pairing with crop tops or blouses.',
      reviews: [],
      rating: 4.4,
      tags: ['featured']
    },
    {
      id: 204,
      name: 'Athletic Slim Fit Women Joggers',
      size: 'S',
      sizes: ['XS', 'S', 'M', 'L'],
      currentPrice: 15000,
      prevPrice: 18500,
      images: [
        'assets/img/header-img.png',
        'assets/img/krebers-1.png'
      ],
      category: 'Women',
      subCategory: 'Joggers',
      color: ['Navy', 'Black'],
      location: 'Lagos, Nigeria',
      qty: 9,
      description: 'Comfortable stretch cotton joggers for workouts or lounging.',
      detailedDescription: 'Soft French terry fabric with elastic cuffed ankles and deep side pockets.',
      reviews: [
        { user: 'Blessing C.', comment: 'So comfy and stylish!', rating: 4.7, date: 'Jul 1, 2026', verified: true }
      ],
      rating: 4.7,
      tags: ['featured']
    },
    {
      id: 205,
      name: 'Elegant Satin Blouse Top',
      size: 'L',
      sizes: ['S', 'M', 'L', 'XL'],
      currentPrice: 14000,
      prevPrice: 17000,
      images: [
        'assets/img/krebers.jpg',
        'assets/img/header-img.png'
      ],
      category: 'Women',
      subCategory: 'Tops',
      color: ['White', 'Beige'],
      location: 'Abuja, Nigeria',
      qty: 0, // Out of stock
      description: 'Silky smooth satin top with button cuffs.',
      detailedDescription: 'Lightweight fluid satin fabric with rounded neckline and button wrist cuffs.',
      reviews: [],
      rating: 4.2,
      tags: ['new']
    },
    {
      id: 301,
      name: 'Kids Graphic Organic Cotton Tee',
      size: 'S',
      sizes: ['S', 'M', 'L'],
      currentPrice: 7500,
      prevPrice: 9500,
      images: [
        'assets/img/header-img.png',
        'assets/img/krebers.jpg'
      ],
      category: 'Kids',
      subCategory: 'T-Shirts',
      color: ['Yellow', 'Blue'],
      location: 'Lagos, Nigeria',
      qty: 25,
      description: 'Fun play t-shirt made with 100% organic soft cotton.',
      detailedDescription: 'Bright graphic tee with non-toxic prints and tagless label for itch-free play time.',
      reviews: [
        { user: 'MamaTunde', comment: 'Very soft on skin, my son loves it.', rating: 5, date: 'Jul 19, 2026', verified: true }
      ],
      rating: 4.8,
      tags: ['new']
    },
    {
      id: 302,
      name: 'Kids Stretch Denim Shorts',
      size: 'M',
      sizes: ['S', 'M', 'L'],
      currentPrice: 9000,
      prevPrice: 11500,
      images: [
        'assets/img/krebers-1.png',
        'assets/img/header-img.png'
      ],
      category: 'Kids',
      subCategory: 'Shorts',
      color: ['Blue'],
      location: 'Port Harcourt, Nigeria',
      qty: 15,
      description: 'Durable stretch denim shorts with adjustable waistband.',
      detailedDescription: 'Classic 5-pocket denim shorts engineered for active kids with interior button elastic adjustments.',
      reviews: [],
      rating: 4.6,
      tags: ['top']
    },
    {
      id: 303,
      name: 'Kids Zip-Up Fleece Hoodie',
      size: 'L',
      sizes: ['S', 'M', 'L'],
      currentPrice: 13500,
      prevPrice: 16000,
      images: [
        'assets/img/krebers.jpg',
        'assets/img/krebers-1.png'
      ],
      category: 'Kids',
      subCategory: 'Hoodies',
      color: ['Red', 'Navy'],
      location: 'Lagos, Nigeria',
      qty: 11,
      description: 'Warm zip-front hoodie with soft fleece lining.',
      detailedDescription: 'Easy front zipper closure and split pouch pockets for school or outdoor adventures.',
      reviews: [],
      rating: 4.5,
      tags: ['featured']
    },
    {
      id: 304,
      name: 'Kids Party Tulle Princess Dress',
      size: 'S',
      sizes: ['S', 'M', 'L'],
      currentPrice: 18500,
      prevPrice: 22000,
      images: [
        'assets/img/header-img.png',
        'assets/img/krebers-1.png'
      ],
      category: 'Kids',
      subCategory: 'Dresses',
      color: ['Pink', 'White'],
      location: 'Lagos, Nigeria',
      qty: 7,
      description: 'Charming tulle party dress with satin sash for birthday celebrations.',
      detailedDescription: 'Breathable cotton lining beneath soft mesh tulle layers for comfort without irritation.',
      reviews: [],
      rating: 4.9,
      tags: ['new', 'top']
    }
  ];

  constructor() {
    this.loadStoredReviews();
  }

  private loadStoredReviews(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(this.REVIEWS_KEY);
        if (stored) {
          const map: { [productId: number]: Review[] } = JSON.parse(stored);
          Object.keys(map).forEach(idStr => {
            const id = Number(idStr);
            const prod = this.products.find(p => p.id === id);
            if (prod && map[id]) {
              // Prepend custom reviews
              prod.reviews = [...map[id], ...prod.reviews];
              this.recalculateRating(prod);
            }
          });
        }
      } catch (e) {
        console.error('Failed to load custom reviews from storage', e);
      }
    }
  }

  addReview(productId: number, newReview: Review): Product | undefined {
    const product = this.getProductById(productId);
    if (!product) return undefined;

    newReview.id = 'rev_' + Date.now();
    newReview.date = newReview.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    newReview.verified = true;

    product.reviews.unshift(newReview);
    this.recalculateRating(product);

    // Save to local storage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(this.REVIEWS_KEY);
        const map: { [id: number]: Review[] } = stored ? JSON.parse(stored) : {};
        map[productId] = map[productId] || [];
        map[productId].unshift(newReview);
        localStorage.setItem(this.REVIEWS_KEY, JSON.stringify(map));
      } catch (e) {
        console.error('Failed to save review to storage', e);
      }
    }

    return product;
  }

  private recalculateRating(product: Product): void {
    if (!product.reviews || product.reviews.length === 0) return;
    const total = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = Math.round((total / product.reviews.length) * 10) / 10;
  }

  getProducts(): Product[] {
    return [...this.products];
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  // Get unique subcategories based on optional category
  getSubCategories(category?: string): string[] {
    let prods = this.products;
    if (category) {
      prods = prods.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    const subcats = new Set<string>();
    prods.forEach(p => {
      if (p.subCategory) subcats.add(p.subCategory);
    });
    return Array.from(subcats).sort();
  }

  // Get all unique available colors
  getAllColors(): string[] {
    const colors = new Set<string>();
    this.products.forEach(p => {
      p.color?.forEach(c => colors.add(c));
    });
    return Array.from(colors).sort();
  }

  // Get all unique available sizes
  getAllSizes(): string[] {
    const sizes = new Set<string>();
    this.products.forEach(p => {
      if (p.size) sizes.add(p.size);
    });
    return Array.from(sizes);
  }
}


