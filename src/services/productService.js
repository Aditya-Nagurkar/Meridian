import { FALLBACK_PRODUCT_IMAGE } from "../lib/utils"

/**
 * Categories excluded to maintain Meridian's luxury curated essentials brand identity.
 * Completely removes Home & Living (furniture, home decor, kitchenware), groceries, and vehicles.
 */
export const EXCLUDED_CATEGORIES = new Set([
  "furniture",
  "home-decoration",
  "kitchen-accessories",
  "groceries",
  "motorcycle",
  "vehicle",
])

/**
 * Refined category mapping from DummyJSON slug categories to Meridian store categories:
 * - electronics -> Audio & Tech
 * - apparel     -> Apparel
 * - footwear    -> Footwear
 * - accessories -> Accessories
 * - grooming    -> Grooming & Fragrance
 */
export const CATEGORY_MAP = {
  // Audio & Tech
  smartphones: "electronics",
  laptops: "electronics",
  tablets: "electronics",
  "mobile-accessories": "electronics",

  // Apparel
  "mens-shirts": "apparel",
  tops: "apparel",
  "womens-dresses": "apparel",

  // Footwear
  "mens-shoes": "footwear",
  "womens-shoes": "footwear",

  // Accessories
  "mens-watches": "accessories",
  "womens-watches": "accessories",
  "womens-bags": "accessories",
  sunglasses: "accessories",
  "womens-jewellery": "accessories",
  "sports-accessories": "accessories",

  // Grooming & Fragrance
  beauty: "grooming",
  fragrances: "grooming",
  "skin-care": "grooming",
}

export const CATEGORY_LABELS = {
  electronics: "Audio & Tech",
  apparel: "Apparel",
  footwear: "Footwear",
  accessories: "Accessories",
  grooming: "Grooming & Fragrance",
}

/**
 * Converts a raw DummyJSON product into the normalized Meridian Product model.
 * - Converts USD prices to realistic INR values (x85 conversion).
 * - Computes original price and discount percentage.
 * - Formats technical specifications, badges, colors, and sizes.
 */
export function transformDummyProduct(p) {
  // Convert USD to INR (approx 1 USD = 85 INR)
  const inrPrice = Math.round((p.price || 10) * 85)

  // Compute original price if discount exists
  const discountPercent = p.discountPercentage ? Math.round(p.discountPercentage) : null
  const originalInrPrice =
    discountPercent && discountPercent > 0
      ? Math.round(inrPrice * (1 + discountPercent / 100))
      : null

  // Map category to Meridian high-level categories
  const mappedCategory = CATEGORY_MAP[p.category] || "accessories"
  const categoryLabel = CATEGORY_LABELS[mappedCategory] || "Curated"

  // Specs array extracted from API fields
  const specs = []
  if (p.brand) specs.push({ label: "Brand", value: p.brand })
  if (p.warrantyInformation) specs.push({ label: "Warranty", value: p.warrantyInformation })
  if (p.shippingInformation) specs.push({ label: "Shipping", value: p.shippingInformation })
  if (p.returnPolicy) specs.push({ label: "Return Policy", value: p.returnPolicy })
  if (p.sku) specs.push({ label: "SKU / Model", value: p.sku })
  if (p.weight) specs.push({ label: "Weight", value: `${p.weight} kg` })
  if (p.dimensions) {
    specs.push({
      label: "Dimensions",
      value: `${p.dimensions.width}x${p.dimensions.height}x${p.dimensions.depth} cm`,
    })
  }
  if (specs.length === 0) {
    specs.push({ label: "Quality", value: "Verified Authentic" })
    specs.push({ label: "Packaging", value: "Secure Retail Box" })
  }

  // Derive dynamic sizes if category is footwear or apparel
  let sizes = null
  if (p.category === "mens-shoes" || p.category === "womens-shoes") {
    sizes = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]
  } else if (
    p.category === "mens-shirts" ||
    p.category === "tops" ||
    p.category === "womens-dresses"
  ) {
    sizes = ["S (38)", "M (40)", "L (42)", "XL (44)"]
  }

  // Derive dynamic colors or default curated palette
  const colors =
    p.tags && p.tags.length > 1
      ? [
          p.tags[0].charAt(0).toUpperCase() + p.tags[0].slice(1),
          p.tags[1].charAt(0).toUpperCase() + p.tags[1].slice(1),
          "Classic Edition",
        ]
      : ["Default Finish", "Midnight Black", "Pure Silver"]

  // Determine badge
  let badge = null
  let badgeType = "default"
  if (discountPercent && discountPercent >= 15) {
    badge = `${discountPercent}% Off`
    badgeType = "destructive"
  } else if (p.rating >= 4.5) {
    badge = "Top Rated"
    badgeType = "default"
  } else if (p.stock !== undefined && p.stock <= 5 && p.stock > 0) {
    badge = `Only ${p.stock} Left`
    badgeType = "accent"
  } else if (p.brand) {
    badge = p.brand
    badgeType = "secondary"
  }

  // Collect images safely
  const images =
    p.images && p.images.length > 0
      ? p.images
      : p.thumbnail
      ? [p.thumbnail]
      : [FALLBACK_PRODUCT_IMAGE]

  return {
    id: String(p.id),
    rawId: p.id,
    name: p.title,
    title: p.title,
    tagline: p.brand
      ? `${p.brand} • ${p.availabilityStatus || "In Stock"}`
      : `${p.description.slice(0, 60)}...`,
    description: p.description,
    price: inrPrice,
    originalPrice: originalInrPrice,
    discountPercent,
    category: mappedCategory,
    categoryLabel,
    rawCategory: p.category,
    rating: Number((p.rating || 4.2).toFixed(1)),
    reviewsCount: p.reviews?.length
      ? p.reviews.length * 28 + Math.floor(p.rating * 15)
      : 36,
    stock: p.stock ?? 25,
    badge,
    badgeType,
    featured: (p.rating || 0) >= 4.0 || (discountPercent || 0) > 12,
    images,
    colors,
    sizes,
    specs,
    brand: p.brand || "Meridian Curated",
  }
}

const CACHE_KEY = "meridian_dummyjson_products_cache_v3"

/**
 * Fetches products from DummyJSON API, filters out off-brand items (Home & Living, groceries, etc.),
 * and transforms them for the Meridian UI.
 * Automatically caches results in sessionStorage to provide instant loads on subsequent visits.
 */
export async function fetchProductsFromAPI() {
  // Check session cache first for instant loads
  if (typeof window !== "undefined") {
    try {
      const cached = window.sessionStorage.getItem(CACHE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Return cache and revalidate in background
          revalidateBackground()
          return parsed
        }
      }
    } catch {
      // Ignore cache parse errors
    }
  }

  // Fetch all products
  const response = await fetch("https://dummyjson.com/products?limit=0")
  if (!response.ok) {
    throw new Error(`Failed to fetch products from DummyJSON: ${response.statusText}`)
  }

  const data = await response.json()
  const rawProducts = data.products || []

  // Filter out Home & Living, groceries, and off-brand categories completely
  const filteredRaw = rawProducts.filter(
    (p) => !EXCLUDED_CATEGORIES.has(p.category) && CATEGORY_MAP[p.category]
  )
  const transformed = filteredRaw.map(transformDummyProduct)

  // Save to session cache
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(transformed))
    } catch {
      // Ignore quota errors
    }
  }

  return transformed
}

async function revalidateBackground() {
  try {
    const response = await fetch("https://dummyjson.com/products?limit=0")
    if (response.ok) {
      const data = await response.json()
      const rawProducts = data.products || []
      const filteredRaw = rawProducts.filter(
        (p) => !EXCLUDED_CATEGORIES.has(p.category) && CATEGORY_MAP[p.category]
      )
      const transformed = filteredRaw.map(transformDummyProduct)
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(transformed))
      }
    }
  } catch {
    // Silent background error
  }
}
