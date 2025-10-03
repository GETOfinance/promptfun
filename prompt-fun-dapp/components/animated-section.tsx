"use client"

import type React from "react"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "fade-in" | "scale-up"
  delay?: number
  duration?: number
}

export function AnimatedSection({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  duration = 600,
}: AnimatedSectionProps) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "-50px",
  })

  const getAnimationClasses = () => {
    const baseClasses = `transition-all ease-out`
    const durationClass = `duration-[${duration}ms]`
    const delayClass = delay > 0 ? `delay-[${delay}ms]` : ""

    if (!isIntersecting) {
      switch (animation) {
        case "fade-up":
          return `${baseClasses} ${durationClass} ${delayClass} opacity-0 translate-y-8`
        case "fade-down":
          return `${baseClasses} ${durationClass} ${delayClass} opacity-0 -translate-y-8`
        case "fade-left":
          return `${baseClasses} ${durationClass} ${delayClass} opacity-0 translate-x-8`
        case "fade-right":
          return `${baseClasses} ${durationClass} ${delayClass} opacity-0 -translate-x-8`
        case "fade-in":
          return `${baseClasses} ${durationClass} ${delayClass} opacity-0`
        case "scale-up":
          return `${baseClasses} ${durationClass} ${delayClass} opacity-0 scale-95`
        default:
          return `${baseClasses} ${durationClass} ${delayClass} opacity-0 translate-y-8`
      }
    }

    return `${baseClasses} ${durationClass} ${delayClass} opacity-100 translate-y-0 translate-x-0 scale-100`
  }

  return (
    <div ref={ref} className={`${getAnimationClasses()} ${className}`}>
      {children}
    </div>
  )
}
