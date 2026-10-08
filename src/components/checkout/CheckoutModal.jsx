import React, { useState } from "react"
import confetti from "canvas-confetti"
import { CheckCircle2, CreditCard, ShieldCheck, Truck, ArrowRight, Lock, Copy, Check, Sparkles, Smartphone, Banknote, Building2 } from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { Modal } from "../common/Modal"
import { Button } from "../ui/button"
import { formatCurrency, generateOrderId } from "../../lib/utils"
import { INDIAN_STATES } from "../../lib/constants"

export function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    subtotal,
    discount,
    shipping,
    gst,
    total,
    completeOrder,
    appliedPromo,
  } = useStore()

  // Form Fields customized for Indian market
  const [formData, setFormData] = useState({
    fullName: "Rohit Verma",
    email: "rohit.verma@meridian.in",
    phone: "9876543210",
    flatHouse: "Flat 402, Signature Towers",
    streetArea: "Indiranagar 100ft Road",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560038",
    paymentMethod: "upi", // upi | card | cod | netbanking
    upiId: "rohit.verma@okhdfcbank",
    cardNumber: "5241 •••• •••• 8892",
    cardExp: "08/29",
    cardCvc: "742",
    bank: "HDFC Bank",
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
      // Fallback
    }
  }

  const handleSubmitOrder = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate realistic payment gateway processing delay (Razorpay / Cashfree style)
    setTimeout(() => {
      const orderId = generateOrderId()
      const newOrder = completeOrder({
        orderId,
        shippingAddress: {
          name: formData.fullName,
          email: formData.email,
          phone: `+91 ${formData.phone}`,
          address: `${formData.flatHouse}, ${formData.streetArea}`,
          city: formData.city,
          state: formData.state,
          postalCode: formData.pincode,
          country: "India",
        },
        paymentMethod: formData.paymentMethod.toUpperCase(),
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
      title={confirmedOrder ? "Order Placed Successfully!" : "Secure Checkout (All-India Delivery)"}
      description={
        confirmedOrder
          ? "Your order has been verified and registered for courier dispatch."
          : "Complete your transaction with UPI, RuPay/Cards, or Cash on Delivery."
      }
    >
      {confirmedOrder ? (
        /* Order Confirmation Success Screen */
        <div className="max-h-[82vh] overflow-y-auto pr-1 space-y-6 py-2 text-center animate-fade-in">
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
            <img src="/logo.png" alt="Meridian" className="h-16 w-16 object-contain drop-shadow" />
            <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <CheckCircle2 className="h-4 w-4" />
            </div>
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
              Order confirmation SMS sent to <strong className="text-foreground">{confirmedOrder.shippingAddress.phone}</strong> and email to <strong className="text-foreground">{confirmedOrder.shippingAddress.email}</strong>.
            </p>
          </div>

          {/* Receipt Breakdown Card */}
          <div className="rounded-2xl border border-border bg-muted/30 p-5 text-left text-xs space-y-3">
            <div className="flex justify-between pb-2 border-b border-border/60 text-muted-foreground">
              <span>Estimated Delivery</span>
              <span className="font-semibold text-foreground">2 - 4 Business Days (Blue Dart / Delhivery Express)</span>
            </div>

            <div className="flex justify-between text-muted-foreground">
              <span>Delivery Address</span>
              <span className="font-medium text-foreground text-right max-w-xs">
                {confirmedOrder.shippingAddress.address}, {confirmedOrder.shippingAddress.city},{" "}
                {confirmedOrder.shippingAddress.state} - {confirmedOrder.shippingAddress.postalCode}
              </span>
            </div>

            <div className="flex justify-between text-muted-foreground">
              <span>Payment Mode</span>
              <span className="font-medium text-foreground uppercase">
                {confirmedOrder.paymentMethod} (Verified & Encrypted)
              </span>
            </div>

            <div className="flex justify-between text-muted-foreground">
              <span>Items in Package</span>
              <span className="font-semibold text-foreground">
                {confirmedOrder.items.reduce((acc, i) => acc + i.quantity, 0)} units
              </span>
            </div>

            <div className="flex justify-between text-muted-foreground">
              <span>GST Included (18%)</span>
              <span className="font-medium text-foreground">{formatCurrency(confirmedOrder.gst)}</span>
            </div>

            <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t border-border">
              <span>Total Amount Paid / Payable</span>
              <span>{formatCurrency(confirmedOrder.total)}</span>
            </div>
          </div>

          {/* Storage & Invoice Note */}
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
        <div className="max-h-[82vh] overflow-y-auto pr-1">
          <form onSubmit={handleSubmitOrder} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Contact & Address in India */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Truck className="h-4 w-4" />
                <span>Delivery Address (India)</span>
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
                    <label className="font-medium text-foreground block mb-1">10-Digit Mobile</label>
                    <div className="flex items-center">
                      <span className="p-2.5 bg-muted border border-r-0 border-border rounded-l-xl text-muted-foreground font-mono">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-2.5 rounded-r-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                      />
                    </div>
                  </div>
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
                </div>

                <div>
                  <label className="font-medium text-foreground block mb-1">Flat / House No. / Building</label>
                  <input
                    type="text"
                    required
                    name="flatHouse"
                    value={formData.flatHouse}
                    onChange={handleInputChange}
                    className="w-full p-2.5 rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="font-medium text-foreground block mb-1">Street / Locality / Landmark</label>
                  <input
                    type="text"
                    required
                    name="streetArea"
                    value={formData.streetArea}
                    onChange={handleInputChange}
                    className="w-full p-2.5 rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="font-medium text-foreground block mb-1">PIN Code</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    />
                  </div>
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
                    <label className="font-medium text-foreground block mb-1">State</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer text-xs"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Payment Simulation (UPI, RuPay/Cards, COD) */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <CreditCard className="h-4 w-4" />
                <span>Payment Options (India)</span>
              </h4>

              {/* Payment Methods Grid */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "upi", label: "UPI (GPay / PhonePe)", icon: Smartphone },
                  { id: "card", label: "RuPay / Cards", icon: CreditCard },
                  { id: "cod", label: "Cash on Delivery", icon: Banknote },
                ].map((m) => {
                  const Icon = m.icon
                  const isSelected = formData.paymentMethod === m.id
                  return (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setFormData((p) => ({ ...p, paymentMethod: m.id }))}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border flex flex-col items-center gap-1 transition-all ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-muted/40 text-muted-foreground border-border hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{m.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* UPI Option Form */}
              {formData.paymentMethod === "upi" && (
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-2 text-xs">
                  <label className="font-medium text-foreground block">Enter UPI ID / VPA</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      placeholder="mobileNumber@upi or name@okhdfcbank"
                      className="w-full pl-9 p-2 rounded-lg bg-card border border-border font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-muted-foreground">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">✓ Instant Approval</span>
                    <span>Supports Google Pay, PhonePe, Paytm, BHIM</span>
                  </div>
                </div>
              )}

              {/* Card Option Form */}
              {formData.paymentMethod === "card" && (
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-3 text-xs">
                  <div>
                    <label className="font-medium text-foreground block mb-1">RuPay / Visa / Mastercard</label>
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
                      <label className="font-medium text-foreground block mb-1">Expiry Date</label>
                      <input
                        type="text"
                        name="cardExp"
                        value={formData.cardExp}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded-lg bg-card border border-border font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="font-medium text-foreground block mb-1">Security CVV</label>
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

              {/* COD Option Note */}
              {formData.paymentMethod === "cod" && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                  <span className="font-bold text-amber-700 dark:text-amber-400 block">
                    Cash on Delivery Available
                  </span>
                  <p className="text-muted-foreground text-[11px]">
                    Pay cash or scan courier QR code with UPI at the time of delivery. Free verification OTP will be sent to +91 {formData.phone}.
                  </p>
                </div>
              )}

              {/* Order Summary Receipt in Rupees */}
              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Coupon Discount ({appliedPromo?.code})</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Charges</span>
                  <span>{shipping === 0 ? "FREE" : formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated GST (18%)</span>
                  <span>{formatCurrency(gst)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t border-border">
                  <span>Total Amount Payable</span>
                  <span className="font-mono">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 border-t border-border flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Lock className="h-3.5 w-3.5 text-emerald-500" />
              <span>256-Bit Encrypted Indian Banking Gateway</span>
            </div>

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="px-6 h-11 text-sm font-bold shadow-lg"
            >
              <span>Confirm & Place Order</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    )}
  </Modal>
)
}
