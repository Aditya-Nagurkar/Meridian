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
} from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { Modal } from "../common/Modal"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { formatCurrency } from "../../lib/utils"

export function AccountModal() {
  const { isAccountOpen, setIsAccountOpen, user, logout, orders } = useStore()

  if (!user) return null

  const userOrders = orders.filter((o) => o.userId === user.id || o.userId === "guest")

  const handleSignOut = () => {
    logout()
    setIsAccountOpen(false)
  }

  return (
    <Modal
      isOpen={isAccountOpen}
      onClose={() => setIsAccountOpen(false)}
      maxWidth="max-w-lg"
      showCloseButton={true}
    >
      <div className="space-y-5 max-h-[80vh] overflow-y-auto pr-1">
        {/* Header / Profile Header */}
        <div className="flex items-start gap-3.5 pb-4 border-b border-border">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl object-cover border-2 border-primary/30 flex-shrink-0 shadow-md"
            />
          ) : (
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-primary/15 text-primary flex items-center justify-center font-bold text-xl flex-shrink-0 border border-primary/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}

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
            <div className="space-y-2.5">
              {userOrders.slice(0, 3).map((order) => (
                <div
                  key={order.orderId}
                  className="p-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-foreground">
                        {order.orderId}
                      </span>
                      <Badge variant="default" className="text-[9px] px-1.5 py-0">
                        {order.status || "Confirmed"}
                      </Badge>
                    </div>
                    <span className="font-black text-xs text-foreground font-mono">
                      {formatCurrency(order.total)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(order.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span>
                      {order.items?.length || 1} item{order.items?.length > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              ))}
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
