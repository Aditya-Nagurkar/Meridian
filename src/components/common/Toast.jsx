import React from "react"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { cn } from "../../lib/utils"

export function ToastContainer() {
  const { toasts, removeToast } = useStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success"
        const isError = toast.type === "error"

        return (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-center justify-between gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md transition-all animate-slide-up",
              isSuccess && "bg-card/95 border-emerald-500/30 text-card-foreground shadow-emerald-500/5",
              isError && "bg-card/95 border-red-500/30 text-card-foreground shadow-red-500/5",
              !isSuccess && !isError && "bg-card/95 border-border text-card-foreground"
            )}
            role="status"
          >
            <div className="flex items-center gap-3">
              {isSuccess && <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />}
              {isError && <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />}
              {!isSuccess && !isError && <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />}
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
