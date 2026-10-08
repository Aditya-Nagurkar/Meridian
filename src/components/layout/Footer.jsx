import React, { useState } from "react"
import { ShieldCheck, RefreshCw, Truck, ArrowRight, CreditCard } from "lucide-react"
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
    addToast("Welcome to Meridian Club! Use coupon code FIRST10 for 10% off.", "success")
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
              <h4 className="text-sm font-bold text-foreground">Pan-India Express Delivery</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Complimentary insured delivery on orders over ₹1,499. Partnered with Blue Dart, Delhivery & DTDC.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-xl bg-primary/5 text-primary flex items-center justify-center flex-shrink-0">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">7-Day Easy Replacements</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Zero hassle door-to-door reverse pickup for sizing or defect exchanges across 19,000+ Indian PIN codes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-xl bg-primary/5 text-primary flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">1-Year Pan-India Warranty</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Official brand warranty and BIS certified hardware with dedicated service center support.
              </p>
            </div>
          </div>
        </div>

        {/* Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12 border-b border-border">
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="Meridian Golden Orbital Emblem"
                className="h-8 w-8 object-contain drop-shadow"
              />
              <span className="font-extrabold text-lg tracking-tight font-['Space_Grotesk']">
                MERIDIAN
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Premium everyday lifestyle essentials, BIS-certified audio, breathable natural fabrics, and genuine leather goods.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              GST Compliant Invoicing
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
              Categories
            </h5>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li><span className="hover:text-foreground cursor-pointer transition-colors">Audio & Smart Wearables</span></li>
              <li><span className="hover:text-foreground cursor-pointer transition-colors">Ergonomic Footwear</span></li>
              <li><span className="hover:text-foreground cursor-pointer transition-colors">Pure French Linen Shirts</span></li>
              <li><span className="hover:text-foreground cursor-pointer transition-colors">Full-Grain Leather Wallets</span></li>
              <li><span className="hover:text-foreground cursor-pointer transition-colors">Weatherproof Commuter Bags</span></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
              Supported Payments
            </h5>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li><span className="text-foreground font-medium">UPI (GPay, PhonePe, Paytm)</span></li>
              <li><span className="text-foreground font-medium">RuPay / Visa / Mastercard</span></li>
              <li><span className="text-foreground font-medium">Net Banking (HDFC, ICICI, SBI)</span></li>
              <li><span className="text-foreground font-medium">Cash on Delivery (COD)</span></li>
              <li><span className="text-foreground font-medium">No-Cost EMI Available</span></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
              Stay Connected
            </h5>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              Subscribe for exclusive launch access, festive coupon drops, and private sales.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
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
                Get an instant 10% coupon code (FIRST10).
              </span>
            </form>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Meridian Retail Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-foreground cursor-pointer">Privacy Policy</span>
            <span className="hover:text-foreground cursor-pointer">Terms of Service</span>
            <span className="hover:text-foreground cursor-pointer">Shipping & Returns</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
