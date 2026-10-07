import React, { useState, useEffect } from "react"
import { Heart, ShoppingBag, Plus, Minus, Check, Shield, Truck, RotateCcw } from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { Modal } from "../common/Modal"
import { Badge } from "../common/Badge"
import { StarRating } from "../common/StarRating"
import { Button } from "../common/Button"
import { formatCurrency, cn } from "../../lib/utils"

export function QuickViewModal() {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    recordProductView,
  } = useStore()

  const product = quickViewProduct

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  // Reset local state when product changes
  useEffect(() => {
    if (product) {
      setSelectedImageIndex(0)
      setSelectedColor(product.colors ? product.colors[0] : "")
      setSelectedSize(product.sizes ? product.sizes[0] : "")
      setQuantity(1)
      setIsAdded(false)
      recordProductView(product)
    }
  }, [product, recordProductView])

  if (!product) return null

  const isWishlisted = isInWishlist(product.id)

  const handleAddToCart = () => {
    addToCart(product, quantity, {
      color: selectedColor,
      size: selectedSize,
    })
    setIsAdded(true)
    setTimeout(() => {
      setIsAdded(false)
      setQuickViewProduct(null)
    }, 1200)
  }

  return (
    <Modal
      isOpen={Boolean(product)}
      onClose={() => setQuickViewProduct(null)}
      maxWidth="max-w-4xl"
      showCloseButton={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted/30 border border-border">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {product.badge && (
              <div className="absolute top-3 left-3">
                <Badge variant={product.badgeType || "default"}>{product.badge}</Badge>
              </div>
            )}
          </div>

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={cn(
                    "relative h-18 w-18 aspect-square rounded-xl overflow-hidden border-2 transition-all",
                    selectedImageIndex === idx
                      ? "border-primary ring-2 ring-primary/20 scale-102"
                      : "border-border/60 opacity-70 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Information & Controls */}
        <div className="flex flex-col space-y-5">
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span className="uppercase tracking-widest font-mono font-medium">
                {product.category}
              </span>
              <StarRating rating={product.rating} reviewsCount={product.reviewsCount} size="sm" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-foreground font-['Space_Grotesk']">
              {product.name}
            </h2>

            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price Tag */}
          <div className="flex items-baseline gap-3 p-3 rounded-xl bg-muted/40 border border-border/60">
            <span className="text-2xl font-black text-foreground">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            <span className="ml-auto text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
            </span>
          </div>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Color</span>
                <span className="text-muted-foreground font-normal">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
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
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Size</span>
                <span className="text-muted-foreground font-normal">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
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

          {/* Technical Specifications Highlights */}
          {product.specs && (
            <div className="space-y-2 pt-2 border-t border-border">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Specifications
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {product.specs.map((spec, i) => (
                  <div key={i} className="p-2 rounded-lg bg-muted/30 border border-border/50">
                    <span className="text-muted-foreground block text-[11px]">{spec.label}</span>
                    <span className="font-medium text-foreground">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="pt-3 border-t border-border space-y-3">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-border rounded-xl overflow-hidden bg-muted/40">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="p-2.5 hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold font-mono">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="p-2.5 hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Add to Cart CTA */}
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 h-11 text-sm font-bold shadow-lg"
              >
                {isAdded ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Added to Bag!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Add {quantity > 1 ? `(${quantity})` : ""} • {formatCurrency(product.price * quantity)}
                  </>
                )}
              </Button>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(product)}
                className={cn(
                  "p-3 rounded-xl border border-border transition-colors",
                  isWishlisted
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-secondary text-foreground hover:bg-muted"
                )}
                aria-label="Toggle wishlist"
              >
                <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
              </button>
            </div>

            {/* Guarantee badges */}
            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2">
              <span className="flex items-center gap-1">
                <Truck className="h-3.5 w-3.5" /> Fast Dispatch
              </span>
              <span className="flex items-center gap-1">
                <RotateCcw className="h-3.5 w-3.5" /> 30-Day Returns
              </span>
              <span className="flex items-center gap-1">
                <Shield className="h-3.5 w-3.5" /> Authenticity Guaranteed
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
