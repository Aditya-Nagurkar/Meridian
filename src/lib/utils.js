import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines conditional classnames safely with Tailwind Merge
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number into Indian Rupee (INR) currency format (e.g. ₹2,499)
 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "₹0"
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Truncate long strings with ellipsis
 */
export function truncate(str, max = 50) {
  if (!str) return ""
  return str.length > max ? `${str.slice(0, max)}...` : str
}

/**
 * Generates an alphanumeric order ID with MRD- prefix (Meridian)
 */
export function generateOrderId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let result = "MRD-"
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Defensive image fallback constants & handler
 */
export const FALLBACK_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"

export const FALLBACK_SVG_DATA_URI =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22600%22%20height%3D%22600%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20600%22%3E%3Crect%20fill%3D%22%2318181b%22%20width%3D%22600%22%20height%3D%22600%22%2F%3E%3Ccircle%20cx%3D%22300%22%20cy%3D%22260%22%20r%3D%2270%22%20fill%3D%22none%22%20stroke%3D%22%23eab308%22%20stroke-width%3D%223%22%2F%3E%3Cpath%20d%3D%22M270%20290%20L270%20230%20L300%20265%20L330%20230%20L330%20290%22%20fill%3D%22none%22%20stroke%3D%22%23eab308%22%20stroke-width%3D%224%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3Ctext%20fill%3D%22%23eab308%22%20font-family%3D%22sans-serif%22%20font-size%3D%2222%22%20font-weight%3D%22bold%22%20letter-spacing%3D%224%22%20x%3D%2250%25%22%20y%3D%22380%22%20text-anchor%3D%22middle%22%3EMERIDIAN%3C%2Ftext%3E%3Ctext%20fill%3D%22%23a1a1aa%22%20font-family%3D%22sans-serif%22%20font-size%3D%2213%22%20letter-spacing%3D%221%22%20x%3D%2250%25%22%20y%3D%22410%22%20text-anchor%3D%22middle%22%3ELuxury%20Collection%3C%2Ftext%3E%3C%2Fsvg%3E"

export function handleImageFallback(e) {
  if (!e || !e.currentTarget) return
  if (!e.currentTarget.dataset.fallbackTried) {
    e.currentTarget.dataset.fallbackTried = "primary"
    e.currentTarget.src = FALLBACK_PRODUCT_IMAGE
  } else {
    e.currentTarget.onerror = null
    e.currentTarget.src = FALLBACK_SVG_DATA_URI
  }
}
