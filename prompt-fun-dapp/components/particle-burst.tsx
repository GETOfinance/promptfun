"use client"

import { useState, useEffect, useRef } from "react"

interface BurstParticle {
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
}

interface ParticleBurstProps {
  trigger: boolean
  x?: number
  y?: number
  particleCount?: number
  colors?: string[]
  onComplete?: () => void
}

export function ParticleBurst({
  trigger,
  x = 0,
  y = 0,
  particleCount = 20,
  colors = ["#6C5CE7", "#A29BFE", "#74B9FF"],
  onComplete,
}: ParticleBurstProps) {
  const [particles, setParticles] = useState<BurstParticle[]>([])
  const animationFrameId = useRef<number>()

  const createBurstParticle = (centerX: number, centerY: number): BurstParticle => {
    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * 8 + 4
    const size = Math.random() * 4 + 2

    return {
      id: Math.random(),
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size,
      opacity: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: Math.random() * 60 + 40,
    }
  }

  const updateBurstParticles = () => {
    setParticles((prev) => {
      const updated = prev
        .map((particle) => {
          const newParticle = { ...particle }
          newParticle.life += 1
          newParticle.x += newParticle.vx
          newParticle.y += newParticle.vy
          newParticle.vy += 0.2 // gravity
          newParticle.vx *= 0.98 // friction

          // Fade out
          const lifeRatio = newParticle.life / newParticle.maxLife
          newParticle.opacity = Math.max(0, 1 - lifeRatio)

          return newParticle
        })
        .filter((particle) => particle.life < particle.maxLife)

      if (updated.length === 0 && prev.length > 0) {
        onComplete?.()
      }

      return updated
    })
  }

  useEffect(() => {
    if (trigger) {
      const newParticles: BurstParticle[] = []
      for (let i = 0; i < particleCount; i++) {
        newParticles.push(createBurstParticle(x, y))
      }
      setParticles(newParticles)
    }
  }, [trigger, x, y, particleCount])

  useEffect(() => {
    if (particles.length === 0) return

    const animate = () => {
      updateBurstParticles()
      animationFrameId.current = requestAnimationFrame(animate)
    }

    animationFrameId.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [particles.length])

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-pulse"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
        />
      ))}
    </div>
  )
}
