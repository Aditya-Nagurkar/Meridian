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

  // Compute original price if discount exists (P_orig = P / (1 - discount / 100))
  const discountPercent = p.discountPercentage ? Math.round(p.discountPercentage) : null
  const originalInrPrice =
    discountPercent && discountPercent > 0
      ? Math.round(inrPrice / (1 - discountPercent / 100))
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

  // Determine merchandising badge (avoid duplicating discount badges)
  let badge = null
  let badgeType = "default"
  if (p.rating >= 4.6) {
    badge = "Top Rated"
    badgeType = "default"
  } else if (p.stock !== undefined && p.stock <= 5 && p.stock > 0) {
    badge = `Only ${p.stock} Left`
    badgeType = "accent"
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

export const PRODUCTS_CACHE_KEY = "meridian_dummyjson_products_cache_v5"
const PRODUCTS_CACHE_TS_KEY = "meridian_dummyjson_products_cache_ts"
const REVALIDATE_INTERVAL_MS = 15 * 60 * 1000 // 15 minutes TTL

// Module-level in-flight promise for deduplicating concurrent fetch requests
let inFlightPromise = null

/**
 * Curated offline fallback collection of luxury essentials.
 * Used when network is completely offline (ERR_INTERNET_DISCONNECTED) and cache is empty.
 */
export const OFFLINE_FALLBACK_PRODUCTS = [
  {
    id: "1",
    rawId: 1,
    name: "Huawei MateBook X Pro",
    title: "Huawei MateBook X Pro",
    tagline: "Huawei • In Stock",
    description: "The Huawei MateBook X Pro is a slim, lightweight laptop with a vibrant 3K touchscreen display and Intel Core processor.",
    price: 118999,
    originalPrice: 139999,
    discountPercent: 15,
    category: "electronics",
    categoryLabel: "Audio & Tech",
    rawCategory: "laptops",
    rating: 4.8,
    reviewsCount: 148,
    stock: 12,
    badge: "Top Rated",
    badgeType: "default",
    featured: true,
    images: ["https://cdn.dummyjson.com/products/images/laptops/Huawei%20MateBook%20X%20Pro/1.png"],
    colors: ["Space Gray", "Mystic Silver", "Emerald Green"],
    sizes: null,
    specs: [
      { label: "Display", value: "13.9\" 3K FullView Touchscreen" },
      { label: "Processor", value: "Intel Core i7 11th Gen" },
      { label: "Battery", value: "56Wh Fast Charge" },
    ],
    brand: "Huawei",
  },
  {
    id: "83",
    rawId: 83,
    name: "Blue & Black Check Shirt",
    title: "Blue & Black Check Shirt",
    tagline: "Classic Casual • In Stock",
    description: "The Blue & Black Check Shirt is a stylish and versatile flannel shirt featuring a classic buffalo plaid pattern.",
    price: 2549,
    originalPrice: 2999,
    discountPercent: 15,
    category: "apparel",
    categoryLabel: "Apparel",
    rawCategory: "mens-shirts",
    rating: 4.6,
    reviewsCount: 92,
    stock: 28,
    badge: "Bestseller",
    badgeType: "default",
    featured: true,
    images: ["https://cdn.dummyjson.com/products/images/mens-shirts/Blue%20&%20Black%20Check%20Shirt/1.png"],
    colors: ["Blue Plaid", "Midnight Check", "Classic Gray"],
    sizes: ["S (38)", "M (40)", "L (42)", "XL (44)"],
    specs: [
      { label: "Material", value: "100% Breathable Brushed Cotton" },
      { label: "Fit", value: "Modern Tailored Fit" },
      { label: "Care", value: "Machine Wash Cold" },
    ],
    brand: "Classic Casual",
  },
  {
    id: "85",
    rawId: 85,
    name: "Man Plaid Shirt",
    title: "Man Plaid Shirt",
    tagline: "Meridian Urban • In Stock",
    description: "Premium cotton long-sleeve plaid shirt with chest pocket, double-button cuffs, and contoured hem.",
    price: 2870,
    originalPrice: 3499,
    discountPercent: 18,
    category: "apparel",
    categoryLabel: "Apparel",
    rawCategory: "mens-shirts",
    rating: 4.5,
    reviewsCount: 76,
    stock: 22,
    badge: null,
    badgeType: "default",
    featured: false,
    images: ["https://cdn.dummyjson.com/products/images/mens-shirts/Man%20Plaid%20Shirt/1.png"],
    colors: ["Crimson Red", "Forest Green", "Amber Gold"],
    sizes: ["S (38)", "M (40)", "L (42)", "XL (44)"],
    specs: [
      { label: "Fabric", value: "Organic Yarn-Dyed Cotton" },
      { label: "Collar", value: "Button-Down Spread" },
    ],
    brand: "Meridian Urban",
  },
  {
    id: "4",
    rawId: 4,
    name: "Red Lipstick",
    title: "Red Lipstick",
    tagline: "Chic Cosmetics • In Stock",
    description: "The Red Lipstick is a classic bold beauty essential with rich pigment, satin matte finish, and all-day hydration.",
    price: 1104,
    originalPrice: 1255,
    discountPercent: 12,
    category: "grooming",
    categoryLabel: "Grooming & Fragrance",
    rawCategory: "beauty",
    rating: 4.7,
    reviewsCount: 149,
    stock: 45,
    badge: "Top Rated",
    badgeType: "default",
    featured: true,
    images: ["https://cdn.dummyjson.com/products/images/beauty/Red%20Lipstick/1.png"],
    colors: ["Classic Crimson", "Velvet Ruby", "Deep Bordeaux"],
    sizes: null,
    specs: [
      { label: "Finish", value: "Hydrating Velvet Matte" },
      { label: "Longevity", value: "Up to 12 Hours Wear" },
    ],
    brand: "Chic Cosmetics",
  },
  {
    id: "5",
    rawId: 5,
    name: "Red Nail Polish",
    title: "Red Nail Polish",
    tagline: "Nail Couture • In Stock",
    description: "High-shine, chip-resistant salon grade red nail polish with quick-drying gloss enamel.",
    price: 764,
    originalPrice: 850,
    discountPercent: 11,
    category: "grooming",
    categoryLabel: "Grooming & Fragrance",
    rawCategory: "beauty",
    rating: 4.6,
    reviewsCount: 148,
    stock: 60,
    badge: null,
    badgeType: "default",
    featured: false,
    images: ["https://cdn.dummyjson.com/products/images/beauty/Red%20Nail%20Polish/1.png"],
    colors: ["Scarlet Gloss", "Wine Rouge"],
    sizes: null,
    specs: [
      { label: "Formula", value: "Toxin-Free 10-Free" },
      { label: "Drying Time", value: "60 Seconds Quick Dry" },
    ],
    brand: "Nail Couture",
  },
  {
    id: "8",
    rawId: 8,
    name: "Dior Sauvage Eau de Parfum",
    title: "Dior Sauvage Eau de Parfum",
    tagline: "Dior • In Stock",
    description: "A radically fresh composition with notes of Reggio Bergamot and Ambroxan, delivering an unforgettable noble trail.",
    price: 8499,
    originalPrice: 9999,
    discountPercent: 15,
    category: "grooming",
    categoryLabel: "Grooming & Fragrance",
    rawCategory: "fragrances",
    rating: 4.9,
    reviewsCount: 210,
    stock: 15,
    badge: "Top Rated",
    badgeType: "default",
    featured: true,
    images: ["https://cdn.dummyjson.com/products/images/fragrances/Dior%20J'adore/1.png"],
    colors: ["Signature Bottle"],
    sizes: null,
    specs: [
      { label: "Concentration", value: "Eau de Parfum (EDP)" },
      { label: "Volume", value: "100ml / 3.4 oz" },
    ],
    brand: "Dior",
  },
  {
    id: "91",
    rawId: 91,
    name: "Sports Leather Chronograph Watch",
    title: "Sports Leather Chronograph Watch",
    tagline: "Chronos • In Stock",
    description: "Precision Japanese quartz movement with dual subdials, hardened mineral crystal, and genuine saddle leather strap.",
    price: 6499,
    originalPrice: 8200,
    discountPercent: 20,
    category: "accessories",
    categoryLabel: "Accessories",
    rawCategory: "mens-watches",
    rating: 4.8,
    reviewsCount: 120,
    stock: 18,
    badge: "Top Rated",
    badgeType: "default",
    featured: true,
    images: ["https://cdn.dummyjson.com/products/images/mens-watches/Brown%20Leather%20Belt%20Watch/1.png"],
    colors: ["Cognac Leather", "Midnight Obsidian"],
    sizes: null,
    specs: [
      { label: "Case Material", value: "316L Stainless Steel" },
      { label: "Water Resistance", value: "5 ATM (50m)" },
    ],
    brand: "Chronos",
  },
  {
    id: "78",
    rawId: 78,
    name: "Puma Future Rider Sneaker",
    title: "Puma Future Rider Sneaker",
    tagline: "Puma • In Stock",
    description: "Retro street running silhouette updated with lightweight shock-absorbing Rider Foam and suede overlays.",
    price: 4999,
    originalPrice: 6499,
    discountPercent: 23,
    category: "footwear",
    categoryLabel: "Footwear",
    rawCategory: "mens-shoes",
    rating: 4.7,
    reviewsCount: 95,
    stock: 20,
    badge: null,
    badgeType: "default",
    featured: true,
    images: ["https://cdn.dummyjson.com/products/images/mens-shoes/Puma%20Future%20Rider%20Trainers/1.png"],
    colors: ["Retro Multi", "Monochrome Slate"],
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    specs: [
      { label: "Outsole", value: "Federbein Shock Absorb Rubber" },
      { label: "Upper", value: "Ripstop Nylon with Suede" },
    ],
    brand: "Puma",
  },
]

// Clean up any product caches from localStorage to keep user's disk storage clean and lean
if (typeof window !== "undefined") {
  try {
    window.localStorage.removeItem(PRODUCTS_CACHE_KEY)
    window.localStorage.removeItem(PRODUCTS_CACHE_TS_KEY)
    window.localStorage.removeItem("meridian_dummyjson_products_cache_v4")
    window.localStorage.removeItem("meridian_dummyjson_products_cache")
  } catch {
    // Ignore storage cleanup errors
  }
}

/**
 * Safely retrieves cached products strictly from sessionStorage (tab lifecycle).
 */
export function getCachedProducts() {
  if (typeof window === "undefined") return null
  try {
    const raw = window.sessionStorage.getItem(PRODUCTS_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
    }
  } catch {
    // Ignore cache parse errors
  }
  return null
}

/**
 * Safely persists products strictly to sessionStorage (erased automatically on tab close).
 */
function saveProductsToCache(products) {
  if (typeof window === "undefined" || !Array.isArray(products) || products.length === 0) return
  try {
    const serialized = JSON.stringify(products)
    window.sessionStorage.setItem(PRODUCTS_CACHE_KEY, serialized)
    window.sessionStorage.setItem(PRODUCTS_CACHE_TS_KEY, String(Date.now()))
  } catch {
    // Ignore storage quota warnings
  }
}

/**
 * Fetches products from DummyJSON API, filters out off-brand items (Home & Living, groceries, etc.),
 * and transforms them for the Meridian UI.
 * Handles offline mode gracefully (no net::ERR_INTERNET_DISCONNECTED console noise).
 * Deduplicates in-flight requests (protects against React StrictMode double invocation).
 */
export async function fetchProductsFromAPI() {
  // 1. If an identical request is already running, reuse the promise
  if (inFlightPromise) {
    return inFlightPromise
  }

  // 2. Read session cache (erased when tab closes)
  const cached = getCachedProducts()

  // 3. If offline, immediately serve cached products or curated fallback without attempting network
  const isOffline = typeof navigator !== "undefined" && navigator.onLine === false
  if (isOffline) {
    if (cached && cached.length > 0) return cached
    return OFFLINE_FALLBACK_PRODUCTS
  }

  // 4. If session cache is valid, return immediately and conditionally revalidate in background
  if (cached && cached.length > 0) {
    const lastFetched =
      typeof window !== "undefined"
        ? Number(window.sessionStorage.getItem(PRODUCTS_CACHE_TS_KEY) || 0)
        : 0
    if (Date.now() - lastFetched > REVALIDATE_INTERVAL_MS) {
      revalidateBackground()
    }
    return cached
  }

  // 5. Perform live fetch with deduplication and defensive fallback
  inFlightPromise = (async () => {
    try {
      const response = await fetch("https://dummyjson.com/products?limit=0")
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      const rawProducts = data.products || []

      // Filter out Home & Living, groceries, and off-brand categories completely
      const filteredRaw = rawProducts.filter(
        (p) => !EXCLUDED_CATEGORIES.has(p.category) && CATEGORY_MAP[p.category]
      )
      const transformed = filteredRaw.map(transformDummyProduct)

      if (transformed && transformed.length > 0) {
        saveProductsToCache(transformed)
        return transformed
      }

      return cached || OFFLINE_FALLBACK_PRODUCTS
    } catch (err) {
      // Gracefully fall back to cached or bundled offline products on any network failure
      if (cached && cached.length > 0) {
        return cached
      }
      return OFFLINE_FALLBACK_PRODUCTS
    } finally {
      inFlightPromise = null
    }
  })()

  return inFlightPromise
}

/**
 * Background silent revalidation that runs only when online and doesn't disrupt the UI.
 */
async function revalidateBackground() {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return
  try {
    const response = await fetch("https://dummyjson.com/products?limit=0")
    if (response.ok) {
      const data = await response.json()
      const rawProducts = data.products || []
      const filteredRaw = rawProducts.filter(
        (p) => !EXCLUDED_CATEGORIES.has(p.category) && CATEGORY_MAP[p.category]
      )
      const transformed = filteredRaw.map(transformDummyProduct)
      if (transformed && transformed.length > 0) {
        saveProductsToCache(transformed)
      }
    }
  } catch {
    // Silent background handling
  }
}

