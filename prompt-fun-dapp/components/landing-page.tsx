"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AnimatedSection } from "@/components/animated-section"
import { ParallaxElement } from "@/components/parallax-element"
import { ScrollParticles } from "@/components/scroll-particles"
import { SectionParticles } from "@/components/section-particles"
import { ParticleBurst } from "@/components/particle-burst"
import { FuturisticBackground } from "@/components/futuristic-background"
import { TailwindConnectButton } from "@/components/ui/tailwind-connect-button"
import { Menu, X, Brain, Rocket, TrendingUp, Zap, Check, Code, Globe } from "lucide-react"
import { TextRevealCard, TextRevealCardDescription, TextRevealCardTitle } from "@/components/ui/text-reveal-card"
import { useWallet } from "../contexts/WalletContext";
import { useRouter } from "next/navigation";

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [burstTrigger, setBurstTrigger] = useState(false)
  const [burstPosition, setBurstPosition] = useState({ x: 0, y: 0 })
  const { account, connect, wallets = [] } = useWallet();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  const handleButtonClick = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setBurstPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    })
    setBurstTrigger(true)
    setTimeout(() => setBurstTrigger(false), 100)
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Futuristic Background */}
      <FuturisticBackground />

      {/* Scroll-based Particles */}
      <ScrollParticles maxParticles={60} spawnRate={0.4} colors={["#00D4FF", "#7C3AED", "#06FFA5"]} />

      {/* Particle Burst Effect */}
      <ParticleBurst
        trigger={burstTrigger}
        x={burstPosition.x}
        y={burstPosition.y}
        particleCount={25}
        colors={["#00D4FF", "#7C3AED", "#06FFA5"]}
        onComplete={() => setBurstTrigger(false)}
      />

      {/* Header Navigation */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-black/80 backdrop-blur-md border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center animate-pulse-glow">
                <Code className="w-6 h-6 text-black font-light" />
              </div>
              <span className="text-2xl font-light neon-text tracking-wide">Prompt.fun</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-gray-300 hover:text-primary transition-colors font-light tracking-wide"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("benefits")}
                className="text-gray-300 hover:text-primary transition-colors font-light tracking-wide"
              >
                Why Aptos
              </button>
              <Link
                href="/chat"
                className="text-gray-300 hover:text-primary transition-colors font-light tracking-wide"
              >
                Copilot
              </Link>
            </nav>

            {/* Wallet Connect */}
            <div className="hidden md:block">
              <TailwindConnectButton
                onClick={async () => {
                  if (!account) {
                    // Connect to Petra
                    const petra = wallets.find((w) => w.name.toLowerCase().includes("petra"));
                    if (petra) await connect(petra.name);
                  }
                  if (account) router.push("/chat");
                }}
                variant="navbar"
              >
                Connect Wallet
              </TailwindConnectButton>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border">
              <nav className="flex flex-col gap-4 mt-4">
                <button
                  onClick={() => {
                    scrollToSection("how-it-works")
                    setIsMenuOpen(false)
                  }}
                  className="text-left text-gray-300 hover:text-primary transition-colors font-light"
                >
                  How It Works
                </button>
                <button
                  onClick={() => {
                    scrollToSection("benefits")
                    setIsMenuOpen(false)
                  }}
                  className="text-left text-gray-300 hover:text-primary transition-colors font-light"
                >
                  Why Aptos
                </button>
                <Link href="/chat" className="text-gray-300 hover:text-primary transition-colors font-light">
                  Copilot
                </Link>
                <TailwindConnectButton onClick={handleButtonClick} className="w-full justify-center mt-2">
                  Connect Wallet
                </TailwindConnectButton>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <SectionParticles
        particleCount={20}
        colors={["#00D4FF", "#7C3AED"]}
        className="min-h-screen flex items-center justify-center relative pt-20 circuit-bg"
      >
        <div className="max-w-3xl mx-auto px-4 flex flex-col items-center justify-center text-center space-y-8 relative z-10">
          {/* Centered Text and Button */}
          <AnimatedSection animation="fade-down" duration={800}>
            <h1 className="text-6xl lg:text-8xl font-light leading-tight tracking-tight">
              Launch, Trade, and Explore <span className="text-primary neon-text">Meme Tokens</span> Just Prompt It<span className="text-primary">.</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed font-light tracking-wide mt-6">
              Built on Aptos. Driven by AI. Accessible to everyone.
            </p>
            <div className="flex justify-center">
              <button
                onClick={(e) => {
                  handleButtonClick(e);
                  scrollToSection("copilot-preview");
                }}
                className="relative rounded-full bg-zinc-950 px-8 py-4 text-white font-light text-lg flex items-center justify-center shadow-[0_0_10px_0_rgba(0,212,255,0.25)] border border-cyan-500/10 transition-all duration-150 hover:shadow-[0_0_16px_2px_rgba(0,212,255,0.3)] focus:outline-none text-lg animate-pulse-glow px-8 py-4 rounded-xl shadow-lg mt-6"
              >
                Try Copilot Now
              </button>
            </div>
          </AnimatedSection>
        </div>
      </SectionParticles>

      {/* Copilot Chat Preview */}
      <SectionParticles
        particleCount={12}
        colors={["#00D4FF", "#7C3AED"]}
        className="py-20 bg-card/20 relative circuit-bg"
      >
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <AnimatedSection animation="fade-up" duration={600}>
            <h2 className="text-4xl font-light mb-4 neon-text tracking-wide">Talk to Copilot — Your Web3 Guide</h2>
            <p className="text-gray-400 text-lg mb-12 font-light tracking-wide">
              Ask it anything. Like "What is Aptos?" or "Launch $MOON token"
            </p>
          </AnimatedSection>

          {/* Chat Preview */}
          <AnimatedSection animation="scale-up" duration={700} delay={200}>
            <ParallaxElement speed={0.05}>
              <TextRevealCard
                text="How do I launch a meme token?"
                revealText="Launch $MOON token now!"
                className="holo-card max-w-2xl mx-auto mb-8"
              >
                <TextRevealCardTitle>Talk to Copilot — Your Web3 Guide</TextRevealCardTitle>
                <TextRevealCardDescription>
                  Hover to reveal what Copilot can help you with. Ask anything about Aptos, tokens, or DeFi.
                </TextRevealCardDescription>
              </TextRevealCard>
            </ParallaxElement>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" duration={600} delay={400}>
            <div className="flex justify-center mt-12">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="relative rounded-full bg-zinc-950 px-8 py-4 text-white font-light text-lg flex items-center justify-center shadow-[0_0_10px_0_rgba(0,212,255,0.25)] border border-cyan-500/10 transition-all duration-150 hover:shadow-[0_0_16px_2px_rgba(0,212,255,0.3)] focus:outline-none text-lg"
              >
                Start Chat
              </button>
            </div>
          </AnimatedSection>
        </div>
      </SectionParticles>

      {/* How It Works */}
      <SectionParticles particleCount={15} colors={["#06FFA5", "#00D4FF"]} className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <AnimatedSection animation="fade-up" duration={600}>
            <h2 className="text-4xl font-light text-center mb-16 neon-text tracking-wide">How Prompt.fun Works</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-16 lg:gap-20">
            {/* Step 1 */}
            <AnimatedSection animation="fade-up" duration={600} delay={100}>
              <div className="text-center group">
                <div className="w-20 h-20 holo-card rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-glow transition-all duration-300">
                  <Brain className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-light mb-4 tracking-wide">Chat with Copilot</h3>
                <p className="text-gray-400 leading-relaxed font-light">
                  Ask anything about tokens, DeFi, Aptos, or trading. Our AI understands natural language.
                </p>
              </div>
            </AnimatedSection>

            {/* Step 2 */}
            <AnimatedSection animation="fade-up" duration={600} delay={200}>
              <div className="text-center group">
                <div className="w-20 h-20 holo-card rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-glow transition-all duration-300">
                  <Rocket className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-light mb-4 tracking-wide">Launch or Trade Tokens</h3>
                <p className="text-gray-400 leading-relaxed font-light">
                  Create your own token or buy from the marketplace. Everything happens on Aptos blockchain.
                </p>
              </div>
            </AnimatedSection>

            {/* Step 3 */}
            <AnimatedSection animation="fade-up" duration={600} delay={300}>
              <div className="text-center group">
                <div className="w-20 h-20 holo-card rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-glow transition-all duration-300">
                  <TrendingUp className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-light mb-4 tracking-wide">Earn XP, Discover Trends</h3>
                <p className="text-gray-400 leading-relaxed font-light">
                  Get rewarded for every action. Track your growth and discover trending tokens.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </SectionParticles>

      {/* Benefits Section */}
      <SectionParticles
        particleCount={10}
        colors={["#7C3AED", "#00D4FF"]}
        className="py-20 bg-card/20 relative circuit-bg"
      >
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <AnimatedSection animation="fade-up" duration={600}>
            <h2 className="text-4xl font-light mb-4 neon-text tracking-wide">
              Why Meme Tokens Matter — and Why Aptos Is Perfect
            </h2>
            <p className="text-gray-400 text-lg mb-12 font-light tracking-wide">
              The perfect combination of fun, finance, and cutting-edge technology
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-16 lg:gap-20 text-left">
            <AnimatedSection animation="fade-right" duration={600} delay={100}>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-light mb-2 tracking-wide">Fast & Cheap Transactions</h3>
                    <p className="text-gray-400 leading-relaxed font-light">
                      Aptos processes thousands of transactions per second with minimal fees.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-light mb-2 tracking-wide">Community + Creativity</h3>
                    <p className="text-gray-400 leading-relaxed font-light">
                      Build communities around shared interests and creative expression.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-left" duration={600} delay={200}>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-light mb-2 tracking-wide">Fun + Financial Upside</h3>
                    <p className="text-gray-400 leading-relaxed font-light">
                      Meme tokens combine entertainment with real investment opportunities.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-light mb-2 tracking-wide">Developer-Friendly Ecosystem</h3>
                    <p className="text-gray-400 leading-relaxed font-light">
                      Move programming language makes smart contracts safer and more efficient.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </SectionParticles>

      {/* Final CTA */}
      <SectionParticles particleCount={25} colors={["#00D4FF", "#7C3AED", "#06FFA5"]} className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <AnimatedSection animation="scale-up" duration={700}>
            <div className="space-y-6">
              <h2 className="text-5xl font-light mb-6 neon-text tracking-tight">Ready to Prompt Your First Token?</h2>

              <div className="flex justify-center">
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="relative rounded-full bg-zinc-950 px-8 py-4 text-white font-light text-xl flex items-center justify-center shadow-[0_0_10px_0_rgba(0,212,255,0.25)] border border-cyan-500/10 transition-all duration-150 hover:shadow-[0_0_16px_2px_rgba(0,212,255,0.3)] focus:outline-none animate-pulse-glow"
                >
                  Launch Prompt.fun
                </button>
              </div>

              <p className="text-gray-400 text-lg font-light tracking-wide">
                Built on Aptos Devnet. No risk. Just fun.
              </p>

              {/* XP Badge Preview */}
              <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 holo-card rounded-full">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm font-light tracking-wide">Earn XP for every action</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </SectionParticles>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-card/20 relative">
        <AnimatedSection animation="fade-up" duration={600}>
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <Code className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-light tracking-wide">Prompt.fun</span>
              </div>

              {/* Links */}
              <nav className="flex flex-wrap items-center gap-6 text-sm">
                <Link href="/" className="text-gray-400 hover:text-primary transition-colors font-light">
                  Home
                </Link>
                <Link href="/chat" className="text-gray-400 hover:text-primary transition-colors font-light">
                  Copilot
                </Link>
                <Link href="/dashboard" className="text-gray-400 hover:text-primary transition-colors font-light">
                  Dashboard
                </Link>
                <Link href="#" className="text-gray-400 hover:text-primary transition-colors font-light">
                  Docs
                </Link>
                <Link href="#" className="text-gray-400 hover:text-primary transition-colors font-light">
                  GitHub
                </Link>
                <Link href="#" className="text-gray-400 hover:text-primary transition-colors font-light">
                  Privacy
                </Link>
                <Link href="#" className="text-gray-400 hover:text-primary transition-colors font-light">
                  Twitter
                </Link>
              </nav>

              {/* Made with love */}
              <p className="text-sm text-gray-400 font-light">Made with ❤️ on Aptos</p>
            </div>
          </div>
        </AnimatedSection>
      </footer>
    </div>
  )
}
