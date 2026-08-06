# Krebers — Modern Online Fashion E-Commerce Web Application

> **Repository Description:**  
> *Krebers is a full-featured, responsive online fashion e-commerce application built with Angular and Bootstrap. It features comprehensive collections for Men, Women, and Kids, interactive shopping cart and wishlist management, real-time product filtering, quick view modals, responsive layouts, and seamless dark mode support.*

---

## 🛍️ About Krebers

**Krebers** is a modern e-commerce web platform designed for fashion retail. It offers a seamless shopping experience for apparel across multiple categories including Men's, Women's, and Kids' fashion collections.

---

## ✨ Key Features

- 👗 **Multi-Category Fashion Catalog**:
  - **Men's Section**: Hoodies, Shirts, T-Shirts, Pants, Native Attire.
  - **Women's Section**: Hoodies, Tops, Skirts, Gowns, Joggers.
  - **Kids' Section**: Hoodies, T-Shirts, Shorts, Dresses, Native Wear.
- 🛒 **Interactive Shopping Cart & Checkout**:
  - Add, update quantity, or remove items with instant cart total calculations.
  - Real-time stock availability badges (In Stock / Out of Stock).
- ❤️ **Wishlist Management**:
  - Quick heart toggle to save favorite items for later viewing.
- 🔍 **Product Discovery & Quick View**:
  - Quick View overlay modal for instant product inspections.
  - Filter by size, color, subcategory, price, and tags (`New`, `Top Rated`, `Sale`).
- 🌓 **Dark Mode Support**:
  - Smooth theme toggling with custom dark palette styling across all cards, navigation, and modals.
- 📱 **Responsive & Accessible Design**:
  - Desktop-first and mobile-optimized layouts powered by Bootstrap grid and standard CSS animations.

---

## 🛠️ Tech Stack

- **Frontend Framework**: Angular 16+
- **Languages**: TypeScript, HTML5, CSS3 / SASS
- **UI & Iconography**: Bootstrap 5, FontAwesome Icons
- **State & Data**: Angular Reactive Services, RxJS, LocalStorage persistence

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or `ng` CLI

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/krebers.html
   cd krebers
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000/` or `http://localhost:4200/`.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📁 Directory Structure

```text
src/
├── app/
│   ├── pages/            # Page components (Home, Cart, Checkout, Wishlist, Categories)
│   ├── shared/           # Shared UI components (Header, Footer, QuickView Modal)
│   ├── services/         # Angular services (Cart, Wishlist, Product Catalog)
│   ├── app.routes.ts     # Application routing configuration
│   └── app.ts            # Root application component
├── assets/               # Static assets, images, and global CSS stylesheets
└── styles.css            # Global application styles and dark mode rules
```

---

## 📝 License

This project is licensed under the MIT License.

