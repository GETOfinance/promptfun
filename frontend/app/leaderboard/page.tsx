"use client"

import { motion } from "framer-motion"
import { AICopilot } from "@/components/ai-copilot"
import { Trophy, Medal, Award, TrendingUp, Sparkles, Rocket } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const topTraders = [
  {
    rank: 1,
    address: "0x1234...abcd",
    xp: 15680,
    volume: "125M APT",
    badge: "Diamond Trader",
    avatar: "👑",
    level: 45,
    streak: 12,
    winRate: 94.2,
    specialty: "Meme Master",
  },
  {
    rank: 2,
    address: "0x5678...efgh",
    xp: 12450,
    volume: "98M APT",
    badge: "Gold Trader",
    avatar: "🥇",
    level: 38,
    streak: 8,
    winRate: 89.7,
    specialty: "Volume King",
  },
  {
    rank: 3,
    address: "0x9abc...ijkl",
    xp: 10230,
    volume: "87M APT",
    badge: "Silver Trader",
    avatar: "🥈",
    level: 34,
    streak: 6,
    winRate: 87.3,
    specialty: "Quick Draw",
  },
  {
    rank: 4,
    address: "0xdef0...mnop",
    xp: 8900,
    volume: "76M APT",
    badge: "Bronze Trader",
    avatar: "🥉",
    level: 29,
    streak: 4,
    winRate: 82.1,
    specialty: "Trend Rider",
  },
  {
    rank: 5,
    address: "0x1111...qrst",
    xp: 7650,
    volume: "65M APT",
    badge: "Elite Trader",
    avatar: "⭐",
    level: 26,
    streak: 3,
    winRate: 79.8,
    specialty: "Risk Taker",
  },
]

const topCreators = [
  {
    rank: 1,
    address: "0xaaaa...bbbb",
    tokens: 45,
    volume: "89M APT",
    badge: "Token Master",
    avatar: "🚀",
    level: 42,
    successRate: 78.2,
    totalLaunches: 58,
  },
  {
    rank: 2,
    address: "0xcccc...dddd",
    tokens: 38,
    volume: "72M APT",
    badge: "Meme Lord",
    avatar: "🎭",
    level: 35,
    successRate: 71.4,
    totalLaunches: 53,
  },
  {
    rank: 3,
    address: "0xeeee...ffff",
    tokens: 32,
    volume: "58M APT",
    badge: "Creator Pro",
    avatar: "🎨",
    level: 31,
    successRate: 68.9,
    totalLaunches: 46,
  },
  {
    rank: 4,
    address: "0x2222...gggg",
    tokens: 28,
    volume: "45M APT",
    badge: "Token Wizard",
    avatar: "🧙",
    level: 27,
    successRate: 65.2,
    totalLaunches: 43,
  },
  {
    rank: 5,
    address: "0x3333...hhhh",
    tokens: 24,
    volume: "38M APT",
    badge: "Launch Expert",
    avatar: "🔥",
    level: 24,
    successRate: 62.5,
    totalLaunches: 38,
  },
]

const achievements = [
  { title: "First Blood", description: "First successful trade", icon: "🎯", rarity: "Common" },
  { title: "Meme Slayer", description: "Launched 10 meme tokens", icon: "🗡️", rarity: "Rare" },
  { title: "Diamond Hands", description: "Held position for 30 days", icon: "💎", rarity: "Epic" },
  { title: "Whale Hunter", description: "Single trade over 1M APT", icon: "🐋", rarity: "Legendary" },
  { title: "Speed Demon", description: "100 trades in 24h", icon: "⚡", rarity: "Mythic" },
  { title: "Oracle", description: "90%+ win rate over 100 trades", icon: "🔮", rarity: "Legendary" },
]

export default function LeaderboardPage() {
  const userRank = 17
  const userXP = 2450
  const userLevel = 12
  const nextLevelXP = 3000

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="subtle-glow w-96 h-96 top-20 -right-48" />
      <div className="subtle-glow w-64 h-64 bottom-20 -left-32" />
      <div className="subtle-glow w-48 h-48 top-1/2 left-1/4" />

      <div className="container mx-auto p-4 md:p-6 lg:p-8 pt-8 md:pt-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium mb-4 md:mb-6">
            <span className="gradient-text-subtle">Global</span> <span className="text-white/90">Leaderboard</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white/60 font-medium max-w-2xl mx-auto">
            Compete with the best traders and climb the ranks
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {/* Main Leaderboards */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Top Traders */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <div className="elegant-card p-4 md:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-slate-600 to-slate-500 rounded-xl flex items-center justify-center">
                    <Trophy className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-medium text-white/95">Elite Traders</h2>
                </div>
                <div className="space-y-3 md:space-y-4">
                  {topTraders.map((trader, index) => (
                    <motion.div
                      key={trader.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative overflow-hidden rounded-xl border transition-all hover:bg-white/5 group ${
                        trader.rank === 1
                          ? "bg-gradient-to-r from-yellow-500/5 to-orange-500/5 border-yellow-500/20"
                          : trader.rank === 2
                            ? "bg-gradient-to-r from-gray-400/5 to-gray-600/5 border-gray-400/20"
                            : trader.rank === 3
                              ? "bg-gradient-to-r from-orange-600/5 to-orange-800/5 border-orange-600/20"
                              : "bg-white/5 border-white/10"
                      }`}
                    >
                      {/* Rank Badge */}
                      <div className="absolute top-2 left-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            trader.rank === 1
                              ? "bg-yellow-500/20 text-yellow-400"
                              : trader.rank === 2
                                ? "bg-gray-400/20 text-gray-300"
                                : trader.rank === 3
                                  ? "bg-orange-600/20 text-orange-400"
                                  : "bg-white/10 text-white/70"
                          }`}
                        >
                          #{trader.rank}
                        </div>
                      </div>

                      <div className="p-4 md:p-6 pt-12">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="text-2xl md:text-3xl">{trader.avatar}</div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                                <span className="font-mono text-white/95 font-medium text-sm md:text-base">
                                  {trader.address}
                                </span>
                                <Badge className="bg-white/10 text-white/80 text-xs font-medium border-white/20">
                                  {trader.badge}
                                </Badge>
                                <Badge className="bg-slate-600/20 text-slate-300 text-xs font-medium border-slate-500/20">
                                  {trader.specialty}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-white/60 font-medium">
                                <div>Level {trader.level}</div>
                                <div>🔥 {trader.streak} streak</div>
                                <div>📊 {trader.winRate}% win</div>
                                <div>💰 {trader.volume}</div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl md:text-2xl font-medium accent-text mb-1">
                              {trader.xp.toLocaleString()} XP
                            </div>
                            {/* XP Progress Bar */}
                            <div className="w-24 md:w-32 bg-white/10 rounded-full h-1.5 mb-2">
                              <div
                                className="bg-gradient-to-r from-slate-600 to-slate-500 h-1.5 rounded-full transition-all"
                                style={{ width: `${(trader.xp % 1000) / 10}%` }}
                              />
                            </div>
                            <div className="text-xs text-white/50 font-medium">Rank #{trader.rank}</div>
                          </div>
                        </div>
                      </div>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Top Creators */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="elegant-card p-4 md:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-slate-600 to-slate-500 rounded-xl flex items-center justify-center">
                    <Rocket className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-medium text-white/95">Token Creators</h2>
                </div>
                <div className="space-y-3 md:space-y-4">
                  {topCreators.map((creator, index) => (
                    <motion.div
                      key={creator.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className={`relative overflow-hidden rounded-xl border transition-all hover:bg-white/5 group ${
                        creator.rank === 1
                          ? "bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-blue-500/20"
                          : "bg-white/5 border-white/10"
                      }`}
                    >
                      <div className="absolute top-2 left-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            creator.rank === 1 ? "bg-blue-500/20 text-blue-400" : "bg-white/10 text-white/70"
                          }`}
                        >
                          #{creator.rank}
                        </div>
                      </div>

                      <div className="p-4 md:p-6 pt-12">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="text-2xl md:text-3xl">{creator.avatar}</div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                                <span className="font-mono text-white/95 font-medium text-sm md:text-base">
                                  {creator.address}
                                </span>
                                <Badge className="bg-white/10 text-white/80 text-xs font-medium border-white/20">
                                  {creator.badge}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-white/60 font-medium">
                                <div>Level {creator.level}</div>
                                <div>✅ {creator.successRate}% success</div>
                                <div>🚀 {creator.totalLaunches} launches</div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl md:text-2xl font-medium accent-text mb-1">
                              {creator.tokens} Tokens
                            </div>
                            <div className="text-sm text-white/60 font-medium">{creator.volume} volume</div>
                          </div>
                        </div>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6 lg:space-y-8">
            {/* User Stats */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <div className="elegant-card p-4 md:p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-500 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-white/95">Your Progress</h3>
                </div>

                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">🎯</div>
                  <div className="text-3xl font-medium accent-text">#{userRank}</div>
                  <div className="text-sm text-white/60 font-medium mb-4">Current Rank</div>

                  {/* Level Progress */}
                  <div className="bg-white/10 rounded-full h-3 mb-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-slate-600 to-slate-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${(userXP / nextLevelXP) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-white/60 font-medium">
                    Level {userLevel} • {userXP}/{nextLevelXP} XP
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 font-medium">XP</span>
                    <span className="font-mono accent-text font-medium">{userXP.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 font-medium">Tokens Created</span>
                    <span className="font-mono text-white/90 font-medium">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 font-medium">Total Volume</span>
                    <span className="font-mono text-white/90 font-medium">15.2M APT</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 font-medium">Win Streak</span>
                    <span className="font-mono text-green-400 font-medium">🔥 5</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-center">
                    <Badge className="bg-slate-600/20 text-slate-300 text-xs font-medium border-slate-500/20 mb-2">
                      Rising Star
                    </Badge>
                    <p className="text-xs text-white/60 font-medium">850 XP to reach Top 10</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AI Copilot Commentary */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
              <div className="elegant-card p-4 md:p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-white/95">AI Copilot</h3>
                </div>
                <AICopilot
                  message={`Your current rank is #${userRank} — reach Top 10 to earn a golden badge! 🏆`}
                  size="sm"
                />
                <div className="mt-6 space-y-3 text-sm text-white/70 font-medium">
                  <p>
                    💡 <strong className="text-white/90">Tip:</strong> Launch more tokens to climb faster
                  </p>
                  <p>
                    🔥 <strong className="text-white/90">Hot:</strong> Meme tokens are trending today
                  </p>
                  <p>
                    ⚡ <strong className="text-white/90">Quest:</strong> Trade 5 different tokens for bonus XP
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Achievements Gallery */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }}>
              <div className="elegant-card p-4 md:p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-500 rounded-lg flex items-center justify-center">
                    <Medal className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-white/95">Achievement Gallery</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.slice(0, 4).map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      className={`p-3 rounded-xl border text-center transition-all hover:scale-105 ${
                        index < 2 ? "bg-green-500/5 border-green-500/20" : "bg-white/5 border-white/10 opacity-50"
                      }`}
                    >
                      <div className="text-2xl mb-2">{achievement.icon}</div>
                      <div className="text-xs font-medium text-white/90 mb-1">{achievement.title}</div>
                      <Badge
                        className={`text-xs ${
                          achievement.rarity === "Legendary"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : achievement.rarity === "Epic"
                              ? "bg-purple-500/20 text-purple-400"
                              : achievement.rarity === "Rare"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {achievement.rarity}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Platform Stats */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }}>
              <div className="elegant-card p-4 md:p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-white/95">Platform Stats</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 font-medium">Total Users</span>
                    <span className="font-mono text-white/95 font-medium">12,847</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 font-medium">Tokens Launched</span>
                    <span className="font-mono text-white/95 font-medium">3,456</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 font-medium">Total Volume</span>
                    <span className="font-mono text-green-400 font-medium">892M APT</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 font-medium">Active Today</span>
                    <span className="font-mono accent-text font-medium">2,341</span>
                  </div>
                </div>

                {/* Live Activity Indicator */}
                <div className="mt-6 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-green-400">Live Activity</span>
                  </div>
                  <div className="text-xs text-white/60 font-medium">
                    🚀 New token launched • 🔥 Volume spike detected
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
