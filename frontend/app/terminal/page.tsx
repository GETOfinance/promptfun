"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BorderMagicButton } from "@/components/ui/border-magic-button"
import { Input } from "@/components/ui/input"
import {
  Send,
  TrendingUp,
  TrendingDown,
  Zap,
  Trophy,
  Coins,
  Rocket,
  Brain,
  Activity,
  Star,
  Gamepad2,
  Crown,
  Flame,
} from "lucide-react"
import { useWallet } from "@/contexts/WalletContext";
import { useLaunchToken } from "../../../test-frontend/src/hooks/aptos/useLaunchToken";

interface Message {
  id: string
  type: "user" | "copilot" | "system" | "achievement" | "trade"
  content: string
  timestamp: Date
  isTyping?: boolean
  data?: any
}

interface UserStats {
  level: number
  xp: number
  xpToNext: number
  totalTrades: number
  winRate: number
  portfolio: number
  achievements: string[]
  streak: number
}

interface TrendingToken {
  symbol: string
  name: string
  price: number
  change24h: number
  volume: string
  marketCap: string
}

export default function TerminalPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "system",
      content: "🚀 Welcome to prompt.fun Web3 Trading Terminal v2.0",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [userStats, setUserStats] = useState<UserStats>({
    level: 12,
    xp: 2450,
    xpToNext: 550,
    totalTrades: 147,
    winRate: 68.5,
    portfolio: 15420,
    achievements: ["First Trade", "Profit Master", "Diamond Hands", "Trend Spotter"],
    streak: 7,
  })

  const [trendingTokens] = useState<TrendingToken[]>([
    { symbol: "MOULI", name: "Mouli Coin", price: 0.0234, change24h: 25.4, volume: "2.1M", marketCap: "45M" },
    { symbol: "CYBER", name: "CyberPunk", price: 1.567, change24h: 18.2, volume: "5.8M", marketCap: "120M" },
    { symbol: "NEON", name: "Neon Dreams", price: 0.891, change24h: 12.7, volume: "3.2M", marketCap: "78M" },
    { symbol: "DOGE", name: "Dogecoin", price: 0.067, change24h: -2.1, volume: "890M", marketCap: "9.5B" },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { account, signAndSubmitTransaction, connected } = useWallet();
  const { launchToken, loading: launchLoading, error: launchError, success: launchSuccess } = useLaunchToken(account, signAndSubmitTransaction);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const addAchievement = (achievement: string) => {
    if (!userStats.achievements.includes(achievement)) {
      setUserStats((prev) => ({
        ...prev,
        achievements: [...prev.achievements, achievement],
        xp: prev.xp + 100,
      }))

      const achievementMessage: Message = {
        id: Date.now().toString(),
        type: "achievement",
        content: `🏆 Achievement Unlocked: ${achievement} (+100 XP)`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, achievementMessage])
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setIsTyping(true)

    // Only real contract: Launch Token
    if (connected && (currentInput.toLowerCase().startsWith("launch ") || currentInput.toLowerCase().startsWith("create "))) {
      const match = currentInput.match(/launch\s+(\w+)\s+(\w+)\s+(\d+)/i);
      if (match) {
        const [, name, symbol, supplyStr] = match;
        const supply = parseInt(supplyStr, 10);
        await launchToken(name, symbol, supply);
        const contractMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "copilot" as "copilot",
          content: launchError ? `❌ ${launchError}` : launchSuccess ? `✅ ${launchSuccess}` : launchLoading ? "⏳ Launching token..." : "",
          timestamp: new Date(),
        };
        setMessages((prev) => [
          ...prev,
          contractMessage,
        ]);
        setIsTyping(false);
        return;
      }
    }
    // All other commands: simulated AI response

    // Check for achievements
    if (currentInput.toLowerCase().includes("buy") || currentInput.toLowerCase().includes("sell")) {
      setTimeout(() => addAchievement("Active Trader"), 2000)
    }

    // Simulate AI response with typing effect
    setTimeout(() => {
      const response = generateCopilotResponse(currentInput)
      const copilotResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: response.type || "copilot",
        content: response.content,
        timestamp: new Date(),
        isTyping: true,
        data: response.data,
      }
      setMessages((prev) => [...prev, copilotResponse])
      setIsTyping(false)

      // Remove typing indicator after response is complete
      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => (msg.id === copilotResponse.id ? { ...msg, isTyping: false } : msg)))
      }, 2000)
    }, 1500)
  }

  const generateCopilotResponse = (userInput: string): { content: string; type?: string; data?: any } => {
    const input = userInput.toLowerCase()

    if (input.includes("launch") || input.includes("create")) {
      return {
        content:
          "🚀 Token Launch Protocol Activated!\n\n✨ Creating your meme token on Aptos blockchain\n💰 Deployment cost: 0.1 APT\n⚡ Estimated time: 30 seconds\n🎯 Auto-liquidity pool creation enabled\n\n[SIMULATION] Your token $MEME is now live! 🎉",
        type: "trade",
      }
    } else if (input.includes("buy")) {
      const token = input.match(/\$(\w+)/)?.[1] || "MOULI"
      return {
        content: `🎯 Buy Order Initiated for $${token.toUpperCase()}\n\n📊 Market Analysis:\n• Current Price: $0.0234\n• 24h Volume: 2.1M APT\n• Liquidity: High ✅\n• Slippage: 0.5%\n\n⚡ Order Status: FILLED\n💎 +50 XP earned for successful trade!`,
        type: "trade",
      }
    } else if (input.includes("sell")) {
      return {
        content:
          "📈 Sell Order Processing...\n\n🎯 Finding optimal exit price\n💰 Profit calculation: +23.5%\n⚡ Order executed successfully!\n🏆 Diamond Hands achievement progress: 8/10",
        type: "trade",
      }
    } else if (input.includes("portfolio") || input.includes("balance")) {
      return {
        content: `💼 Your Web3 Portfolio Dashboard\n\n💰 Total Value: $${userStats.portfolio.toLocaleString()}\n📊 24h P&L: +$342 (+2.3%)\n🎯 Win Rate: ${userStats.winRate}%\n⚡ Active Positions: 8\n\nTop Holdings:\n• 150 APT ($3,450)\n• 50K $MOULI ($2,100)\n• 25K $CYBER ($1,890)\n• 10K $NEON ($890)`,
      }
    } else if (input.includes("leaderboard") || input.includes("rank")) {
      return {
        content: `🏆 Global Leaderboard Status\n\n👑 Your Rank: #17 / 10,000\n⭐ Level: ${userStats.level}\n🔥 XP: ${userStats.xp.toLocaleString()}\n📈 Win Streak: ${userStats.streak} trades\n\nTop 3 Traders:\n🥇 CryptoKing - 15,680 XP\n🥈 DiamondHands - 14,230 XP\n🥉 MoonShot - 13,890 XP`,
      }
    } else if (input.includes("trend") || input.includes("hot")) {
      return {
        content: `🔥 Trending Tokens Alert!\n\n🚀 Top Gainers (24h):\n• $MOULI +25.4% 📈\n• $CYBER +18.2% 🎯\n• $NEON +12.7% ⚡\n\n📊 Market Sentiment: BULLISH\n💎 Volume Surge: +150%\n🎪 Meme Season: ACTIVE\n\n💡 AI Recommendation: Consider $MOULI for momentum play`,
      }
    } else if (input.includes("help") || input.includes("command")) {
      return {
        content: `🤖 Web3 Trading Copilot Commands\n\n🚀 Token Operations:\n• "launch $TOKEN" - Create new token\n• "buy $TOKEN for X APT" - Execute buy order\n• "sell X $TOKEN" - Execute sell order\n\n📊 Analytics:\n• "portfolio" - View holdings\n• "trending" - Hot tokens\n• "leaderboard" - Your rank\n\n🎮 Gamification:\n• "achievements" - View unlocked rewards\n• "level up" - Check XP progress\n• "streak" - Trading streak info`,
      }
    } else if (input.includes("achievement")) {
      return {
        content: `🏆 Your Achievement Collection\n\n✅ Unlocked (${userStats.achievements.length}/20):\n${userStats.achievements.map((a) => `• ${a} 🎖️`).join("\n")}\n\n🔒 Locked Achievements:\n• Whale Trader (Trade >$100K)\n• Speed Demon (10 trades in 1 hour)\n• Prophet (5 consecutive wins)\n• Community Leader (Refer 10 friends)`,
      }
    } else if (input.includes("level")) {
      return {
        content: `⭐ Level Progress Dashboard\n\n🎯 Current Level: ${userStats.level}\n⚡ XP: ${userStats.xp}/${userStats.xp + userStats.xpToNext}\n📈 Progress: ${Math.round((userStats.xp / (userStats.xp + userStats.xpToNext)) * 100)}%\n\n🎁 Next Level Rewards:\n• +$50 trading bonus\n• Exclusive NFT badge\n• VIP trading signals\n• Reduced fees (0.1%)`,
      }
    } else {
      return {
        content: `🤖 I'm your Web3 Trading Copilot! I can help you:\n\n🚀 Launch meme tokens instantly\n💰 Execute smart trades with AI analysis\n📊 Track portfolio performance\n🏆 Climb the global leaderboard\n🎮 Unlock achievements & rewards\n\nTry: "buy $MOULI for 10 APT" or "launch $MYMEME"`,
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const quickCommands = [
    { label: "Buy $MOULI", command: "buy $MOULI for 10 APT", icon: TrendingUp },
    { label: "Portfolio", command: "show my portfolio", icon: Coins },
    { label: "Trending", command: "show trending tokens", icon: Flame },
    { label: "Launch Token", command: "launch $MYMEME", icon: Rocket },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="subtle-glow w-96 h-96 top-20 -right-48" />
      <div className="subtle-glow w-64 h-64 bottom-20 -left-32" />

      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(100,116,139,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(100,116,139,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      </div>

      <div className="flex h-screen">
        {/* Main Terminal Area */}
        <div className="flex-1 flex flex-col">
          {/* Enhanced Header with Stats */}
          <div className="border-b border-white/10 p-6">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-4">
                <motion.div
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-slate-600 to-slate-500 flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(100, 116, 139, 0.5)",
                      "0 0 40px rgba(100, 116, 139, 0.8)",
                      "0 0 20px rgba(100, 116, 139, 0.5)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Brain className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-xl font-bold text-white">Web3 Trading Copilot</h1>
                  <p className="text-sm text-slate-400">AI-Powered DeFi Terminal</p>
                </div>
              </div>

              {/* User Stats Bar */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-700">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="text-slate-300">Level {userStats.level}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-700">
                  <Star className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-300">{userStats.xp.toLocaleString()} XP</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-700">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-slate-300">{userStats.streak} streak</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-700">
                  <Coins className="w-4 h-4 text-green-400" />
                  <span className="text-slate-300">${userStats.portfolio.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-8">
            <div className="max-w-6xl mx-auto space-y-8">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={`${index > 0 ? "border-t border-white/5 pt-8" : ""}`}
                  >
                    <div className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-4xl ${message.type === "user" ? "ml-auto" : ""}`}>
                        {message.type === "copilot" && (
                          <div className="flex items-center gap-3 mb-4">
                            <motion.div
                              className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-600 to-slate-500 flex items-center justify-center"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                            >
                              <Brain className="w-4 h-4 text-white" />
                            </motion.div>
                            <span className="text-sm text-slate-400 font-medium">AI Copilot</span>
                            <div className="flex items-center gap-1">
                              <Activity className="w-3 h-3 text-green-400" />
                              <span className="text-xs text-green-400">ONLINE</span>
                            </div>
                          </div>
                        )}

                        {message.type === "user" && (
                          <div className="flex items-center gap-3 mb-4 justify-end">
                            <span className="text-sm text-slate-400 font-medium">You</span>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                              <Gamepad2 className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}

                        {message.type === "achievement" && (
                          <div className="flex items-center gap-3 mb-4">
                            <motion.div
                              className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.5 }}
                            >
                              <Trophy className="w-4 h-4 text-white" />
                            </motion.div>
                            <span className="text-sm text-yellow-400 font-medium">Achievement</span>
                          </div>
                        )}

                        {message.type === "trade" && (
                          <div className="flex items-center gap-3 mb-4">
                            <motion.div
                              className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            >
                              <Zap className="w-4 h-4 text-white" />
                            </motion.div>
                            <span className="text-sm text-green-400 font-medium">Trade Engine</span>
                          </div>
                        )}

                        <div className={`${message.type === "user" ? "text-right" : "text-left"}`}>
                          <div
                            className={`inline-block p-4 rounded-2xl ${
                              message.type === "user"
                                ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30"
                                : message.type === "achievement"
                                  ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
                                  : message.type === "trade"
                                    ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30"
                                    : "bg-slate-900/50 border border-slate-700"
                            }`}
                          >
                            <p className="text-white/90 font-medium leading-relaxed whitespace-pre-line">
                              {message.content}
                              {message.isTyping && (
                                <motion.span
                                  className="inline-block w-2 h-5 bg-slate-400 ml-1"
                                  animate={{ opacity: [1, 0, 1] }}
                                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                                />
                              )}
                            </p>
                          </div>
                          <p className="text-xs text-white/30 mt-2 font-light">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-white/5 pt-8">
                  <div className="flex justify-start">
                    <div className="max-w-4xl">
                      <div className="flex items-center gap-3 mb-4">
                        <motion.div
                          className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-600 to-slate-500 flex items-center justify-center"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                        >
                          <Brain className="w-4 h-4 text-white" />
                        </motion.div>
                        <span className="text-sm text-slate-400 font-medium">AI Copilot</span>
                        <span className="text-xs text-slate-500">thinking...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.div
                          className="w-2 h-2 bg-slate-400 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-slate-400 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-slate-400 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Enhanced Input Area with Quick Commands */}
          <div className="px-4 lg:px-8 py-6 border-t border-white/10">
            <div className="max-w-6xl mx-auto space-y-4">
              {/* Quick Commands */}
              <div className="flex flex-wrap gap-2">
                {quickCommands.map((cmd, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setInput(cmd.command)}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-900/50 hover:bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <cmd.icon className="w-4 h-4" />
                    {cmd.label}
                  </motion.button>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-4">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your command... (e.g., 'buy $MOULI for 10 APT')"
                  className="elegant-input flex-1 text-lg py-6 bg-slate-900/30 border-slate-700"
                />
                <BorderMagicButton
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isTyping}
                  size="lg"
                  variant="primary"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Execute
                </BorderMagicButton>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Sidebar with Trending Tokens */}
        <div className="w-80 border-l border-white/10 bg-slate-950/50 backdrop-blur-xl p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* XP Progress */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">Level Progress</h3>
                <span className="text-xs text-slate-400">Level {userStats.level}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(userStats.xp / (userStats.xp + userStats.xpToNext)) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-slate-400">
                {userStats.xp} / {userStats.xp + userStats.xpToNext} XP
              </p>
            </div>

            {/* Trending Tokens */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-semibold text-white">Trending Now</h3>
              </div>
              <div className="space-y-3">
                {trendingTokens.map((token, index) => (
                  <motion.div
                    key={token.symbol}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setInput(`buy $${token.symbol} for 10 APT`)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">${token.symbol}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            token.change24h > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {token.change24h > 0 ? "+" : ""}
                          {token.change24h}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">${token.price}</p>
                    </div>
                    {token.change24h > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <h3 className="text-sm font-semibold text-white">Achievements</h3>
              </div>
              <div className="space-y-2">
                {userStats.achievements.slice(-3).map((achievement, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-slate-300">
                    <Star className="w-3 h-3 text-yellow-400" />
                    {achievement}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <BorderMagicButton onClick={() => setInput("show my portfolio")} className="w-full" size="sm">
                <Coins className="w-4 h-4 mr-2" />
                View Portfolio
              </BorderMagicButton>
              <BorderMagicButton
                onClick={() => setInput("show leaderboard")}
                className="w-full"
                size="sm"
                variant="secondary"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Leaderboard
              </BorderMagicButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
