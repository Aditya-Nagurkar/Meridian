export const CATEGORIES = [
  { id: "all", label: "All Products", icon: "Sparkles" },
  { id: "electronics", label: "Audio & Tech", icon: "Headphones" },
  { id: "apparel", label: "Apparel", icon: "Shirt" },
  { id: "footwear", label: "Footwear", icon: "Footprints" },
  { id: "accessories", label: "Accessories", icon: "Watch" },
  { id: "grooming", label: "Grooming & Fragrance", icon: "Sparkles" },
]

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured & Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Highest Rated" },
  { value: "name-asc", label: "Alphabetical (A-Z)" },
]

export const PROMO_CODES = {
  INDIA20: { discountPercent: 20, description: "20% festive discount on all orders" },
  FIRST10: { discountPercent: 10, description: "10% off on your first order" },
  FESTIVE500: { discountAmount: 500, minSubtotal: 2999, description: "Flat ₹500 off on orders above ₹2,999" },
}

export const FREE_SHIPPING_THRESHOLD = 1499
export const STANDARD_SHIPPING_COST = 99
export const ESTIMATED_GST_RATE = 0.18 // 18% standard GST for consumer goods & electronics

export const INDIAN_STATES = [
  "Maharashtra",
  "Karnataka",
  "Delhi NCR",
  "Tamil Nadu",
  "Telangana",
  "Gujarat",
  "Uttar Pradesh",
  "West Bengal",
  "Kerala",
  "Rajasthan",
  "Haryana",
  "Punjab",
  "Madhya Pradesh",
  "Andhra Pradesh",
  "Goa",
  "Assam",
]
