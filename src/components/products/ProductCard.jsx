import React, { useState } from "react"
import { Eye, Heart, ShoppingBag, Check } from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { Badge } from "../common/Badge"
import { StarRating } from "../common/StarRating"
import { formatCurrency, cn } from "../../lib/utils"

export function ProductCard({ product }) {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    recordProductView,
  } = useStore()

  const [isAddedRecently, setIsAddedRecently] = useState(false)
  const isWishlisted = isInWishlist(product.id)

  const handleOpenQuickView = () => {
    recordProductView(product)
    setQuickViewProduct(product)
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart(product, 1)
    setIsAddedRecently(true)
    setTimeout(() => setIsAddedRecently(false), 1600)
  }

  const handleToggleWishlist = (e) => {
    e.stopPropagation()
    toggleWishlist(product)
  }

  return (
    <div
      onClick={handleOpenQuickView}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-xl hover:border-primary/30 cursor-pointer"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted/40">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.badge && (
            <Badge variant={product.badgeType || "default"} className="shadow-sm backdrop-blur-md">
              {product.badge}
            </Badge>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <Badge variant="destructive" className="shadow-sm">
              Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </Badge>
          )}
        </div>

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-200 active:scale-90 shadow-sm",
            isWishlisted
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-white/80 dark:bg-black/60 text-muted-foreground hover:text-red-500 hover:bg-white dark:hover:bg-black/90"
          )}
        >
          <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
        </button>

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleOpenQuickView()
            }}
            className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-background/90 text-foreground text-xs font-semibold backdrop-blur-md shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 hover:bg-background"
          >
            <Eye className="h-3.5 w-3.5" />
            Quick Inspect
          </button>
        </div>

        {/* Stock status indicator pill */}
        {product.stock <= 5 && (
          <div className="absolute bottom-2.5 left-2.5 z-10 bg-black/75 backdrop-blur text-[10px] text-amber-300 px-2 py-0.5 rounded-md font-mono font-medium">
            🔥 Only {product.stock} left
          </div>
        )}
      </div>

      {/* Product Details Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
          <span className="uppercase tracking-wider font-mono text-[11px] font-medium">
            {product.category}
          </span>
          <StarRating rating={product.rating} reviewsCount={product.reviewsCount} size="xs" />
        </div>

        <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">
          {product.name}
        </h3>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {product.tagline}
        </p>

        {/* Price and Add to Cart Row */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/60">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 shadow-sm",
              isAddedRecently
                ? "bg-emerald-600 text-white shadow-emerald-500/20"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            aria-label="Add to cart"
          >
            {isAddedRecently ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
