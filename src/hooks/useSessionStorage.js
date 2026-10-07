import { useState, useEffect, useCallback } from "react"

/**
 * Custom hook to safely interact with window.sessionStorage
 * Features:
 * - Scoped strictly to the browser tab/session
 * - Safe JSON parsing and stringify with fallback
 * - Handles private browsing mode exceptions
 * - Supports functional updates (prev => ...)
 * 
 * @param {string} key - Storage key
 * @param {*} initialValue - Fallback value
 */
export function useSessionStorage(key, initialValue) {
  const readValue = useCallback(() => {
    if (typeof window === "undefined") {
      return initialValue
    }

    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`[useSessionStorage] Error reading key "${key}":`, error)
      return initialValue
    }
  }, [key, initialValue])

  const [storedValue, setStoredValue] = useState(readValue)

  const setValue = useCallback(
    (value) => {
      if (typeof window === "undefined") {
        console.warn(`[useSessionStorage] Tried to set "${key}" in non-browser environment`)
        return
      }

      try {
        setStoredValue((currentVal) => {
          const nextValue = value instanceof Function ? value(currentVal) : value
          window.sessionStorage.setItem(key, JSON.stringify(nextValue))
          return nextValue
        })
      } catch (error) {
        console.warn(`[useSessionStorage] Error setting key "${key}":`, error)
      }
    },
    [key]
  )

  return [storedValue, setValue]
}
