import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ConditionalSidebar } from "@/components/conditional-sidebar"
import { WalletProvider } from "@/contexts/WalletContext"

export const metadata: Metadata = {
  title: "prompt.fun - Launch & Trade Meme Tokens with AI",
  description: "Launch & trade meme tokens with just a prompt — powered by AI & Aptos blockchain",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <WalletProvider>
          <ConditionalSidebar>{children}</ConditionalSidebar>
        </WalletProvider>
      </body>
    </html>
  )
}
