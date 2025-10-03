"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, Users, MessageSquare, ExternalLink } from "lucide-react"
import { useWallet } from "@/contexts/WalletContext"
import { useBuyToken } from "@/hooks/aptos/useBuyToken"
import { useGetXP } from "@/hooks/aptos/useGetXP"
import { useLaunchToken } from "@/hooks/aptos/useLaunchToken"
import { AptosClient } from 'aptos'
import { Label } from "@/components/ui/label"
import { storeLaunchedToken, fetchLaunchedTokens } from "@/lib/marketplaceApi"

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!
const NODE_URL = 'https://fullnode.testnet.aptoslabs.com/v1'

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedToken, setSelectedToken] = useState<(typeof mockTokens)[0] | null>(null)
  const { account, signAndSubmitTransaction, connected } = useWallet()
  const { buyToken, launchTokenOnCurve, initializeCurveStore, loading: buyLoading, error: buyError, success: buySuccess } = useBuyToken(account, signAndSubmitTransaction)
  const { getXP, loading: xpLoading, error: xpError, xp } = useGetXP(account, signAndSubmitTransaction)
  const { launchToken, initializeStore, loading: launchLoading, error: launchError, success: launchSuccess } = useLaunchToken(account, signAndSubmitTransaction)

  // State for buy form
  const [buyAmount, setBuyAmount] = useState(1)
  const [buyPayment, setBuyPayment] = useState(10)
  const [basePrice, setBasePrice] = useState(1)
  const [showXP, setShowXP] = useState(false)

  // Add state to track which tokens are launched on the curve
  const [curveLaunched, setCurveLaunched] = useState<{ [symbol: string]: boolean }>({})
  const [checkingCurve, setCheckingCurve] = useState(false)

  const [name, setName] = useState("")
  const [symbol, setSymbol] = useState("")
  const [supply, setSupply] = useState(1000)
  const [launchingToken, setLaunchingToken] = useState(false)
  const [launchErrorMsg, setLaunchErrorMsg] = useState("")

  const [launchedTokens, setLaunchedTokens] = useState<{ symbol: string }[]>([])

  // Fetch launched tokens from Mongo on mount
  useEffect(() => {
    fetchLaunchedTokens().then(setLaunchedTokens).catch(console.error)
  }, [])

  const isTokenLaunched = (symbol: string) =>
    launchedTokens.some((t) => t.symbol === symbol)

  const filteredTokens = launchedTokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Function to check if a token is already on the curve (global)
  async function checkTokenOnCurve(symbol: string) {
    setCheckingCurve(true)
    try {
      const client = new AptosClient(NODE_URL)
      // Get the CurveStore resource for the global contract address
      const resource = await client.getAccountResource(CONTRACT_ADDRESS, `${CONTRACT_ADDRESS}::BondingCurve::CurveStore`)
      const curvesHandle = resource.data.curves.handle
      // Try to get the curve for the symbol
      const tableItem = {
        key_type: "string",
        value_type: `${CONTRACT_ADDRESS}::BondingCurve::Curve`,
        key: symbol
      }
      await client.getTableItem(curvesHandle, tableItem)
      setCurveLaunched((prev) => ({ ...prev, [symbol]: true }))
      setCheckingCurve(false)
      return true // Exists
    } catch (err: any) {
      setCurveLaunched((prev) => ({ ...prev, [symbol]: false }))
      setCheckingCurve(false)
      return false // Not found
    }
  }

  // Check if token is on curve when modal opens or selectedToken changes
  useEffect(() => {
    if (selectedToken) {
      checkTokenOnCurve(selectedToken.symbol)
    }
  }, [selectedToken])

  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 md:ml-64 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold neon-text">Marketplace</h1>
              <p className="text-gray-400">Discover and trade Aptos meme tokens</p>
            </div>
            <Button className="animate-pulse-glow">
              <MessageSquare className="w-4 h-4 mr-2" />
              Ask Copilot
            </Button>
          </div>

          {/* Search */}
          <Card className="glow-border bg-card/50">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tokens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glow-border bg-background/50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Launch a New Token Form */}
          <Card className="glow-border bg-card/50">
            <CardHeader>
              <CardTitle>Launch a New Token</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Input placeholder="Token Name" value={name} onChange={e => setName(e.target.value)} />
              <Input placeholder="Symbol" value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())} />
              <Input type="number" placeholder="Supply" value={supply} onChange={e => setSupply(Number(e.target.value))} />
              <Input type="number" placeholder="Base Price (for Curve)" value={basePrice} onChange={e => setBasePrice(Number(e.target.value))} />
              <Button
                className="w-full mt-2 rounded-full bg-zinc-950 px-8 py-4 text-white font-light text-lg flex items-center justify-center shadow-[0_0_10px_0_rgba(0,212,255,0.25)] border border-cyan-500/10 transition-all duration-150 hover:shadow-[0_0_16px_2px_rgba(0,212,255,0.3)] focus:outline-none"
                onClick={async () => {
                  if (!account || typeof signAndSubmitTransaction !== 'function') {
                    setLaunchErrorMsg("Wallet not connected.");
                    return;
                  }
                  setLaunchingToken(true)
                  setLaunchErrorMsg("")
                  let timeoutId: any = null
                  try {
                    const timeoutPromise = new Promise((_, reject) => {
                      timeoutId = setTimeout(() => reject(new Error("Timeout: Launch/check took too long. Please try again or check your network.")), 30000)
                    })
                    // Check if token already exists in Mongo
                    if (isTokenLaunched(symbol)) {
                      setLaunchErrorMsg("A token with this symbol is already launched. Please choose a different symbol.")
                      return
                    }
                    // 1. Launch PromptToken (wallet prompt)
                    const promptTokenTx = await Promise.race([launchToken(name, symbol, supply), timeoutPromise])
                    // 2. Launch on BondingCurve (wallet prompt)
                    const curveTx = await Promise.race([launchTokenOnCurve(symbol, basePrice), timeoutPromise])
                    // 3. Only after both succeed, store in Mongo
                    console.log("DEBUG launch", { symbol, name, curveTx });
                    const txHash = curveTx?.hash || curveTx?.txnHash || curveTx?.transactionHash || "";
                    const payload: any = {};
                    if (typeof symbol === "string" && symbol.trim()) payload.symbol = symbol.trim();
                    if (typeof name === "string" && name.trim()) payload.name = name.trim();
                    if (txHash && typeof txHash === "string" && txHash.trim()) payload.tx_hash = txHash.trim();
                    if (account?.address) {
                      let creatorStr = account.address;
                      if (typeof creatorStr !== "string") {
                        if (creatorStr.toString) {
                          creatorStr = creatorStr.toString();
                        } else if (creatorStr.data && Array.isArray(creatorStr.data)) {
                          // If it's a Uint8Array or similar, convert to hex
                          creatorStr = "0x" + Array.from(creatorStr.data).map((x: number) => x.toString(16).padStart(2, "0")).join("");
                        } else {
                          creatorStr = String(creatorStr);
                        }
                      }
                      payload.creator = creatorStr;
                    }
                    if (typeof supply === "number" && Number.isFinite(supply)) payload.supply = supply;
                    if (typeof basePrice === "number" && Number.isFinite(basePrice)) payload.base_price = basePrice;

                    if (!payload.symbol || !payload.name || !payload.tx_hash) {
                      setLaunchErrorMsg("Token symbol, name, or transaction hash missing.");
                      setLaunchingToken(false);
                      return;
                    }

                    await storeLaunchedToken(payload)
                    // Refresh launched tokens
                    fetchLaunchedTokens().then(setLaunchedTokens).catch(console.error)
                    setName("")
                    setSymbol("")
                    setSupply(1000)
                    setBasePrice(1)
                  } catch (err: any) {
                    setLaunchErrorMsg(err?.message || (typeof err === "string" ? err : JSON.stringify(err)) || "Failed to launch token")
                  } finally {
                    if (timeoutId) clearTimeout(timeoutId)
                    setLaunchingToken(false)
                  }
                }}
                disabled={launchingToken || !name || !symbol || supply <= 0 || basePrice <= 0}
              >
                {launchingToken ? "Launching..." : "Launch Token"}
              </Button>
              {launchErrorMsg && <div className="text-red-500 text-xs mt-1">{launchErrorMsg}</div>}
            </CardContent>
          </Card>

          {/* Token Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {launchedTokens.length === 0 ? (
              <div className="col-span-full text-center text-gray-400 py-12">No tokens launched yet.</div>
            ) : (
              launchedTokens
                .filter(token =>
                  token.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  token.symbol?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((token, index) => (
              <Card
                key={index}
                className="glow-border bg-card/50 hover:bg-card/70 transition-all duration-300 cursor-pointer"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                            <span className="font-bold">{token.symbol?.[0]}</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">${token.symbol}</CardTitle>
                        <p className="text-sm text-gray-400">{token.name}</p>
                      </div>
                    </div>
                        <Badge variant="default">Launched</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                        {token.supply !== undefined && (
                    <div>
                            <p className="text-gray-400">Supply</p>
                            <p className="font-semibold">{token.supply}</p>
                    </div>
                        )}
                        {token.base_price !== undefined && (
                    <div>
                            <p className="text-gray-400">Base Price</p>
                            <p className="font-semibold">{token.base_price}</p>
                    </div>
                        )}
                    <div>
                          <p className="text-gray-400">Tx Hash</p>
                          <p className="font-semibold break-all">{token.tx_hash}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 rounded-full bg-zinc-950 px-8 py-4 text-white font-light text-lg flex items-center justify-center shadow-[0_0_10px_0_rgba(0,212,255,0.25)] border border-cyan-500/10 transition-all duration-150 hover:shadow-[0_0_16px_2px_rgba(0,212,255,0.3)] focus:outline-none"
                          onClick={() => setSelectedToken(token)}
                        >
                      Buy ${token.symbol}
                        </Button>
                    <Button size="sm" variant="outline" className="glow-border bg-transparent">
                      <TrendingUp className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="glow-border bg-transparent">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
                ))
            )}
          </div>

          {/* Token Detail Drawer */}
          {selectedToken && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-md glow-border bg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center">
                        <span className="text-lg font-bold">{selectedToken.symbol[0]}</span>
                      </div>
                      <div>
                        <CardTitle>${selectedToken.symbol}</CardTitle>
                        <p className="text-sm text-gray-400">{selectedToken.name}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedToken(null)}>
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          if (account) getXP(account.address)
                          setShowXP(true)
                        }}
                        disabled={!account || xpLoading}
                      >
                        {xpLoading ? "Loading XP..." : "Show My XP"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={async () => {
                          if (account) {
                            await launchTokenOnCurve(selectedToken.symbol, basePrice)
                            setCurveLaunched((prev) => ({ ...prev, [selectedToken.symbol]: true }))
                            setTimeout(() => checkTokenOnCurve(selectedToken.symbol), 1500)
                          }
                        }}
                        disabled={!account || buyLoading || curveLaunched[selectedToken.symbol] || checkingCurve}
                      >
                        {checkingCurve
                          ? "Checking..."
                          : curveLaunched[selectedToken.symbol]
                            ? "Launched on Curve"
                            : "Launch on Curve"}
                      </Button>
                    </div>
                    {showXP && (
                      <div className="text-purple-600 text-sm mt-2">XP: {xp !== null ? xp : "-"}</div>
                    )}
                    {isTokenLaunched(selectedToken.symbol) ? (
                      <>
                        {/* Show buy options if token is on the curve */}
                        <div className="mt-4">
                          <Label>Amount to Buy</Label>
                          <Input
                            type="number"
                            min={1}
                            value={buyAmount}
                            onChange={e => setBuyAmount(Number(e.target.value))}
                            className="mb-2"
                          />
                          <Label>Payment (APT)</Label>
                          <Input
                            type="number"
                            min={1}
                            value={buyPayment}
                            onChange={e => setBuyPayment(Number(e.target.value))}
                            className="mb-2"
                          />
                          <Button
                            size="sm"
                            className="flex-1 rounded-full bg-zinc-950 px-8 py-4 text-white font-light text-lg flex items-center justify-center shadow-[0_0_10px_0_rgba(0,212,255,0.25)] border border-cyan-500/10 transition-all duration-150 hover:shadow-[0_0_16px_2px_rgba(0,212,255,0.3)] focus:outline-none"
                            onClick={async () => {
                              if (account) {
                                await buyToken(selectedToken.symbol, buyAmount, buyPayment)
                                setTimeout(() => checkTokenOnCurve(selectedToken.symbol), 1500)
                              }
                            }}
                            disabled={!account || buyLoading || checkingCurve}
                          >
                            {buyLoading ? "Buying..." : `Buy ${selectedToken.symbol}`}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="mt-4 text-sm text-yellow-600">
                        You must launch this token on the curve before buying.
                      </div>
                    )}
                    <div className="mt-4 space-y-2">
                      <label className="block text-sm font-medium">Base Price (for Curve Launch)</label>
                      <Input
                        type="number"
                        min={1}
                        value={basePrice}
                        onChange={e => setBasePrice(Number(e.target.value))}
                        className="w-full"
                      />
                      <Button
                        className="w-full mt-2"
                        onClick={async () => {
                          if (account) await launchTokenOnCurve(selectedToken.symbol, basePrice)
                        }}
                        disabled={!account || buyLoading}
                      >
                        {buyLoading ? "Launching..." : `Launch ${selectedToken.symbol} on Curve`}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
