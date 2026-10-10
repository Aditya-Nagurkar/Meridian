import React, { useState, useEffect } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import {
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Shield,
  Truck,
  RotateCcw,
  X,
  ArrowLeft,
  Share2,
} from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { Badge } from "../ui/badge"
import { StarRating } from "../common/StarRating"
import { Button } from "../ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel"
import { formatCurrency, cn, handleImageFallback } from "../../lib/utils"

export function QuickViewModal() {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    recordProductView,
    cartCount,
    setIsCartOpen,
  } = useStore()

  const isOpen = Boolean(quickViewProduct)
  const [cachedProduct, setCachedProduct] = useState(quickViewProduct)

  useEffect(() => {
    if (quickViewProduct) {
      setCachedProduct(quickViewProduct)
    }
  }, [quickViewProduct])

  const product = quickViewProduct || cachedProduct

  const [api, setApi] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  // Listen to carousel slide changes
  useEffect(() => {
    if (!api) return
    const onSelect = () => {
      setSelectedImageIndex(api.selectedScrollSnap())
    }
    api.on("select", onSelect)
    return () => api.off("select", onSelect)
  }, [api])

  // Reset local state when product changes
  useEffect(() => {
    if (quickViewProduct) {
      setSelectedImageIndex(0)
      if (api) api.scrollTo(0)
      setSelectedColor(quickViewProduct.colors ? quickViewProduct.colors[0] : "")
      setSelectedSize(quickViewProduct.sizes ? quickViewProduct.sizes[0] : "")
      setQuantity(1)
      setIsAdded(false)
      recordProductView(quickViewProduct)
    }
  }, [quickViewProduct, recordProductView, api])

  if (!product) return null

  const isWishlisted = isInWishlist(product.id)
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null

  const handleAddToCart = () => {
    addToCart(product, quantity, {
      color: selectedColor,
      size: selectedSize,
    })
    setIsAdded(true)
    setTimeout(() => {
      setIsAdded(false)
    }, 1500)
  }

  const handleThumbnailClick = (idx) => {
    setSelectedImageIndex(idx)
    api?.scrollTo(idx)
  }

  const handleOpenCart = () => {
    setQuickViewProduct(null)
    setIsCartOpen(true)
  }

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) setQuickViewProduct(null)
      }}
    >
      <DialogPrimitive.Portal>
        {/* Animated Backdrop */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm dialog-overlay" />

        {/* Centering Layout Wrapper */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 overflow-hidden sm:overflow-y-auto pointer-events-none">
          {/* Main View Container:
              - Mobile: Fullscreen edge-to-edge view with bottom slide-up
              - Desktop: Centered floating card with spring scale-in
          */}
          <DialogPrimitive.Content
            className={cn(
              "pointer-events-auto relative z-10 w-full h-[100dvh] sm:h-auto sm:max-h-[88vh] sm:max-w-4xl",
              "rounded-none sm:rounded-2xl border-0 sm:border border-border",
              "bg-background sm:bg-card text-card-foreground shadow-2xl",
              "flex flex-col overflow-hidden my-auto dialog-content focus:outline-none"
            )}
          >
        {/* Mobile Sticky Top Navigation Bar */}
        <div className="sm:hidden sticky top-0 z-20 flex items-center justify-between px-3.5 py-2.5 bg-background/95 backdrop-blur-md border-b border-border flex-shrink-0 safe-area-pt">
          <button
            onClick={() => setQuickViewProduct(null)}
            className="flex items-center gap-1.5 py-1 px-2 -ml-1 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground active:scale-95 transition-all"
            aria-label="Back to Catalog"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-muted-foreground truncate max-w-[140px]">
            {product.categoryLabel || product.category}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleWishlist(product)}
              className={cn(
                "p-2 rounded-xl transition-all active:scale-90",
                isWishlisted
                  ? "text-red-500 bg-red-500/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="Toggle Wishlist"
            >
              <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
            </button>

            <button
              onClick={handleOpenCart}
              className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground active:scale-90 transition-all"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute 1 top-1 right-1 h-3.5 w-3.5 rounded-full bg-primary text-primary-foreground text-[8px] font-bold flex items-center justify-center font-mono">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setQuickViewProduct(null)}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground active:scale-90 transition-all"
              aria-label="Close Quick View"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Desktop Header Close Button */}
        <div className="hidden sm:flex items-center justify-between px-6 pt-5 pb-3 border-b border-border/60 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest font-semibold text-muted-foreground">
              {product.categoryLabel || product.category}
            </span>
            {product.badge && (
              <Badge variant={product.badgeType || "default"} className="text-[10px]">
                {product.badge}
              </Badge>
            )}
          </div>
          <button
            onClick={() => setQuickViewProduct(null)}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Main Content Body */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 sm:px-6 sm:py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 items-start">
            {/* Column 1: Image Gallery */}
            <div className="space-y-2.5 sm:space-y-4">
              <Carousel setApi={setApi} className="w-full relative">
                <CarouselContent>
                  {product.images.map((img, idx) => (
                    <CarouselItem key={idx}>
                      <div className="relative aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden bg-muted/30 border border-border/80">
                        <img
                          src={img}
                          alt={`${product.name} preview ${idx + 1}`}
                          loading="lazy"
                          decoding="async"
                          onError={handleImageFallback}
                          className="w-full h-full object-cover object-center"
                        />
                        {/* Mobile Badge Overlay */}
                        {product.badge && idx === 0 && (
                          <div className="absolute top-2.5 left-2.5 z-10 sm:hidden">
                            <Badge variant={product.badgeType || "default"} className="text-[10px]">
                              {product.badge}
                            </Badge>
                          </div>
                        )}
                        {discountPercent && (
                          <div className="absolute top-2.5 right-2.5 z-10">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-sm font-mono">
                              -{discountPercent}%
                            </span>
                          </div>
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {product.images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-2 h-7 w-7 sm:h-8 sm:w-8" />
                    <CarouselNext className="right-2 h-7 w-7 sm:h-8 sm:w-8" />
                  </>
                )}
              </Carousel>

              {/* Slide Indicator Dots on Mobile */}
              {product.images.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 sm:hidden py-1">
                  {product.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleThumbnailClick(idx)}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        selectedImageIndex === idx
                          ? "w-5 bg-primary"
                          : "w-1.5 bg-muted-foreground/30"
                      )}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Thumbnails Row */}
              {product.images.length > 1 && (
                <div className="hidden sm:flex items-center gap-2.5 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleThumbnailClick(idx)}
                      className={cn(
                        "relative h-14 w-14 sm:h-16 sm:w-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0",
                        selectedImageIndex === idx
                          ? "border-primary ring-2 ring-primary/20 scale-102"
                          : "border-border/60 opacity-70 hover:opacity-100"
                      )}
                    >
                      <img
                        src={img}
                        alt=""
                        onError={handleImageFallback}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Column 2: Product Information, Selectors & Details */}
            <div className="flex flex-col space-y-3.5 sm:space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <StarRating rating={product.rating} reviewsCount={product.reviewsCount} size="sm" />
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    {product.stock > 0 ? `In Stock (${product.stock} left)` : "Out of Stock"}
                  </span>
                </div>

                <DialogPrimitive.Title asChild>
                  <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground font-['Space_Grotesk'] leading-snug">
                    {product.name}
                  </h1>
                </DialogPrimitive.Title>

                {/* Inline Price Highlight */}
                <div className="flex items-baseline gap-2.5 mt-2 p-2.5 rounded-xl bg-muted/40 border border-border/60">
                  <span className="text-xl sm:text-2xl font-black text-foreground font-mono">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs sm:text-sm text-muted-foreground line-through font-mono">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                  {discountPercent && (
                    <Badge variant="accent" className="text-[10px] ml-auto">
                      Save {discountPercent}%
                    </Badge>
                  )}
                </div>

                <DialogPrimitive.Description asChild>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2.5 leading-relaxed">
                    {product.description}
                  </p>
                </DialogPrimitive.Description>
              </div>

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                    <span>Color</span>
                    <span className="text-muted-foreground font-normal text-[11px]">
                      {selectedColor}
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-xs font-medium transition-all border",
                          selectedColor === color
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-secondary/70 text-foreground border-border hover:bg-secondary"
                        )}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                    <span>Size / Variant</span>
                    <span className="text-muted-foreground font-normal text-[11px]">
                      {selectedSize}
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-xs font-medium transition-all border font-mono",
                          selectedSize === size
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-secondary/70 text-foreground border-border hover:bg-secondary"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Specifications */}
              {product.specs && (
                <div className="space-y-1.5 pt-2 border-t border-border">
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Specifications
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    {product.specs.map((spec, i) => (
                      <div
                        key={i}
                        className="p-1.5 sm:p-2 rounded-lg bg-muted/30 border border-border/50"
                      >
                        <span className="text-muted-foreground block text-[10px]">
                          {spec.label}
                        </span>
                        <span className="font-semibold text-foreground truncate block">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Guarantees & Trust Highlights */}
              <div className="grid grid-cols-3 gap-1.5 text-[10px] text-muted-foreground pt-2 border-t border-border/70 text-center">
                <div className="p-1.5 rounded-lg bg-muted/20 flex flex-col items-center gap-0.5">
                  <Truck className="h-3.5 w-3.5 text-primary" />
                  <span>Pan-India</span>
                </div>
                <div className="p-1.5 rounded-lg bg-muted/20 flex flex-col items-center gap-0.5">
                  <RotateCcw className="h-3.5 w-3.5 text-primary" />
                  <span>7-Day Return</span>
                </div>
                <div className="p-1.5 rounded-lg bg-muted/20 flex flex-col items-center gap-0.5">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  <span>1-Yr Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HERO ELEMENT: Sticky Bottom Purchase Bar
            - On Mobile: Pinned fixed at the bottom, price + quantity + add to cart ALWAYS VISIBLE
            - On Desktop: Clean docked footer at the base of the dialog
        */}
        <div className="sticky bottom-0 z-30 bg-card/95 backdrop-blur-xl border-t border-border px-4 py-3 sm:px-6 sm:py-4 shadow-[0_-6px_20px_rgba(0,0,0,0.12)] flex-shrink-0 safe-area-pb">
          <div className="flex items-center justify-between gap-3 max-w-4xl mx-auto">
            {/* Price Block */}
            <div className="min-w-0">
              <div className="text-[10px] text-muted-foreground uppercase font-mono font-medium">
                Total Price
              </div>
              <div className="text-lg sm:text-xl font-black text-foreground font-mono leading-none">
                {formatCurrency(product.price * quantity)}
              </div>
              {quantity > 1 && (
                <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                  {formatCurrency(product.price)} each
                </div>
              )}
            </div>

            {/* Stepper & Add to Cart Action Group */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end max-w-sm">
              {/* Stepper */}
              <div className="flex items-center border border-border rounded-xl overflow-hidden bg-muted/50 h-10 sm:h-11">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="px-2.5 h-full hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-7 sm:w-9 text-center text-xs sm:text-sm font-bold font-mono">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="px-2.5 h-full hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Add to Cart CTA */}
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={cn(
                  "flex-1 h-10 sm:h-11 text-xs sm:text-sm font-bold shadow-lg rounded-xl transition-all",
                  isAdded && "bg-emerald-600 hover:bg-emerald-600 text-white"
                )}
              >
                {isAdded ? (
                  <>
                    <Check className="h-4 w-4 mr-1.5" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4 mr-1.5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </Button>

              {/* Desktop Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={cn(
                  "hidden sm:flex p-2.5 rounded-xl border border-border transition-colors flex-shrink-0 items-center justify-center h-11 w-11",
                  isWishlisted
                    ? "bg-red-500 text-white border-red-500 shadow-sm"
                    : "bg-secondary text-foreground hover:bg-muted"
                )}
                aria-label="Toggle wishlist"
              >
                <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
              </button>
            </div>
          </div>
        </div>
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
