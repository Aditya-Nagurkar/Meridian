import React from "react"
import { X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "../ui/sheet"
import { MobileNavBar } from "../layout/MobileNavBar"
import { cn } from "../../lib/utils"

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  banner,
  countBadge,
  children,
  footer,
  width = "max-w-md sm:max-w-lg",
  activeNavTab,
}) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        hideCloseButton={true}
        className={cn(
          "p-0 gap-0 flex flex-col h-full w-full bg-card text-card-foreground border-l border-border shadow-2xl z-50 overflow-hidden",
          width
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-border bg-card flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 pr-4">
            <SheetTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground font-['Space_Grotesk']">
              {title}
            </SheetTitle>
            {countBadge !== undefined && (
              <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary flex-shrink-0">
                {countBadge}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors -mr-2 flex-shrink-0"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Optional Banner (e.g. Free shipping progress bar) */}
        {banner && <div className="flex-shrink-0">{banner}</div>}

        {/* Optional Subtitle */}
        {subtitle && !banner && (
          <SheetDescription className="px-5 sm:px-6 py-2.5 bg-muted/40 text-xs text-muted-foreground border-b border-border/50 flex-shrink-0">
            {subtitle}
          </SheetDescription>
        )}

        {/* Scrollable Products Body: takes all remaining height! */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5">
          {children}
        </div>

        {/* Docked Compact Footer */}
        {footer && (
          <div className="flex-shrink-0 border-t border-border bg-card/95 backdrop-blur p-4 sm:p-5 shadow-lg">
            {footer}
          </div>
        )}

        {/* Docked Mobile Navigation Bar for Phone Screens */}
        {activeNavTab && (
          <div className="sm:hidden flex-shrink-0">
            <MobileNavBar activeTab={activeNavTab} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
