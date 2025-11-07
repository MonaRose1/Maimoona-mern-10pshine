import React, { createContext, useContext, useState } from "react"
import { cn } from "@/lib/utils"

export const SidebarContext = createContext({
  isOpen: true,
  setIsOpen: () => {}
})

export function SidebarProvider({ children, style }) {
  const [isOpen, setIsOpen] = useState(true)
  
  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="flex h-full w-full" style={style}>
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

export function Sidebar({ className, ...props }) {
  const context = useContext(SidebarContext)
  const isOpen = context?.isOpen ?? true
  
  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r bg-sidebar text-sidebar-foreground transition-all",
        isOpen ? "w-64" : "w-16",
        className
      )}
      {...props}
    />
  )
}

export function SidebarTrigger({ className, ...props }) {
  const context = useContext(SidebarContext)
  const isOpen = context?.isOpen ?? true
  const setIsOpen = context?.setIsOpen ?? (() => {})
  
  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
        className
      )}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>
  )
}

export function SidebarHeader({ className, ...props }) {
  const context = useContext(SidebarContext)
  const isOpen = context?.isOpen ?? true
  
  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-4",
        !isOpen && "items-center p-2",
        className
      )}
      {...props}
    />
  )
}

export function SidebarContent({ className, ...props }) {
  return (
    <div
      className={cn("flex-1 overflow-auto", className)}
      {...props}
    />
  )
}

export function SidebarGroup({ className, ...props }) {
  return (
    <div
      className={cn("px-3 py-2", className)}
      {...props}
    />
  )
}

export function SidebarGroupLabel({ className, ...props }) {
  const context = useContext(SidebarContext)
  const isOpen = context?.isOpen ?? true
  
  if (!isOpen) return null
  
  return (
    <div
      className={cn(
        "px-2 py-1 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export function SidebarGroupContent({ className, ...props }) {
  return (
    <div
      className={cn("space-y-1", className)}
      {...props}
    />
  )
}

export function SidebarMenu({ className, ...props }) {
  return (
    <ul
      className={cn("space-y-1", className)}
      {...props}
    />
  )
}

export function SidebarMenuItem({ className, ...props }) {
  return (
    <li
      className={cn("", className)}
      {...props}
    />
  )
}

export function SidebarMenuButton({ className, children, ...props }) {
  const context = useContext(SidebarContext)
  const isOpen = context?.isOpen ?? true
  
  return (
    <button
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
        !isOpen && "justify-center px-0",
        className
      )}
      {...props}
    >
      {isOpen ? children : React.Children.toArray(children)[0]}
    </button>
  )
}
