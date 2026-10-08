import React from "react"
import { ArrowDown, Sparkles } from "lucide-react"
import { Button } from "../ui/button"
import { ShinyText } from "../reactbits/ShinyText"
import { AnimatedContent } from "../reactbits/AnimatedContent"
import { useStore } from "../../context/StoreContext"

export function Hero({ onExploreClick }) {
  const { updateFilter } = useStore()

  return (
    <div className="relative overflow-hidden pt-6 pb-8 sm:pt-14 sm:pb-16 border-b border-border bg-gradient-to-b from-muted/30 via-background to-background">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedContent distance={24} delay={0.05}>
          <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-card/80 text-[11px] sm:text-xs font-medium text-foreground shadow-sm backdrop-blur-md">
              <img src="/logo.png" alt="Meridian" className="h-4 w-4 object-contain" />
              <span>Meridian 2026 • Made For Modern Living</span>
            </div>

            {/* Headline with React Bits ShinyText */}
            <h1 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground font-['Space_Grotesk'] leading-[1.15]">
              Curated Essentials. <br />
              <ShinyText text="Engineered for Excellence." speed={4.5} />
            </h1>

            {/* Subheading */}
            <p className="text-xs sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto px-2">
              From 42dB Hybrid ANC acoustics and BIS-certified wireless docks to pure French linen
              and handcrafted buff leather. Thoughtfully engineered for India.
            </p>

            {/* CTA Buttons with shadcn Button */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <Button
                onClick={onExploreClick}
                size="default"
                className="rounded-xl px-5 sm:px-7 text-xs sm:text-sm font-bold shadow-lg"
              >
                <span>Explore Products</span>
                <ArrowDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1.5" />
              </Button>
              <Button
                onClick={() => {
                  updateFilter("category", "electronics")
                  onExploreClick()
                }}
                variant="outline"
                size="default"
                className="rounded-xl px-4 sm:px-6 text-xs sm:text-sm font-semibold"
              >
                <span>Audio & Gadgets</span>
              </Button>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6 max-w-md mx-auto border-t border-border/60">
              <div className="text-center">
                <span className="block text-sm sm:text-xl font-extrabold text-foreground font-mono">100%</span>
                <span className="text-[10px] sm:text-[11px] text-muted-foreground">BIS Certified</span>
              </div>
              <div className="text-center border-x border-border/60">
                <span className="block text-sm sm:text-xl font-extrabold text-foreground font-mono">4.8 ★</span>
                <span className="text-[10px] sm:text-[11px] text-muted-foreground">50k+ Reviews</span>
              </div>
              <div className="text-center">
                <span className="block text-sm sm:text-xl font-extrabold text-foreground font-mono">Free</span>
                <span className="text-[10px] sm:text-[11px] text-muted-foreground">Above ₹1,499</span>
              </div>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </div>
  )
}
