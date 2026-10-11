import { create } from "zustand"
import { fetchProductsFromAPI } from "../services/productService"
import { fetchUsersFromAPI, loginWithAPI, registerWithAPI } from "../services/authService"
import { fetchUserCartFromAPI, syncCartToAPI } from "../services/cartService"
import {
  PROMO_CODES,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_COST,
  ESTIMATED_GST_RATE,
} from "../lib/constants"
import { generateOrderId } from "../lib/utils"

// -------------------------------------------------------------
// DEDICATED STORAGE ENGINES (Isolated Keys in LocalStorage)
// -------------------------------------------------------------
// CART       -> window.localStorage (key: 'meridian_cart')
// ORDERS     -> window.localStorage (key: 'meridian_orders')
// WISHLIST   -> window.localStorage (key: 'meridian_wishlist')
// AUTH       -> window.localStorage (key: 'meridian_auth')
// FILTERS    -> window.sessionStorage (key: 'meridian_filters')
// -------------------------------------------------------------
const storageSafe = {
  getLocal: (key, fallback) => {
    if (typeof window === "undefined") return fallback
    try {
      const raw = window.localStorage.getItem(key)
      if (!raw) return fallback
      const parsed = JSON.parse(raw)
      if (Array.isArray(fallback)) {
        if (Array.isArray(parsed)) return parsed
        if (parsed && typeof parsed === "object") return [parsed]
        return fallback
      }
      return parsed ?? fallback
    } catch {
      return fallback
    }
  },
  setLocal: (key, val) => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(key, JSON.stringify(val))
    } catch (e) {
      console.warn(`[localStorage] Error saving ${key}:`, e)
    }
  },
  getSession: (key, fallback) => {
    if (typeof window === "undefined") return fallback
    try {
      const raw = window.sessionStorage.getItem(key)
      if (!raw) return fallback
      const parsed = JSON.parse(raw)
      if (Array.isArray(fallback)) {
        if (Array.isArray(parsed)) return parsed
        if (parsed && typeof parsed === "object") return [parsed]
        return fallback
      }
      return parsed ?? fallback
    } catch {
      return fallback
    }
  },
  setSession: (key, val) => {
    if (typeof window === "undefined") return
    try {
      window.sessionStorage.setItem(key, JSON.stringify(val))
    } catch (e) {
      console.warn(`[sessionStorage] Error saving ${key}:`, e)
    }
  },
}

// Migrate any session orders or legacy v2 blob to localStorage and sanitize array structures
if (typeof window !== "undefined") {
  try {
    // Migrate orders from sessionStorage to localStorage if any exist
    const sessionOrders = window.sessionStorage.getItem("meridian_orders")
    if (sessionOrders) {
      if (!window.localStorage.getItem("meridian_orders")) {
        window.localStorage.setItem("meridian_orders", sessionOrders)
      }
      window.sessionStorage.removeItem("meridian_orders")
    }

    // Ensure meridian_orders in localStorage is strictly a valid JSON array
    const rawOrders = window.localStorage.getItem("meridian_orders")
    if (rawOrders) {
      try {
        const parsed = JSON.parse(rawOrders)
        if (!Array.isArray(parsed)) {
          const sanitized = parsed && typeof parsed === "object" ? [parsed] : []
          window.localStorage.setItem("meridian_orders", JSON.stringify(sanitized))
        }
      } catch {
        window.localStorage.setItem("meridian_orders", "[]")
      }
    }

    // Clean up legacy v2 blob
    const legacy = window.localStorage.getItem("meridian_storage_v2")
    if (legacy) {
      const parsed = JSON.parse(legacy)
      if (parsed?.state) {
        if (parsed.state.cart?.length && !window.localStorage.getItem("meridian_cart")) {
          storageSafe.setLocal("meridian_cart", parsed.state.cart)
        }
        if (parsed.state.wishlist?.length && !window.localStorage.getItem("meridian_wishlist")) {
          storageSafe.setLocal("meridian_wishlist", parsed.state.wishlist)
        }
        if (parsed.state.user && !window.localStorage.getItem("meridian_auth")) {
          storageSafe.setLocal("meridian_auth", parsed.state.user)
        }
        if (parsed.state.orders && !window.localStorage.getItem("meridian_orders")) {
          const ords = Array.isArray(parsed.state.orders) ? parsed.state.orders : [parsed.state.orders]
          storageSafe.setLocal("meridian_orders", ords)
        }
      }
      window.localStorage.removeItem("meridian_storage_v2")
    }
  } catch {
    // Ignore migration cleanup errors
  }
}

const INITIAL_FILTERS = {
  category: "all",
  searchQuery: "",
  sortBy: "featured",
  maxPrice: 150000,
  inStockOnly: false,
}

export const useStore = create((set, get) => ({
  // -------------------------------------------------------------
  // DYNAMIC PRODUCTS (Fetched from DummyJSON API)
  // -------------------------------------------------------------
  products: storageSafe.getSession("meridian_dummyjson_products_cache", []),
  isLoadingProducts: true,
  productsError: null,

  fetchProducts: async () => {
    // If cache is empty, flag loading
    if (get().products.length === 0) {
      set({ isLoadingProducts: true, productsError: null })
    }
    try {
      const liveProducts = await fetchProductsFromAPI()
      set({
        products: liveProducts,
        isLoadingProducts: false,
        productsError: null,
      })
      return liveProducts
    } catch (err) {
      console.error("[useStore] Error fetching products from DummyJSON:", err)
      set({
        isLoadingProducts: false,
        productsError: err.message || "Failed to load products from DummyJSON API",
      })
      return get().products
    }
  },

  // -------------------------------------------------------------
  // LIVE USERS (Fetched from DummyJSON Users API)
  // -------------------------------------------------------------
  demoUsers: storageSafe.getSession("meridian_dummyjson_users_cache_v1", []),
  isLoadingDemoUsers: false,

  fetchDemoUsers: async () => {
    if (get().demoUsers.length === 0) {
      set({ isLoadingDemoUsers: true })
    }
    try {
      const liveUsers = await fetchUsersFromAPI(6)
      set({ demoUsers: liveUsers, isLoadingDemoUsers: false })
      return liveUsers
    } catch (err) {
      console.warn("[useStore] Error loading demo users from DummyJSON:", err)
      set({ isLoadingDemoUsers: false })
      return get().demoUsers
    }
  },

  // -------------------------------------------------------------
  // 1. LOCAL STORAGE PERSISTED (Dedicated independent keys)
  // -------------------------------------------------------------
  cart: storageSafe.getLocal("meridian_cart", []),
  orders: storageSafe.getLocal("meridian_orders", []),
  wishlist: storageSafe.getLocal("meridian_wishlist", []),
  user: storageSafe.getLocal("meridian_auth", null),

  // -------------------------------------------------------------
  // 2. SESSION STORAGE PERSISTED (Transient Session State)
  // -------------------------------------------------------------
  recentlyViewedIds: storageSafe.getSession("meridian_recently_viewed", []),
  filters: storageSafe.getSession("meridian_filters", INITIAL_FILTERS),

  // -------------------------------------------------------------
  // 3. TRANSIENT UI STATE (Not persisted)
  // -------------------------------------------------------------
  isCartOpen: false,
  isWishlistOpen: false,
  isCheckoutOpen: false,
  isAuthOpen: false,
  isAccountOpen: false,
  quickViewProduct: null,
  appliedPromo: null,
  toasts: [],

  // -------------------------------------------------------------
  // 4. TOAST MANAGEMENT
  // -------------------------------------------------------------
  addToast: (message, type = "success") => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6)
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }))
    setTimeout(() => {
      get().removeToast(id)
    }, 3500)
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },

  // -------------------------------------------------------------
  // 5. UI MODAL TOGGLES
  // -------------------------------------------------------------
  setIsCartOpen: (open) => set({ isCartOpen: open }),
  setIsWishlistOpen: (open) => set({ isWishlistOpen: open }),
  setIsCheckoutOpen: (open) => set({ isCheckoutOpen: open }),
  setIsAuthOpen: (open) => set({ isAuthOpen: open }),
  setIsAccountOpen: (open) => set({ isAccountOpen: open }),
  setQuickViewProduct: (product) => set({ quickViewProduct: product }),

  // -------------------------------------------------------------
  // 6. AUTHENTICATION (Saved to localStorage: meridian_auth)
  // -------------------------------------------------------------
  login: async (identifier, password) => {
    try {
      const res = await loginWithAPI(identifier, password)
      if (res.success && res.user) {
        storageSafe.setLocal("meridian_auth", res.user)
        set({ user: res.user, isAuthOpen: false, isAccountOpen: true })
        get().addToast(`Welcome back, ${res.user.name}!`, "success")

        // Sync or import user cart from DummyJSON Carts API if local cart is empty
        if (get().cart.length === 0 && res.user.id) {
          try {
            const remoteCart = await fetchUserCartFromAPI(res.user.id)
            if (remoteCart && remoteCart.length > 0) {
              const mapped = remoteCart.map((p) => ({
                cartItemId: `${p.id}-default-default`,
                productId: String(p.id),
                quantity: p.quantity,
                selectedColor: "Default Finish",
                selectedSize: null,
              }))
              set({ cart: mapped })
              storageSafe.setLocal("meridian_cart", mapped)
              get().addToast(`Synced ${mapped.length} items from your account cart.`, "info")
            }
          } catch (e) {
            console.warn("[useStore] Could not fetch remote cart:", e)
          }
        }

        return { success: true, user: res.user }
      }

      get().addToast(res.error || "Invalid username or password.", "error")
      return { success: false, error: res.error || "Invalid credentials" }
    } catch (err) {
      get().addToast("Authentication service unavailable.", "error")
      return { success: false, error: err.message }
    }
  },

  register: async (name, email, password, phone = "") => {
    const trimmedEmail = email.trim().toLowerCase()
    if (!name || !trimmedEmail || password.length < 6) {
      get().addToast("Please fill all fields (password min 6 chars).", "error")
      return { success: false, error: "Validation failed" }
    }

    try {
      const res = await registerWithAPI(name, trimmedEmail, password, phone)
      if (res.success && res.user) {
        storageSafe.setLocal("meridian_auth", res.user)
        set({ user: res.user, isAuthOpen: false, isAccountOpen: true })
        get().addToast(`Account created! Welcome, ${res.user.name}.`, "success")
        return { success: true, user: res.user }
      }

      get().addToast(res.error || "Registration failed.", "error")
      return { success: false, error: res.error }
    } catch (err) {
      return { success: false, error: err.message }
    }
  },

  logout: () => {
    const userName = get().user?.name || "Member"
    storageSafe.setLocal("meridian_auth", null)
    set({ user: null, isAccountOpen: false })
    get().addToast(`Signed out successfully. Have a great day, ${userName}.`, "info")
  },

  // -------------------------------------------------------------
  // 7. CART (Saved to localStorage: meridian_cart)
  // -------------------------------------------------------------
  addToCart: (product, quantity = 1, options = {}) => {
    const color = options.color || (product.colors && product.colors[0]) || null
    const size = options.size || (product.sizes && product.sizes[0]) || null
    const cartItemId = `${product.id}-${color || "none"}-${size || "none"}`

    set((state) => {
      const existingIndex = state.cart.findIndex((item) => item.cartItemId === cartItemId)
      let nextCart
      if (existingIndex > -1) {
        nextCart = [...state.cart]
        const currentQty = nextCart[existingIndex].quantity
        const newQty = Math.min(currentQty + quantity, product.stock)
        nextCart[existingIndex] = {
          ...nextCart[existingIndex],
          quantity: newQty,
        }
      } else {
        nextCart = [
          ...state.cart,
          {
            cartItemId,
            productId: product.id,
            quantity: Math.min(quantity, product.stock),
            selectedColor: color,
            selectedSize: size,
          },
        ]
      }
      storageSafe.setLocal("meridian_cart", nextCart)
      return { cart: nextCart }
    })

    get().addToast(`Added "${product.name}" to your cart.`, "success")
  },

  updateCartQuantity: (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      get().removeFromCart(cartItemId)
      return
    }

    set((state) => {
      const nextCart = state.cart.map((item) => {
        if (item.cartItemId === cartItemId) {
          const liveProduct = get().products.find(
            (p) => String(p.id) === String(item.productId)
          )
          const maxStock = liveProduct ? liveProduct.stock : 99
          return { ...item, quantity: Math.min(newQuantity, maxStock) }
        }
        return item
      })
      storageSafe.setLocal("meridian_cart", nextCart)
      return { cart: nextCart }
    })
  },

  removeFromCart: (cartItemId) => {
    const itemToRemove = get().cart.find((i) => i.cartItemId === cartItemId)
    const liveProduct = itemToRemove
      ? get().products.find((p) => String(p.id) === String(itemToRemove.productId))
      : null

    set((state) => {
      const nextCart = state.cart.filter((i) => i.cartItemId !== cartItemId)
      storageSafe.setLocal("meridian_cart", nextCart)
      return { cart: nextCart }
    })

    if (liveProduct) {
      get().addToast(`Removed "${liveProduct.name}" from cart.`, "info")
    }
  },

  clearCart: () => {
    storageSafe.setLocal("meridian_cart", [])
    set({ cart: [] })
  },

  // -------------------------------------------------------------
  // 8. WISHLIST (Saved to localStorage: meridian_wishlist)
  // -------------------------------------------------------------
  toggleWishlist: (productOrId) => {
    const productId = typeof productOrId === "object" ? productOrId.id : productOrId
    const product = get().products.find((p) => String(p.id) === String(productId))
    const isPresent = get().wishlist.some((id) => String(id) === String(productId))

    if (isPresent) {
      set((state) => {
        const nextWishlist = state.wishlist.filter((id) => String(id) !== String(productId))
        storageSafe.setLocal("meridian_wishlist", nextWishlist)
        return { wishlist: nextWishlist }
      })
      if (product) {
        get().addToast(`Removed "${product.name}" from wishlist.`, "info")
      }
    } else {
      set((state) => {
        const nextWishlist = [...state.wishlist, String(productId)]
        storageSafe.setLocal("meridian_wishlist", nextWishlist)
        return { wishlist: nextWishlist }
      })
      if (product) {
        get().addToast(`Saved "${product.name}" to wishlist.`, "success")
      }
    }
  },

  isInWishlist: (productId) => {
    return get().wishlist.some((id) => String(id) === String(productId))
  },

  // -------------------------------------------------------------
  // 9. RECENTLY VIEWED & FILTERS (Saved to sessionStorage)
  // -------------------------------------------------------------
  recordProductView: (productOrId) => {
    const productId = typeof productOrId === "object" ? productOrId.id : productOrId
    set((state) => {
      const filtered = state.recentlyViewedIds.filter((id) => id !== productId)
      const nextIds = [productId, ...filtered].slice(0, 10)
      storageSafe.setSession("meridian_recently_viewed", nextIds)
      return { recentlyViewedIds: nextIds }
    })
  },

  updateFilter: (key, value) => {
    set((state) => {
      const nextFilters = { ...state.filters, [key]: value }
      storageSafe.setSession("meridian_filters", nextFilters)
      return { filters: nextFilters }
    })
  },

  resetFilters: () => {
    storageSafe.setSession("meridian_filters", INITIAL_FILTERS)
    set({ filters: INITIAL_FILTERS })
  },

  // -------------------------------------------------------------
  // 10. PROMO CODES
  // -------------------------------------------------------------
  applyPromoCode: (codeStr) => {
    const clean = codeStr.trim().toUpperCase()
    const promo = PROMO_CODES[clean]

    if (!promo) {
      get().addToast(`Coupon "${clean}" is invalid or expired.`, "error")
      return false
    }

    const subtotal = get().getCartSubtotal()
    if (subtotal < promo.minSpend) {
      get().addToast(`Coupon "${clean}" requires a minimum spend of ₹${promo.minSpend.toLocaleString("en-IN")}.`, "error")
      return false
    }

    set({ appliedPromo: promo })
    get().addToast(`Coupon "${promo.code}" applied! You saved ${promo.discount}% on this order.`, "success")
    return true
  },

  removePromoCode: () => {
    set({ appliedPromo: null })
    get().addToast("Coupon removed.", "info")
  },

  // -------------------------------------------------------------
  // 11. ORDERS (Persisted in localStorage: meridian_orders)
  // Dedicated independent key in localStorage!
  // -------------------------------------------------------------
  createOrder: (orderDetails) => {
    const cartItems = get().getHydratedCart()
    const subtotal = get().getCartSubtotal()
    const discountAmount = get().getCartDiscount()
    const gstAmount = get().getCartGst()
    const shippingAmount = get().getCartShipping()
    const totalAmount = get().getCartTotal()

    const newOrder = {
      orderId: generateOrderId(),
      date: new Date().toISOString(),
      userId: get().user?.id || "guest",
      items: cartItems.map((item) => ({
        productId: item.productId,
        name: item.product.name,
        priceAtPurchase: item.product.price,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        image: item.product.images[0],
      })),
      subtotal,
      discountAmount,
      gstAmount,
      shippingAmount,
      total: totalAmount,
      shippingAddress: orderDetails.shippingAddress,
      paymentMethod: orderDetails.paymentMethod,
      status: "Confirmed",
    }

    set((state) => {
      const prevOrders = Array.isArray(state.orders) ? state.orders : []
      const nextOrders = [newOrder, ...prevOrders]
      // Persist orders in localStorage under dedicated key 'meridian_orders'
      storageSafe.setLocal("meridian_orders", nextOrders)
      // Empty the cart in localStorage under 'meridian_cart'
      storageSafe.setLocal("meridian_cart", [])
      return {
        orders: nextOrders,
        cart: [],
        appliedPromo: null,
        isCheckoutOpen: false,
      }
    })

    get().addToast(`Order ${newOrder.orderId} placed successfully!`, "success")
    return newOrder
  },

  // -------------------------------------------------------------
  // 12. DYNAMIC HYDRATION SELECTORS
  // -------------------------------------------------------------
  getHydratedCart: () => {
    const state = get()
    return state.cart
      .map((item) => {
        const product = state.products.find(
          (p) => String(p.id) === String(item.productId)
        )
        if (!product) return null
        return {
          ...item,
          product,
        }
      })
      .filter(Boolean)
  },

  getHydratedWishlist: () => {
    const state = get()
    return state.wishlist
      .map((id) => state.products.find((p) => String(p.id) === String(id)))
      .filter(Boolean)
  },

  getHydratedRecentlyViewed: () => {
    const state = get()
    return state.recentlyViewedIds
      .map((id) => state.products.find((p) => String(p.id) === String(id)))
      .filter(Boolean)
  },

  getCartCount: () => {
    return get().cart.reduce((sum, item) => sum + item.quantity, 0)
  },

  getCartSubtotal: () => {
    const items = get().getHydratedCart()
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  },

  getCartDiscount: () => {
    const state = get()
    if (!state.appliedPromo) return 0
    const subtotal = state.getCartSubtotal()
    return Math.round((subtotal * state.appliedPromo.discount) / 100)
  },

  getCartGst: () => {
    const subtotal = get().getCartSubtotal()
    const discount = get().getCartDiscount()
    const taxable = Math.max(0, subtotal - discount)
    return Math.round(taxable * ESTIMATED_GST_RATE)
  },

  getCartShipping: () => {
    const subtotal = get().getCartSubtotal()
    if (subtotal === 0) return 0
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST
  },

  getCartTotal: () => {
    const subtotal = get().getCartSubtotal()
    if (subtotal === 0) return 0
    const discount = get().getCartDiscount()
    const gst = get().getCartGst()
    const shipping = get().getCartShipping()
    return Math.max(0, subtotal - discount + gst + shipping)
  },
}))
