import React, { useMemo, useRef, useDeferredValue, useEffect } from "react"
import { AlertCircle } from "lucide-react"
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
import { AuthModal } from "./components/auth/AuthModal"
import { AccountModal } from "./components/auth/AccountModal"
import { MobileNav } from "./components/layout/MobileNav"
import { Footer } from "./components/layout/Footer"
import { ToastContainer } from "./components/common/Toast"
import { Spinner } from "./components/ui/spinner"
import { Button } from "./components/ui/button"

function StoreContent() {
  const { products, isLoadingProducts, productsError, fetchProducts, filters } = useStore()
  const catalogRef = useRef(null)

  // Fetch live products from DummyJSON API on mount
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Performance optimization: useDeferredValue keeps input typing silky smooth at 60fps
  const deferredSearchQuery = useDeferredValue(filters.searchQuery)

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Pre-compile search tokens for fast matching
  const queryTokens = useMemo(() => {
    if (!deferredSearchQuery.trim()) return []
    return deferredSearchQuery.toLowerCase().trim().split(/\s+/)
  }, [deferredSearchQuery])

  // Filter & sort dynamic products with React useMemo & deferred search query
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return []

    return products
      .filter((product) => {
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

        // High-performance tokenized multi-field search
        if (queryTokens.length > 0) {
          const searchableContent = `${product.name} ${product.tagline} ${product.description} ${product.category} ${
            product.rawCategory || ""
          } ${product.brand || ""} ${
            product.specs ? product.specs.map((s) => `${s.label} ${s.value}`).join(" ") : ""
          }`.toLowerCase()

          const matchesAllTokens = queryTokens.every((token) => searchableContent.includes(token))
          if (!matchesAllTokens) return false
        }

        return true
      })
      .sort((a, b) => {
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
  }, [products, filters.category, filters.maxPrice, filters.inStockOnly, filters.sortBy, queryTokens])

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans transition-colors">
      <AnnouncementBar />
      <Navbar onOpenFilterMobile={scrollToCatalog} />

      <main className="flex-1">
        <Hero onExploreClick={scrollToCatalog} />

        <div ref={catalogRef} className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-14 sm:pb-16">
          <FilterBar totalResults={filteredProducts.length} />

          {/* Dynamic Loading State from DummyJSON */}
          {isLoadingProducts && products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Spinner size="lg" className="text-primary mb-4" />
              <h3 className="text-base font-bold text-foreground font-['Space_Grotesk']">
                Fetching Products from DummyJSON...
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Loading authentic live catalog with real images, specs, and pricing.
              </p>
            </div>
          ) : productsError && products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="p-3.5 rounded-2xl bg-destructive/10 text-destructive mb-3">
                <AlertCircle className="h-8 w-8 mx-auto" />
              </div>
              <h3 className="text-base font-bold text-foreground font-['Space_Grotesk']">
                Failed to Load Products
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mb-4">
                {productsError}
              </p>
              <Button onClick={() => fetchProducts()} size="sm" variant="outline">
                Retry Connection
              </Button>
            </div>
          ) : (
            <>
              <ProductGrid products={filteredProducts} />
              <RecentlyViewed />
            </>
          )}
        </div>
      </main>

      <Footer />

      {/* Floating & Slide-Over Interactive Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <QuickViewModal />
      <CheckoutModal />
      <AuthModal />
      <AccountModal />
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
