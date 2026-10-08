import React from "react"
import { cn } from "../../lib/utils"

/**
 * ShinyText component from React Bits (reactbits.dev)
 * Generates an animated metallic/shimmer light wave across text.
 */
export function ShinyText({ text, disabled = false, speed = 5, className = "" }) {
  const animationDuration = `${speed}s`

  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent font-extrabold",
        !disabled && "animate-shimmer",
        className
      )}
      style={{
        backgroundImage:
          "linear-gradient(120deg, hsl(var(--foreground)) 0%, hsl(var(--foreground)) 38%, rgba(234, 179, 8, 0.95) 50%, hsl(var(--foreground)) 62%, hsl(var(--foreground)) 100%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        animationDuration,
      }}
    >
      {text}
    </span>
  )
}
