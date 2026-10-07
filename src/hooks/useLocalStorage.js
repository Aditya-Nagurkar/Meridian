import { useState, useEffect, useCallback } from "react"

/**
 * Custom hook to safely interact with window.localStorage
 * Features:
 * - Safe JSON parse & stringify with fallback
 * - Handles quota exceeded and private browsing sandbox blocks
 * - Cross-tab synchronization via 'storage' window events
 * - Functional updater support like useState(prev => ...)
 * 
 * @param {string} key - Storage key
 * @param {*} initialValue - Fallback value if storage key does not exist
 */
export function useLocalStorage(key, initialValue) {
  // Read value from localStorage or fallback
  const readValue = useCallback(() => {
    if (typeof window === "undefined") {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`[useLocalStorage] Error reading key "${key}":`, error)
      return initialValue
    }
  }, [key, initialValue])

  const [storedValue, setStoredValue] = useState(readValue)

  // Setter function supporting both raw values and updater functions
  const setValue = useCallback(
    (value) => {
      if (typeof window === "undefined") {
        console.warn(`[useLocalStorage] Tried to set "${key}" in non-browser environment`)
        return
      }

      try {
        setStoredValue((currentVal) => {
          const nextValue = value instanceof Function ? value(currentVal) : value
          window.localStorage.setItem(key, JSON.stringify(nextValue))
          
          // Dispatch a custom event so other components in the same tab update immediately
          window.dispatchEvent(new CustomEvent("local-storage-change", { detail: { key, nextValue } }))
          return nextValue
        })
      } catch (error) {
        console.warn(`[useLocalStorage] Error setting key "${key}":`, error)
      }
    },
    [key]
  )

  // Sync state if localStorage changes in another tab or via custom event in current tab
  useEffect(() => {
    const handleStorageEvent = (event) => {
      if (event.key === key && event.newValue) {
        try {
          setStoredValue(JSON.parse(event.newValue))
        } catch {
          setStoredValue(initialValue)
        }
      }
    }

    const handleCustomEvent = (event) => {
      if (event.detail?.key === key) {
        setStoredValue(event.detail.nextValue)
      }
    }

    window.addEventListener("storage", handleStorageEvent)
    window.addEventListener("local-storage-change", handleCustomEvent)

    return () => {
      window.removeEventListener("storage", handleStorageEvent)
      window.removeEventListener("local-storage-change", handleCustomEvent)
    }
  }, [key, initialValue])

  return [storedValue, setValue]
}
