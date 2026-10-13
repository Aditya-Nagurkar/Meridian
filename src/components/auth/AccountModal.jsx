import React from "react"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Award,
  LogOut,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { Modal } from "../common/Modal"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Card, CardContent } from "../ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { formatCurrency, handleImageFallback } from "../../lib/utils"

export function AccountModal() {
  const {
    isAccountOpen,
    setIsAccountOpen,
    user,
    logout,
    orders,
    products,
    setQuickViewProduct,
  } = useStore()

  if (!user) return null

  const safeOrders = Array.isArray(orders) ? orders : []
  const userOrders = safeOrders.filter((o) => o?.userId === user.id || o?.userId === "guest")

  const handleSignOut = () => {
    logout()
    setIsAccountOpen(false)
  }

  const handleViewProduct = (item) => {
    const liveMatch = (products || []).find(
      (p) =>
        String(p.id) === String(item.productId) ||
        p.name.toLowerCase() === (item.name || "").toLowerCase()
    )
    if (liveMatch) {
      setQuickViewProduct(liveMatch)
      setIsAccountOpen(false)
    }
  }

  const getOrderItems = (order) => {
    if (Array.isArray(order.items) && order.items.length > 0) {
      return order.items.map((item) => {
        const liveMatch = (products || []).find((p) => String(p.id) === String(item.productId))
        return {
          ...item,
          name: item.name || liveMatch?.name || "Curated Essential",
          image: item.image || liveMatch?.images?.[0] || "/logo.png",
          priceAtPurchase: item.priceAtPurchase || item.price || liveMatch?.price || order.total,
          quantity: item.quantity || 1,
        }
      })
    }
    // Fallback for orders without an items array
    const matched =
      (products || []).find((p) => Math.abs(p.price - (order.total || 0)) < 400) ||
      (products && products[0])
    return [
      {
        name: matched ? matched.name : "Curated Lifestyle Essential",
        image: matched ? matched.images[0] : "/logo.png",
        priceAtPurchase: order.total || (matched ? matched.price : 1499),
        quantity: 1,
        productId: matched?.id,
      },
    ]
  }

  return (
    <Modal
      isOpen={isAccountOpen}
      onClose={() => setIsAccountOpen(false)}
      title="Account Profile"
      activeNavTab="account"
      maxWidth="max-w-xl"
      showCloseButton={true}
    >
      <div className="space-y-5">
        {/* Header / Profile Header */}
        <div className="flex items-start gap-3.5 pb-4 border-b border-border">
          <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border-2 border-primary/30 flex-shrink-0 shadow-md">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
            <AvatarFallback className="text-xl font-bold bg-primary/15 text-primary">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground font-['Space_Grotesk']">
                {user.name}
              </h2>
              <Badge variant="accent" className="text-[10px] px-2 py-0.5">
                {user.tier || "Member"}
              </Badge>
            </div>

            <div className="space-y-0.5 mt-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loyalty & Tier Benefits */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
              <Award className="h-4 w-4" />
              <span>Reward Points</span>
            </div>
            <div className="text-xl font-black text-foreground font-mono mt-1">
              {user.rewardPoints || 0}
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Redeemable at checkout
            </p>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Member Status</span>
            </div>
            <div className="text-sm font-bold text-foreground mt-1 truncate">
              {user.tier || "Active Member"}
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Free Express Shipping unlocked
            </p>
          </div>
        </div>

        {/* Saved Shipping Address */}
        {user.defaultAddress && (
          <div className="p-3.5 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Default Delivery Address
              </span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">
                Primary
              </span>
            </div>
            <div className="text-xs text-muted-foreground space-y-0.5 leading-relaxed">
              <p className="font-semibold text-foreground">
                {user.defaultAddress.fullName}
              </p>
              <p>{user.defaultAddress.street}</p>
              <p>
                {user.defaultAddress.city}, {user.defaultAddress.state} -{" "}
                <span className="font-mono font-medium text-foreground">
                  {user.defaultAddress.pincode}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Order History */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Package className="h-4 w-4 text-primary" />
              Recent Orders ({userOrders.length})
            </h3>
          </div>

          {userOrders.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-border rounded-xl bg-muted/20">
              <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-xs text-muted-foreground">No orders placed yet.</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Items you purchase will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {userOrders.slice(0, 5).map((order) => {
                const orderItems = getOrderItems(order)
                return (
                  <div
                    key={order.orderId}
                    className="p-3.5 sm:p-4 rounded-2xl border border-border bg-card hover:border-[#C59B3C]/50 transition-all shadow-sm space-y-3"
                  >
                    {/* Order Top Bar: ID, Status, Total */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-foreground">
                          {order.orderId}
                        </span>
                        <Badge
                          variant="default"
                          className="text-[9px] px-2 py-0.5 bg-emerald-600 text-white font-semibold"
                        >
                          {order.status || "Confirmed"}
                        </Badge>
                      </div>
                      <span className="font-black text-sm text-foreground font-mono">
                        {formatCurrency(order.total)}
                      </span>
                    </div>

                    {/* Order Meta: Date & Payment Method */}
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        {new Date(order.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      {order.paymentMethod && (
                        <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/60">
                          {order.paymentMethod}
                        </span>
                      )}
                    </div>

                    {/* Ordered Items List */}
                    <div className="pt-2 border-t border-border/60 space-y-2">
                      <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground font-bold">
                        Items Ordered ({orderItems.length})
                      </div>

                      <div className="space-y-2">
                        {orderItems.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-2 sm:p-2.5 rounded-xl bg-[#F7F2E8]/70 dark:bg-muted/40 border border-[#E8DEC9] dark:border-border/60 transition-colors"
                          >
                            {/* Product Thumbnail on Sandstone Pedestal */}
                            <div className="h-12 w-12 sm:h-13 sm:w-13 rounded-lg overflow-hidden bg-[#F2EBE0] dark:bg-muted/60 border border-[#DDD1BD] dark:border-border/80 flex-shrink-0 p-1">
                              <img
                                src={item.image}
                                alt={item.name}
                                onError={handleImageFallback}
                                className="h-full w-full object-contain object-center"
                              />
                            </div>

                            {/* Product Title, Quantity & Price */}
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs sm:text-sm font-bold text-foreground truncate leading-snug">
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground font-mono">
                                <span>Qty: {item.quantity}</span>
                                <span>•</span>
                                <span className="font-bold text-foreground font-mono">
                                  {formatCurrency(item.priceAtPurchase)}
                                </span>
                              </div>
                              {(item.selectedColor || item.selectedSize) && (
                                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground">
                                  {item.selectedColor && (
                                    <span className="px-1.5 py-0.5 rounded bg-card border border-border text-[9px] font-medium">
                                      {item.selectedColor}
                                    </span>
                                  )}
                                  {item.selectedSize && (
                                    <span className="px-1.5 py-0.5 rounded bg-card border border-border text-[9px] font-medium font-mono">
                                      Size {item.selectedSize}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* View Product Details Button */}
                            <button
                              onClick={() => handleViewProduct(item)}
                              className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-card hover:bg-secondary text-foreground flex items-center gap-1 flex-shrink-0 transition-colors shadow-sm"
                              title="View product in store"
                            >
                              <Eye className="h-3 w-3 text-primary" />
                              <span className="hidden sm:inline">View</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Address Destination Snippet */}
                    {order.shippingAddress && (
                      <div className="pt-2 border-t border-border/40 text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        <span className="truncate">
                          Delivering to: {order.shippingAddress.name || order.shippingAddress.address},{" "}
                          {order.shippingAddress.city || ""} ({order.shippingAddress.postalCode || ""})
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center gap-2.5 border-t border-border">
          <Button
            type="button"
            variant="destructive"
            onClick={handleSignOut}
            className="flex-1 font-semibold text-xs"
          >
            <LogOut className="h-3.5 w-3.5 mr-1.5" />
            <span>Sign Out</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setIsAccountOpen(false)}
            className="flex-1 font-semibold text-xs"
          >
            <span>Close</span>
          </Button>
        </div>
      </div>
    </Modal>
  )
}
