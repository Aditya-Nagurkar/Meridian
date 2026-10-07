import React from "react"
import { ArrowDown, Sparkles, ShieldCheck, Zap, Star } from "lucide-react"
import { Button } from "../common/Button"
import { Badge } from "../common/Badge"
import { useStore } from "../../context/StoreContext"

export function Hero({ onExploreClick }) {
  const { updateFilter } = useStore()

  return (
    <div className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 border-b border-border bg-gradient-to-b from-muted/30 via-background to-background">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-card/80 text-xs font-medium text-foreground shadow-sm backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
            <span>2026 Atelier Collection • Limited Edition Release</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground font-['Space_Grotesk'] leading-[1.1]">
            Precision Engineering. <br />
            <span className="bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
              Everyday Velocity.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            A curated sanctuary of spatial acoustics, carbon-plated footwear, heavy-weight apparel,
            and CNC-machined desk hardware. Crafted for collectors and creators.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              onClick={onExploreClick}
              size="lg"
              className="rounded-xl px-7 text-sm font-bold shadow-xl"
            >
              <span>Explore Catalog</span>
              <ArrowDown className="h-4 w-4 ml-2" />
            </Button>
            <Button
              onClick={() => {
                updateFilter("category", "electronics")
                onExploreClick()
              }}
              variant="outline"
              size="lg"
              className="rounded-xl px-6 text-sm font-semibold"
            >
              <span>View Electronics</span>
            </Button>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-3 gap-4 pt-8 max-w-lg mx-auto border-t border-border/60">
            <div className="text-center">
              <span className="block text-xl font-extrabold text-foreground font-mono">100%</span>
              <span className="text-[11px] text-muted-foreground">Original Batch</span>
            </div>
            <div className="text-center border-x border-border/60">
              <span className="block text-xl font-extrabold text-foreground font-mono">4.9 ★</span>
              <span className="text-[11px] text-muted-foreground">User Verified</span>
            </div>
            <div className="text-center">
              <span className="block text-xl font-extrabold text-foreground font-mono">Free</span>
              <span className="text-[11px] text-muted-foreground">Over $150</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
