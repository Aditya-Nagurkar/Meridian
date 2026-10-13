import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-2xl border p-3 sm:p-3.5 shadow-2xl backdrop-blur-md transition-all",
  {
    variants: {
      variant: {
        default: "border-border bg-card/95 text-card-foreground shadow-[0_10px_30px_rgba(0,0,0,0.2)]",
        destructive: "border-destructive/60 bg-destructive/95 text-destructive-foreground shadow-[0_10px_30px_rgba(220,38,38,0.25)]",
        success: "border-emerald-500/40 bg-[#132A1C]/95 text-emerald-100 shadow-[0_10px_30px_rgba(5,150,105,0.25)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = "Toast"

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs font-bold leading-none tracking-tight", className)}
    {...props}
  />
))
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs opacity-90 leading-relaxed mt-1", className)}
    {...props}
  />
))
ToastDescription.displayName = "ToastDescription"

export { Toast, ToastTitle, ToastDescription }
