import React from "react"
import { SlidersHorizontal, RotateCcw } from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { Slider } from "../ui/slider"
import { CATEGORIES, SORT_OPTIONS } from "../../lib/constants"
import { formatCurrency, cn } from "../../lib/utils"

export function FilterBar({ totalResults }) {
  const { filters, updateFilter, resetFilters } = useStore()

  const isFiltered =
    filters.category !== "all" ||
    filters.searchQuery !== "" ||
    filters.sortBy !== "featured" ||
    filters.maxPrice < 150000 ||
    filters.inStockOnly

  return (
    <div className="space-y-3 sm:space-y-4 mb-6">
      {/* Category Pills Row (Horizontally scrollable on mobile) */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => updateFilter("category", cat.id)}
                className={cn(
                  "px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 border",
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
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors whitespace-nowrap flex-shrink-0"
            title="Reset all active filters"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset Filters</span>
            <span className="sm:hidden">Reset</span>
          </button>
        )}
      </div>

      {/* Responsive Secondary Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-card border border-border/80 shadow-sm">
        {/* Results Count & Search Pill */}
        <div className="flex items-center justify-between sm:justify-start gap-2 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground">{totalResults}</span>
            <span>products</span>
            {filters.searchQuery && (
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md font-mono text-xs max-w-[120px] sm:max-w-xs truncate">
                "{filters.searchQuery}"
              </span>
            )}
          </div>

          {/* Mobile-only In-stock toggle for compactness */}
          <label className="flex sm:hidden items-center gap-1.5 text-xs font-medium text-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => updateFilter("inStockOnly", e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5 accent-primary"
            />
            <span>In Stock</span>
          </label>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 sm:gap-5">
          {/* Desktop In Stock Only Checkbox */}
          <label className="hidden sm:flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => updateFilter("inStockOnly", e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4 accent-primary"
            />
            <span>In Stock Only</span>
          </label>

          {/* Price Range Filter Slider in Rupees */}
          <div className="flex items-center gap-2.5 text-xs">
            <span className="text-muted-foreground whitespace-nowrap">Max:</span>
            <span className="font-semibold text-foreground font-mono whitespace-nowrap">
              {formatCurrency(filters.maxPrice)}
            </span>
            <div className="w-20 sm:w-28 flex items-center">
              <Slider
                value={[filters.maxPrice]}
                min={500}
                max={150000}
                step={1000}
                onValueChange={([val]) => updateFilter("maxPrice", val)}
              />
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground hidden md:inline">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter("sortBy", e.target.value)}
              className="bg-muted/70 text-foreground text-xs font-medium py-1.5 px-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
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
