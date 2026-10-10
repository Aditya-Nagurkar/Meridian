import React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { MobileNavBar } from "../layout/MobileNavBar"
import { cn } from "../../lib/utils"

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "max-w-2xl",
  showCloseButton = true,
  activeNavTab,
}) {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        {/* Animated Backdrop */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm dialog-overlay" />

        {/* Centering Wrapper */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 overflow-hidden sm:overflow-y-auto pointer-events-none">
          {/* Modal Dialog Content: Fullscreen edge-to-edge on mobile, floating elegant dialog on desktop */}
          <DialogPrimitive.Content
            className={cn(
              "pointer-events-auto relative z-10 w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] rounded-none sm:rounded-2xl border-0 sm:border border-border bg-card text-card-foreground shadow-2xl my-auto flex flex-col overflow-hidden dialog-content focus:outline-none",
              maxWidth
            )}
          >
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border bg-card/95 backdrop-blur flex-shrink-0">
                <div className="min-w-0 pr-4">
                  {title && (
                    <DialogPrimitive.Title className="text-lg sm:text-xl font-bold tracking-tight text-foreground font-['Space_Grotesk']">
                      {title}
                    </DialogPrimitive.Title>
                  )}
                  {description && (
                    <DialogPrimitive.Description className="text-xs text-muted-foreground mt-0.5">
                      {description}
                    </DialogPrimitive.Description>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors ml-auto flex-shrink-0"
                    aria-label="Close dialog"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}

            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6">
              {children}
            </div>

            {/* Docked Mobile Navigation Bar for Phone Screens */}
            {activeNavTab && (
              <div className="sm:hidden flex-shrink-0 border-t border-border bg-card/95">
                <MobileNavBar activeTab={activeNavTab} />
              </div>
            )}
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
