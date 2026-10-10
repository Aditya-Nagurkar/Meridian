import React, { useState, useRef, useEffect } from "react"
import { User, LogOut, Package, Award, MapPin, ChevronDown, ExternalLink } from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"

export function UserMenu() {
  const { user, logout, setIsAuthOpen, setIsAccountOpen, orders } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!user) {
    return (
      <Button
        onClick={() => setIsAuthOpen(true)}
        variant="outline"
        size="sm"
        className="h-9 px-3 gap-1.5 rounded-xl border-border/80 hover:border-primary/40 text-xs font-semibold"
      >
        <User className="h-3.5 w-3.5 text-primary" />
        <span className="hidden sm:inline">Sign In</span>
      </Button>
    )
  }

  const safeOrders = Array.isArray(orders) ? orders : []
  const userOrdersCount = safeOrders.filter((o) => o?.userId === user.id).length

  const handleAvatarClick = () => {
    // On mobile devices, open the responsive AccountModal directly instead of overflowing
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      setIsAccountOpen(true)
      return
    }
    // On desktop, toggle the floating card dropdown
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleAvatarClick}
        className="flex items-center gap-2 p-0.5 sm:pr-2.5 rounded-full sm:rounded-xl border border-border/80 hover:border-primary/40 bg-card/80 transition-all focus:outline-none"
        aria-label="User Account"
      >
        <Avatar className="h-7 w-7 border border-primary/30">
          {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
          <AvatarFallback className="text-[11px] font-bold">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <span className="hidden sm:inline text-xs font-semibold text-foreground max-w-[100px] truncate">
          {user.name.split(" ")[0]}
        </span>
        <ChevronDown className="hidden sm:inline h-3 w-3 text-muted-foreground" />
      </button>

      {/* Desktop Dropdown Menu - 100% Solid, High-Contrast & Screen-Bounded */}
      {isOpen && (
        <div className="hidden sm:block absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card text-card-foreground shadow-2xl z-50 p-3.5 animate-in fade-in-50 zoom-in-95 duration-150 ring-1 ring-border/50">
          {/* User Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-border/80">
            <Avatar className="h-10 w-10 border border-primary/30">
              {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
              <AvatarFallback className="text-sm font-bold">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-foreground truncate">{user.name}</h4>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
              <Badge variant="accent" className="mt-1 text-[9px] px-2 py-0.5">
                {user.tier || "Member"}
              </Badge>
            </div>
          </div>

          {/* Details & Stats */}
          <div className="py-3 space-y-2.5 text-xs text-muted-foreground border-b border-border/80">
            {user.rewardPoints !== undefined && (
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-amber-500" />
                  Reward Points:
                </span>
                <span className="font-bold text-foreground font-mono">
                  {user.rewardPoints} pts
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5 text-primary" />
                Orders Placed:
              </span>
              <span className="font-bold text-foreground font-mono">
                {userOrdersCount}
              </span>
            </div>

            {user.defaultAddress && (
              <div className="flex items-start gap-1.5 text-[10px] text-muted-foreground pt-0.5">
                <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                <span className="truncate">
                  {user.defaultAddress.city}, {user.defaultAddress.state}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2.5 space-y-1.5">
            <button
              onClick={() => {
                setIsAccountOpen(true)
                setIsOpen(false)
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-foreground hover:bg-muted transition-colors border border-border/60"
            >
              <span>View Account Details</span>
              <ExternalLink className="h-3 w-3 ml-1 text-muted-foreground" />
            </button>

            <button
              onClick={() => {
                logout()
                setIsOpen(false)
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
