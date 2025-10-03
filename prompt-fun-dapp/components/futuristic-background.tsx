"use client"

import { useEffect, useState } from "react"

interface DataStream {
  id: number
  x: number
  delay: number
  duration: number
  opacity: number
}

export function FuturisticBackground() {
  const [dataStreams, setDataStreams] = useState<DataStream[]>([])

  useEffect(() => {
    const streams: DataStream[] = []
    for (let i = 0; i < 15; i++) {
      streams.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 4,
        duration: Math.random() * 3 + 2,
        opacity: Math.random() * 0.3 + 0.1,
      })
    }
    setDataStreams(streams)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated Data Streams */}
      {dataStreams.map((stream) => (
        <div
          key={stream.id}
          className="absolute top-0 w-px bg-gradient-to-b from-transparent via-primary to-transparent animate-data-flow"
          style={{
            left: `${stream.x}%`,
            height: "20px",
            animationDelay: `${stream.delay}s`,
            animationDuration: `${stream.duration}s`,
            opacity: stream.opacity,
          }}
        />
      ))}

      {/* Floating Geometric Shapes */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 border border-primary/30 rotate-45 animate-spin-slow" />
      <div className="absolute top-3/4 right-1/4 w-3 h-3 border border-accent/20 animate-pulse" />
      <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-secondary/40 rounded-full animate-ping" />
      <div className="absolute bottom-1/4 left-1/2 w-4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute top-1/3 right-1/3 w-px h-4 bg-gradient-to-b from-transparent via-accent/30 to-transparent" />

      {/* Holographic Grid Lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary to-transparent" />
        <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
        <div className="absolute top-0 bottom-0 left-1/4 w-px bg-gradient-to-b from-transparent via-primary to-transparent" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-secondary to-transparent" />
        <div className="absolute top-0 bottom-0 left-3/4 w-px bg-gradient-to-b from-transparent via-accent to-transparent" />
      </div>
    </div>
  )
}
