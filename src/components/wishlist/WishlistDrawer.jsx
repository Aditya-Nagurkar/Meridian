import React from "react"
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { Drawer } from "../common/Drawer"
import { Button } from "../common/Button"
import { formatCurrency } from "../../lib/utils"

export function WishlistDrawer() {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    addToCart,
    setQuickViewProduct,
    recordProductView,
  } = useStore()

  const handleMoveToCart = (product) => {
    addToCart(product, 1)
    toggleWishlist(product)
  }

  const handleAddAllToCart = () => {
    wishlist.forEach((product) => {
      addToCart(product, 1)
    })
    setIsWishlistOpen(false)
  }

  return (
    <Drawer
      isOpen={isWishlistOpen}
      onClose={() => setIsWishlistOpen(false)}
      title="Saved Wishlist"
      countBadge={`${wishlist.length} saved`}
      subtitle="Items saved in your browser's LocalStorage"
      footer={
        wishlist.length > 0 ? (
          <div className="space-y-3">
            <Button
              onClick={handleAddAllToCart}
              className="w-full h-11 text-sm font-bold shadow-md"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              <span>Add All to Shopping Bag</span>
            </Button>
            <Button
              onClick={() => setIsWishlistOpen(false)}
              variant="outline"
              className="w-full text-xs"
            >
              Continue Browsing
            </Button>
          </div>
        ) : null
      }
    >
      {wishlist.length > 0 ? (
        <div className="divide-y divide-border/60">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="flex gap-4 py-4 items-center group"
            >
              <div
                onClick={() => {
                  recordProductView(product)
                  setQuickViewProduct(product)
                  setIsWishlistOpen(false)
                }}
                className="h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden bg-muted/30 border border-border cursor-pointer"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-mono text-muted-foreground block">
                  {product.category}
                </span>
                <h4
                  onClick={() => {
                    recordProductView(product)
                    setQuickViewProduct(product)
                    setIsWishlistOpen(false)
                  }}
                  className="text-sm font-semibold text-foreground truncate cursor-pointer hover:text-primary transition-colors"
                >
                  {product.name}
                </h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm font-bold text-foreground">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all active:scale-95"
                  >
                    <ShoppingBag className="h-3 w-3" />
                    <span>Move to Cart</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-muted transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-4">
            <Heart className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-foreground">Your wishlist is empty</h3>
          <p className="text-xs text-muted-foreground max-w-xs mt-1 mb-6">
            Tap the heart icon on any product to save your favorites for later.
          </p>
          <Button onClick={() => setIsWishlistOpen(false)} size="sm" variant="secondary">
            Discover Products
          </Button>
        </div>
      )}
    </Drawer>
  )
}
