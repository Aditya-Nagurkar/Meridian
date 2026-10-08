import * as React from "react"
import { cn } from "../../lib/utils"

const TabsContext = React.createContext({
  value: "",
  onValueChange: () => {},
})

export function Tabs({ value, onValueChange, defaultValue, className, children, ...props }) {
  const [activeTab, setActiveTab] = React.useState(defaultValue || "")
  const currentTab = value !== undefined ? value : activeTab
  const handleChange = onValueChange || setActiveTab

  return (
    <TabsContext.Provider value={{ value: currentTab, onValueChange: handleChange }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-xl bg-muted/60 p-1 text-muted-foreground w-full border border-border/60",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({ value, className, children, ...props }) {
  const context = React.useContext(TabsContext)
  const isSelected = context.value === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      onClick={() => context.onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1",
        isSelected
          ? "bg-background text-foreground shadow-sm font-bold"
          : "hover:text-foreground text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, className, children, ...props }) {
  const context = React.useContext(TabsContext)
  if (context.value !== value) return null

  return (
    <div
      role="tabpanel"
      className={cn("mt-4 focus-visible:outline-none animate-in fade-in-50 duration-200", className)}
      {...props}
    >
      {children}
    </div>
  )
}
