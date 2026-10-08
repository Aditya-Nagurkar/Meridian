import React, { useState, memo } from "react"
import { Eye, Heart, ShoppingBag, Check } from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { Badge } from "../ui/badge"
import { SpotlightCard } from "../reactbits/SpotlightCard"
import { StarRating } from "../common/StarRating"
import { formatCurrency, cn, handleImageFallback } from "../../lib/utils"

function ProductCardComponent({ product }) {
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
    <SpotlightCard
      onClick={handleOpenQuickView}
      spotlightColor="rgba(234, 179, 8, 0.18)"
      className="group flex flex-col transition-all duration-300 hover:shadow-xl hover:border-primary/30 cursor-pointer"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted/40">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          decoding="async"
          onError={handleImageFallback}
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {product.badge && (
            <Badge
              variant={product.badgeType || "default"}
              className="text-[9px] sm:text-xs px-1.5 py-0.5 sm:px-2.5 shadow-sm backdrop-blur-md"
            >
              {product.badge}
            </Badge>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <Badge
              variant="destructive"
              className="text-[9px] sm:text-xs px-1.5 py-0.5 sm:px-2 shadow-sm"
            >
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
            </Badge>
          )}
        </div>

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all duration-200 active:scale-90 shadow-sm",
            isWishlisted
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-white/80 dark:bg-black/60 text-muted-foreground hover:text-red-500 hover:bg-white dark:hover:bg-black/90"
          )}
        >
          <Heart className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", isWishlisted && "fill-current")} />
        </button>

        {/* Desktop Quick View Overlay */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleOpenQuickView()
            }}
            className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background/90 text-foreground text-xs font-semibold backdrop-blur-md shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200 hover:bg-background"
          >
            <Eye className="h-3.5 w-3.5" />
            Quick View
          </button>
        </div>

        {/* Stock warning pill */}
        {product.stock <= 6 && (
          <div className="absolute bottom-1.5 left-1.5 sm:bottom-2.5 sm:left-2.5 z-10 bg-black/80 backdrop-blur text-[8px] sm:text-[10px] text-amber-300 px-1.5 py-0.5 rounded font-mono font-medium">
            🔥 {product.stock} left
          </div>
        )}
      </div>

      {/* Product Card Content */}
      <div className="flex flex-1 flex-col p-2.5 sm:p-4">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground mb-1 gap-1">
          <span className="uppercase tracking-wider font-mono text-[9px] sm:text-[11px] truncate">
            {product.category}
          </span>
          <StarRating rating={product.rating} reviewsCount={product.reviewsCount} size="xs" showScore={false} />
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1 leading-snug">
          {product.name}
        </h3>

        {/* Product Tagline (desktop only) */}
        <p className="text-[11px] text-muted-foreground line-clamp-1 mb-2 hidden sm:block">
          {product.tagline}
        </p>

        {/* Price & Action Row */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/60 gap-1.5">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5">
            <span className="text-xs sm:text-base font-bold text-foreground">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[9px] sm:text-xs text-muted-foreground line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={cn(
              "flex items-center justify-center p-1.5 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 shadow-sm flex-shrink-0",
              isAddedRecently
                ? "bg-emerald-600 text-white"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            aria-label={`Add ${product.name} to cart`}
          >
            {isAddedRecently ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span className="hidden sm:inline sm:ml-1">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" />
                <span className="hidden sm:inline sm:ml-1">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </SpotlightCard>
  )
}

export const ProductCard = memo(ProductCardComponent)

