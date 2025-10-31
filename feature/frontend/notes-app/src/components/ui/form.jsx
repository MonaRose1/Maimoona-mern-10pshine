import React from "react"
import { cn } from "@/lib/utils"

export function Form({ children, onSubmit, ...props }) {
  return (
    <form onSubmit={onSubmit} {...props}>
      {children}
    </form>
  )
}

export function FormProvider({ children, ...props }) {
  return <div {...props}>{children}</div>
}

export function FormField({ control, name, render }) {
  return render({
    field: { name, value: "", onChange: () => {}, onBlur: () => {} },
    fieldState: { error: null },
    formState: { errors: {} }
  })
}

export function FormItem({ className, ...props }) {
  return (
    <div className={cn("space-y-2", className)} {...props} />
  )
}

export function FormLabel({ className, ...props }) {
  return (
    <label
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
}

export function FormControl({ children }) {
  return <div>{children}</div>
}

export function FormMessage({ className, ...props }) {
  return (
    <p
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    />
  )
}