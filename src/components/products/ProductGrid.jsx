import React from "react"
import { ProductCard } from "./ProductCard"
import { PackageX, RotateCcw } from "lucide-react"
import { useStore } from "../../context/StoreContext"

export function ProductGrid({ products }) {
  const { resetFilters } = useStore()

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl border border-dashed border-border bg-card/40 my-6">
        <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3">
          <PackageX className="h-7 w-7" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-foreground">No matching products found</h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mt-1 mb-5">
          We couldn't find any items matching your selected category, price range, or search criteria.
        </p>
        <button
          onClick={resetFilters}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-md active:scale-95"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Clear All Filters</span>
        </button>
      </div>
    )
  }

  return (
    /* 2 columns on phone screens, 3 on tablets/small laptops, 4 on desktop */
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
