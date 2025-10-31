import React from "react"
import * as ResizablePrimitive from "react-resizable-panels"
import { cn } from "@/lib/utils"

export function ResizablePanelGroup({ className, ...props }) {
  return (
    <ResizablePrimitive.PanelGroup
      className={cn("flex h-full w-full", className)}
      {...props}
    />
  )
}

export function ResizablePanel({ className, ...props }) {
  return (
    <ResizablePrimitive.Panel
      className={cn("relative", className)}
      {...props}
    />
  )
}

export function ResizableHandle({ className, ...props }) {
  return (
    <ResizablePrimitive.PanelResizeHandle
      className={cn(
        "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:w-1 after:bg-border/50 after:transition-colors hover:after:bg-primary",
        className
      )}
      {...props}
    />
  )
}
