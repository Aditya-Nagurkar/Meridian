import React, { useState } from "react"
import { ShieldCheck, RefreshCw, Truck, ArrowRight, Github, Heart } from "lucide-react"
import { useStore } from "../../context/StoreContext"

export function Footer() {
  const [email, setEmail] = useState("")
  const { addToast } = useStore()

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      addToast("Please enter a valid email address.", "error")
      return
    }
    addToast("Welcome to AURA Club! 10% coupon code: WELCOME10", "success")
    setEmail("")
  }

  return (
    <footer className="border-t border-border bg-card/60 mt-20 pt-16 pb-24 sm:pb-16 text-card-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pb-12 border-b border-border">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-xl bg-primary/5 text-primary flex items-center justify-center flex-shrink-0">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Global Express Shipping</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Complimentary insured delivery on orders over $150. Tracked end-to-end.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-xl bg-primary/5 text-primary flex items-center justify-center flex-shrink-0">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">30-Day Effortless Returns</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Risk-free home trial. Pre-paid return labels included inside every delivery parcel.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-xl bg-primary/5 text-primary flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">2-Year Atelier Guarantee</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Every hardware piece and garment is tested for uncompromising longevity.
              </p>
            </div>
          </div>
        </div>

        {/* Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12 border-b border-border">
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                A
              </div>
              <span className="font-extrabold text-lg tracking-tight font-['Space_Grotesk']">
                AURA
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Curated everyday performance essentials, minimalist footwear, modular accessories, and precision audio.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All systems operational
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
              Collections
            </h5>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li><span className="hover:text-foreground cursor-pointer transition-colors">Precision Electronics</span></li>
              <li><span className="hover:text-foreground cursor-pointer transition-colors">Aerolite Footwear</span></li>
              <li><span className="hover:text-foreground cursor-pointer transition-colors">Architectural Apparel</span></li>
              <li><span className="hover:text-foreground cursor-pointer transition-colors">Modular Accessories</span></li>
              <li><span className="hover:text-foreground cursor-pointer transition-colors">Archive & Releases</span></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
              Architecture & Tech
            </h5>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li><span className="text-foreground font-medium">React 18 & Vite</span></li>
              <li><span className="text-foreground font-medium">Tailwind CSS 3.4</span></li>
              <li><span className="text-foreground font-medium">Shadcn / UI Design tokens</span></li>
              <li><span className="text-foreground font-medium">LocalStorage & SessionStorage</span></li>
              <li><span className="text-foreground font-medium">Lucide Icons</span></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
              Join the Vanguard
            </h5>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              Subscribe for private drop keys, engineering notes, and insider discounts.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-muted/70 text-xs text-foreground px-3 py-2.5 rounded-lg border border-border flex-1 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground p-2.5 rounded-lg hover:bg-primary/90 transition-colors"
                  aria-label="Subscribe newsletter"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <span className="text-[10px] text-muted-foreground block">
                Instant 10% coupon code on subscription.
              </span>
            </form>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} AURA Modern Gear. Built with React, Tailwind CSS, & Vite.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-foreground cursor-pointer">Privacy Policy</span>
            <span className="hover:text-foreground cursor-pointer">Terms of Service</span>
            <span className="hover:text-foreground cursor-pointer">Security Audit</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
