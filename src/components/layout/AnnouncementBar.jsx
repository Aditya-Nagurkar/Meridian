import React from "react"
import { Sparkles, Truck, RotateCcw, ShieldCheck } from "lucide-react"

export function AnnouncementBar() {
  return (
    <div className="relative bg-[#14110E] text-neutral-200 border-b border-white/10 dark:border-amber-500/20 text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 font-medium">
        {/* Left Promo */}
        <div className="flex items-center gap-1.5 mx-auto lg:mx-0">
          <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-300 animate-pulse flex-shrink-0" />
          <span>
            Festive Sale <span className="opacity-30 mx-1 sm:mx-1.5">|</span> Up to 20% OFF <span className="opacity-30 mx-1 sm:mx-1.5">|</span> Use Code:{" "}
            <strong className="underline tracking-wider font-bold text-amber-200">INDIA20</strong>
          </span>
        </div>

        {/* Right Trust Indicators (Exact match with luxury mockups) */}
        <div className="hidden lg:flex items-center gap-3.5 text-[11px] text-neutral-300">
          <span className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-amber-300/80 flex-shrink-0" />
            Free Shipping Above ₹1,499
          </span>
          <span className="opacity-30">|</span>
          <span className="flex items-center gap-1.5">
            <RotateCcw className="h-3.5 w-3.5 text-amber-300/80 flex-shrink-0" />
            7-Day Easy Returns
          </span>
          <span className="opacity-30">|</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-300/80 flex-shrink-0" />
            100% Genuine Products
          </span>
        </div>
      </div>
    </div>
  )
}
