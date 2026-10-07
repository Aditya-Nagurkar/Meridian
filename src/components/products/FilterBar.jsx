import React from "react"
import { SlidersHorizontal, RotateCcw, Check, Sparkles, Filter } from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { CATEGORIES, SORT_OPTIONS } from "../../lib/constants"
import { formatCurrency, cn } from "../../lib/utils"

export function FilterBar({ totalResults }) {
  const { filters, updateFilter, resetFilters } = useStore()

  const isFiltered =
    filters.category !== "all" ||
    filters.searchQuery !== "" ||
    filters.sortBy !== "featured" ||
    filters.maxPrice < 600 ||
    filters.inStockOnly

  return (
    <div className="space-y-4 mb-8">
      {/* Category Pills Row */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => updateFilter("category", cat.id)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 border",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted/60"
                )}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Clear Filters Button */}
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors whitespace-nowrap flex-shrink-0"
            title="Reset all active filters"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Secondary Controls Bar: Results count, Max price, In-stock toggle, and Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/80 shadow-sm">
        {/* Results Count & Search Indicator */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{totalResults}</span>
          <span>products found</span>
          {filters.searchQuery && (
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md font-mono text-xs">
              "{filters.searchQuery}"
            </span>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          {/* In Stock Only Checkbox */}
          <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => updateFilter("inStockOnly", e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4 accent-primary"
            />
            <span>In Stock Only</span>
          </label>

          {/* Price Range Filter Slider */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground hidden sm:inline">Up to:</span>
            <span className="font-semibold text-foreground font-mono">
              {formatCurrency(filters.maxPrice)}
            </span>
            <input
              type="range"
              min="50"
              max="600"
              step="25"
              value={filters.maxPrice}
              onChange={(e) => updateFilter("maxPrice", Number(e.target.value))}
              className="w-24 sm:w-32 accent-primary cursor-pointer"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden md:inline">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter("sortBy", e.target.value)}
              className="bg-muted/70 text-foreground text-xs font-medium py-1.5 px-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
