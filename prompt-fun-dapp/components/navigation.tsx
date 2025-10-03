"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MessageSquare, BarChart3, Rocket, Store, User, Menu, X, Home } from "lucide-react"
import { TailwindConnectButton } from "@/components/ui/tailwind-connect-button"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/chat", label: "Copilot", icon: MessageSquare },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/launch", label: "Launch", icon: Rocket },
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/leaderboard", label: "Leaderboard", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: User },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-zinc-950 border border-white/10"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <nav
        className={`
        fixed left-0 top-0 h-full w-64 bg-zinc-950/95 backdrop-blur-sm border-r border-white/10 z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <span className="text-white font-light text-sm">P</span>
            </div>
            <span className="text-xl font-light neon-text tracking-wide">Prompt.fun</span>
          </div>

          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-light
                    ${
                      isActive
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "hover:bg-white/5 text-gray-300 hover:text-white border border-transparent"
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <TailwindConnectButton className="w-full justify-center" variant="navbar">Connect Wallet</TailwindConnectButton>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
