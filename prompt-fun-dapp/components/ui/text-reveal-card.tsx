"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { twMerge } from "tailwind-merge"
import { cn } from "@/lib/utils"
import { Send, Sparkles } from "lucide-react"
import { TailwindConnectButton } from "@/components/ui/tailwind-connect-button"

interface ChatMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export const TextRevealCard = ({
  text,
  revealText,
  children,
  className,
}: {
  text?: string
  revealText?: string
  children?: React.ReactNode
  className?: string
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: "Hi! I can help you launch tokens. Try saying 'Launch $MOON token' or 'Create $DOGE coin'",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response for token launching
    setTimeout(() => {
      let response = ""
      const inputLower = input.toLowerCase()

      if (inputLower.includes("launch") || inputLower.includes("create")) {
        response = "🚀 Great! I'll help you launch that token. Setting up the smart contract on Aptos blockchain..."
      } else if (inputLower.includes("token") || inputLower.includes("coin")) {
        response = "💡 I can help you create that token! What would you like to name it? Try 'Launch $YOURNAME token'"
      } else {
        response = "I'm here to help you launch tokens! Try saying 'Launch $MOON token' or ask me about token creation."
      }

      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      className={cn(
        "bg-card/50 border border-primary/20 w-[40rem] rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm glow-border holo-card",
        className,
      )}
    >
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-8 left-6 w-1 h-1 bg-accent rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-6 right-8 w-1.5 h-1.5 bg-secondary rounded-full animate-bounce opacity-50"></div>
      </div>

      {/* Content with higher z-index */}
      <div className="relative z-10">
        {children}

        {/* Enhanced Chat Container */}
        <div className="h-64 flex flex-col bg-slate-800/50 rounded-xl border border-cyan-500/20 p-4 backdrop-blur-sm shadow-lg shadow-zinc-900/50">
          {/* Messages with enhanced styling */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-transparent">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-xl text-sm backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
                    message.isUser
                      ? "bg-slate-800 text-white ml-8 shadow-lg shadow-cyan-500/10 border border-cyan-500/20 ring-1 ring-white/10"
                      : "bg-zinc-950 text-white mr-8 shadow-lg shadow-black/20 border border-cyan-500/10 ring-1 ring-white/5"
                  }`}
                >
                  <p className="leading-relaxed font-light">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2 font-mono text-cyan-400/70">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-950 border border-cyan-500/10 ring-1 ring-white/5 p-3 rounded-xl mr-8 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce shadow-sm shadow-cyan-400/50"></div>
                    <div
                      className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce shadow-sm shadow-cyan-400/50"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce shadow-sm shadow-cyan-400/50"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Input */}
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Try: Launch $MOON token"
              className="flex-1 px-4 py-3 bg-slate-800 border border-cyan-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 text-sm backdrop-blur-sm transition-all duration-300 ring-1 ring-white/10 shadow-lg shadow-zinc-900/50"
              disabled={isLoading}
            />
            <TailwindConnectButton
              onClick={handleSend}
              className="px-4 py-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </TailwindConnectButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export const TextRevealCardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <h2 className={twMerge("text-white text-lg mb-2 font-light neon-text flex items-center gap-2", className)}>
      <Sparkles className="w-5 h-5 text-primary" />
      {children}
    </h2>
  )
}

export const TextRevealCardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <p className={twMerge("text-gray-400 text-sm font-light mb-4", className)}>{children}</p>
}
