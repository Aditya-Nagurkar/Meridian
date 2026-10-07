import React from "react"
import { Home, Compass, Heart, ShoppingBag } from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { cn } from "../../lib/utils"

export function MobileNav({ onScrollToCatalog }) {
  const { cartCount, wishlistCount, setIsCartOpen, setIsWishlistOpen } = useStore()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-lg border-t border-border px-4 py-2 sm:hidden safe-area-pb">
      <div className="flex items-center justify-around">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" })
          }}
          className="flex flex-col items-center gap-1 p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        <button
          onClick={onScrollToCatalog}
          className="flex flex-col items-center gap-1 p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Compass className="h-5 w-5" />
          <span className="text-[10px] font-medium">Explore</span>
        </button>

        <button
          onClick={() => setIsWishlistOpen(true)}
          className="relative flex flex-col items-center gap-1 p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <div className="relative">
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 h-4 w-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Wishlist</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-1 p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Cart</span>
        </button>
      </div>
    </nav>
  )
}
