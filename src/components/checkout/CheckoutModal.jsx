import React, { useState } from "react"
import confetti from "canvas-confetti"
import { CheckCircle2, CreditCard, ShieldCheck, Truck, ArrowRight, Lock, Copy, Check, Sparkles } from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { Modal } from "../common/Modal"
import { Button } from "../common/Button"
import { formatCurrency, generateOrderId } from "../../lib/utils"

export function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    completeOrder,
    appliedPromo,
  } = useStore()

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: "Alex Mercer",
    email: "alex.mercer@atelier-aura.com",
    phone: "+1 (555) 234-5678",
    address: "742 Evergreen Terrace, Suite 4B",
    city: "San Francisco",
    state: "CA",
    postalCode: "94107",
    country: "United States",
    paymentMethod: "card",
    cardNumber: "•••• •••• •••• 4242",
    cardExp: "12/28",
    cardCvc: "888",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState(null)
  const [isCopied, setIsCopied] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const triggerConfettiCelebration = () => {
    try {
      // Fire confetti bursts from left and right
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6, x: 0.3 },
      })
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6, x: 0.7 },
      })
    } catch (e) {
      // Graceful fallback if canvas is restricted
    }
  }

  const handleSubmitOrder = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate realistic payment gateway processing delay
    setTimeout(() => {
      const orderId = generateOrderId()
      const newOrder = completeOrder({
        orderId,
        shippingAddress: {
          name: formData.fullName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
      })

      setIsSubmitting(false)
      setConfirmedOrder(newOrder)
      triggerConfettiCelebration()
    }, 1200)
  }

  const handleClose = () => {
    setConfirmedOrder(null)
    setIsCheckoutOpen(false)
  }

  const handleCopyOrderId = () => {
    if (confirmedOrder?.orderId) {
      navigator.clipboard.writeText(confirmedOrder.orderId)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  if (!isCheckoutOpen) return null

  return (
    <Modal
      isOpen={isCheckoutOpen}
      onClose={handleClose}
      maxWidth="max-w-3xl"
      title={confirmedOrder ? "Order Confirmed!" : "Secure Checkout"}
      description={
        confirmedOrder
          ? "Your order has been received and is being prepared for dispatch."
          : "Complete your simulated transaction with zero risk."
      }
    >
      {confirmedOrder ? (
        /* Order Confirmation Success Screen */
        <div className="space-y-6 py-2 text-center animate-fade-in">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-12 w-12" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-bold mb-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Order ID: {confirmedOrder.orderId}
              <button
                onClick={handleCopyOrderId}
                className="ml-1 text-muted-foreground hover:text-foreground"
                title="Copy Order ID"
              >
                {isCopied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
              </button>
            </span>
            <h3 className="text-2xl font-bold tracking-tight text-foreground font-['Space_Grotesk']">
              Thank You, {confirmedOrder.shippingAddress.name}!
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
              A confirmation email has been sent to{" "}
              <strong className="text-foreground">{confirmedOrder.shippingAddress.email}</strong>.
            </p>
          </div>

          {/* Receipt Breakdown Card */}
          <div className="rounded-2xl border border-border bg-muted/30 p-5 text-left text-xs space-y-3">
            <div className="flex justify-between pb-2 border-b border-border/60 text-muted-foreground">
              <span>Estimated Delivery</span>
              <span className="font-semibold text-foreground">3 - 5 Business Days (Express)</span>
            </div>

            <div className="flex justify-between text-muted-foreground">
              <span>Shipping Destination</span>
              <span className="font-medium text-foreground text-right">
                {confirmedOrder.shippingAddress.address}, {confirmedOrder.shippingAddress.city},{" "}
                {confirmedOrder.shippingAddress.state} {confirmedOrder.shippingAddress.postalCode}
              </span>
            </div>

            <div className="flex justify-between text-muted-foreground">
              <span>Payment Simulated via</span>
              <span className="font-medium text-foreground uppercase">
                {confirmedOrder.paymentMethod} (Encrypted)
              </span>
            </div>

            <div className="flex justify-between text-muted-foreground">
              <span>Items Purchased</span>
              <span className="font-semibold text-foreground">
                {confirmedOrder.items.reduce((acc, i) => acc + i.quantity, 0)} items
              </span>
            </div>

            <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t border-border">
              <span>Total Amount Paid</span>
              <span>{formatCurrency(confirmedOrder.total)}</span>
            </div>
          </div>

          {/* LocalStorage Note */}
          <div className="text-[11px] text-muted-foreground bg-primary/5 p-3 rounded-xl border border-primary/10">
            💾 <strong>Storage Integration:</strong> Your cart has been safely cleared from{" "}
            <code>localStorage</code>, and this order receipt has been persisted to your local order history.
          </div>

          <Button onClick={handleClose} className="w-full h-11 text-sm font-semibold shadow-md">
            <span>Continue Shopping</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      ) : (
        /* Checkout Form View */
        <form onSubmit={handleSubmitOrder} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Contact & Shipping Form */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Truck className="h-4 w-4" />
                <span>Shipping Details</span>
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-medium text-foreground block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-2.5 rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-medium text-foreground block mb-1">Email</label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-foreground block mb-1">Phone</label>
                    <input
                      type="text"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-medium text-foreground block mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2.5 rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="font-medium text-foreground block mb-1">City</label>
                    <input
                      type="text"
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-foreground block mb-1">State / Prov</label>
                    <input
                      type="text"
                      required
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-foreground block mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Payment Simulation & Summary */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <CreditCard className="h-4 w-4" />
                <span>Payment Simulation</span>
              </h4>

              {/* Payment Methods Tabs */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "card", label: "Credit Card" },
                  { id: "applepay", label: "Apple Pay" },
                  { id: "cod", label: "Pay Later" },
                ].map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setFormData((p) => ({ ...p, paymentMethod: m.id }))}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                      formData.paymentMethod === m.id
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-muted/40 text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {formData.paymentMethod === "card" && (
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-3 text-xs">
                  <div>
                    <label className="font-medium text-foreground block mb-1">Simulated Card</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full pl-9 p-2 rounded-lg bg-card border border-border font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-medium text-foreground block mb-1">Exp Date</label>
                      <input
                        type="text"
                        name="cardExp"
                        value={formData.cardExp}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded-lg bg-card border border-border font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="font-medium text-foreground block mb-1">Security CVC</label>
                      <input
                        type="text"
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded-lg bg-card border border-border font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary Mini-Receipt */}
              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Discount ({appliedPromo?.code})</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t border-border">
                  <span>Final Total</span>
                  <span className="font-mono">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 border-t border-border flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Lock className="h-3.5 w-3.5 text-emerald-500" />
              <span>Simulated 256-Bit SSL Encryption</span>
            </div>

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="px-6 h-11 text-sm font-bold shadow-lg"
            >
              <span>Authorize & Place Order</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
