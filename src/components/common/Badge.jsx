import React from "react"
import { cn } from "../../lib/utils"

const badgeVariants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/80",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive: "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/20",
  outline: "text-foreground border border-border",
  accent: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20",
  warning: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20",
  success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
}

export function Badge({ className, variant = "default", children, ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        badgeVariants[variant] || badgeVariants.default,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
