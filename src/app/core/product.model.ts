export interface Review {
  id?: string;
  user: string;
  email?: string;
  comment: string;
  rating: number;
  date?: string;
  photoUrl?: string;
  verified?: boolean;
}

export interface Product {
  id: number;
  name: string;
  size: string;
  currentPrice: number;
  prevPrice: number;
  images: string[];
  category: 'Men' | 'Women' | 'Kids';
  subCategory: string;
  color: string[];
  location: string;
  qty: number;
  description: string;
  detailedDescription: string;
  reviews: Review[];
  rating: number;
  tags: ('new' | 'featured' | 'top')[];
}
