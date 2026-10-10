import * as React from "react"
import { cn } from "../../lib/utils"
import { Label } from "./label"

const Field = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-1.5 w-full", className)} {...props} />
))
Field.displayName = "Field"

const FieldLabel = React.forwardRef(({ className, required, children, ...props }, ref) => (
  <Label ref={ref} className={cn("flex items-center gap-1", className)} {...props}>
    {children}
    {required && <span className="text-destructive font-bold">*</span>}
  </Label>
))
FieldLabel.displayName = "FieldLabel"

const FieldDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-[11px] text-muted-foreground", className)} {...props} />
))
FieldDescription.displayName = "FieldDescription"

const FieldError = React.forwardRef(({ className, children, ...props }, ref) => {
  if (!children) return null
  return (
    <p ref={ref} className={cn("text-[11px] font-medium text-destructive", className)} {...props}>
      {children}
    </p>
  )
})
FieldError.displayName = "FieldError"

export { Field, FieldLabel, FieldDescription, FieldError }
