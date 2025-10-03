"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Crown, Zap, Users, DollarSign, BarChart3, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Token {
  id: number
  name: string
  symbol: string
  price: number
  change24h: number
  marketCap: number
  volume24h: number
  holders: number
  rank: number
  isNew?: boolean
  isHot?: boolean
}

const mockTokens: Token[] = [
  {
    id: 1,
    name: "CyberCoin",
    symbol: "CYBER",
    price: 0.00234,
    change24h: 1247.5,
    marketCap: 2340000,
    volume24h: 890000,
    holders: 12450,
    rank: 1,
    isHot: true,
  },
  {
    id: 2,
    name: "NeonToken",
    symbol: "NEON",
    price: 0.00156,
    change24h: 892.3,
    marketCap: 1890000,
    volume24h: 670000,
    holders: 9876,
    rank: 2,
    isNew: true,
  },
  {
    id: 3,
    name: "QuantumCash",
    symbol: "QCASH",
    price: 0.00089,
    change24h: 567.8,
    marketCap: 1560000,
    volume24h: 450000,
    holders: 8234,
    rank: 3,
  },
  {
    id: 4,
    name: "HoloCoin",
    symbol: "HOLO",
    price: 0.00067,
    change24h: 423.1,
    marketCap: 1230000,
    volume24h: 380000,
    holders: 7123,
    rank: 4,
    isHot: true,
  },
  {
    id: 5,
    name: "VoidToken",
    symbol: "VOID",
    price: 0.00045,
    change24h: 312.7,
    marketCap: 980000,
    volume24h: 290000,
    holders: 5987,
    rank: 5,
  },
  {
    id: 6,
    name: "PlasmaFi",
    symbol: "PLASMA",
    price: 0.00034,
    change24h: 234.9,
    marketCap: 780000,
    volume24h: 210000,
    holders: 4567,
    rank: 6,
    isNew: true,
  },
  {
    id: 7,
    name: "DataStream",
    symbol: "DSTREAM",
    price: 0.00023,
    change24h: 189.4,
    marketCap: 650000,
    volume24h: 180000,
    holders: 3456,
    rank: 7,
  },
  {
    id: 8,
    name: "SynthWave",
    symbol: "SYNTH",
    price: 0.00019,
    change24h: 156.2,
    marketCap: 520000,
    volume24h: 150000,
    holders: 2890,
    rank: 8,
  },
]

export default function LeaderboardPage() {
  const [tokens, setTokens] = useState<Token[]>(mockTokens)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"rank" | "change24h" | "marketCap" | "volume24h">("rank")
  const [filterType, setFilterType] = useState<"all" | "hot" | "new">("all")

  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        // Scrolling up or near top - show header
        setIsHeaderVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past threshold - hide header
        setIsHeaderVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`
    }
    return `$${num.toFixed(2)}`
  }

  const formatPrice = (price: number) => {
    return `$${price.toFixed(6)}`
  }

  const filteredTokens = tokens
    .filter((token) => {
      const matchesSearch =
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter =
        filterType === "all" || (filterType === "hot" && token.isHot) || (filterType === "new" && token.isNew)
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "change24h":
          return b.change24h - a.change24h
        case "marketCap":
          return b.marketCap - a.marketCap
        case "volume24h":
          return b.volume24h - a.volume24h
        default:
          return a.rank - b.rank
      }
    })

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div
        className={`border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 transition-transform duration-300 ease-in-out ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl lg:text-6xl font-thin neon-text mb-2">Token Leaderboard</h1>
              <p className="text-muted-foreground text-lg">Real-time rankings of the hottest tokens in the metaverse</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="holo-card p-4 text-center">
                <div className="text-2xl font-thin text-primary">24</div>
                <div className="text-xs text-muted-foreground">Active Tokens</div>
              </div>
              <div className="holo-card p-4 text-center">
                <div className="text-2xl font-thin text-accent">$12.4M</div>
                <div className="text-xs text-muted-foreground">Total Volume</div>
              </div>
              <div className="holo-card p-4 text-center">
                <div className="text-2xl font-thin text-secondary">89K</div>
                <div className="text-xs text-muted-foreground">Total Holders</div>
              </div>
              <div className="holo-card p-4 text-center">
                <div className="text-2xl font-thin text-primary">+247%</div>
                <div className="text-xs text-muted-foreground">Avg Growth</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search tokens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card/50 border-border/50 focus:border-primary/50"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              onClick={() => setFilterType("all")}
              className="bg-card/50 border-border/50"
            >
              All
            </Button>
            <Button
              variant={filterType === "hot" ? "default" : "outline"}
              onClick={() => setFilterType("hot")}
              className="bg-card/50 border-border/50"
            >
              <Zap className="w-4 h-4 mr-1" />
              Hot
            </Button>
            <Button
              variant={filterType === "new" ? "default" : "outline"}
              onClick={() => setFilterType("new")}
              className="bg-card/50 border-border/50"
            >
              New
            </Button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 bg-card/50 border border-border/50 rounded-md text-foreground focus:border-primary/50 focus:outline-none"
          >
            <option value="rank">Rank</option>
            <option value="change24h">24h Change</option>
            <option value="marketCap">Market Cap</option>
            <option value="volume24h">Volume</option>
          </select>
        </div>

        {/* Leaderboard Table */}
        <div className="holo-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left p-4 text-muted-foreground font-thin">Rank</th>
                  <th className="text-left p-4 text-muted-foreground font-thin">Token</th>
                  <th className="text-right p-4 text-muted-foreground font-thin">Price</th>
                  <th className="text-right p-4 text-muted-foreground font-thin">24h Change</th>
                  <th className="text-right p-4 text-muted-foreground font-thin">Market Cap</th>
                  <th className="text-right p-4 text-muted-foreground font-thin">Volume</th>
                  <th className="text-right p-4 text-muted-foreground font-thin">Holders</th>
                </tr>
              </thead>
              <tbody>
                {filteredTokens.map((token, index) => (
                  <tr
                    key={token.id}
                    className="border-b border-border/20 hover:bg-card/30 transition-all duration-300 group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {token.rank === 1 && <Crown className="w-4 h-4 text-accent" />}
                        <span className="font-thin text-lg">{token.rank}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/30">
                          <span className="text-xs font-thin">{token.symbol.slice(0, 2)}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-thin text-lg">{token.name}</span>
                            {token.isHot && (
                              <span className="px-2 py-1 text-xs bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-full">
                                🔥 HOT
                              </span>
                            )}
                            {token.isNew && (
                              <span className="px-2 py-1 text-xs bg-gradient-to-r from-secondary/20 to-primary/20 border border-secondary/30 rounded-full">
                                ✨ NEW
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{token.symbol}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <span className="font-thin text-lg">{formatPrice(token.price)}</span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {token.change24h > 0 ? (
                          <TrendingUp className="w-4 h-4 text-accent" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-400" />
                        )}
                        <span className={`font-thin text-lg ${token.change24h > 0 ? "text-accent" : "text-red-400"}`}>
                          +{token.change24h.toFixed(1)}%
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <span className="font-thin text-lg">{formatNumber(token.marketCap)}</span>
                    </td>

                    <td className="p-4 text-right">
                      <span className="font-thin text-lg">{formatNumber(token.volume24h)}</span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="font-thin text-lg">{token.holders.toLocaleString()}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="holo-card p-6 text-center">
            <DollarSign className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-thin text-primary mb-1">$2.34M</div>
            <div className="text-sm text-muted-foreground">Top Token Market Cap</div>
          </div>

          <div className="holo-card p-6 text-center">
            <BarChart3 className="w-8 h-8 text-accent mx-auto mb-3" />
            <div className="text-2xl font-thin text-accent mb-1">+1,247%</div>
            <div className="text-sm text-muted-foreground">Highest 24h Gain</div>
          </div>

          <div className="holo-card p-6 text-center">
            <Users className="w-8 h-8 text-secondary mx-auto mb-3" />
            <div className="text-2xl font-thin text-secondary mb-1">12,450</div>
            <div className="text-sm text-muted-foreground">Most Holders</div>
          </div>
        </div>
      </div>
    </div>
  )
} 