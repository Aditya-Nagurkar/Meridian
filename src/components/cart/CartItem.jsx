import React from "react"
import { Plus, Minus, Trash2 } from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { formatCurrency, handleImageFallback } from "../../lib/utils"

export function CartItem({ item }) {
  const { updateCartQuantity, removeFromCart } = useStore()
  const { product, quantity, cartItemId, selectedColor, selectedSize } = item

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl border border-border/80 bg-card/90 text-card-foreground shadow-sm hover:border-primary/40 transition-all flex gap-3.5 items-start">
      {/* Thumbnail */}
      <div className="relative h-20 w-20 sm:h-22 sm:w-22 rounded-xl overflow-hidden bg-muted/40 border border-border/80 flex-shrink-0">
        <img
          src={product.images[0]}
          alt={product.name}
          onError={handleImageFallback}
          className="h-full w-full object-cover object-center"
        />
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="absolute bottom-1 left-1 bg-destructive text-destructive-foreground text-[8px] font-bold px-1 py-0.5 rounded shadow-sm">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </span>
        )}
      </div>

      {/* Info & Options */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          {/* Category Tag & Delete Button */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground truncate font-medium">
              {product.categoryLabel || product.category}
            </span>
            <button
              onClick={() => removeFromCart(cartItemId)}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-1 rounded-lg transition-colors -mr-1"
              aria-label={`Remove ${product.name} from cart`}
              title="Remove item"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Full Readable Product Name */}
          <h4 className="text-xs sm:text-sm font-bold text-foreground leading-snug line-clamp-2 mt-0.5">
            {product.name}
          </h4>

          {/* Selected Variant Tags & Stock Warning */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            {selectedColor && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-foreground font-medium border border-border/60">
                {selectedColor}
              </span>
            )}
            {selectedSize && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-foreground font-medium border border-border/60">
                Size: {selectedSize}
              </span>
            )}
            {product.stock <= 6 && (
              <span className="text-[9px] text-amber-600 dark:text-amber-400 font-mono font-medium">
                🔥 {product.stock} left
              </span>
            )}
          </div>
        </div>

        {/* Quantity Stepper & Price Row */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/60">
          <div className="flex items-center border border-border rounded-xl overflow-hidden bg-muted/40 shadow-inner">
            <button
              onClick={() => updateCartQuantity(cartItemId, quantity - 1)}
              className="p-1 sm:p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors active:scale-95"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-7 text-center text-xs font-bold font-mono select-none">
              {quantity}
            </span>
            <button
              onClick={() => updateCartQuantity(cartItemId, quantity + 1)}
              disabled={quantity >= product.stock}
              className="p-1 sm:p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 transition-colors active:scale-95"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <div className="text-right">
            <span className="text-xs sm:text-sm font-extrabold text-foreground font-mono">
              {formatCurrency(product.price * quantity)}
            </span>
            {quantity > 1 && (
              <span className="text-[10px] text-muted-foreground block font-mono">
                {formatCurrency(product.price)} each
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
