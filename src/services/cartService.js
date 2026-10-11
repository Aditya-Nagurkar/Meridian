/**
 * Cart Service integrating live DummyJSON Carts APIs:
 * - GET https://dummyjson.com/carts (Get all carts)
 * - GET https://dummyjson.com/carts/user/{userId} (Get user's carts)
 * - POST https://dummyjson.com/carts/add (Add a new cart / sync to DummyJSON)
 */

import { FALLBACK_PRODUCT_IMAGE } from "../lib/utils"

/**
 * Fetches the user's remote cart from DummyJSON Carts API (https://dummyjson.com/carts/user/{userId}).
 * Normalizes the products into the Meridian cart item format.
 */
export async function fetchUserCartFromAPI(userId) {
  if (!userId) return []

  try {
    const numericId = typeof userId === "number" ? userId : parseInt(String(userId).replace(/\D/g, ""), 10) || 1
    const response = await fetch(`https://dummyjson.com/carts/user/${numericId}`)

    if (!response.ok) {
      console.warn(`[cartService] No remote cart for user ${userId}:`, response.statusText)
      return []
    }

    const data = await response.json()
    const userCart = data.carts && data.carts[0]

    if (!userCart || !userCart.products || userCart.products.length === 0) {
      return []
    }

    // Transform DummyJSON cart products into Meridian cart items
    return userCart.products.map((p) => {
      const inrPrice = Math.round((p.price || 15) * 85)
      const discountPercent = p.discountPercentage ? Math.round(p.discountPercentage) : null
      const originalInrPrice =
        discountPercent && discountPercent > 0
          ? Math.round(inrPrice * (1 + discountPercent / 100))
          : null

      return {
        id: String(p.id),
        rawId: p.id,
        name: p.title,
        price: inrPrice,
        originalPrice: originalInrPrice,
        discountPercent,
        image: p.thumbnail || FALLBACK_PRODUCT_IMAGE,
        quantity: p.quantity || 1,
        category: "accessories",
        brand: "DummyJSON Curated",
        stock: 20,
      }
    })
  } catch (error) {
    console.warn("[cartService] Error fetching user cart from DummyJSON:", error)
    return []
  }
}

/**
 * Syncs current cart items to DummyJSON via POST https://dummyjson.com/carts/add.
 */
export async function syncCartToAPI(userId, cartItems) {
  if (!cartItems || cartItems.length === 0) return null

  try {
    const numericUserId =
      typeof userId === "number" ? userId : parseInt(String(userId).replace(/\D/g, ""), 10) || 1

    const payload = {
      userId: numericUserId,
      products: cartItems.map((item) => ({
        id: Number(item.rawId || item.id) || 1,
        quantity: item.quantity || 1,
      })),
    }

    const response = await fetch("https://dummyjson.com/carts/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.warn("[cartService] Could not sync cart to DummyJSON:", response.statusText)
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.warn("[cartService] Network error syncing cart to DummyJSON:", error)
    return null
  }
}
