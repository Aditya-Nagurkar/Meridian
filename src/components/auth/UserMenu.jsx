import React, { useState, useRef, useEffect } from "react"
import { User, LogOut, Package, Award, MapPin, ChevronDown } from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"

export function UserMenu() {
  const { user, logout, setIsAuthOpen, orders } = useStore()
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

  const userOrdersCount = orders.filter((o) => o.userId === user.id).length

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 sm:pr-2.5 rounded-full sm:rounded-xl border border-border/80 hover:border-primary/40 bg-card/60 transition-all focus:outline-none"
        aria-label="User Account"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="h-7 w-7 rounded-full object-cover border border-primary/30"
          />
        ) : (
          <div className="h-7 w-7 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="hidden sm:inline text-xs font-semibold text-foreground max-w-[100px] truncate">
          {user.name.split(" ")[0]}
        </span>
        <ChevronDown className="hidden sm:inline h-3 w-3 text-muted-foreground" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-popover/95 backdrop-blur-xl p-3 shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 duration-150">
          {/* User Header */}
          <div className="flex items-center gap-2.5 pb-3 border-b border-border/60">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover border border-primary/30"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-foreground truncate">{user.name}</h4>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
              <Badge variant="accent" className="mt-1 text-[9px] px-1.5 py-0">
                {user.tier || "Member"}
              </Badge>
            </div>
          </div>

          {/* Details & Stats */}
          <div className="py-2.5 space-y-2 text-xs text-muted-foreground border-b border-border/60">
            {user.rewardPoints !== undefined && (
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-primary" />
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
              <div className="flex items-start gap-1.5 text-[10px] text-muted-foreground pt-1">
                <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                <span className="truncate">
                  {user.defaultAddress.city}, {user.defaultAddress.state}
                </span>
              </div>
            )}
          </div>

          {/* Sign Out Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                logout()
                setIsOpen(false)
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
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
