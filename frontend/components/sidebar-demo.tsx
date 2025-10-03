"use client"

import { useState } from "react"
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from "@/components/ui/sidebar"
import { Home, Terminal, Trophy, User, Settings, LogOut, Cpu, TrendingUp, Wallet, Rocket } from 'lucide-react'
import { motion } from "framer-motion"
import Link from "next/link"
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function SidebarDemo() {
  const { account, disconnect } = useWallet()
  const router = useRouter()
  const links = [
    {
      label: "Home",
      href: "/",
      icon: <Home className="h-5 w-5 shrink-0 text-white/70 group-hover/sidebar:text-white" />,
    },
    {
      label: "Terminal",
      href: "/terminal",
      icon: <Terminal className="h-5 w-5 shrink-0 text-white/70 group-hover/sidebar:text-white" />,
    },
    {
      label: "Leaderboard",
      href: "/leaderboard",
      icon: <Trophy className="h-5 w-5 shrink-0 text-white/70 group-hover/sidebar:text-white" />,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <User className="h-5 w-5 shrink-0 text-white/70 group-hover/sidebar:text-white" />,
    },
    {
      label: "Trading",
      href: "/terminal",
      icon: <TrendingUp className="h-5 w-5 shrink-0 text-white/70 group-hover/sidebar:text-white" />,
    },
    {
      label: "Meme Launch",
      href: "/meme-launch",
      icon: <Rocket className="h-5 w-5 shrink-0 text-yellow-400 group-hover/sidebar:text-white" />,
    },
    {
      label: "Settings",
      href: "#",
      icon: <Settings className="h-5 w-5 shrink-0 text-white/70 group-hover/sidebar:text-white" />,
    },
  ]

  const { open } = useSidebar()

  return (
    <Sidebar>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div className="border-t border-white/10 pt-4">
          {account && (
            <Button
              variant="ghost"
              className="w-full flex items-center gap-2 text-white/70 hover:text-white"
              onClick={async (e) => {
                e.preventDefault()
                await disconnect()
                router.push('/')
              }}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              Logout
            </Button>
          )}
        </div>
      </SidebarBody>
    </Sidebar>
  )
}

export const Logo = () => {
  return (
    <Link href="/" className="relative z-20 flex items-center space-x-3 py-2 text-sm font-light text-white">
      <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-500 rounded-lg flex items-center justify-center shrink-0">
        <Cpu className="w-4 h-4 text-white" />
      </div>
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-light whitespace-pre text-white">
        prompt.fun
      </motion.span>
    </Link>
  )
}

export const LogoIcon = () => {
  return (
    <Link href="/" className="relative z-20 flex items-center space-x-2 py-2 text-sm font-light text-white">
      <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-500 rounded-lg flex items-center justify-center shrink-0">
        <Cpu className="w-4 h-4 text-white" />
      </div>
    </Link>
  )
}
