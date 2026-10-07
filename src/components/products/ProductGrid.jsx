import React from "react"
import { ProductCard } from "./ProductCard"
import { PackageX, RotateCcw } from "lucide-react"
import { useStore } from "../../context/StoreContext"

export function ProductGrid({ products }) {
  const { resetFilters } = useStore()

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl border border-dashed border-border bg-card/40 my-8">
        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-4">
          <PackageX className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-foreground">No matching products found</h3>
        <p className="text-sm text-muted-foreground max-w-md mt-1 mb-6">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
