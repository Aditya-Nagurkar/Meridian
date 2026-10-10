import React from "react"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"
import { useStore } from "../../context/StoreContext"
import { Toast } from "../ui/toast"
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
          <Toast
            key={toast.id}
            variant={isSuccess ? "success" : isError ? "destructive" : "default"}
            className="animate-slide-up"
          >
            <div className="flex items-center gap-3">
              {isSuccess && <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />}
              {isError && <AlertCircle className="h-5 w-5 text-red-300 flex-shrink-0" />}
              {!isSuccess && !isError && <Info className="h-5 w-5 text-blue-400 flex-shrink-0" />}
              <p className="text-sm font-medium leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="rounded-md p-1 opacity-70 hover:opacity-100 transition-opacity ml-2 flex-shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </Toast>
        )
      })}
    </div>
  )
}
