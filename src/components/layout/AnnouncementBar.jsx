import React from "react"
import { Sparkles, Truck, Tag } from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { formatCurrency, cn } from "../../lib/utils"

export function AnnouncementBar() {
  const { freeShippingRemaining, subtotal } = useStore()

  return (
    <div className="relative bg-primary text-primary-foreground text-xs py-2 px-4 border-b border-primary/20 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center font-medium">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
          <span>
            SPRING DROP: Use code <strong className="underline tracking-wider font-bold">AURA20</strong> for 20% off your entire cart
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Truck className="h-3.5 w-3.5 text-primary-foreground/80" />
          {freeShippingRemaining > 0 ? (
            <span>
              Add <strong className="font-bold">{formatCurrency(freeShippingRemaining)}</strong> more for free worldwide express shipping
            </span>
          ) : (
            <span className="text-emerald-300 font-bold flex items-center gap-1">
              🎉 Congratulations! You unlocked Free Express Shipping!
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
