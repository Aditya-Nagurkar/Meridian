import React from "react"
import { Sparkles, Truck } from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { formatCurrency } from "../../lib/utils"

export function AnnouncementBar() {
  const { freeShippingRemaining } = useStore()

  return (
    <div className="relative bg-primary text-primary-foreground text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-primary/20 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-center font-medium">
        <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
          <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-300 animate-pulse flex-shrink-0" />
          <span>
            Code <strong className="underline tracking-wider font-bold">INDIA20</strong> for 20% off
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs">
          <Truck className="h-3.5 w-3.5 text-primary-foreground/80 flex-shrink-0" />
          {freeShippingRemaining > 0 ? (
            <span>
              Add <strong className="font-bold">{formatCurrency(freeShippingRemaining)}</strong> for free delivery
            </span>
          ) : (
            <span className="text-emerald-300 font-bold">
              🎉 Free Express Delivery Unlocked!
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
