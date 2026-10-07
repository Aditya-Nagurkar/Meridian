import React, { useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

export function Drawer({ isOpen, onClose, title, subtitle, countBadge, children, footer, width = "max-w-md sm:max-w-lg" }) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose()
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div
          className={cn(
            "w-screen bg-card text-card-foreground border-l border-border shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out animate-slide-up",
            width
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-card/80 backdrop-blur">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
              {countBadge !== undefined && (
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {countBadge}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Close drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {subtitle && (
            <div className="px-6 py-2 bg-muted/40 text-xs text-muted-foreground border-b border-border/50">
              {subtitle}
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>

          {/* Optional Footer */}
          {footer && (
            <div className="border-t border-border bg-card/90 backdrop-blur p-6">{footer}</div>
          )}
        </div>
      </div>
    </div>
  )
}
