import React from "react"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { Toast } from "../ui/toast"
import { cn } from "../../lib/utils"

export function ToastContainer() {
  const { toasts, removeToast } = useStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-[72px] sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-sm z-50 flex flex-col gap-2 pointer-events-none items-center sm:items-end">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success"
        const isError = toast.type === "error"

        return (
          <Toast
            key={toast.id}
            variant={isSuccess ? "success" : isError ? "destructive" : "default"}
            className="animate-slide-up w-full sm:w-auto min-w-[280px] max-w-sm"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              {isSuccess && <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 flex-shrink-0" />}
              {isError && <AlertCircle className="h-4.5 w-4.5 text-red-300 flex-shrink-0" />}
              {!isSuccess && !isError && <Info className="h-4.5 w-4.5 text-blue-400 flex-shrink-0" />}
              <p className="text-xs sm:text-sm font-medium leading-snug truncate sm:whitespace-normal">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="rounded-md p-1 opacity-70 hover:opacity-100 transition-opacity flex-shrink-0 text-current"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </Toast>
        )
      })}
    </div>
  )
}
