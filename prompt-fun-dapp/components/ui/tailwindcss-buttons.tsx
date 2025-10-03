"use client"

import type React from "react"

interface ButtonsCardProps {
  children: React.ReactNode
  onClick?: () => void
}

export function ButtonsCard({ children, onClick }: ButtonsCardProps) {
  return (
    <div
      className="relative group cursor-pointer p-6 rounded-lg border border-border bg-card/50 hover:bg-card/70 transition-all duration-200"
      onClick={onClick}
    >
      <div className="flex items-center justify-center min-h-[60px]">{children}</div>
    </div>
  )
}
