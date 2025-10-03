"use client"

import { useScrollParticles } from "@/hooks/use-scroll-particles"
import { useEffect, useState } from "react"

interface ScrollParticlesProps {
  maxParticles?: number
  spawnRate?: number
  colors?: string[]
  enabled?: boolean
}

export function ScrollParticles({
  maxParticles = 50,
  spawnRate = 0.3,
  colors = ["#6C5CE7", "#A29BFE", "#74B9FF"],
  enabled = true,
}: ScrollParticlesProps = {}) {
  const { particles, scrollVelocity } = useScrollParticles({
    maxParticles,
    spawnRate,
    colors,
    enabled,
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !enabled) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Scroll velocity indicator */}
      {Math.abs(scrollVelocity) > 2 && (
        <div className="absolute top-4 right-4 bg-primary/20 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-primary border border-primary/30">
          Scroll: {Math.abs(scrollVelocity).toFixed(1)}
        </div>
      )}

      {/* Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full transition-opacity duration-100 ${getParticleClasses(particle.type)}`}
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            transform: particle.type === "burst" ? `rotate(${particle.life * 10}deg)` : undefined,
          }}
        />
      ))}

      {/* Trail effects for high-speed scrolling */}
      {Math.abs(scrollVelocity) > 8 && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-pulse" />
      )}
    </div>
  )
}

function getParticleClasses(type: string): string {
  switch (type) {
    case "spark":
      return "animate-pulse"
    case "trail":
      return "blur-[0.5px]"
    case "burst":
      return "animate-spin"
    case "float":
      return "animate-bounce"
    default:
      return ""
  }
}
