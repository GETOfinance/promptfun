"use client"

import { useEffect, useRef, useState } from "react"

interface UseParallaxProps {
  speed?: number
  direction?: "up" | "down" | "left" | "right"
  disabled?: boolean
}

export function useParallax({ speed = 0.5, direction = "up", disabled = false }: UseParallaxProps = {}) {
  const ref = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (disabled) return

    const handleScroll = () => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const scrolled = window.pageYOffset
      const rate = scrolled * -speed

      let transform = ""
      switch (direction) {
        case "up":
          transform = `translateY(${rate}px)`
          break
        case "down":
          transform = `translateY(${-rate}px)`
          break
        case "left":
          transform = `translateX(${rate}px)`
          break
        case "right":
          transform = `translateX(${-rate}px)`
          break
      }

      if (ref.current) {
        ref.current.style.transform = transform
      }

      setOffset(rate)
    }

    // Use requestAnimationFrame for smooth performance
    let ticking = false
    const smoothScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", smoothScroll, { passive: true })
    handleScroll() // Initial call

    return () => {
      window.removeEventListener("scroll", smoothScroll)
    }
  }, [speed, direction, disabled])

  return { ref, offset }
}
