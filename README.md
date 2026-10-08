# 🌐 MERIDIAN // Curated Modern Essentials & Electronics (Indian Market Edition)

A production-ready, fully responsive, and visually stunning luxury E-Commerce web application built with **React**, **Vite**, **Tailwind CSS**, **Lucide React**, **shadcn/ui**, and **React Bits**, tailored specifically for the **Indian consumer market**.

---

## 🌟 Table of Contents
1. [Project Overview](#project-overview)
2. [shadcn/ui & React Bits Integration](#shadcnui--react-bits-integration)
3. [Brand Identity: Golden Orbital M Emblem](#brand-identity-golden-orbital-m-emblem)
4. [Indian Market Tailoring & Features](#indian-market-tailoring--features)
5. [Key UI, Layout & Performance Upgrades](#key-ui-layout--performance-upgrades)
6. [Tech Stack & Dependencies](#tech-stack--dependencies)
7. [Project Directory & File Structure](#project-directory--file-structure)
8. [Complete File-by-File Breakdown](#complete-file-by-file-breakdown)
9. [Project Explanation Guide (For Presentations & Reviews)](#project-explanation-guide-for-presentations--reviews)
   - [Where each part comes from](#1-where-each-part-comes-from)
   - [How data flows between components](#2-how-data-flows-between-components)
   - [Why specific storage choices were made (LocalStorage vs. SessionStorage)](#3-why-specific-storage-choices-were-made)
   - [State management architecture & edge-case safety](#4-state-management-architecture--edge-case-safety)
10. [Getting Started & Local Development](#getting-started--local-development)

---

## 🚀 Project Overview

**MERIDIAN** is designed as a direct-to-consumer modern lifestyle & technology brand for India. The brand communicates precision, reliability, and modern aesthetic distinction.

The catalog focuses on high-demand, high-utility products thoughtfully engineered for Indian climates, daily urban commutes, and modern lifestyles:
- **Audio & Electronics:** 42dB Hybrid ANC True Wireless Earbuds with ENC for loud city commutes, 1.96" AMOLED calling smartwatches, 65% hot-swappable mechanical keyboards, and 3-in-1 fast wireless charging stations with BIS (Bureau of Indian Standards) compliance.
- **Footwear:** Breathable bio-knit runners engineered for hot climates and handcrafted Agra full-grain buff leather penny loafers.
- **Apparel:** 100% pure French linen mandarin collar shirts and 240 GSM bio-washed Supima cotton heavyweight t-shirts.
- **Bags & Accessories:** Weatherproof commuter backpacks with 16" laptop padding and vegetable-tanned genuine leather wallets sized specifically for Indian currency notes with RFID protection.

---

## 🎨 shadcn/ui & React Bits Integration

### How shadcn/ui and React Bits Work
Neither **shadcn/ui** nor **React Bits** are monolithic npm packages you `npm install shadcn`. Instead:
1. **shadcn/ui** is an open architecture built on top of **Radix UI primitives** (`@radix-ui/react-slot`, `@radix-ui/react-dialog`) and **class-variance-authority (`cva`)**. Components live in `src/components/ui/` giving you 100% ownership and zero third-party vendor lock-in.
2. **React Bits (`reactbits.dev`)** is an open-source library of micro-interaction components powered by **Framer Motion**, Canvas shaders, and Tailwind CSS. Components live in `src/components/reactbits/`.

### Components Integrated:
* **shadcn/ui Primitives (`src/components/ui/`):**
  - [`button.jsx`](file:///home/blaze/Documents/Ecom/src/components/ui/button.jsx): Uses Radix Slot (`asChild`), `cva` variants (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`), and built-in loading spinners.
  - [`badge.jsx`](file:///home/blaze/Documents/Ecom/src/components/ui/badge.jsx): Uses `cva` pill variants (`accent`, `warning`, `destructive`, `success`).
  - [`card.jsx`](file:///home/blaze/Documents/Ecom/src/components/ui/card.jsx): Standard Card header, title, description, content, and footer primitives.
* **React Bits Components (`src/components/reactbits/`):**
  - [`SpotlightCard.jsx`](file:///home/blaze/Documents/Ecom/src/components/reactbits/SpotlightCard.jsx): Tracks real-time mouse coordinates `(x, y)` to cast a golden ambient radial gradient glow over product cards.
  - [`ShinyText.jsx`](file:///home/blaze/Documents/Ecom/src/components/reactbits/ShinyText.jsx): Creates continuous metallic gradient shimmer waves across headlines.
  - [`AnimatedContent.jsx`](file:///home/blaze/Documents/Ecom/src/components/reactbits/AnimatedContent.jsx): Framer Motion spring physics entrance animation container.

---

## ⚜️ Brand Identity: Golden Orbital M Emblem

The project features the custom **Golden Orbital M Emblem** identity (`public/logo.png`) seamlessly integrated across the platform:
- **Browser Favicon:** Crisp high-resolution tab icon in `index.html`.
- **Header Brand Mark:** Positioned in `Navbar.jsx` with subtle hover scaling and elevation.
- **Collection Eyebrow:** Highlighted in the `Hero.jsx` collection badge.
- **Footer Monogram:** Anchoring brand trust in `Footer.jsx`.
- **Order Confirmation Seal:** Verified authenticity emblem in `CheckoutModal.jsx` upon successful order placement.

---

## 🇮🇳 Indian Market Tailoring & Features

### 1. Currency & Pricing Localization
- **Indian Rupee Standard (`₹`):** Formatted natively using `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })` (e.g., `₹2,499`, `₹14,999`).
- **GST Invoicing:** Displays estimated 18% Goods & Services Tax (GST) breakdown during cart and checkout reviews.
- **Free Pan-India Delivery:** Express shipping unlocked for orders over ₹1,499 (Standard delivery ₹99).

### 2. Payment Gateway Simulation (India Stack)
- **UPI Integration:** Supports Unified Payments Interface (Google Pay, PhonePe, Paytm, BHIM) with VPA/UPI ID entry and instant simulation.
- **RuPay & Cards:** Full support for domestic RuPay debit/credit cards alongside Visa and Mastercard.
- **Cash on Delivery (COD):** Doorstep cash or courier QR payment option with OTP verification notice.
- **Net Banking:** Support for major Indian banks (HDFC, ICICI, SBI, Axis).

### 3. Localization in Logistics & Addressing
- **Indian Address Fields:** 6-digit PIN code field, flat/house number, street/locality, city, and comprehensive state dropdown covering 16+ Indian states and union territories.
- **Courier Integration Notes:** Trust badges referencing express logistics partners (Blue Dart, Delhivery, DTDC).
- **Warranty & Quality Assurance:** Clear indicators for BIS certification, 1-Year Pan-India warranty support, and 7-Day doorstep exchange policies.

---

## ⚡ Key UI, Layout & Performance Upgrades

### 1. High-Visibility Spacious Search Bar
- **Wide Center Console:** Desktop search bar commands a generous `max-w-2xl` width in the header, ensuring long queries (*"noise cancelling earbuds"*, *"french linen shirt"*) are fully visible with clear typing cues, keyboard shortcut badge (`/`), and an instant clear button (`X`).
- **Dedicated Category Sub-Nav:** Category pills (`All Products`, `Electronics & Audio`, `Footwear & Sneakers`, `Apparel & Essentials`, `Bags & Accessories`) are positioned in a clean secondary navigation bar below the main header, eliminating layout crowding.
- **Mobile Full-Width Search:** Dedicated full-width input on mobile screens for effortless thumb access.

### 2. Mobile 2-Column Product Grid (`grid-cols-2`)
- **Smartphone E-Commerce Standard:** On mobile screens, products are displayed in a modern **2-column grid** (`grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6`) rather than oversized single blocks.
- **Proportionate Mobile Cards:** Compact padding (`p-2.5 sm:p-4`), micro-badges, clamped text, and streamlined add-to-cart buttons.

### 3. High-Performance Architecture
- **`useDeferredValue`:** Search query filtering runs concurrently with React 18's `useDeferredValue()`, keeping input typing responsive at 60fps.
- **Tokenized Search Index:** Pre-tokenized multi-field matching across titles, descriptions, categories, and technical specs.
- **`React.memo`:** Product cards are memoized to eliminate redundant re-renders when drawers, modals, or toasts trigger state updates.
- **Asynchronous Image Loading:** Images are loaded with `loading="lazy"` and `decoding="async"`.

---

## 🛠️ Tech Stack & Dependencies

| Package | Purpose |
| :--- | :--- |
| **React 18** | UI component architecture and state management (`useState`, `useEffect`, `useMemo`, `useCallback`, `useDeferredValue`, `useContext`) |
| **Vite 6** | Fast build tool and dev server with Hot Module Replacement (HMR) |
| **Tailwind CSS 3.4** | Utility-first styling, responsive grid, dark mode classes, and custom keyframes |
| **Framer Motion** | Spring physics animations powering React Bits components |
| **class-variance-authority** | Type-safe variant-based class composition powering shadcn/ui components |
| **@radix-ui/react-slot** | Polymorphic element composition (`asChild`) for shadcn/ui Buttons |
| **Lucide React** | Modern, clean iconography |
| **clsx & tailwind-merge** | Safe conditional class merging utility (`cn`) |
| **canvas-confetti** | High-performance canvas-based particle bursts for celebratory checkout confirmation |

---

## 📁 Project Directory & File Structure

```
Ecom/
├── public/
│   └── logo.png                   # Golden Orbital M Emblem brand asset
├── index.html                     # HTML5 template with Plus Jakarta Sans & Space Grotesk fonts
├── package.json                   # Project dependencies and npm scripts
├── postcss.config.js              # PostCSS pipeline for Tailwind and Autoprefixer
├── tailwind.config.js             # Tailwind design tokens, animations, and color variables
├── vite.config.js                 # Vite bundler configuration
├── README.md                      # Comprehensive project documentation
└── src/
    ├── main.jsx                   # React root bootstrap file
    ├── App.jsx                    # Root coordinator component with deferred filtering and modal mounting
    ├── index.css                  # Tailwind directives, CSS variables (shadcn theme), and utilities
    ├── lib/
    │   ├── utils.js               # Utility helpers: cn(), formatCurrency() [INR], generateOrderId()
    │   └── constants.js           # Categories, promo codes, shipping rates, GST, and Indian states
    ├── data/
    │   └── products.js            # Mock dataset of 12 curated products tailored for India
    ├── hooks/
    │   ├── useLocalStorage.js     # Custom hook for safe localStorage reads, writes, and cross-tab sync
    │   └── useSessionStorage.js   # Custom hook for tab-isolated sessionStorage reads and writes
    ├── context/
    │   ├── StoreContext.jsx       # Global application state (Cart, Wishlist, Filters, Toasts, Orders)
    │   └── ThemeContext.jsx       # Theme state provider (Dark/Light mode) with localStorage persistence
    └── components/
        ├── ui/                    # Official shadcn/ui Component Primitives
        │   ├── button.jsx         # Radix Slot + CVA Button with loading states
        │   ├── badge.jsx          # CVA Pill Indicator Badge
        │   └── card.jsx           # Card, CardHeader, CardTitle, CardContent, CardFooter
        ├── reactbits/             # Official React Bits Animation Components
        │   ├── SpotlightCard.jsx  # Mouse coordinate cursor-tracking radial glow card
        │   ├── ShinyText.jsx      # Continuous metallic shimmering text animation
        │   └── AnimatedContent.jsx# Framer Motion spring physics entrance wrapper
        ├── common/
        │   ├── Modal.jsx          # Accessible dialog with blur backdrop and ESC key listener
        │   ├── Drawer.jsx         # Slide-over panel component for Cart and Wishlist
        │   ├── StarRating.jsx     # Star rating component with partial star rendering
        │   └── Toast.jsx          # Animated floating notification toasts with auto-dismiss
        ├── layout/
        │   ├── AnnouncementBar.jsx# Top ticker bar with shipping goals and active discount hints
        │   ├── Navbar.jsx         # Wide search bar, Golden Orbital M Emblem, and category sub-nav
        │   ├── Hero.jsx           # Editorial hero banner with React Bits ShinyText & AnimatedContent
        │   ├── MobileNav.jsx      # Bottom dock navigation bar for mobile devices
        │   └── Footer.jsx         # Sleek footer with warranty guarantees, newsletter form, and links
        ├── products/
        │   ├── ProductCard.jsx    # Memoized SpotlightCard with image hover-zoom, wishlist, and add-to-cart
        │   ├── ProductGrid.jsx    # Responsive 2-column mobile and 4-column desktop grid
        │   ├── FilterBar.jsx      # Category pills, price slider (₹), in-stock toggle, and sort dropdown
        │   ├── QuickViewModal.jsx # Product inspection modal with gallery thumbnails and specs table
        │   └── RecentlyViewed.jsx # SessionStorage-powered recently viewed products section
        ├── cart/
        │   ├── CartDrawer.jsx     # Slide-over cart with free shipping bar, coupons, and checkout CTA
        │   └── CartItem.jsx       # Individual cart item row with variant options and quantity stepper
        ├── wishlist/
        │   └── WishlistDrawer.jsx # Slide-over wishlist with item list, move-to-cart, and clear options
        └── checkout/
            └── CheckoutModal.jsx  # Indian address form, UPI/Card/COD simulation, and confetti receipt
```

---

## 🔍 Complete File-by-File Breakdown

### Configuration & Assets
1. **`public/logo.png`**
   - The official Golden Orbital M Emblem brand asset for MERIDIAN, served directly at `/logo.png` across navigation, favicon, hero, footer, and checkout confirmation.
2. **`index.html`**
   - Loads Google Fonts (`Plus Jakarta Sans` and `Space Grotesk`), binds `<div id="root"></div>`, binds the `/logo.png` favicon, and defines the site title **"MERIDIAN // Curated Modern Essentials & Electronics"**.
3. **`package.json`**
   - Declares dependencies, scripts (`dev`, `build`, `preview`), and project metadata (`meridian-store`).
4. **`tailwind.config.js`**
   - Implements shadcn-compatible CSS variable tokens, custom keyframes (`slideUp`, `scaleIn`, `shimmer`), and enables dark mode.
5. **`src/index.css`**
   - Base CSS theme variables for light and dark modes, modern scrollbars, and utility classes (`.glass-header`, `.glass-card`).
6. **`src/main.jsx`**
   - Bootstraps the React DOM using `ReactDOM.createRoot` inside `<React.StrictMode>`.

### Utilities & Data
7. **`src/lib/utils.js`**
   - `formatCurrency(amount)`: Converts numeric values into Indian Rupee strings using `en-IN` format (e.g., `₹3,499`).
   - `generateOrderId()`: Produces random alphanumeric order tracking IDs with the `MRD-` prefix (e.g. `MRD-7K2X9P`).
   - `cn(...inputs)`: Safe Tailwind class name joining via `clsx` and `tailwind-merge`.
8. **`src/lib/constants.js`**
   - Defines `CATEGORIES`, `SORT_OPTIONS`, active `PROMO_CODES` (`INDIA20`, `FIRST10`, `FESTIVE500`), `FREE_SHIPPING_THRESHOLD` (₹1,499), `STANDARD_SHIPPING_COST` (₹99), `ESTIMATED_GST_RATE` (18%), and `INDIAN_STATES`.
9. **`src/data/products.js`**
   - Curated list of 12 high-demand products across Electronics, Footwear, Apparel, and Accessories with realistic Rupee prices, specs, BIS certification tags, and photography.

### Storage Hooks & State Management
10. **`src/hooks/useLocalStorage.js`**
    - Safe interface for `window.localStorage` with `try/catch` fallbacks, functional updates, and cross-tab event synchronization via `window.addEventListener('storage')`.
11. **`src/hooks/useSessionStorage.js`**
    - Interacts safely with `window.sessionStorage` for temporary, tab-scoped data.
12. **`src/context/ThemeContext.jsx`**
    - Manages dark and light modes, persists choice in `localStorage`, and handles OS system preference defaults.
13. **`src/context/StoreContext.jsx`**
    - Central hub combining cart, wishlist, recently viewed items, filter states, toast alerts, and completed order history.

### Components
14. **`src/components/ui/button.jsx`**: Official shadcn/ui Button using `@radix-ui/react-slot` and `class-variance-authority`.
15. **`src/components/ui/badge.jsx`**: Official shadcn/ui Badge using `class-variance-authority`.
16. **`src/components/ui/card.jsx`**: Official shadcn/ui Card primitives (`Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`).
17. **`src/components/reactbits/SpotlightCard.jsx`**: React Bits Spotlight Card that tracks cursor coordinates with dynamic radial gold illumination.
18. **`src/components/reactbits/ShinyText.jsx`**: React Bits continuous shimmering headline gradient wave.
19. **`src/components/reactbits/AnimatedContent.jsx`**: React Bits Framer Motion spring physics entrance container.
20. **`src/components/common/Modal.jsx`**: Accessible dialog container with backdrop blur and body scroll lock.
21. **`src/components/common/Drawer.jsx`**: Slide-over panel component from right edge.
22. **`src/components/common/StarRating.jsx`**: Star rating with fractional star rendering.
23. **`src/components/common/Toast.jsx`**: Floating animated notification toasts.
24. **`src/components/layout/AnnouncementBar.jsx`**: Top ribbon with shipping target and festive coupon prompts.
25. **`src/components/layout/Navbar.jsx`**: Wide search bar, Golden Orbital M Emblem, and category sub-nav.
26. **`src/components/layout/Hero.jsx`**: Editorial hero section with React Bits `ShinyText` and `AnimatedContent`.
27. **`src/components/layout/MobileNav.jsx`**: Bottom fixed dock navigation for mobile smartphones.
28. **`src/components/layout/Footer.jsx`**: Footer with courier partners, payment methods, and GST invoice info.
29. **`src/components/products/ProductCard.jsx`**: Memoized `SpotlightCard` with image zoom, wishlist heart, quick view, and add-to-cart button.
30. **`src/components/products/ProductGrid.jsx`**: Responsive 2-column mobile and 4-column desktop grid.
31. **`src/components/products/FilterBar.jsx`**: Filter controls with Rupee price range slider and sort dropdown.
32. **`src/components/products/QuickViewModal.jsx`**: Inspection modal with image gallery, specs, and variant selectors.
33. **`src/components/products/RecentlyViewed.jsx`**: Displays products inspected during the current browsing session.
34. **`src/components/cart/CartDrawer.jsx`**: Slide-over cart with free shipping bar, coupons, and checkout CTA.
35. **`src/components/cart/CartItem.jsx`**: Individual cart item row with quantity stepper.
36. **`src/components/wishlist/WishlistDrawer.jsx`**: Slide-over wishlist with move-to-cart actions.
37. **`src/components/checkout/CheckoutModal.jsx`**: Indian address validation, UPI/RuPay/COD payment options, and confetti celebration receipt.

---

## 🎓 Project Explanation Guide (For Presentations & Reviews)

### 1. Where each part comes from
- **Professional Brand Positioning:** **MERIDIAN** with the **Golden Orbital M Emblem**, communicating trust, precision, and longevity.
- **shadcn/ui Architecture:** Real headless Radix UI components (`@radix-ui/react-slot`) composed with `class-variance-authority` in `src/components/ui/`.
- **React Bits Micro-Interactions:** Mouse-tracking `SpotlightCard`, shimmering `ShinyText`, and Framer Motion spring physics via `AnimatedContent`.

### 2. How data flows between components
- Top-level `App.jsx` mounts `ThemeProvider` and `StoreProvider`.
- Components consume `useStore()` hook for read and dispatch operations.
- Dynamic filtering runs in `App.jsx` using `useMemo` and `useDeferredValue` over category, price, and tokenized query criteria.
- State is synchronized to browser storage using custom hooks (`useLocalStorage`, `useSessionStorage`).

### 3. Why specific storage choices were made

| Feature | Storage Choice | Architectural Rationale |
| :--- | :--- | :--- |
| **Shopping Cart** | `localStorage` | **High Purchase Intent.** Customer cart items persist across accidental tab closures, reloads, and returning visits. |
| **Wishlist** | `localStorage` | **Long-Term Collection.** Saved items remain preserved across days and weeks until explicitly removed. |
| **Order Receipts** | `localStorage` | **Order Verification.** Users can retain simulated order records and transaction IDs locally. |
| **Recently Viewed** | `sessionStorage` | **Session-Scoped Journey.** Automatically cleared when the browser tab is closed to prevent unbounded storage bloat and protect privacy. |
| **Active Filters** | `sessionStorage` | **Navigation Comfort Without Stale Traps.** Users retain filter context upon accidental page refresh without locking new browser windows into old search states. |

---

## 💻 Getting Started & Local Development

1. Navigate to the project root:
   ```bash
   cd /home/blaze/Documents/Ecom
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview the production build:
   ```bash
   npm run preview
   ```

---

## 🏷️ Test Coupons for Evaluation
- `INDIA20`: 20% festive discount on all orders
- `FIRST10`: 10% welcome discount
- `FESTIVE500`: Flat ₹500 off on orders above ₹2,999
