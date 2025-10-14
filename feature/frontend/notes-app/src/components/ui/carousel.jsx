"use client"

import * as React from "react"
import { Carousel as CarouselPrimitive } from "embla-carousel-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Carousel({ children, className, ...props }) {
  const [emblaRef, emblaApi] = CarouselPrimitive.useEmblaCarousel({
    loop: true,
  })

  return (
    <div className={cn("relative", className)} {...props}>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">{children}</div>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2"
        onClick={() => emblaApi && emblaApi.scrollPrev()}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2"
        onClick={() => emblaApi && emblaApi.scrollNext()}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
