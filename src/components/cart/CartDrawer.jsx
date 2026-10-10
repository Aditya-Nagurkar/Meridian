import React, { useState } from "react"
import { ShoppingBag, ArrowRight, Tag, X, Sparkles, Trash2, CheckCircle2 } from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { Drawer } from "../common/Drawer"
import { CartItem } from "./CartItem"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import { Alert, AlertDescription } from "../ui/alert"
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
      activeNavTab="cart"
      banner={
        <div className="px-5 py-2.5 bg-muted/40 border-b border-border/60">
          <div className="flex items-center justify-between text-xs font-medium mb-1">
            <span className="flex items-center gap-1.5 text-foreground font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              {freeShippingRemaining > 0
                ? `Add ${formatCurrency(freeShippingRemaining)} for Free Delivery`
                : "🎉 Free Pan-India Delivery Unlocked!"}
            </span>
            <span className="text-[11px] text-muted-foreground font-mono font-semibold">
              {freeShippingProgress}%
            </span>
          </div>
          <Progress value={freeShippingProgress} className="h-1.5" />
        </div>
      }
      footer={
        cart.length > 0 ? (
          <div className="space-y-3">
            {/* Promo Code Form */}
            {!appliedPromo ? (
              <form onSubmit={handleApplyPromo} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="PROMO CODE (e.g. INDIA20)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs uppercase font-mono rounded-xl bg-muted/60 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <Button type="submit" size="sm" variant="secondary" className="px-3 text-xs font-semibold h-8">
                    Apply
                  </Button>
                </div>
                {promoError && <p className="text-[11px] text-destructive pl-1">{promoError}</p>}
              </form>
            ) : (
              <Alert variant="success" className="py-2 px-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5" />
                  <AlertDescription className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    Coupon {appliedPromo.code} applied (-{formatCurrency(discount)})
                  </AlertDescription>
                </div>
                <button
                  onClick={removePromoCode}
                  className="text-muted-foreground hover:text-foreground p-1"
                  aria-label="Remove coupon code"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </Alert>
            )}

            {/* Pricing Breakdown: Compact & clear */}
            <div className="space-y-1 text-xs pt-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({cartCount} items)</span>
                <span className="font-medium text-foreground font-mono">{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Coupon Discount</span>
                  <span className="font-mono">-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Charges</span>
                <span className="font-mono">{shipping === 0 ? "FREE" : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-foreground pt-1.5 border-t border-border/80">
                <div>
                  <span>Total Amount</span>
                  <span className="block text-[10px] text-muted-foreground font-normal">Incl. 18% GST ({formatCurrency(gst)})</span>
                </div>
                <span className="font-mono text-lg font-black">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <Button
              onClick={handleProceedToCheckout}
              className="w-full h-11 sm:h-12 text-sm font-bold shadow-lg rounded-xl"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

            {/* Clear Cart link */}
            <div className="flex justify-center pt-0.5">
              <button
                onClick={clearCart}
                className="text-[11px] text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" />
                <span>Empty Cart</span>
              </button>
            </div>
          </div>
        ) : null
      }
    >
      {/* Cart Items List: Clean spacious product cards */}
      {cart.length > 0 ? (
        <div className="space-y-3">
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
