import React, { useMemo, useRef } from "react"
import { PRODUCTS } from "./data/products"
import { StoreProvider, useStore } from "./context/StoreContext"
import { ThemeProvider } from "./context/ThemeContext"
import { AnnouncementBar } from "./components/layout/AnnouncementBar"
import { Navbar } from "./components/layout/Navbar"
import { Hero } from "./components/layout/Hero"
import { FilterBar } from "./components/products/FilterBar"
import { ProductGrid } from "./components/products/ProductGrid"
import { RecentlyViewed } from "./components/products/RecentlyViewed"
import { QuickViewModal } from "./components/products/QuickViewModal"
import { CartDrawer } from "./components/cart/CartDrawer"
import { WishlistDrawer } from "./components/wishlist/WishlistDrawer"
import { CheckoutModal } from "./components/checkout/CheckoutModal"
import { MobileNav } from "./components/layout/MobileNav"
import { Footer } from "./components/layout/Footer"
import { ToastContainer } from "./components/common/Toast"

function StoreContent() {
  const { filters } = useStore()
  const catalogRef = useRef(null)

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Filter & sort products with React useMemo
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (filters.category !== "all" && product.category !== filters.category) {
        return false
      }

      // Max price filter
      if (product.price > filters.maxPrice) {
        return false
      }

      // In stock filter
      if (filters.inStockOnly && product.stock <= 0) {
        return false
      }

      // Search query filter (matches name, description, category, and specs)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim()
        const matchesName = product.name.toLowerCase().includes(query)
        const matchesTagline = product.tagline.toLowerCase().includes(query)
        const matchesDesc = product.description.toLowerCase().includes(query)
        const matchesCategory = product.category.toLowerCase().includes(query)
        const matchesSpecs = product.specs?.some(
          (s) => s.label.toLowerCase().includes(query) || s.value.toLowerCase().includes(query)
        )
        if (!matchesName && !matchesTagline && !matchesDesc && !matchesCategory && !matchesSpecs) {
          return false
        }
      }

      return true
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "rating-desc":
          return b.rating - a.rating
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "featured":
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      }
    })
  }, [filters])

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans transition-colors">
      <AnnouncementBar />
      <Navbar onOpenFilterMobile={scrollToCatalog} />

      <main className="flex-1">
        <Hero onExploreClick={scrollToCatalog} />

        <div ref={catalogRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          <FilterBar totalResults={filteredProducts.length} />
          <ProductGrid products={filteredProducts} />
          <RecentlyViewed />
        </div>
      </main>

      <Footer />

      {/* Floating & Slide-Over Interactive Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <QuickViewModal />
      <CheckoutModal />
      <ToastContainer />
      <MobileNav onScrollToCatalog={scrollToCatalog} />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <StoreContent />
      </StoreProvider>
    </ThemeProvider>
  )
}
