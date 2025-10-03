"use client"

import type React from "react"
import { useParallax } from "@/hooks/use-parallax"

interface ParallaxElementProps {
  children: React.ReactNode
  speed?: number
  direction?: "up" | "down" | "left" | "right"
  className?: string
  disabled?: boolean
}

export function ParallaxElement({
  children,
  speed = 0.5,
  direction = "up",
  className = "",
  disabled = false,
}: ParallaxElementProps) {
  const { ref } = useParallax({ speed, direction, disabled })

  return (
    <div ref={ref} className={`${className}`} style={{ transform: "none" }}>
      {children}
    </div>
  )
}
