"use client"

import { useEffect, useState, useCallback, useRef } from "react"

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  life: number
  maxLife: number
  type: "spark" | "trail" | "burst" | "float"
  angle: number
  speed: number
}

interface UseScrollParticlesProps {
  maxParticles?: number
  spawnRate?: number
  colors?: string[]
  enabled?: boolean
}

export function useScrollParticles({
  maxParticles = 50,
  spawnRate = 0.3,
  colors = ["#6C5CE7", "#A29BFE", "#74B9FF"],
  enabled = true,
}: UseScrollParticlesProps = {}) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const lastScrollY = useRef(0)
  const lastScrollTime = useRef(Date.now())
  const animationFrameId = useRef<number>()

  const createParticle = useCallback(
    (x: number, y: number, type: Particle["type"] = "spark"): Particle => {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 3 + 1

      return {
        id: Math.random(),
        x,
        y,
        vx: Math.cos(angle) * speed * (type === "burst" ? 2 : 1),
        vy: Math.sin(angle) * speed * (type === "burst" ? 2 : 1) - (type === "float" ? 1 : 0),
        size: Math.random() * (type === "burst" ? 6 : 4) + 1,
        opacity: Math.random() * 0.8 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: type === "trail" ? 60 : type === "burst" ? 30 : 120,
        type,
        angle,
        speed,
      }
    },
    [colors],
  )

  const spawnParticles = useCallback(
    (scrollY: number, velocity: number) => {
      if (!enabled || Math.abs(velocity) < 0.5) return

      const spawnCount = Math.min(Math.floor(Math.abs(velocity) * spawnRate), 5)
      const newParticles: Particle[] = []

      for (let i = 0; i < spawnCount; i++) {
        const x = Math.random() * window.innerWidth
        const y = scrollY + Math.random() * window.innerHeight

        // Different particle types based on scroll speed
        let type: Particle["type"] = "spark"
        if (Math.abs(velocity) > 10) {
          type = Math.random() > 0.7 ? "burst" : "trail"
        } else if (Math.abs(velocity) > 5) {
          type = Math.random() > 0.5 ? "trail" : "spark"
        } else {
          type = Math.random() > 0.8 ? "float" : "spark"
        }

        newParticles.push(createParticle(x, y, type))
      }

      setParticles((prev) => {
        const combined = [...prev, ...newParticles]
        return combined.slice(-maxParticles)
      })
    },
    [enabled, spawnRate, maxParticles, createParticle],
  )

  const updateParticles = useCallback(() => {
    setParticles((prev) =>
      prev
        .map((particle) => {
          const newParticle = { ...particle }
          newParticle.life += 1

          // Update position based on type
          switch (particle.type) {
            case "spark":
              newParticle.x += newParticle.vx
              newParticle.y += newParticle.vy
              newParticle.vy += 0.1 // gravity
              newParticle.vx *= 0.99 // friction
              break
            case "trail":
              newParticle.x += newParticle.vx * 0.5
              newParticle.y += newParticle.vy * 0.5
              newParticle.vx *= 0.95
              newParticle.vy *= 0.95
              break
            case "burst":
              newParticle.x += newParticle.vx
              newParticle.y += newParticle.vy
              newParticle.vx *= 0.92
              newParticle.vy *= 0.92
              break
            case "float":
              newParticle.x += Math.sin(newParticle.life * 0.1) * 0.5
              newParticle.y += newParticle.vy
              newParticle.vy *= 0.98
              break
          }

          // Update opacity based on life
          const lifeRatio = newParticle.life / newParticle.maxLife
          newParticle.opacity = Math.max(0, (1 - lifeRatio) * 0.8)

          return newParticle
        })
        .filter((particle) => particle.life < particle.maxLife && particle.opacity > 0.01),
    )
  }, [])

  useEffect(() => {
    if (!enabled) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const currentTime = Date.now()
      const deltaTime = currentTime - lastScrollTime.current
      const deltaScroll = currentScrollY - lastScrollY.current

      if (deltaTime > 0) {
        const velocity = (deltaScroll / deltaTime) * 16.67 // normalize to 60fps
        setScrollVelocity(velocity)
        spawnParticles(currentScrollY, velocity)
      }

      lastScrollY.current = currentScrollY
      lastScrollTime.current = currentTime
    }

    const animate = () => {
      updateParticles()
      animationFrameId.current = requestAnimationFrame(animate)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    animationFrameId.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [enabled, spawnParticles, updateParticles])

  return { particles, scrollVelocity }
}
