import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const InputOTP = React.forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-10 w-10 items-center justify-center rounded-md border text-center text-lg font-medium tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
InputOTP.displayName = "InputOTP"

export { InputOTP }
