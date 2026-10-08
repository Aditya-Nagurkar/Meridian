import React, { createContext, useContext, useState, useMemo, useCallback } from "react"
import { useLocalStorage } from "../hooks/useLocalStorage"
import { useSessionStorage } from "../hooks/useSessionStorage"
import { PROMO_CODES, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_COST, ESTIMATED_GST_RATE } from "../lib/constants"

const StoreContext = createContext(null)

const INITIAL_FILTERS = {
  category: "all",
  searchQuery: "",
  sortBy: "featured",
  maxPrice: 10000,
  inStockOnly: false,
}

export function StoreProvider({ children }) {
  // 1. LocalStorage Persisted State: Shopping Cart, Wishlist & Order History
  const [cart, setCart] = useLocalStorage("meridian_cart", [])
  const [wishlist, setWishlist] = useLocalStorage("meridian_wishlist", [])
  const [orders, setOrders] = useLocalStorage("meridian_orders", [])

  // 2. SessionStorage Persisted State: Recently Viewed & Active Filters
  const [recentlyViewed, setRecentlyViewed] = useSessionStorage("meridian_recently_viewed", [])
  const [filters, setFilters] = useSessionStorage("meridian_filters", INITIAL_FILTERS)

  // 3. UI States (Drawers, Modals, Promo Code, Toast Notifications)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [toasts, setToasts] = useState([])

  // --- Toast Management ---
  const addToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // --- Cart Operations ---
  const addToCart = useCallback((product, quantity = 1, options = {}) => {
    const color = options.color || (product.colors && product.colors[0]) || null
    const size = options.size || (product.sizes && product.sizes[0]) || null
    const cartItemId = `${product.id}-${color || "none"}-${size || "none"}`

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId)
      if (existingItemIndex > -1) {
        const updated = [...prevCart]
        const currentQty = updated[existingItemIndex].quantity
        const newQty = Math.min(currentQty + quantity, product.stock)
        updated[existingItemIndex] = {
          ...updated[existingItemIndex],
          quantity: newQty,
        }
        return updated
      } else {
        return [
          ...prevCart,
          {
            cartItemId,
            product,
            quantity: Math.min(quantity, product.stock),
            selectedColor: color,
            selectedSize: size,
          },
        ]
      }
    })

    addToast(`Added "${product.name}" to your cart.`, "success")
  }, [setCart, addToast])

  const updateCartQuantity = useCallback((cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId))
      return
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const clampedQty = Math.min(newQuantity, item.product.stock)
          return { ...item, quantity: clampedQty }
        }
        return item
      })
    )
  }, [setCart])

  const removeFromCart = useCallback((cartItemId) => {
    setCart((prev) => {
      const removed = prev.find((item) => item.cartItemId === cartItemId)
      if (removed) {
        addToast(`Removed "${removed.product.name}" from cart.`, "info")
      }
      return prev.filter((item) => item.cartItemId !== cartItemId)
    })
  }, [setCart, addToast])

  const clearCart = useCallback(() => {
    setCart([])
  }, [setCart])

  // --- Promo Code Operations ---
  const applyPromoCode = useCallback((codeString) => {
    const code = codeString.trim().toUpperCase()
    if (!code) return { success: false, message: "Please enter a coupon code" }

    const promo = PROMO_CODES[code]
    if (!promo) {
      addToast(`Coupon "${code}" is invalid or expired.`, "error")
      return { success: false, message: "Invalid coupon code" }
    }

    setAppliedPromo({ code, ...promo })
    addToast(`Coupon "${code}" applied successfully!`, "success")
    return { success: true, message: "Applied successfully!" }
  }, [addToast])

  const removePromoCode = useCallback(() => {
    setAppliedPromo(null)
    addToast("Coupon code removed.", "info")
  }, [addToast])

  // --- Cart Financial Calculations (Rupees & GST) ---
  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0)
  }, [cart])

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  }, [cart])

  const discount = useMemo(() => {
    if (!appliedPromo || subtotal === 0) return 0
    if (appliedPromo.minSubtotal && subtotal < appliedPromo.minSubtotal) {
      return 0
    }
    if (appliedPromo.discountPercent) {
      return Math.round((subtotal * appliedPromo.discountPercent) / 100)
    }
    if (appliedPromo.discountAmount) {
      return Math.min(appliedPromo.discountAmount, subtotal)
    }
    return 0
  }, [appliedPromo, subtotal])

  const shipping = useMemo(() => {
    if (subtotal === 0) return 0
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST
  }, [subtotal])

  const freeShippingRemaining = useMemo(() => {
    return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  }, [subtotal])

  const freeShippingProgress = useMemo(() => {
    if (subtotal >= FREE_SHIPPING_THRESHOLD) return 100
    return Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  }, [subtotal])

  const gst = useMemo(() => {
    const taxableAmount = Math.max(0, subtotal - discount)
    return Math.round(taxableAmount * ESTIMATED_GST_RATE)
  }, [subtotal, discount])

  const total = useMemo(() => {
    if (subtotal === 0) return 0
    return Math.max(0, subtotal - discount) + shipping + gst
  }, [subtotal, discount, shipping, gst])

  // --- Wishlist Operations ---
  const isInWishlist = useCallback((productId) => {
    return wishlist.some((item) => (typeof item === "string" ? item === productId : item.id === productId))
  }, [wishlist])

  const toggleWishlist = useCallback((product) => {
    const exists = isInWishlist(product.id)
    if (exists) {
      setWishlist((prev) => prev.filter((item) => (typeof item === "string" ? item !== product.id : item.id !== product.id)))
      addToast(`Removed "${product.name}" from wishlist.`, "info")
    } else {
      setWishlist((prev) => [...prev, product])
      addToast(`Saved "${product.name}" to your wishlist.`, "success")
    }
  }, [isInWishlist, setWishlist, addToast])

  const wishlistCount = wishlist.length

  // --- Recently Viewed Operations (SessionStorage) ---
  const recordProductView = useCallback((product) => {
    if (!product || !product.id) return
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id)
      return [product, ...filtered].slice(0, 8)
    })
  }, [setRecentlyViewed])

  // --- Filter Operations ---
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [setFilters])

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS)
  }, [setFilters])

  // --- Checkout Simulation ---
  const completeOrder = useCallback((orderDetails) => {
    const newOrder = {
      orderId: orderDetails.orderId,
      date: new Date().toISOString(),
      items: [...cart],
      subtotal,
      discount,
      shipping,
      gst,
      total,
      shippingAddress: orderDetails.shippingAddress,
      paymentMethod: orderDetails.paymentMethod,
    }

    setOrders((prev) => [newOrder, ...prev])
    clearCart()
    setAppliedPromo(null)
    return newOrder
  }, [cart, subtotal, discount, shipping, gst, total, setOrders, clearCart])

  const value = {
    // Cart
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    subtotal,
    discount,
    shipping,
    tax: gst,
    gst,
    total,
    freeShippingRemaining,
    freeShippingProgress,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    
    // Wishlist
    wishlist,
    toggleWishlist,
    isInWishlist,
    wishlistCount,
    
    // Recently Viewed
    recentlyViewed,
    recordProductView,
    
    // Filters
    filters,
    updateFilter,
    resetFilters,
    
    // Drawers & Modals
    isCartOpen,
    setIsCartOpen,
    isWishlistOpen,
    setIsWishlistOpen,
    isCheckoutOpen,
    setIsCheckoutOpen,
    quickViewProduct,
    setQuickViewProduct,
    
    // Toasts
    toasts,
    addToast,
    removeToast,
    
    // Orders
    orders,
    completeOrder,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
