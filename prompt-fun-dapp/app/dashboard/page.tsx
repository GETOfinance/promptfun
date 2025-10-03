"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Wallet, Coins, Zap, MessageSquare } from "lucide-react"
import { TailwindConnectButton } from "@/components/ui/tailwind-connect-button"

const mockTokens = [
  { symbol: "DOGE", price: "$0.0023", change: "+12.5%", holders: "1.2K" },
  { symbol: "PEPE", price: "$0.0018", change: "+8.3%", holders: "890" },
  { symbol: "SHIB", price: "$0.0031", change: "-2.1%", holders: "2.1K" },
]

const userTokens = [
  { symbol: "MOON", price: "$0.0045", supply: "1M", status: "Active" },
  { symbol: "ROCKET", price: "$0.0012", supply: "500K", status: "Active" },
]

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 md:ml-64 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold neon-text">Dashboard</h1>
              <p className="text-gray-400">Your Aptos meme token overview</p>
            </div>
            <Button className="gradient-bg hover:opacity-90">
              <MessageSquare className="w-4 h-4 mr-2" />
              Ask Copilot
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glow-border bg-card/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
                <Wallet className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,234.56</div>
                <p className="text-xs text-green-400">+20.1% from last month</p>
              </CardContent>
            </Card>

            <Card className="glow-border bg-card/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tokens Launched</CardTitle>
                <Coins className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-gray-400">Active tokens</p>
              </CardContent>
            </Card>

            <Card className="glow-border bg-card/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">XP Points</CardTitle>
                <Zap className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,250</div>
                <p className="text-xs text-gray-400">Level 5 Trader</p>
              </CardContent>
            </Card>

            <Card className="glow-border bg-card/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-green-400">+12 this week</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trending Tokens */}
            <Card className="glow-border bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Trending Meme Tokens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTokens.map((token, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center">
                          <span className="text-xs font-bold">{token.symbol[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium">${token.symbol}</p>
                          <p className="text-sm text-gray-400">{token.holders} holders</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{token.price}</p>
                        <p className={`text-sm ${token.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                          {token.change}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Your Launched Tokens */}
            <Card className="glow-border bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-secondary" />
                  Your Launched Tokens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userTokens.map((token, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center">
                          <span className="text-xs font-bold">{token.symbol[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium">${token.symbol}</p>
                          <p className="text-sm text-gray-400">{token.supply} supply</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{token.price}</p>
                        <span className="inline-block px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                          {token.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <TailwindConnectButton className="w-full mt-4 justify-center">
                  Ask Copilot to launch another token
                </TailwindConnectButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
