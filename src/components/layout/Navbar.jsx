import React, { useRef, useEffect } from "react"
import { Search, ShoppingBag, Heart, Sun, Moon, X, Sparkles } from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { useTheme } from "../../context/ThemeContext"
import { CATEGORIES } from "../../lib/constants"
import { formatCurrency, cn } from "../../lib/utils"
import { UserMenu } from "../auth/UserMenu"

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
      {/* Top Primary Bar: Brand + Spacious Search Bar + Actions */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3 sm:gap-6">
          {/* Brand Logo & Monogram */}
          <button
            onClick={() => {
              resetFilters()
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
            className="flex items-center gap-2.5 text-left group focus:outline-none flex-shrink-0"
            aria-label="Meridian Home"
          >
            <img
              src="/logo.png"
              alt="Meridian Golden Orbital Emblem"
              className="h-10 w-10 sm:h-11 sm:w-11 object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-200"
            />
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground font-['Space_Grotesk'] block leading-none">
                MERIDIAN
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-widest text-muted-foreground uppercase font-mono block mt-0.5">
                Essentials
              </span>
            </div>
          </button>

          {/* Wide, Prominent Desktop Search Bar */}
          <div className="flex-1 max-w-2xl mx-2 hidden sm:block">
            <div className="relative flex items-center w-full">
              <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products, earbuds, linen, sneakers, specs... (Press '/')"
                value={filters.searchQuery}
                onChange={(e) => updateFilter("searchQuery", e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-muted/60 border border-border/80 text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all shadow-inner"
              />
              {filters.searchQuery ? (
                <button
                  onClick={() => updateFilter("searchQuery", "")}
                  className="absolute right-3 text-muted-foreground hover:text-foreground p-1 rounded-md"
                  aria-label="Clear search query"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <kbd className="absolute right-3 hidden lg:inline-flex items-center rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground font-semibold">
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* Right Action Icons: Auth, Theme, Wishlist, Cart */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            {/* User Account / Sign In */}
            <UserMenu />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              aria-label="Toggle dark/light theme"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Wishlist Trigger */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 sm:p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              aria-label="Open wishlist"
              title="Saved Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 min-w-[1rem] px-1 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center animate-scale-in">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
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
          </div>
        </div>

        {/* Mobile Full-Width Search Input */}
        <div className="pb-3 pt-1 sm:hidden">
          <div className="relative flex items-center w-full">
            <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search products, brands, gear..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter("searchQuery", e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm bg-muted/70 border border-border text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {filters.searchQuery && (
              <button
                onClick={() => updateFilter("searchQuery", "")}
                className="absolute right-3 text-muted-foreground p-1"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Category Sub-Nav Bar (Clean & Dedicated) */}
      <div className="hidden sm:block border-t border-border/50 bg-card/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 py-2 overflow-x-auto scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = filters.category === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => updateFilter("category", cat.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}
