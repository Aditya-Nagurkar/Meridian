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
      className="group flex flex-col overflow-hidden transition-all duration-300 hover:shadow-[0_20px_45px_-12px_rgba(180,130,50,0.2)] hover:border-amber-600/50 dark:hover:border-primary/50 cursor-pointer p-0 bg-card text-card-foreground border border-border/90 rounded-2xl shadow-[0_4px_20px_-4px_rgba(90,70,40,0.05)]"
    >
      {/* Product Image Frame on Warm Sculptural Pedestal */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F2EBE0] dark:bg-[#18181C] border-b border-[#E8DEC9] dark:border-border/60 p-3 sm:p-4">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          decoding="async"
          onError={handleImageFallback}
          className="h-full w-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {quantityInCart > 0 && (
            <span className="text-[9px] sm:text-[10px] px-2 py-0.5 bg-emerald-600 text-white rounded-lg shadow-sm font-mono font-bold animate-scale-in">
              {quantityInCart} in Cart
            </span>
          )}
          {/* Status or Discount Badge */}
          {(product.discountPercent && product.discountPercent > 0) ||
          (product.originalPrice && product.originalPrice > product.price) ? (
            <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-lg font-bold bg-[#FDF1EB] text-[#C2522C] border border-[#F7D4C6] shadow-sm">
              {product.discountPercent ||
                Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </span>
          ) : product.badge ? (
            <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-lg font-bold bg-[#241A14] text-[#FAF5ED] border border-amber-500/25 shadow-sm">
              {product.badge}
            </span>
          ) : null}
        </div>

        {/* Wishlist Button (Circular Floating Button matching Image 2) */}
        <button
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 h-7 w-7 sm:h-8 sm:w-8 rounded-full transition-all duration-200 active:scale-90 shadow-sm border flex items-center justify-center",
            isWishlisted
              ? "bg-red-500 text-white border-red-500 shadow-md"
              : "bg-[#FDFBF7]/95 dark:bg-card/90 text-[#7A695C] dark:text-neutral-300 border-[#E2D6C0] dark:border-border hover:text-red-500 hover:border-red-300"
          )}
        >
          <Heart className={cn("h-3.5 w-3.5", isWishlisted && "fill-current")} />
        </button>

        {/* Stock warning pill */}
        {product.stock <= 6 && (
          <div className="absolute bottom-2 left-2 z-10 bg-[#241A14]/90 backdrop-blur text-[8px] sm:text-[10px] text-amber-300 px-1.5 py-0.5 rounded-md font-mono font-medium border border-amber-500/30">
            🔥 {product.stock} left
          </div>
        )}
      </div>

      {/* Product Card Content */}
      <div className="flex flex-1 flex-col p-3 sm:p-4 bg-card">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground mb-1 gap-1">
          <span className="uppercase tracking-wider font-mono text-[9px] sm:text-[10px] font-bold text-[#956E2C] dark:text-amber-400/80 truncate">
            {product.categoryLabel || product.category}
          </span>
          <StarRating rating={product.rating} reviewsCount={product.reviewsCount} size="xs" showScore={false} />
        </div>

        {/* Product Name with HoverCard */}
        <HoverCard openDelay={250} closeDelay={150}>
          <HoverCardTrigger asChild>
            <h3 className="font-bold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1 leading-snug">
              {product.name}
            </h3>
          </HoverCardTrigger>
          <HoverCardContent className="w-72 p-3 text-xs" side="top">
            <div className="flex gap-2.5 items-start">
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-12 w-12 rounded-lg object-contain p-1 border border-border flex-shrink-0 bg-muted/30"
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

        {/* Brand & Stock Status */}
        <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mb-2 truncate">
          <span>{product.brand || "Meridian"}</span>
          <span className="opacity-30">•</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">In Stock</span>
        </p>

        {/* Price & Action Row */}
        <div className="mt-auto flex flex-wrap items-center justify-between pt-2 border-t border-border/60 gap-y-1.5 gap-x-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5 min-w-0 flex-shrink">
            <span className="text-xs sm:text-base font-extrabold text-foreground font-mono truncate">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[9px] sm:text-xs text-muted-foreground line-through truncate font-mono">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {quantityInCart > 0 ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center border border-[#D5C7B0] dark:border-primary/30 bg-[#F4EDE0] dark:bg-primary/10 rounded-full overflow-hidden h-7 sm:h-8 flex-shrink-0 shadow-sm transition-all animate-scale-in ml-auto sm:ml-0"
            >
              <button
                onClick={handleDecrement}
                className="h-full px-1.5 sm:px-2.5 flex items-center justify-center text-foreground hover:bg-[#EAE0CF] dark:hover:bg-primary/15 transition-colors active:scale-90"
                aria-label={`Decrease quantity of ${product.name}`}
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="min-w-[1.1rem] sm:min-w-[1.5rem] text-center text-xs font-bold font-mono text-primary px-0.5 select-none">
                {quantityInCart}
              </span>
              <button
                onClick={handleIncrement}
                disabled={quantityInCart >= product.stock}
                className={cn(
                  "h-full px-1.5 sm:px-2.5 flex items-center justify-center text-foreground hover:bg-[#EAE0CF] dark:hover:bg-primary/15 transition-colors active:scale-90",
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
                "flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm flex-shrink-0 ml-auto sm:ml-0",
                product.stock === 0
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : isAddedRecently
                  ? "bg-emerald-600 text-white"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 border border-amber-500/25 shadow-[0_2px_10px_rgba(30,22,16,0.18)] hover:shadow-[0_4px_14px_rgba(197,160,89,0.3)]"
              )}
              aria-label={`Add ${product.name} to cart`}
            >
              {product.stock === 0 ? (
                <span className="text-[10px] sm:text-xs whitespace-nowrap">
                  <span className="hidden sm:inline">Out of </span>Stock
                </span>
              ) : isAddedRecently ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>
                    Add<span className="hidden sm:inline"> to Cart</span>
                  </span>
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

