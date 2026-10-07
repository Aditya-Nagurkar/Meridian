import React, { useState, useRef, useEffect } from "react"
import { Search, ShoppingBag, Heart, Sun, Moon, Menu, X, ArrowRight, Layers, SlidersHorizontal } from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { useTheme } from "../../context/ThemeContext"
import { CATEGORIES } from "../../lib/constants"
import { formatCurrency, cn } from "../../lib/utils"

export function Navbar({ onOpenFilterMobile }) {
  const {
    cartCount,
    subtotal,
    wishlistCount,
    setIsCartOpen,
    setIsWishlistOpen,
    filters,
    updateFilter,
    resetFilters,
  } = useStore()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const searchInputRef = useRef(null)

  // Keyboard shortcut listener: pressing '/' focuses the search bar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 glass-header transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                resetFilters()
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black tracking-tighter shadow-md group-hover:scale-105 transition-transform duration-200">
                <span className="text-lg">A</span>
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-foreground font-['Space_Grotesk']">
                  AURA
                </span>
                <span className="text-[10px] tracking-widest text-muted-foreground uppercase font-mono block -mt-1">
                  Atelier
                </span>
              </div>
            </button>

            {/* Desktop Category Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {CATEGORIES.map((cat) => {
                const isActive = filters.category === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => updateFilter("category", cat.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-secondary text-foreground font-semibold shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {cat.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Live Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search premium products, specs, gear... (Press '/')"
                value={filters.searchQuery}
                onChange={(e) => updateFilter("searchQuery", e.target.value)}
                className="w-full pl-10 pr-9 py-2 rounded-xl text-sm bg-muted/60 border border-border/80 text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
              />
              {filters.searchQuery ? (
                <button
                  onClick={() => updateFilter("searchQuery", "")}
                  className="absolute right-3 text-muted-foreground hover:text-foreground p-0.5 rounded-md"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <kbd className="absolute right-3 hidden xl:inline-flex items-center rounded border border-border bg-card px-1.5 font-mono text-[10px] text-muted-foreground font-semibold">
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              aria-label="Toggle color theme"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Wishlist Trigger */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 sm:p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              aria-label="View wishlist"
              title="Saved Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 min-w-[1rem] px-1 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center animate-scale-in">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 pl-2.5 pr-3 py-2 sm:py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 shadow-md group"
              aria-label="Open shopping cart"
            >
              <div className="relative">
                <ShoppingBag className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-4 min-w-[1rem] px-1 rounded-full bg-amber-400 text-[10px] font-black text-black flex items-center justify-center animate-scale-in">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-semibold text-xs tracking-wide">
                {subtotal > 0 ? formatCurrency(subtotal) : "Cart"}
              </span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Row (visible on small screens) */}
        <div className="py-2.5 pb-3 md:hidden">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter("searchQuery", e.target.value)}
              className="w-full pl-10 pr-9 py-2 rounded-xl text-sm bg-muted/60 border border-border/80 text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {filters.searchQuery && (
              <button
                onClick={() => updateFilter("searchQuery", "")}
                className="absolute right-3 text-muted-foreground p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card px-4 pt-4 pb-6 space-y-3 animate-slide-down">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2">
            Categories
          </p>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = filters.category === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    updateFilter("category", cat.id)
                    setMobileMenuOpen(false)
                  }}
                  className={cn(
                    "flex items-center justify-between p-2.5 rounded-xl text-sm font-medium text-left transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-secondary/60 text-foreground hover:bg-secondary"
                  )}
                >
                  <span>{cat.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-60" />
                </button>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}
