import React, { useState } from "react"
import { ShoppingBag, ArrowRight, Tag, X, Sparkles, Trash2 } from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { Drawer } from "../common/Drawer"
import { CartItem } from "./CartItem"
import { Button } from "../ui/button"
import { formatCurrency } from "../../lib/utils"

export function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartCount,
    subtotal,
    discount,
    shipping,
    gst,
    total,
    freeShippingRemaining,
    freeShippingProgress,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    clearCart,
    setIsCheckoutOpen,
  } = useStore()

  const [promoInput, setPromoInput] = useState("")
  const [promoError, setPromoError] = useState("")

  const handleApplyPromo = (e) => {
    e.preventDefault()
    setPromoError("")
    const res = applyPromoCode(promoInput)
    if (res.success) {
      setPromoInput("")
    } else {
      setPromoError(res.message)
    }
  }

  const handleProceedToCheckout = () => {
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }

  return (
    <Drawer
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      title="Shopping Cart"
      countBadge={`${cartCount} items`}
      subtitle={
        freeShippingRemaining > 0
          ? `Add ${formatCurrency(freeShippingRemaining)} more for complimentary All-India express delivery`
          : "🎉 You have unlocked Free Pan-India Express Delivery!"
      }
      footer={
        cart.length > 0 ? (
          <div className="space-y-4">
            {/* Promo Code Form */}
            {!appliedPromo ? (
              <form onSubmit={handleApplyPromo} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Coupon code (e.g. INDIA20)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs uppercase font-mono rounded-xl bg-muted/60 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <Button type="submit" size="sm" variant="secondary" className="px-4 text-xs font-semibold">
                    Apply
                  </Button>
                </div>
                {promoError && <p className="text-[11px] text-red-500 pl-1">{promoError}</p>}
                <p className="text-[10px] text-muted-foreground pl-1">
                  Tip: Use code <span className="font-bold underline cursor-pointer" onClick={() => setPromoInput("INDIA20")}>INDIA20</span> for 20% off
                </p>
              </form>
            ) : (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                  <Tag className="h-4 w-4" />
                  <span>Coupon {appliedPromo.code} applied (-{formatCurrency(discount)})</span>
                </div>
                <button
                  onClick={removePromoCode}
                  className="text-muted-foreground hover:text-foreground p-1"
                  aria-label="Remove coupon code"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Price Calculations Breakdown (Rupees & GST) */}
            <div className="space-y-2 text-xs pt-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Coupon Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Charges</span>
                <span>{shipping === 0 ? "FREE" : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Estimated GST (18%)</span>
                <span>{formatCurrency(gst)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-foreground pt-2 border-t border-border">
                <span>Total Amount</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <Button
              onClick={handleProceedToCheckout}
              className="w-full h-12 text-sm font-bold shadow-lg"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

            {/* Clear Cart link */}
            <div className="flex justify-center">
              <button
                onClick={clearCart}
                className="text-[11px] text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" />
                <span>Empty Cart</span>
              </button>
            </div>
          </div>
        ) : null
      }
    >
      {/* Free Shipping Progress Meter */}
      <div className="mb-4 p-3 rounded-xl bg-muted/40 border border-border/60">
        <div className="flex justify-between text-xs font-medium mb-1.5">
          <span className="flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Free Delivery Target</span>
          </span>
          <span className="text-muted-foreground font-mono">
            {freeShippingRemaining > 0 ? `${formatCurrency(freeShippingRemaining)} away` : "Unlocked"}
          </span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 rounded-full"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Cart Items List or Empty State */}
      {cart.length > 0 ? (
        <div className="divide-y divide-border/60">
          {cart.map((item) => (
            <CartItem key={item.cartItemId} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-4">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-foreground">Your shopping bag is empty</h3>
          <p className="text-xs text-muted-foreground max-w-xs mt-1 mb-6">
            Explore our curated selection of electronics, apparel, and footwear designed for India.
          </p>
          <Button onClick={() => setIsCartOpen(false)} size="sm" variant="secondary">
            Continue Shopping
          </Button>
        </div>
      )}
    </Drawer>
  )
}
