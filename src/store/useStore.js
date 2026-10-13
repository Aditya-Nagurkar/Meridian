import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import {
  fetchProductsFromAPI,
  getCachedProducts,
  OFFLINE_FALLBACK_PRODUCTS,
} from "../services/productService"
import { fetchUsersFromAPI, loginWithAPI, registerWithAPI } from "../services/authService"
import { fetchUserCartFromAPI } from "../services/cartService"
import {
  PROMO_CODES,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_COST,
} from "../lib/constants"
import { generateOrderId } from "../lib/utils"

const INITIAL_FILTERS = {
  category: "all",
  searchQuery: "",
  sortBy: "featured",
  maxPrice: 150000,
  inStockOnly: false,
}

export const useStore = create(
  persist(
    (set, get) => ({
      // -------------------------------------------------------------
      // 1. DYNAMIC PRODUCTS (Fetched from DummyJSON / Session Cache)
      // -------------------------------------------------------------
      products: getCachedProducts() || OFFLINE_FALLBACK_PRODUCTS,
      isLoadingProducts: false,
      productsError: null,

      fetchProducts: async () => {
        try {
          const liveProducts = await fetchProductsFromAPI()
          if (liveProducts && liveProducts.length > 0) {
            set({
              products: liveProducts,
              isLoadingProducts: false,
              productsError: null,
            })
            return liveProducts
          }
          return get().products
        } catch {
          set({ isLoadingProducts: false })
          return get().products
        }
      },

      // -------------------------------------------------------------
      // 2. LIVE USERS (DummyJSON Users API)
      // -------------------------------------------------------------
      demoUsers: [],
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
          console.warn("[useStore] Error loading demo users:", err)
          set({ isLoadingDemoUsers: false })
          return get().demoUsers
        }
      },

      // -------------------------------------------------------------
      // 3. PERSISTED STATE (Automatically managed by Zustand persist)
      // -------------------------------------------------------------
      cart: [],
      orders: [],
      wishlist: [],
      user: null,
      theme: typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",

      toggleTheme: () => {
        const nextTheme = get().theme === "dark" ? "light" : "dark"
        set({ theme: nextTheme })
        if (typeof document !== "undefined") {
          if (nextTheme === "dark") {
            document.documentElement.classList.add("dark")
          } else {
            document.documentElement.classList.remove("dark")
          }
        }
      },

      setTheme: (newTheme) => {
        set({ theme: newTheme })
        if (typeof document !== "undefined") {
          if (newTheme === "dark") {
            document.documentElement.classList.add("dark")
          } else {
            document.documentElement.classList.remove("dark")
          }
        }
      },

      // -------------------------------------------------------------
      // 4. TRANSIENT / IN-MEMORY STATE (Not persisted to localStorage)
      // -------------------------------------------------------------
      recentlyViewedIds: [],
      filters: INITIAL_FILTERS,
      isCartOpen: false,
      isWishlistOpen: false,
      isCheckoutOpen: false,
      isAuthOpen: false,
      isAccountOpen: false,
      quickViewProduct: null,
      appliedPromo: null,
      toasts: [],

      // -------------------------------------------------------------
      // 5. TOAST NOTIFICATIONS
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
      // 6. UI MODAL TOGGLES
      // -------------------------------------------------------------
      setIsCartOpen: (open) => set({ isCartOpen: open }),
      setIsWishlistOpen: (open) => set({ isWishlistOpen: open }),
      setIsCheckoutOpen: (open) => set({ isCheckoutOpen: open }),
      setIsAuthOpen: (open) => set({ isAuthOpen: open }),
      setIsAccountOpen: (open) => set({ isAccountOpen: open }),
      setQuickViewProduct: (product) => set({ quickViewProduct: product }),

      // -------------------------------------------------------------
      // 7. AUTHENTICATION ACTIONS
      // -------------------------------------------------------------
      login: async (identifier, password) => {
        try {
          const res = await loginWithAPI(identifier, password)
          if (res.success && res.user) {
            set({ user: res.user, isAuthOpen: false, isAccountOpen: true })
            get().addToast(`Welcome back, ${res.user.name}!`, "success")

            // Sync user cart from DummyJSON Carts API if local cart is empty
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
        set({ user: null, isAccountOpen: false })
        get().addToast(`Signed out successfully. Have a great day, ${userName}.`, "info")
      },

      // -------------------------------------------------------------
      // 8. CART ACTIONS (Automatically persisted by Zustand)
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
          }
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
              const liveProduct = get().products.find(
                (p) => String(p.id) === String(item.productId)
              )
              const maxStock = liveProduct ? liveProduct.stock : 99
              return { ...item, quantity: Math.min(newQuantity, maxStock) }
            }
            return item
          }),
        }))
      },

      removeFromCart: (cartItemId) => {
        const itemToRemove = get().cart.find((i) => i.cartItemId === cartItemId)
        const liveProduct = itemToRemove
          ? get().products.find((p) => String(p.id) === String(itemToRemove.productId))
          : null

        set((state) => ({
          cart: state.cart.filter((i) => i.cartItemId !== cartItemId),
        }))

        if (liveProduct) {
          get().addToast(`Removed "${liveProduct.name}" from cart.`, "info")
        }
      },

      clearCart: () => {
        set({ cart: [] })
      },

      // -------------------------------------------------------------
      // 9. WISHLIST ACTIONS (Automatically persisted by Zustand)
      // -------------------------------------------------------------
      toggleWishlist: (productOrId) => {
        const productId = typeof productOrId === "object" ? productOrId.id : productOrId
        const product = get().products.find((p) => String(p.id) === String(productId))
        const isPresent = get().wishlist.some((id) => String(id) === String(productId))

        if (isPresent) {
          set((state) => ({
            wishlist: state.wishlist.filter((id) => String(id) !== String(productId)),
          }))
          if (product) {
            get().addToast(`Removed "${product.name}" from wishlist.`, "info")
          }
        } else {
          set((state) => ({
            wishlist: [...state.wishlist, String(productId)],
          }))
          if (product) {
            get().addToast(`Saved "${product.name}" to wishlist.`, "success")
          }
        }
      },

      isInWishlist: (productId) => {
        return get().wishlist.some((id) => String(id) === String(productId))
      },

      // -------------------------------------------------------------
      // 10. RECENTLY VIEWED & FILTERS
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

      resetFilters: () => {
        set({ filters: INITIAL_FILTERS })
      },

      // -------------------------------------------------------------
      // 11. PROMO CODES
      // -------------------------------------------------------------
      applyPromoCode: (codeStr) => {
        if (!codeStr || typeof codeStr !== "string") {
          const msg = "Please enter a coupon code."
          get().addToast(msg, "error")
          return { success: false, message: msg }
        }
        const clean = codeStr.trim().toUpperCase()
        const promo = PROMO_CODES[clean]

        if (!promo) {
          const msg = `Coupon "${clean}" is invalid or expired.`
          get().addToast(msg, "error")
          return { success: false, message: msg }
        }

        const subtotal = get().getCartSubtotal()
        const minSpend = promo.minSubtotal || promo.minSpend || 0
        if (minSpend > 0 && subtotal < minSpend) {
          const msg = `Coupon "${clean}" requires a minimum spend of ₹${minSpend.toLocaleString("en-IN")}.`
          get().addToast(msg, "error")
          return { success: false, message: msg }
        }

        const promoData = {
          ...promo,
          code: clean,
          discount: promo.discount || promo.discountPercent || 0,
          discountPercent: promo.discountPercent || promo.discount || 0,
          discountAmount: promo.discountAmount || 0,
        }

        set({ appliedPromo: promoData })
        const savedStr = promoData.discountPercent ? `${promoData.discountPercent}%` : `₹${promoData.discountAmount}`
        const msg = `Coupon "${clean}" applied! You saved ${savedStr} on this order.`
        get().addToast(msg, "success")
        return { success: true, message: msg }
      },

      removePromoCode: () => {
        set({ appliedPromo: null })
        get().addToast("Coupon removed.", "info")
      },

      // -------------------------------------------------------------
      // 12. ORDERS (Automatically persisted by Zustand)
      // -------------------------------------------------------------
      createOrder: (orderDetails) => {
        const currentUser = get().user
        if (!currentUser) {
          get().addToast("Please sign in or create an account to place an order.", "error")
          return null
        }

        const cartItems = get().getHydratedCart()
        const subtotal = get().getCartSubtotal()
        const discountAmount = get().getCartDiscount()
        const gstAmount = get().getCartGst()
        const shippingAmount = get().getCartShipping()
        const totalAmount = get().getCartTotal()

        const newOrder = {
          orderId: generateOrderId(),
          date: new Date().toISOString(),
          userId: currentUser.id || currentUser.email,
          userEmail: currentUser.email,
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

        // Save delivery address to user's profile for future orders
        const updatedUser = {
          ...currentUser,
          phone: orderDetails.shippingAddress?.phone ? orderDetails.shippingAddress.phone.replace("+91", "").trim() : currentUser.phone,
          defaultAddress: {
            fullName: orderDetails.shippingAddress?.name || currentUser.name,
            phone: orderDetails.shippingAddress?.phone || currentUser.phone,
            street: orderDetails.shippingAddress?.address || "",
            city: orderDetails.shippingAddress?.city || "",
            state: orderDetails.shippingAddress?.state || "",
            pincode: orderDetails.shippingAddress?.postalCode || "",
          },
        }

        set((state) => ({
          orders: [newOrder, ...(Array.isArray(state.orders) ? state.orders : [])],
          cart: [],
          appliedPromo: null,
          isCheckoutOpen: false,
          user: updatedUser,
        }))

        get().addToast(`Order ${newOrder.orderId} placed successfully!`, "success")
        return newOrder
      },

      // -------------------------------------------------------------
      // 13. DYNAMIC HYDRATION SELECTORS
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
        if (!subtotal || subtotal <= 0 || isNaN(subtotal)) return 0

        const { discount, discountPercent, discountAmount } = state.appliedPromo
        const percent = Number(discountPercent || discount || 0)
        if (percent > 0) {
          return Math.round((subtotal * percent) / 100)
        }
        const fixedAmount = Number(discountAmount || 0)
        if (fixedAmount > 0) {
          return Math.min(subtotal, fixedAmount)
        }
        return 0
      },

      getCartGst: () => {
        const subtotal = get().getCartSubtotal()
        const discount = get().getCartDiscount()
        const taxable = Math.max(0, subtotal - discount)
        if (taxable <= 0) return 0
        // 18% GST component already included in retail product pricing
        return Math.round((taxable * 18) / 118)
      },

      getCartShipping: () => {
        const subtotal = get().getCartSubtotal()
        if (subtotal === 0) return 0
        return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST
      },

      getCartTotal: () => {
        const subtotal = get().getCartSubtotal()
        if (!subtotal || subtotal <= 0 || isNaN(subtotal)) return 0
        const discount = get().getCartDiscount()
        const shipping = get().getCartShipping()
        return Math.max(0, subtotal - discount + shipping)
      },
    }),
    {
      name: "meridian_store",
      storage: createJSONStorage(() => localStorage),
      // Partialize: strictly select which keys to persist to disk!
      partialize: (state) => ({
        cart: state.cart,
        orders: state.orders,
        wishlist: state.wishlist,
        user: state.user,
        theme: state.theme,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return
        // Scrub legacy dummy address if present
        if (state.user?.defaultAddress?.street?.includes("402, High Street Residences")) {
          state.user.defaultAddress = null
        }
        // Apply theme to document root element upon hydration
        if (typeof document !== "undefined" && state.theme) {
          if (state.theme === "dark") {
            document.documentElement.classList.add("dark")
          } else {
            document.documentElement.classList.remove("dark")
          }
        }
      },
    }
  )
)

// Automatically revalidate catalog when network comes back online
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    useStore.getState().fetchProducts()
  })
}
