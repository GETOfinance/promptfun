"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BorderMagicButton } from "@/components/ui/border-magic-button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Rocket,
  TrendingUp,
  Bot,
  ChevronDown,
  Github,
  Twitter,
  MessageCircle,
  Sparkles,
  Target,
  Crown,
  Medal,
  Cpu,
  Shield,
  Globe,
  Users,
} from "lucide-react"
import Link from "next/link"
import { HoverEffect } from "@/components/ui/card-hover-effect"
import BentoGridDemo from "@/components/bento-grid-demo"
import { TextHoverEffect } from "@/components/ui/text-hover-effect"
import { WalletButton } from "@/components/WalletButton"

export default function ElegantLandingPage() {
  const [typedText, setTypedText] = useState("")
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const prompts = ["Launch $MOULI", "Buy $DOGE for 10 APT", "Create $ROCKET token", "Trade $CYBER"]

  useEffect(() => {
    const prompt = prompts[currentPrompt]
    let i = 0
    const timer = setInterval(() => {
      if (i <= prompt.length) {
        setTypedText(prompt.slice(0, i))
        i++
      } else {
        setTimeout(() => {
          setCurrentPrompt((prev) => (prev + 1) % prompts.length)
          setTypedText("")
        }, 2000)
        clearInterval(timer)
      }
    }, 100)
    return () => clearInterval(timer)
  }, [currentPrompt])

  const xpLevels = [
    {
      title: "Beginner Trader",
      subtitle: "Launch your first token",
      icon: <Target className="w-5 h-5" />,
      xp: "0 - 100 XP",
      features: ["Basic AI guidance", "Standard fees", "Community access"],
    },
    {
      title: "Meme Lord",
      subtitle: "Reach 1,000 XP",
      icon: <Medal className="w-5 h-5" />,
      xp: "100 - 1,000 XP",
      features: ["Advanced strategies", "Reduced fees", "Priority support", "Alpha calls"],
      popular: true,
    },
    {
      title: "Curve Master",
      subtitle: "Top 10 trader globally",
      icon: <Crown className="w-5 h-5" />,
      xp: "1,000+ XP",
      features: ["Full AI suite", "Lowest fees", "VIP access", "Revenue sharing", "Beta features"],
    },
  ]

  const faqs = [
    {
      question: "What is bonding curve trading?",
      answer:
        "Bonding curves are smart contracts that automatically set token prices based on supply and demand. As more people buy, the price increases algorithmically, ensuring fair and transparent pricing without traditional order books.",
    },
    {
      question: "How does the AI Copilot assist me?",
      answer:
        "Our AI Copilot analyzes market trends, suggests optimal trading strategies, helps you craft effective token launches, and provides real-time insights to maximize your trading success on the Aptos blockchain.",
    },
    {
      question: "Can I use this without a wallet?",
      answer:
        "Yes! You can explore the platform, view trending tokens, and simulate trades without connecting a wallet. However, to actually launch or trade tokens, you'll need an Aptos-compatible wallet like Petra or Martian.",
    },
    {
      question: "What makes prompt.fun different?",
      answer:
        "We're the first platform to combine natural language processing with DeFi trading. Simply type what you want to do, and our AI translates it into blockchain transactions - no technical knowledge required!",
    },
  ]

  const projects = [
    {
      title: "AI-Powered Token Launch",
      description:
        "Deploy meme tokens instantly using natural language commands. Our AI understands your intent and creates smart contracts automatically.",
      link: "/terminal",
    },
    {
      title: "Bonding Curve Trading",
      description:
        "Trade with transparent, algorithmic pricing. No order books, no manipulation - just pure mathematical curves determining fair value.",
      link: "/terminal",
    },
    {
      title: "Real-time Market Intelligence",
      description:
        "Get instant insights from our AI Copilot. Market trends, trading signals, and personalized recommendations at your fingertips.",
      link: "/terminal",
    },
    {
      title: "Aptos Blockchain Integration",
      description:
        "Built on the fastest, most secure blockchain. Lightning-fast transactions with minimal fees for optimal trading experience.",
      link: "/terminal",
    },
    {
      title: "XP & Gamification System",
      description:
        "Level up as you trade. Earn XP, unlock achievements, and climb the global leaderboard while building your DeFi portfolio.",
      link: "/leaderboard",
    },
    {
      title: "Community-Driven Ecosystem",
      description:
        "Join thousands of traders, creators, and DeFi enthusiasts. Share strategies, discover new tokens, and shape the future together.",
      link: "/profile",
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-white/5">
        <div className="container mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-500 rounded-lg flex items-center justify-center">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-medium text-white">prompt.fun</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="nav-link-elegant">
                Features
              </a>
              <a href="#tokens" className="nav-link-elegant">
                Tokens
              </a>
              <a href="#pricing" className="nav-link-elegant">
                XP System
              </a>
              <a href="#faq" className="nav-link-elegant">
                FAQ
              </a>
            </div>

            {/* Wallet Button (replaces CTA) */}
            <WalletButton />
          </div>
        </div>
      </nav>

      {/* Subtle Background Elements */}
      <div className="subtle-glow w-96 h-96 top-32 -right-48" />
      <div className="subtle-glow w-64 h-64 bottom-32 -left-32" />
      <div className="subtle-glow w-48 h-48 top-1/2 left-1/4" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32">
        <div className="container mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {/* Interactive Text Effect */}
            <div className="mb-12">
              <TextHoverEffect text="PROMPT.FUN" />
            </div>

            {/* Hero Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium mb-12 leading-tight">
              <span className="gradient-text-subtle">Launch & Trade</span>
              <br />
              <span className="text-white/90">Meme Tokens</span>
              <br />
              <span className="accent-text">with Just a Prompt</span>
            </h1>

            {/* Subtext */}
            <p className="text-xl md:text-2xl lg:text-3xl text-white/60 mb-20 max-w-3xl mx-auto leading-relaxed font-normal">
              Experience DeFi like never before — with <span className="text-slate-400 font-normal">AI Copilot</span>{" "}
              and <span className="text-slate-400 font-normal">Aptos</span> at your command.
            </p>

            {/* Terminal Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex justify-center mb-20"
            >
              <div className="elegant-card p-8 max-w-md">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-600 to-slate-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-slate-400 font-normal text-sm">AI Copilot Active</p>
                    <p className="text-white/50 text-xs font-medium">Ready to assist your trading</p>
                  </div>
                </div>

                {/* Terminal Preview */}
                <div className="bg-black/40 rounded-lg p-4 border border-white/5 font-mono">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-red-400/60 rounded-full" />
                    <div className="w-2 h-2 bg-yellow-400/60 rounded-full" />
                    <div className="w-2 h-2 bg-green-400/60 rounded-full" />
                    <span className="text-white/40 text-xs ml-2 font-medium">prompt.fun terminal</span>
                  </div>
                  <div className="text-slate-400 text-sm">
                    <span className="text-slate-500">$</span> {typedText}
                    <span className="animate-pulse text-slate-400">|</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-24"
            >
              <Link href="/terminal">
                <BorderMagicButton variant="primary" className="group">
                  <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Try the Terminal
                </BorderMagicButton>
              </Link>
              <Link href="/terminal">
                <BorderMagicButton variant="secondary" className="group">
                  <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                  Explore Trending Tokens
                </BorderMagicButton>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {[
                { label: "Total Volume", value: "$2.5B", icon: <TrendingUp className="w-4 h-4" /> },
                { label: "Active Traders", value: "50K+", icon: <Users className="w-4 h-4" /> },
                { label: "Tokens Launched", value: "12K+", icon: <Rocket className="w-4 h-4" /> },
                { label: "AI Interactions", value: "1M+", icon: <Bot className="w-4 h-4" /> },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.8 }}
                  className="stat-card-elegant group"
                >
                  <div className="text-slate-400 flex justify-center mb-4 group-hover:scale-105 transition-transform">
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-medium text-white/90 mb-2">{stat.value}</div>
                  <div className="text-white/50 text-base font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-8">
              <span className="gradient-text-subtle">What Can You Do</span>
              <br />
              <span className="text-white/90">With prompt.fun?</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto font-normal">
              Unleash the power of AI-driven DeFi trading on the Aptos blockchain
            </p>
          </motion.div>

          <HoverEffect items={projects} />
        </div>
      </section>

      {/* Trending Tokens Section */}
      <section id="tokens" className="py-32 relative">
        <div className="container mx-auto px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-24">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-8">
              <span className="accent-text">Trending Tokens</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/60 font-normal">Live from the Aptos blockchain</p>
          </motion.div>

          <BentoGridDemo />
        </div>
      </section>

      {/* XP System Section */}
      <section id="pricing" className="py-32 relative">
        <div className="container mx-auto px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-24">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-8">
              <span className="gradient-text-subtle">Level Up</span> <span className="text-white/90">With XP</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/60 font-normal">
              Earn rewards as you trade and climb the ranks
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {xpLevels.map((level, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className={`pricing-card-elegant ${level.popular ? "popular" : ""}`}
              >
                {level.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-slate-600/20 text-slate-300 px-3 py-1 font-medium text-xs border border-slate-500/20">
                      MOST POPULAR
                    </Badge>
                  </div>
                )}

                <div className="text-slate-400 flex justify-center mb-6">{level.icon}</div>

                <h3 className="text-xl md:text-2xl font-normal text-white/90 text-center mb-3">{level.title}</h3>
                <p className="text-slate-400 text-center mb-3 text-base font-normal">{level.subtitle}</p>
                <p className="text-white/50 text-center mb-10 text-sm font-normal">{level.xp}</p>

                <ul className="space-y-4 mb-10">
                  {level.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-white/70 text-sm font-normal">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/terminal">
                  <BorderMagicButton variant={level.popular ? "primary" : "secondary"} className="w-full">
                    {level.popular ? "Start Trading" : "Learn More"}
                  </BorderMagicButton>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 relative">
        <div className="container mx-auto px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-24">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-8">
              <span className="gradient-text-subtle">Frequently Asked</span>
              <br />
              <span className="text-white/90">Questions</span>
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="elegant-card"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-white/2 transition-colors rounded-lg"
                >
                  <h3 className="text-lg md:text-xl font-normal text-white/90">{faq.question}</h3>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-6"
                  >
                    <p className="text-white/60 leading-relaxed text-base font-normal">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-20 relative">
        <div className="container mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-500 rounded-lg flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-medium text-white">prompt.fun</span>
              </div>
              <p className="text-white/50 mb-8 font-normal text-sm leading-relaxed">
                The future of DeFi trading powered by AI and built on Aptos blockchain.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="text-white/40 hover:text-slate-400 transition-colors p-2 rounded-lg hover:bg-white/5"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="text-white/40 hover:text-slate-400 transition-colors p-2 rounded-lg hover:bg-white/5"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="text-white/40 hover:text-slate-400 transition-colors p-2 rounded-lg hover:bg-white/5"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Project */}
            <div>
              <h4 className="text-white/90 font-normal mb-8 text-sm">Project</h4>
              <ul className="space-y-4 text-white/50 text-sm font-normal">
                <li>
                  <a href="#" className="hover:text-slate-400 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <Link href="/terminal" className="hover:text-slate-400 transition-colors">
                    Terminal
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="hover:text-slate-400 transition-colors">
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-400 transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="text-white/90 font-normal mb-8 text-sm">Community</h4>
              <ul className="space-y-4 text-white/50 text-sm font-normal">
                <li>
                  <a href="#" className="hover:text-slate-400 transition-colors">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-400 transition-colors">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-400 transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-400 transition-colors">
                    Telegram
                  </a>
                </li>
              </ul>
            </div>

            {/* Built On */}
            <div>
              <h4 className="text-white/90 font-normal mb-8 text-sm">Built On</h4>
              <ul className="space-y-4 text-white/50 text-sm font-normal">
                <li className="flex items-center gap-2">
                  <Globe className="w-3 h-3" />
                  <span className="hover:text-slate-400 transition-colors">Aptos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Bot className="w-3 h-3" />
                  <span className="hover:text-slate-400 transition-colors">OpenAI</span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  <span className="hover:text-slate-400 transition-colors">WalletConnect</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 mt-16 pt-8 text-center">
            <p className="text-white/40 text-sm font-normal">
              &copy; 2024 prompt.fun. Built with care for the future of DeFi
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
