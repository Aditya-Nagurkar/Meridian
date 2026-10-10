import React, { useState, memo } from "react"
import { Eye, Heart, ShoppingBag, Check, Plus, Minus } from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { Badge } from "../ui/badge"
import { Card } from "../ui/card"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "../ui/hover-card"
import { StarRating } from "../common/StarRating"
import { formatCurrency, cn, handleImageFallback } from "../../lib/utils"

function ProductCardComponent({ product }) {
  const {
    cart,
    addToCart,
    updateCartQuantity,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    recordProductView,
  } = useStore()

  const [isAddedRecently, setIsAddedRecently] = useState(false)
  const isWishlisted = isInWishlist(product.id)

  // Calculate total quantity of this product currently in cart
  const cartItems = (cart || []).filter((item) => String(item.productId) === String(product.id))
  const quantityInCart = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  const handleOpenQuickView = () => {
    recordProductView(product)
    setQuickViewProduct(product)
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    if (product.stock === 0) return
    addToCart(product, 1)
    setIsAddedRecently(true)
    setTimeout(() => setIsAddedRecently(false), 1400)
  }

  const handleIncrement = (e) => {
    e.stopPropagation()
    if (quantityInCart >= product.stock) return
    if (cartItems.length > 0) {
      const item = cartItems[0]
      updateCartQuantity(item.cartItemId, item.quantity + 1)
    } else {
      addToCart(product, 1)
    }
  }

  const handleDecrement = (e) => {
    e.stopPropagation()
    if (cartItems.length > 0) {
      const item = cartItems[cartItems.length - 1]
      updateCartQuantity(item.cartItemId, item.quantity - 1)
    }
  }

  const handleToggleWishlist = (e) => {
    e.stopPropagation()
    toggleWishlist(product)
  }

  return (
    <Card
      onClick={handleOpenQuickView}
      className="group flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/40 cursor-pointer p-0"
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
          {quantityInCart > 0 && (
            <Badge
              variant="default"
              className="text-[9px] sm:text-xs px-1.5 py-0.5 sm:px-2 bg-emerald-600 text-white border-0 shadow-sm font-mono font-bold animate-scale-in"
            >
              {quantityInCart} in Cart
            </Badge>
          )}
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
            {product.categoryLabel || product.category}
          </span>
          <StarRating rating={product.rating} reviewsCount={product.reviewsCount} size="xs" showScore={false} />
        </div>

        {/* Product Name with shadcn HoverCard */}
        <HoverCard openDelay={250} closeDelay={150}>
          <HoverCardTrigger asChild>
            <h3 className="font-semibold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1 leading-snug">
              {product.name}
            </h3>
          </HoverCardTrigger>
          <HoverCardContent className="w-72 p-3 text-xs" side="top">
            <div className="flex gap-2.5 items-start">
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-12 w-12 rounded-lg object-cover border border-border flex-shrink-0"
              />
              <div className="space-y-1 min-w-0 flex-1">
                <h4 className="font-bold text-foreground text-xs truncate">{product.name}</h4>
                <p className="text-[11px] text-muted-foreground line-clamp-2">{product.tagline}</p>
                <div className="flex items-center gap-2 pt-1 font-mono text-[10px]">
                  <span className="font-bold text-foreground">{formatCurrency(product.price)}</span>
                  <span className="text-emerald-600 dark:text-emerald-400">✓ In Stock ({product.stock})</span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>

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

          {quantityInCart > 0 ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center border border-primary/30 bg-primary/5 dark:bg-primary/10 rounded-lg sm:rounded-xl overflow-hidden h-7 sm:h-8 flex-shrink-0 shadow-sm transition-all animate-scale-in"
            >
              <button
                onClick={handleDecrement}
                className="h-full px-2 sm:px-2.5 flex items-center justify-center text-foreground hover:bg-primary/15 transition-colors active:scale-90"
                aria-label={`Decrease quantity of ${product.name}`}
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="min-w-[1.25rem] sm:min-w-[1.5rem] text-center text-xs font-bold font-mono text-primary px-0.5 select-none">
                {quantityInCart}
              </span>
              <button
                onClick={handleIncrement}
                disabled={quantityInCart >= product.stock}
                className={cn(
                  "h-full px-2 sm:px-2.5 flex items-center justify-center text-foreground hover:bg-primary/15 transition-colors active:scale-90",
                  quantityInCart >= product.stock && "opacity-35 cursor-not-allowed hover:bg-transparent"
                )}
                aria-label={`Increase quantity of ${product.name}`}
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={cn(
                "flex items-center justify-center p-1.5 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 shadow-sm flex-shrink-0",
                product.stock === 0
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : isAddedRecently
                  ? "bg-emerald-600 text-white"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              aria-label={`Add ${product.name} to cart`}
            >
              {product.stock === 0 ? (
                <span className="text-[10px] sm:text-xs">Out of Stock</span>
              ) : isAddedRecently ? (
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
          )}
        </div>
      </div>
    </Card>
  )
}

export const ProductCard = memo(ProductCardComponent)

