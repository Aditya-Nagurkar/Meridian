import React from "react"
import { History } from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { formatCurrency, handleImageFallback } from "../../lib/utils"

export function RecentlyViewed() {
  const { recentlyViewed, setQuickViewProduct, recordProductView } = useStore()

  if (!recentlyViewed || recentlyViewed.length === 0) return null

  return (
    <section className="mt-14 sm:mt-20 pt-8 sm:pt-10 border-t border-border">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <History className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground font-['Space_Grotesk']">
              Recently Viewed
            </h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground">
              Stored temporarily for this browsing session via SessionStorage
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-4">
        {recentlyViewed.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              recordProductView(item)
              setQuickViewProduct(item)
            }}
            className="group relative flex flex-col rounded-xl border border-border bg-card p-2 sm:p-2.5 transition-all duration-200 hover:border-primary/40 hover:shadow-md cursor-pointer"
          >
            <div className="aspect-square w-full rounded-lg overflow-hidden bg-muted/30 mb-1.5 sm:mb-2">
              <img
                src={item.images[0]}
                alt={item.name}
                loading="lazy"
                decoding="async"
                onError={handleImageFallback}
                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <span className="text-[9px] uppercase font-mono text-muted-foreground truncate">
              {item.categoryLabel || item.category}
            </span>
            <h4 className="text-xs font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {item.name}
            </h4>
            <span className="text-xs font-bold text-foreground mt-0.5">
              {formatCurrency(item.price)}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
