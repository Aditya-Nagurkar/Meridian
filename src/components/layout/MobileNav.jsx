import React from "react"
import { useStore } from "../../context/StoreContext"
import { MobileNavBar } from "./MobileNavBar"

export function MobileNav({ onScrollToCatalog }) {
  const { isCartOpen, isWishlistOpen, isAccountOpen, isAuthOpen } = useStore()

  // Determine which tab is active based on current overlay state
  let activeTab = "home"
  if (isCartOpen) activeTab = "cart"
  else if (isWishlistOpen) activeTab = "wishlist"
  else if (isAccountOpen || isAuthOpen) activeTab = "account"

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden">
      <MobileNavBar activeTab={activeTab} onScrollToCatalog={onScrollToCatalog} />
    </div>
  )
}
