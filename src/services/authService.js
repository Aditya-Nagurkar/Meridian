/**
 * Authentication and User Service integrating live DummyJSON Users & Auth APIs:
 * - GET https://dummyjson.com/users (Get users for demo & accounts)
 * - POST https://dummyjson.com/auth/login (Login user and receive JWT tokens)
 * - POST https://dummyjson.com/users/add (Register new user)
 * - GET https://dummyjson.com/users/{id} (Fetch full profile details)
 */

const CACHE_USERS_KEY = "meridian_dummyjson_users_cache_v1"

/**
 * Normalizes a raw DummyJSON user into the Meridian user profile model.
 */
export function normalizeDummyUser(u, token = null) {
  const firstName = u.firstName || ""
  const lastName = u.lastName || ""
  const fullName = `${firstName} ${lastName}`.trim() || u.username || "Member"

  // Derive realistic tier from role or id
  const tier =
    u.role === "admin"
      ? "Meridian Platinum"
      : u.id % 2 === 0
      ? "Meridian Elite"
      : "Meridian Gold"

  return {
    id: u.id,
    rawId: u.id,
    username: u.username || `user_${u.id}`,
    name: fullName,
    firstName,
    lastName,
    email: u.email,
    phone: u.phone || "+91 98201 12345",
    avatar: u.image || `https://dummyjson.com/icon/${u.username || "user"}/128`,
    gender: u.gender,
    role: u.role || "user",
    tier,
    memberSince: "Jan 2025",
    rewardPoints: 1000 + ((u.id * 150) % 900),
    password: u.password || "password123", // Preserved for 1-click demo logins
    defaultAddress: {
      fullName,
      phone: u.phone || "+91 98201 12345",
      street: u.address?.address || "402, High Street Residences",
      city: u.address?.city || "Mumbai",
      state: u.address?.state || "Maharashtra",
      pincode: u.address?.postalCode || "400018",
    },
    token: token || u.token || null,
  }
}

/**
 * Fetches demo users from DummyJSON Users API (https://dummyjson.com/users).
 * Uses session caching for instant UI response and smooth UX.
 */
export async function fetchUsersFromAPI(limit = 6) {
  // Check session cache first
  if (typeof window !== "undefined") {
    try {
      const cached = window.sessionStorage.getItem(CACHE_USERS_KEY)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      }
    } catch {
      // Ignore cache parse errors
    }
  }

  const response = await fetch(`https://dummyjson.com/users?limit=${limit}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch users from DummyJSON: ${response.statusText}`)
  }

  const data = await response.json()
  const rawUsers = data.users || []
  const normalized = rawUsers.map((u) => normalizeDummyUser(u))

  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(CACHE_USERS_KEY, JSON.stringify(normalized))
    } catch {
      // Ignore storage quota errors
    }
  }

  return normalized
}

/**
 * Logs in a user using DummyJSON Auth API (https://dummyjson.com/auth/login).
 * Supports username or email (resolves email to username if necessary).
 */
export async function loginWithAPI(identifier, password) {
  const trimmed = identifier.trim()
  let username = trimmed

  // If user passed an email, resolve to username from users API or cache
  if (trimmed.includes("@")) {
    try {
      const users = await fetchUsersFromAPI(20)
      const found = users.find(
        (u) => u.email.toLowerCase() === trimmed.toLowerCase()
      )
      if (found && found.username) {
        username = found.username
      }
    } catch {
      // Fallback: extract username prefix before @
      username = trimmed.split("@")[0]
    }
  }

  const response = await fetch("https://dummyjson.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      expiresInMins: 60,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    return {
      success: false,
      error: data.message || "Invalid credentials. Please verify your username and password.",
    }
  }

  // Fetch full user details from DummyJSON to get full address and phone
  let fullUser = null
  try {
    const userRes = await fetch(`https://dummyjson.com/users/${data.id}`)
    if (userRes.ok) {
      fullUser = await userRes.json()
    }
  } catch {
    // Non-critical, fallback to login response
  }

  const normalized = normalizeDummyUser(
    {
      ...(fullUser || {}),
      ...data,
      password,
    },
    data.accessToken
  )

  return {
    success: true,
    user: normalized,
    token: data.accessToken,
  }
}

/**
 * Registers a new user via DummyJSON Users API (POST https://dummyjson.com/users/add).
 */
export async function registerWithAPI(name, email, password, phone = "") {
  const names = name.trim().split(" ")
  const firstName = names[0] || "Member"
  const lastName = names.slice(1).join(" ") || ""
  const username = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").toLowerCase()

  try {
    const response = await fetch("https://dummyjson.com/users/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        phone: phone || "+91 98000 00000",
        username,
      }),
    })

    const data = await response.json()

    const newUser = normalizeDummyUser({
      ...data,
      firstName,
      lastName,
      email,
      phone: phone || "+91 98000 00000",
      username,
      password,
    })

    return {
      success: true,
      user: newUser,
    }
  } catch (err) {
    // Fallback registration locally if offline
    const fallbackUser = normalizeDummyUser({
      id: Date.now(),
      firstName,
      lastName,
      email,
      phone: phone || "+91 98000 00000",
      username,
      password,
    })

    return {
      success: true,
      user: fallbackUser,
    }
  }
}
