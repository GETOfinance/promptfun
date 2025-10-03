"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Rocket, MessageSquare, ExternalLink } from "lucide-react"
import { TailwindConnectButton } from "@/components/ui/tailwind-connect-button"
import { useWallet } from "../../contexts/WalletContext"

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!
const NODE_URL = 'https://fullnode.testnet.aptoslabs.com/v1'

// Helper to call add_xp (from test-frontend)
async function addXP(account: any, signAndSubmitTransaction: any, user: string, xp: number) {
  if (!account || typeof signAndSubmitTransaction !== 'function') {
    throw new Error('Wallet not connected');
  }
  const payload = {
    sender: account.address,
    data: {
      function: `${CONTRACT_ADDRESS}::XPSystem::add_xp`,
      typeArguments: [],
      functionArguments: [user, xp]
    }
  };
  return await signAndSubmitTransaction(payload);
}

function useLaunchToken(account: any, signAndSubmitTransaction: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const initializeStore = useCallback(async () => {
    if (!account || typeof signAndSubmitTransaction !== 'function') {
      setError('Wallet not connected');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = {
        sender: account.address,
        data: {
          function: `${CONTRACT_ADDRESS}::PromptToken::init_store`,
          typeArguments: [],
          functionArguments: []
        }
      };
      const response = await signAndSubmitTransaction(payload);
      if (response && response.hash) {
        setSuccess(`Store initialized successfully! Hash: ${response.hash}`);
      } else {
        setError('Store initialization submitted but no hash received');
      }
    } catch (e: any) {
      setError(typeof e === 'string' ? e : e?.message || JSON.stringify(e) || 'Failed to initialize store');
    } finally {
      setLoading(false);
    }
  }, [account, signAndSubmitTransaction]);

  const launchToken = useCallback(async (name: string, symbol: string, supply: number) => {
    if (!account) {
      setError('No account available');
      return;
    }
    if (typeof signAndSubmitTransaction !== 'function') {
      setError('Transaction function not available. Please reconnect your wallet.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        sender: account.address,
        data: {
          function: `${CONTRACT_ADDRESS}::PromptToken::create_token`,
          typeArguments: [],
          functionArguments: [name, symbol, supply]
        }
      };
      const response = await signAndSubmitTransaction(payload);
      if (response && response.hash) {
        setSuccess(`Token launched successfully! Hash: ${response.hash}`);
        // Award XP for launching a token
        try {
          await addXP(account, signAndSubmitTransaction, account.address, 100);
        } catch (xpErr) {
          // XP award failure is non-blocking
        }
      } else {
        setError('Token launch submitted but no hash received');
      }
    } catch (e: any) {
      setError(typeof e === 'string' ? e : e?.message || JSON.stringify(e) || 'Failed to launch token');
    } finally {
      setLoading(false);
    }
  }, [account, signAndSubmitTransaction]);

  return { launchToken, initializeStore, loading, error, success };
}

export default function Launch() {
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
    initialSupply: "",
    bondingCurve: "linear",
  });
  const [transactionStatus, setTransactionStatus] = useState<string>("");
  const { account, signAndSubmitTransaction } = useWallet();
  const { launchToken, initializeStore, loading, error, success } = useLaunchToken(account, signAndSubmitTransaction);

  useEffect(() => {
    if (success) {
      setTransactionStatus(success);
      setTimeout(() => setTransactionStatus(""), 5000);
    }
    if (error) {
      setTransactionStatus(error);
      setTimeout(() => setTransactionStatus(""), 7000);
    }
  }, [success, error]);

  const handleInitStore = async () => {
    setTransactionStatus("Initializing store...");
    await initializeStore();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.symbol || !formData.initialSupply || isNaN(Number(formData.initialSupply)) || Number(formData.initialSupply) <= 0) {
      setTransactionStatus("Please fill in all fields with valid values.");
      return;
    }
    setTransactionStatus("Launching token...");
    await launchToken(formData.name, formData.symbol, Number(formData.initialSupply));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 md:ml-64 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold neon-text">Launch Token</h1>
              <p className="text-gray-400">Create your meme token on Aptos blockchain</p>
            </div>
            <Button variant="outline" className="glow-border bg-transparent">
              <MessageSquare className="w-4 h-4 mr-2" />
              Ask Copilot for Help
            </Button>
          </div>

          {/* Transaction Status */}
          {transactionStatus && (
            <div className={`p-3 rounded text-sm mt-2 ${
              transactionStatus.includes("successfully") ? "bg-green-100 text-green-700" :
              transactionStatus.includes("failed") ? "bg-red-100 text-red-700" :
              "bg-blue-100 text-blue-700"
            }`}>
              {transactionStatus}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Launch Form */}
            <Card className="glow-border bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-primary" />
                  Token Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Token Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Moon Token"
                      className="glow-border bg-background/50"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="symbol">Symbol</Label>
                    <Input
                      id="symbol"
                      name="symbol"
                      value={formData.symbol}
                      onChange={handleInputChange}
                      placeholder="e.g., MOON"
                      className="glow-border bg-background/50"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your token..."
                      className="glow-border bg-background/50"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="initialSupply">Initial Supply</Label>
                    <Input
                      id="initialSupply"
                      name="initialSupply"
                      type="number"
                      value={formData.initialSupply}
                      onChange={handleInputChange}
                      placeholder="1000000"
                      className="glow-border bg-background/50"
                      required
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={handleInitStore}
                    className="w-full justify-center transition-opacity"
                    disabled={loading || !account || typeof signAndSubmitTransaction !== 'function'}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Initializing store...
                      </>
                    ) : (
                      <>Initialize Store</>
                    )}
                  </Button>

                  <Button
                    type="submit"
                    className="w-full justify-center transition-opacity"
                    disabled={loading || !account || typeof signAndSubmitTransaction !== 'function'}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Launching on Aptos...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-4 h-4 mr-2" />
                        Launch Token
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Preview & Info */}
            <div className="space-y-6">
              <Card className="glow-border bg-card/50">
                <CardHeader>
                  <CardTitle>Token Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center">
                        <span className="text-lg font-bold">{formData.symbol ? formData.symbol[0] : "?"}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{formData.name || "Token Name"}</h3>
                        <p className="text-sm text-gray-400">${formData.symbol || "SYMBOL"}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Supply:</span>
                        <span>{formData.initialSupply || "0"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Blockchain:</span>
                        <span>Aptos</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span>Meme Token</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glow-border bg-card/50">
                <CardHeader>
                  <CardTitle>Launch Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Deploy via TokenFactory.move contract</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Automatic bonding curve setup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Instant trading availability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>Gas fee: ~0.001 APT</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
