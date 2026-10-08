import React, { createContext, useContext } from "react"
import { useStore as useZustandStore } from "../store/useStore"
import { FREE_SHIPPING_THRESHOLD } from "../lib/constants"

const StoreContext = createContext(null)

/**
 * StoreProvider wrapper for backward compatibility with React tree
 */
export function StoreProvider({ children }) {
  return children
}

/**
 * useStore hook adapter
 * Connects directly to the normalized Zustand store while exposing the exact same
 * API and hydrated models expected by existing UI components.
 */
export function useStore() {
  const store = useZustandStore()

  // Hydrate normalized items for components
  const cart = store.getHydratedCart()
  const wishlist = store.getHydratedWishlist()
  const recentlyViewed = store.getHydratedRecentlyViewed()

  const subtotal = store.getCartSubtotal()
  const discount = store.getCartDiscount()
  const gst = store.getCartGst()
  const shipping = store.getCartShipping()
  const total = store.getCartTotal()
  const cartCount = store.getCartCount()
  const wishlistCount = store.wishlist.length

  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100))

  return {
    // Cart
    cart,
    addToCart: store.addToCart,
    updateCartQuantity: store.updateCartQuantity,
    removeFromCart: store.removeFromCart,
    clearCart: store.clearCart,
    cartCount,
    subtotal,
    discount,
    shipping,
    tax: gst,
    gst,
    total,
    freeShippingRemaining,
    freeShippingProgress,
    appliedPromo: store.appliedPromo,
    applyPromoCode: store.applyPromoCode,
    removePromoCode: store.removePromoCode,

    // Wishlist
    wishlist,
    toggleWishlist: store.toggleWishlist,
    isInWishlist: store.isInWishlist,
    wishlistCount,

    // Recently Viewed
    recentlyViewed,
    recordProductView: store.recordProductView,

    // Filters
    filters: store.filters,
    updateFilter: store.updateFilter,
    resetFilters: store.resetFilters,

    // Drawers, Modals & Auth UI
    isCartOpen: store.isCartOpen,
    setIsCartOpen: store.setIsCartOpen,
    isWishlistOpen: store.isWishlistOpen,
    setIsWishlistOpen: store.setIsWishlistOpen,
    isCheckoutOpen: store.isCheckoutOpen,
    setIsCheckoutOpen: store.setIsCheckoutOpen,
    isAuthOpen: store.isAuthOpen,
    setIsAuthOpen: store.setIsAuthOpen,
    isAccountOpen: store.isAccountOpen,
    setIsAccountOpen: store.setIsAccountOpen,
    quickViewProduct: store.quickViewProduct,
    setQuickViewProduct: store.setQuickViewProduct,

    // Auth
    user: store.user,
    login: store.login,
    register: store.register,
    logout: store.logout,

    // Toasts
    toasts: store.toasts,
    addToast: store.addToast,
    removeToast: store.removeToast,

    // Orders
    orders: store.orders,
    completeOrder: (orderDetails) => store.createOrder(orderDetails),
    createOrder: store.createOrder,
  }
}
