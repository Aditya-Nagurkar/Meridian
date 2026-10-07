import React from "react"
import { Star } from "lucide-react"
import { cn } from "../../lib/utils"

export function StarRating({ rating = 5, reviewsCount, showScore = true, size = "sm", className }) {
  const starSizes = {
    xs: "h-3 w-3",
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const iconClass = starSizes[size] || starSizes.sm

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = starIndex <= Math.floor(rating)
          const isPartiallyFilled = !isFilled && starIndex === Math.ceil(rating) && rating % 1 >= 0.3

          return (
            <Star
              key={starIndex}
              className={cn(
                iconClass,
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : isPartiallyFilled
                  ? "fill-amber-400/60 text-amber-400"
                  : "fill-transparent text-muted-foreground/30"
              )}
            />
          )
        })}
      </div>
      {showScore && (
        <span className="text-xs font-semibold text-foreground">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewsCount !== undefined && (
        <span className="text-xs text-muted-foreground">({reviewsCount})</span>
      )}
    </div>
  )
}
