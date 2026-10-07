import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines conditional classnames safely with Tailwind Merge
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number into US currency string
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
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
 * Generates an alphanumeric order ID
 */
export function generateOrderId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let result = "AUR-"
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
