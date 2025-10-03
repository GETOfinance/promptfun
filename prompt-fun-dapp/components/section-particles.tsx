"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

interface SectionParticle {
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
  rotation: number
  rotationSpeed: number
}

interface SectionParticlesProps {
  children: React.ReactNode
  particleCount?: number
  colors?: string[]
  triggerOnScroll?: boolean
  className?: string
}

export function SectionParticles({
  children,
  particleCount = 15,
  colors = ["#6C5CE7", "#A29BFE", "#74B9FF"],
  triggerOnScroll = true,
  className = "",
}: SectionParticlesProps) {
  const [particles, setParticles] = useState<SectionParticle[]>([])
  const [isActive, setIsActive] = useState(false)
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.3 })
  const animationFrameId = useRef<number>()
  const sectionRef = useRef<HTMLDivElement>(null)

  const createSectionParticle = (bounds: DOMRect): SectionParticle => {
    return {
      id: Math.random(),
      x: Math.random() * bounds.width,
      y: Math.random() * bounds.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: Math.random() * 180 + 120,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 4,
    }
  }

  const spawnSectionParticles = () => {
    if (!sectionRef.current) return

    const bounds = sectionRef.current.getBoundingClientRect()
    const newParticles: SectionParticle[] = []

    for (let i = 0; i < particleCount; i++) {
      newParticles.push(createSectionParticle(bounds))
    }

    setParticles(newParticles)
    setIsActive(true)
  }

  const updateSectionParticles = () => {
    setParticles((prev) =>
      prev
        .map((particle) => {
          const newParticle = { ...particle }
          newParticle.life += 1
          newParticle.x += newParticle.vx
          newParticle.y += newParticle.vy
          newParticle.rotation += newParticle.rotationSpeed

          // Boundary bouncing
          if (sectionRef.current) {
            const bounds = sectionRef.current.getBoundingClientRect()
            if (newParticle.x <= 0 || newParticle.x >= bounds.width) {
              newParticle.vx *= -0.8
              newParticle.x = Math.max(0, Math.min(bounds.width, newParticle.x))
            }
            if (newParticle.y <= 0 || newParticle.y >= bounds.height) {
              newParticle.vy *= -0.8
              newParticle.y = Math.max(0, Math.min(bounds.height, newParticle.y))
            }
          }

          // Fade out over time
          const lifeRatio = newParticle.life / newParticle.maxLife
          newParticle.opacity = Math.max(0, (1 - lifeRatio) * 0.6)

          // Add some drift
          newParticle.vx *= 0.995
          newParticle.vy *= 0.995

          return newParticle
        })
        .filter((particle) => particle.life < particle.maxLife),
    )
  }

  useEffect(() => {
    if (isIntersecting && triggerOnScroll) {
      spawnSectionParticles()
    }
  }, [isIntersecting, triggerOnScroll])

  useEffect(() => {
    if (!isActive) return

    const animate = () => {
      updateSectionParticles()
      animationFrameId.current = requestAnimationFrame(animate)
    }

    animationFrameId.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [isActive])

  return (
    <div
      ref={(el) => {
        ref.current = el
        sectionRef.current = el
      }}
      className={`relative ${className}`}
    >
      {children}

      {/* Section Particles */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                opacity: particle.opacity,
                boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
                transform: `rotate(${particle.rotation}deg)`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
