import React from "react"
import { ArrowRight, ArrowDown, Sparkles, ShieldCheck, Star, Truck, Headphones } from "lucide-react"
import { Button } from "../ui/button"
import { useStore } from "../../context/StoreContext"
import { CATEGORIES } from "../../lib/constants"
import { cn } from "../../lib/utils"

export function Hero({ onExploreClick }) {
  const { filters, updateFilter } = useStore()

  return (
    <div className="relative overflow-hidden pt-8 pb-10 sm:pt-16 sm:pb-20 border-b border-border/80 bg-gradient-to-b from-[#F2ECE0]/70 via-background to-background dark:from-[#111114]/60">
      {/* Ultra-Optimized GPU Composited Atmosphere (Zero-Cost Radial Gradients, 120FPS) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none [contain:paint_layout] transform-gpu">
        {/* Layer 1: GPU Radial Gradients (No Gaussian Blur Filters) */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.16)_0%,rgba(217,119,6,0.05)_45%,transparent_70%)] animate-orb-1" />
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[360px] bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.13)_0%,rgba(245,158,11,0.03)_45%,transparent_70%)] animate-orb-2" />

        {/* Layer 2: Meridian Horological Orbital Rings (Lightweight Hairlines) */}
        <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[660px] h-[660px] sm:w-[780px] sm:h-[780px] pointer-events-none opacity-80">
          {/* Outer Rotating Hairline Ring */}
          <div className="absolute top-1/2 left-1/2 w-full h-full rounded-full border border-amber-600/15 dark:border-amber-400/15 animate-spin-orbital">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-amber-500/80 dark:bg-amber-300/80" />
          </div>

          {/* Middle Counter-Rotating Dashed Ring */}
          <div className="absolute top-1/2 left-1/2 w-[72%] h-[72%] rounded-full border border-dashed border-amber-700/15 dark:border-amber-400/15 animate-spin-orbital-reverse">
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-amber-400/80 dark:bg-amber-300/80" />
          </div>
        </div>

        {/* Layer 3: Subtle Gilded Light Accents */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { top: "62%", left: "22%", size: "h-1 w-1", tx: "12px", duration: "7s", delay: "0s" },
            { top: "68%", left: "45%", size: "h-1.5 w-1.5", tx: "-15px", duration: "8s", delay: "1.5s" },
            { top: "64%", left: "72%", size: "h-1 w-1", tx: "14px", duration: "7.5s", delay: "3s" },
            { top: "54%", left: "80%", size: "h-1.5 w-1.5", tx: "-10px", duration: "8.5s", delay: "4.5s" },
          ].map((mote, i) => (
            <div
              key={i}
              style={{
                top: mote.top,
                left: mote.left,
                "--tx": mote.tx,
                "--duration": mote.duration,
                "--delay": mote.delay,
              }}
              className={cn(
                "absolute rounded-full bg-amber-400/70 dark:bg-amber-300/70 animate-stardust",
                mote.size
              )}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-5 sm:space-y-7 animate-fade-in">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#DFD3BE] dark:border-amber-400/25 bg-[#FAF5EC]/90 dark:bg-amber-400/[0.04] text-[11px] sm:text-xs font-semibold text-[#7A5416] dark:text-amber-300 shadow-sm backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0 animate-pulse" />
            <span>Meridian 2026 • Made for Modern Living</span>
          </div>

          {/* Headline in Editorial Serif (Playfair Display) */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground font-serif leading-[1.12]">
            Curated Essentials. <br />
            <span className="shimmer-gold-text drop-shadow-sm font-serif">
              Engineered for Excellence.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xs sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto px-2">
            From 42dB Hybrid ANC acoustics and BIS-certified wireless docks to pure French linen
            and handcrafted buff leather. Thoughtfully engineered for India.
          </p>

          {/* CTA Buttons with Exact Mockup Pill Shapes */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              onClick={onExploreClick}
              className="rounded-full px-6 sm:px-8 py-3 sm:py-3.5 bg-primary text-primary-foreground border border-amber-500/25 text-xs sm:text-sm font-bold shadow-[0_6px_20px_rgba(30,22,16,0.22)] hover:shadow-[0_8px_25px_rgba(200,140,50,0.3)] hover:bg-primary/95 active:scale-95 transition-all flex items-center gap-2 group"
            >
              <span>Explore Products</span>
              <ArrowRight className="h-4 w-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => {
                updateFilter("category", "electronics")
                onExploreClick()
              }}
              className="rounded-full px-5 sm:px-7 py-3 sm:py-3.5 bg-card hover:bg-[#F2ECE0]/70 border border-border/90 text-foreground text-xs sm:text-sm font-semibold shadow-sm hover:border-[#C59B3C]/50 active:scale-95 transition-all flex items-center gap-2 backdrop-blur-md"
            >
              <Headphones className="h-4 w-4 text-muted-foreground" />
              <span>Audio & Tech</span>
            </button>
          </div>

          {/* Trust Cards Grid matching Mockup */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-5 max-w-xl mx-auto">
            <div className="p-2.5 sm:p-3.5 rounded-2xl border border-border/90 bg-card shadow-[0_4px_20px_rgba(90,70,40,0.06)] hover:border-[#C59B3C]/40 transition-all flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center sm:text-left backdrop-blur-sm">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#F8EED9] dark:bg-amber-400/10 text-[#8C6018] dark:text-amber-300 border border-[#ECD7B2] dark:border-amber-400/20 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <span className="block text-xs sm:text-base font-extrabold text-foreground font-mono leading-tight">100%</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground block">BIS Certified</span>
              </div>
            </div>

            <div className="p-2.5 sm:p-3.5 rounded-2xl border border-border/90 bg-card shadow-[0_4px_20px_rgba(90,70,40,0.06)] hover:border-[#C59B3C]/40 transition-all flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center sm:text-left backdrop-blur-sm">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#F8EED9] dark:bg-amber-400/10 text-[#8C6018] dark:text-amber-300 border border-[#ECD7B2] dark:border-amber-400/20 flex items-center justify-center flex-shrink-0">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
              </div>
              <div>
                <span className="block text-xs sm:text-base font-extrabold text-foreground font-mono leading-tight">4.8 ★</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground block">50k+ Reviews</span>
              </div>
            </div>

            <div className="p-2.5 sm:p-3.5 rounded-2xl border border-border/90 bg-card shadow-[0_4px_20px_rgba(90,70,40,0.06)] hover:border-[#C59B3C]/40 transition-all flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center sm:text-left backdrop-blur-sm">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#F8EED9] dark:bg-amber-400/10 text-[#8C6018] dark:text-amber-300 border border-[#ECD7B2] dark:border-amber-400/20 flex items-center justify-center flex-shrink-0">
                <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <span className="block text-xs sm:text-base font-extrabold text-foreground font-mono leading-tight">Free</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground block">Above ₹1,499</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

