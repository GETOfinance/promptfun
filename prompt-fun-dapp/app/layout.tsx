import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Poppins } from "next/font/google"
import { WalletProvider } from "../contexts/WalletContext"
import WalletStatusBar from "@/components/WalletStatusBar"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Prompt.fun - AI-Powered Aptos Meme Token Platform",
  description: "Launch, trade, and manage meme tokens on Aptos blockchain with AI assistance",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        <WalletProvider>
          <WalletStatusBar />
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}
