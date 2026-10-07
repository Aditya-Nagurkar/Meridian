export const CATEGORIES = [
  { id: "all", label: "All Items", icon: "Sparkles" },
  { id: "electronics", label: "Electronics", icon: "Headphones" },
  { id: "footwear", label: "Footwear", icon: "Footprints" },
  { id: "apparel", label: "Apparel", icon: "Shirt" },
  { id: "accessories", label: "Accessories", icon: "Watch" },
]

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Highest Rated" },
  { value: "name-asc", label: "Alphabetical (A-Z)" },
]

export const PROMO_CODES = {
  AURA20: { discountPercent: 20, description: "20% off entire order" },
  WELCOME10: { discountPercent: 10, description: "10% Welcome Discount" },
  VIP50: { discountAmount: 50, minSubtotal: 200, description: "$50 off orders over $200" },
}

export const FREE_SHIPPING_THRESHOLD = 150
export const STANDARD_SHIPPING_COST = 12
export const ESTIMATED_TAX_RATE = 0.08
