import React from "react"
import { Plus, Minus, Trash2 } from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { formatCurrency, handleImageFallback } from "../../lib/utils"

export function CartItem({ item }) {
  const { updateCartQuantity, removeFromCart } = useStore()
  const { product, quantity, cartItemId, selectedColor, selectedSize } = item

  return (
    <div className="flex gap-4 py-4 border-b border-border/70 last:border-b-0 items-center">
      {/* Thumbnail */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted/30 border border-border">
        <img
          src={product.images[0]}
          alt={product.name}
          onError={handleImageFallback}
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Info & Options */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold text-foreground line-clamp-1">
              {product.name}
            </h4>
            <button
              onClick={() => removeFromCart(cartItemId)}
              className="text-muted-foreground hover:text-red-500 transition-colors p-1 rounded-md"
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* Variant tags */}
          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
            {selectedColor && <span>Color: {selectedColor}</span>}
            {selectedSize && <span>• Size: {selectedSize}</span>}
          </div>
        </div>

        {/* Quantity Stepper & Price Row */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-border rounded-lg overflow-hidden bg-muted/40">
            <button
              onClick={() => updateCartQuantity(cartItemId, quantity - 1)}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-bold font-mono">
              {quantity}
            </span>
            <button
              onClick={() => updateCartQuantity(cartItemId, quantity + 1)}
              disabled={quantity >= product.stock}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="text-right">
            <span className="text-sm font-bold text-foreground">
              {formatCurrency(product.price * quantity)}
            </span>
            {quantity > 1 && (
              <span className="text-[10px] text-muted-foreground block">
                {formatCurrency(product.price)} each
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
