"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { User, Wallet, Zap, History, Settings, Copy, ExternalLink } from "lucide-react"

const tradeHistory = [
  { type: "Buy", token: "DOGE", amount: "1000", price: "$0.0023", date: "2024-01-15" },
  { type: "Sell", token: "PEPE", amount: "500", price: "$0.0018", date: "2024-01-14" },
  { type: "Launch", token: "MOON", amount: "1M", price: "$0.0045", date: "2024-01-13" },
]

export default function Profile() {
  const [settings, setSettings] = useState({
    beginnerMode: true,
    copilotSuggestions: true,
    notifications: true,
  })

  const walletAddress = "0x1234567890abcdef1234567890abcdef12345678"
  const xpProgress = 75 // 75% to next level

  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 md:ml-64 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold neon-text">Profile & Settings</h1>
            <p className="text-gray-400">Manage your account and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Info */}
            <Card className="glow-border bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Anon Trader</h3>
                    <p className="text-sm text-gray-400">Level 5 Meme Lord</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Wallet Address</span>
                    <Button size="sm" variant="ghost">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-background/50 px-2 py-1 rounded flex-1">
                      {walletAddress.slice(0, 20)}...
                    </code>
                    <Button size="sm" variant="ghost">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">XP Progress</span>
                    <span className="text-sm">1,250 / 1,500 XP</span>
                  </div>
                  <Progress value={xpProgress} className="h-2" />
                  <p className="text-xs text-gray-400">250 XP to Level 6</p>
                </div>

                <div className="flex gap-2">
                  <Badge variant="secondary">
                    <Zap className="w-3 h-3 mr-1" />
                    Token Launcher
                  </Badge>
                  <Badge variant="secondary">
                    <Wallet className="w-3 h-3 mr-1" />
                    Active Trader
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="glow-border bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-secondary" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Beginner Mode</p>
                    <p className="text-sm text-gray-400">Show helpful tips and guides</p>
                  </div>
                  <Switch
                    checked={settings.beginnerMode}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, beginnerMode: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Copilot Suggestions</p>
                    <p className="text-sm text-gray-400">Enable AI-powered suggestions</p>
                  </div>
                  <Switch
                    checked={settings.copilotSuggestions}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, copilotSuggestions: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications</p>
                    <p className="text-sm text-gray-400">Price alerts and updates</p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, notifications: checked }))}
                  />
                </div>

                <div className="pt-4 border-t border-border">
                  <Button variant="outline" className="w-full glow-border bg-transparent">
                    <Wallet className="w-4 h-4 mr-2" />
                    Disconnect Wallet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trade History */}
          <Card className="glow-border bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-accent" />
                Trade History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tradeHistory.map((trade, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={trade.type === "Buy" ? "default" : trade.type === "Sell" ? "destructive" : "secondary"}
                      >
                        {trade.type}
                      </Badge>
                      <div>
                        <p className="font-medium">${trade.token}</p>
                        <p className="text-sm text-gray-400">{trade.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{trade.amount} tokens</p>
                      <p className="text-sm text-gray-400">{trade.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
