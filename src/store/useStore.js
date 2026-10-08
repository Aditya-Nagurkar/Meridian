import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { PRODUCTS } from "../data/products"
import mockUsers from "../data/users.json"
import {
  PROMO_CODES,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_COST,
  ESTIMATED_GST_RATE,
} from "../lib/constants"
import { generateOrderId } from "../lib/utils"

const INITIAL_FILTERS = {
  category: "all",
  searchQuery: "",
  sortBy: "featured",
  maxPrice: 10000,
  inStockOnly: false,
}

export const useStore = create(
  persist(
    (set, get) => ({
      // -------------------------------------------------------------
      // 1. NORMALIZED PERSISTED STATE
      // -------------------------------------------------------------
      // Cart: only stores minimal identifiers in localStorage!
      // Schema: [{ cartItemId, productId, quantity, selectedColor, selectedSize }]
      cart: [],

      // Wishlist: only stores product IDs!
      // Schema: ["prod-1", "prod-3"]
      wishlist: [],

      // Orders history
      orders: [],

      // Auth: Current logged in user object or null
      user: null,

      // Recently viewed product IDs
      recentlyViewedIds: [],

      // Active filters
      filters: INITIAL_FILTERS,

      // -------------------------------------------------------------
      // 2. TRANSIENT UI STATE (Not persisted to storage)
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
      // 3. TOAST ACTIONS
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
      // 4. UI TOGGLES
      // -------------------------------------------------------------
      setIsCartOpen: (open) => set({ isCartOpen: open }),
      setIsWishlistOpen: (open) => set({ isWishlistOpen: open }),
      setIsCheckoutOpen: (open) => set({ isCheckoutOpen: open }),
      setIsAuthOpen: (open) => set({ isAuthOpen: open }),
      setIsAccountOpen: (open) => set({ isAccountOpen: open }),
      setQuickViewProduct: (product) => set({ quickViewProduct: product }),

      // -------------------------------------------------------------
      // 5. AUTH ACTIONS (Dummy Data JSON & Mock Login)
      // -------------------------------------------------------------
      login: (email, password) => {
        const trimmedEmail = email.trim().toLowerCase()
        // Check mock user database
        const found = mockUsers.find(
          (u) => u.email.toLowerCase() === trimmedEmail && u.password === password
        )

        if (found) {
          // Remove password from stored state for security practice
          const { password: _, ...userProfile } = found
          set({ user: userProfile, isAuthOpen: false })
          get().addToast(`Welcome back, ${userProfile.name}!`, "success")
          return { success: true, user: userProfile }
        }

        // Allow demo login for any new credentials
        if (trimmedEmail && password.length >= 6) {
          const newUser = {
            id: `usr-${Date.now().toString(36)}`,
            name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            email: trimmedEmail,
            role: "Member",
            tier: "Meridian Classic",
            phone: "+91 98000 00000",
            memberSince: "Oct 2026",
            rewardPoints: 100,
            defaultAddress: null,
          }
          set({ user: newUser, isAuthOpen: false })
          get().addToast(`Welcome to Meridian, ${newUser.name}!`, "success")
          return { success: true, user: newUser }
        }

        get().addToast("Invalid email or password (min 6 characters).", "error")
        return { success: false, error: "Invalid credentials" }
      },

      register: (name, email, password, phone = "") => {
        const trimmedEmail = email.trim().toLowerCase()
        if (!name || !trimmedEmail || password.length < 6) {
          get().addToast("Please fill all fields (password min 6 chars).", "error")
          return { success: false, error: "Validation failed" }
        }

        const newUser = {
          id: `usr-${Date.now().toString(36)}`,
          name,
          email: trimmedEmail,
          phone: phone || "+91 98000 00000",
          role: "Member",
          tier: "Meridian Classic",
          memberSince: "Oct 2026",
          rewardPoints: 200,
          defaultAddress: null,
        }

        set({ user: newUser, isAuthOpen: false })
        get().addToast(`Account created! Welcome, ${name}.`, "success")
        return { success: true, user: newUser }
      },

      logout: () => {
        const userName = get().user?.name || "Member"
        set({ user: null })
        get().addToast(`Signed out successfully. Have a great day, ${userName}.`, "info")
      },

      // -------------------------------------------------------------
      // 6. NORMALIZED CART ACTIONS
      // -------------------------------------------------------------
      addToCart: (product, quantity = 1, options = {}) => {
        const color = options.color || (product.colors && product.colors[0]) || null
        const size = options.size || (product.sizes && product.sizes[0]) || null
        const cartItemId = `${product.id}-${color || "none"}-${size || "none"}`

        set((state) => {
          const existingIndex = state.cart.findIndex((item) => item.cartItemId === cartItemId)
          if (existingIndex > -1) {
            const nextCart = [...state.cart]
            const currentQty = nextCart[existingIndex].quantity
            const newQty = Math.min(currentQty + quantity, product.stock)
            nextCart[existingIndex] = {
              ...nextCart[existingIndex],
              quantity: newQty,
            }
            return { cart: nextCart }
          } else {
            return {
              cart: [
                ...state.cart,
                {
                  cartItemId,
                  productId: product.id,
                  quantity: Math.min(quantity, product.stock),
                  selectedColor: color,
                  selectedSize: size,
                },
              ],
            }
          }
        })

        get().addToast(`Added "${product.name}" to your cart.`, "success")
      },

      updateCartQuantity: (cartItemId, newQuantity) => {
        if (newQuantity <= 0) {
          get().removeFromCart(cartItemId)
          return
        }

        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.cartItemId === cartItemId) {
              const liveProduct = PRODUCTS.find((p) => p.id === item.productId)
              const maxStock = liveProduct ? liveProduct.stock : 99
              return { ...item, quantity: Math.min(newQuantity, maxStock) }
            }
            return item
          }),
        }))
      },

      removeFromCart: (cartItemId) => {
        const itemToRemove = get().cart.find((i) => i.cartItemId === cartItemId)
        const liveProduct = itemToRemove ? PRODUCTS.find((p) => p.id === itemToRemove.productId) : null

        set((state) => ({
          cart: state.cart.filter((i) => i.cartItemId !== cartItemId),
        }))

        if (liveProduct) {
          get().addToast(`Removed "${liveProduct.name}" from cart.`, "info")
        }
      },

      clearCart: () => set({ cart: [] }),

      // -------------------------------------------------------------
      // 7. NORMALIZED WISHLIST ACTIONS
      // -------------------------------------------------------------
      toggleWishlist: (productOrId) => {
        const productId = typeof productOrId === "object" ? productOrId.id : productOrId
        const product = PRODUCTS.find((p) => p.id === productId)
        const isPresent = get().wishlist.includes(productId)

        if (isPresent) {
          set((state) => ({
            wishlist: state.wishlist.filter((id) => id !== productId),
          }))
          if (product) {
            get().addToast(`Removed "${product.name}" from wishlist.`, "info")
          }
        } else {
          set((state) => ({
            wishlist: [...state.wishlist, productId],
          }))
          if (product) {
            get().addToast(`Saved "${product.name}" to wishlist.`, "success")
          }
        }
      },

      isInWishlist: (productId) => {
        return get().wishlist.includes(productId)
      },

      // -------------------------------------------------------------
      // 8. RECENTLY VIEWED & FILTERS
      // -------------------------------------------------------------
      recordProductView: (productOrId) => {
        const productId = typeof productOrId === "object" ? productOrId.id : productOrId
        set((state) => {
          const filtered = state.recentlyViewedIds.filter((id) => id !== productId)
          return { recentlyViewedIds: [productId, ...filtered].slice(0, 10) }
        })
      },

      updateFilter: (key, value) => {
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        }))
      },

      resetFilters: () => set({ filters: INITIAL_FILTERS }),

      // -------------------------------------------------------------
      // 9. PROMO CODES
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
      // 10. CHECKOUT & ORDERS
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

        set((state) => ({
          orders: [newOrder, ...state.orders],
          cart: [],
          appliedPromo: null,
          isCheckoutOpen: false,
        }))

        get().addToast(`Order ${newOrder.orderId} placed successfully!`, "success")
        return newOrder
      },

      // -------------------------------------------------------------
      // 11. DYNAMIC SELECTORS / HYDRATION GETTERS (Single Source of Truth)
      // -------------------------------------------------------------
      // Hydrates normalized cart items by joining with PRODUCTS data
      getHydratedCart: () => {
        const state = get()
        return state.cart
          .map((item) => {
            const product = PRODUCTS.find((p) => p.id === item.productId)
            if (!product) return null
            return {
              ...item,
              product, // Live product reference with fresh prices and stock!
            }
          })
          .filter(Boolean)
      },

      // Hydrates normalized wishlist items
      getHydratedWishlist: () => {
        const state = get()
        return state.wishlist
          .map((id) => PRODUCTS.find((p) => p.id === id))
          .filter(Boolean)
      },

      // Hydrates recently viewed items
      getHydratedRecentlyViewed: () => {
        const state = get()
        return state.recentlyViewedIds
          .map((id) => PRODUCTS.find((p) => p.id === id))
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
    }),
    {
      name: "meridian_storage_v2", // Clean versioned storage key
      storage: createJSONStorage(() => localStorage),
      // Only persist essential business data (ignore modal open/close transient UI states)
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        orders: state.orders,
        user: state.user,
        recentlyViewedIds: state.recentlyViewedIds,
        filters: state.filters,
      }),
      version: 2,
      // Automatic migration handling to seamlessly upgrade users from legacy v1 schema
      migrate: (persistedState, version) => {
        if (!persistedState) return persistedState
        let state = { ...persistedState }

        // If old cart contained denormalized product objects, normalize to productId
        if (Array.isArray(state.cart)) {
          state.cart = state.cart.map((item) => {
            if (item.product && typeof item.product === "object") {
              return {
                cartItemId: item.cartItemId || `${item.product.id}-${item.selectedColor || "none"}-${item.selectedSize || "none"}`,
                productId: item.product.id,
                quantity: item.quantity || 1,
                selectedColor: item.selectedColor || null,
                selectedSize: item.selectedSize || null,
              }
            }
            return item
          })
        }

        // If old wishlist contained product objects, normalize to IDs
        if (Array.isArray(state.wishlist)) {
          state.wishlist = state.wishlist.map((item) =>
            typeof item === "object" ? item.id : item
          ).filter(Boolean)
        }

        return state
      },
    }
  )
)
