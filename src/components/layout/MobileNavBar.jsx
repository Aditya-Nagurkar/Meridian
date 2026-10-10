import React from "react"
import { Home, Compass, Heart, ShoppingBag, User } from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { cn } from "../../lib/utils"

export function MobileNavBar({ activeTab = "home", onScrollToCatalog, className }) {
  const {
    cartCount,
    wishlistCount,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsAuthOpen,
    setIsAccountOpen,
    setQuickViewProduct,
    setIsCheckoutOpen,
    user,
  } = useStore()

  const closeAllOverlays = () => {
    setIsCartOpen(false)
    setIsWishlistOpen(false)
    setIsAccountOpen(false)
    setIsAuthOpen(false)
    setIsCheckoutOpen(false)
    setQuickViewProduct(null)
  }

  const handleTabClick = (tab) => {
    if (tab === "home") {
      closeAllOverlays()
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    if (tab === "explore") {
      closeAllOverlays()
      if (onScrollToCatalog) {
        onScrollToCatalog()
      } else {
        const el = document.getElementById("catalog-section") || document.querySelector("main")
        el?.scrollIntoView({ behavior: "smooth" })
      }
      return
    }

    if (tab === "wishlist") {
      if (activeTab === "wishlist") return
      closeAllOverlays()
      setIsWishlistOpen(true)
      return
    }

    if (tab === "cart") {
      if (activeTab === "cart") return
      closeAllOverlays()
      setIsCartOpen(true)
      return
    }

    if (tab === "account") {
      if (activeTab === "account") return
      closeAllOverlays()
      if (user) {
        setIsAccountOpen(true)
      } else {
        setIsAuthOpen(true)
      }
      return
    }
  }

  const tabs = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      badge: 0,
    },
    {
      id: "explore",
      label: "Explore",
      icon: Compass,
      badge: 0,
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: Heart,
      badge: wishlistCount,
      badgeColor: "bg-red-500 text-white",
    },
    {
      id: "cart",
      label: "Cart",
      icon: ShoppingBag,
      badge: cartCount,
      badgeColor: "bg-primary text-primary-foreground",
    },
    {
      id: "account",
      label: user ? user.name.split(" ")[0] : "Profile",
      icon: User,
      badge: 0,
      customAvatar: user ? (
        <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[9px]">
          {user.name.charAt(0).toUpperCase()}
        </div>
      ) : null,
    },
  ]

  return (
    <nav
      className={cn(
        "w-full bg-card/95 backdrop-blur-xl border-t border-border px-2 py-1.5 safe-area-pb shadow-lg",
        className
      )}
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                "relative flex flex-col items-center justify-center min-w-[56px] py-1 px-1.5 rounded-xl transition-all duration-150 active:scale-95",
                isActive
                  ? "text-primary font-bold bg-primary/10"
                  : "text-muted-foreground hover:text-foreground font-medium"
              )}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="relative flex items-center justify-center h-6 w-6">
                {tab.customAvatar ? (
                  tab.customAvatar
                ) : (
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-transform",
                      isActive ? "scale-105 stroke-[2.4]" : "stroke-[1.8]"
                    )}
                  />
                )}

                {tab.badge > 0 && (
                  <span
                    className={cn(
                      "absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center shadow-sm font-mono",
                      tab.badgeColor
                    )}
                  >
                    {tab.badge > 99 ? "99+" : tab.badge}
                  </span>
                )}
              </div>

              <span
                className={cn(
                  "text-[10px] mt-0.5 truncate max-w-[52px] leading-tight",
                  isActive ? "text-primary font-bold" : "text-muted-foreground"
                )}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
