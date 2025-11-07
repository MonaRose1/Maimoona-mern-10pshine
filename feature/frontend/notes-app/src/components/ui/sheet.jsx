import React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sheet({ ...props }) {
  return <SheetPrimitive.Root {...props} />
}

export const SheetTrigger = SheetPrimitive.Trigger
export const SheetClose = SheetPrimitive.Close

export const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-all",
      className
    )}
    {...props}
  />
))

export const SheetContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <SheetPrimitive.Portal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 flex flex-col gap-4 bg-background p-6 shadow-lg transition-all",
        className
      )}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 opacity-70 hover:opacity-100">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPrimitive.Portal>
))
