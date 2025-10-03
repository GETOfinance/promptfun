"use client";

import { useState, useEffect } from "react";
import { useWallet } from "../contexts/WalletContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
const NODE_URL = 'https://fullnode.testnet.aptoslabs.com/v1';

import { useBuyToken } from "@/hooks/aptos/useBuyToken";

export default function WalletStatusBar() {
  const { account, connected, wallets = [], connect, disconnect, signAndSubmitTransaction } = useWallet() as any;
  const [amount, setAmount] = useState<number>(1);
  const [basePrice, setBasePrice] = useState<number | null>(null);
  const [supply, setSupply] = useState<number | null>(null);
  const [estPayment, setEstPayment] = useState<number | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  // Fetch price and supply from view functions
  useEffect(() => {
    let aborted = false;
    async function fetchInfo() {
      try {
        setFetching(true);
        const headers = { 'Content-Type': 'application/json' };
        const view = async (fn: string, args: any[]) => {
          const res = await fetch(`${NODE_URL}/view`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              function: fn,
              type_arguments: [],
              arguments: args,
            }),
          });
          if (!res.ok) throw new Error(`View call failed: ${res.status}`);
          const data = await res.json();
          return data;
        };
        const [priceArr, supplyArr] = await Promise.all([
          view(`${CONTRACT_ADDRESS}::BondingCurve::get_token_price`, [CONTRACT_ADDRESS, "PROMPT"]),
          view(`${CONTRACT_ADDRESS}::BondingCurve::get_token_supply`, [CONTRACT_ADDRESS, "PROMPT"]),
        ]);
        if (aborted) return;
        const p = Number(priceArr?.[0] ?? 0);
        const s = Number(supplyArr?.[0] ?? 0);
        setBasePrice(p);
        setSupply(s);
        const amt = Number(amount || 1);
        setEstPayment(Number.isFinite(p) && Number.isFinite(s) ? p * (s + amt) : null);
      } catch (e) {
        console.error('Failed to fetch price/supply', e);
        setBasePrice(null);
        setSupply(null);
        setEstPayment(null);
      } finally {
        setFetching(false);
      }
    }
    fetchInfo();
    return () => { aborted = true; };
  }, [amount]);

  const { buyToken, loading, error, success } = useBuyToken(account, signAndSubmitTransaction);
  const [buying, setBuying] = useState(false);

  const formatAddress = (addr: any) => {
    if (!addr) return "N/A";
    const addressStr = typeof addr === "string" ? addr : addr.toString();
    return `${addressStr.slice(0, 6)}...${addressStr.slice(-4)}`;
  };

  const handleConnect = async (walletName: string) => {
    try {
      await connect(walletName);
    } catch (e) {
      console.error("Connect error", e);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (e) {
      console.error("Disconnect error", e);
    }
  };

  const handleBuyOne = async () => {
    if (!connected || !account) return;
    try {
      setBuying(true);
      const payment = basePrice != null && supply != null ? basePrice * (supply + 1) : 10;
      const resp = await buyToken("PROMPT", 1, payment);
      if (resp?.hash) setLastTxHash(resp.hash);
    } finally {
      setBuying(false);
    }
  };

  const handleBuyN = async () => {
    if (!connected || !account) return;
    try {
      setBuying(true);
      const amt = Math.max(1, Number(amount || 1));
      const payment = basePrice != null && supply != null ? basePrice * (supply + amt) : 10 * amt;
      const resp = await buyToken("PROMPT", amt, payment);
      if (resp?.hash) setLastTxHash(resp.hash);
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-2 flex items-center gap-3">
        <div className="text-sm text-gray-600 flex-1">
          {connected && account ? (
            <span>Connected: <span className="font-medium">{formatAddress(account.address)}</span></span>
          ) : (
            <span>Wallet: Not connected</span>
          )}
        </div>

        {/* Price & supply readout */}
        <div className="hidden md:flex items-center gap-3 text-sm text-gray-600">
          <span>Base Price: {basePrice ?? "—"}</span>
          <span>Supply: {supply ?? "—"}</span>
          <span>Est. Payment: {estPayment ?? "—"}</span>
          <span>Holdings: N/A</span>
        </div>

        {/* Buy N input */}
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(Math.max(1, Number(e.target.value || 1)))}
            className="w-24"
          />
          <Button onClick={handleBuyN} disabled={!connected || buying || loading || fetching}>
            {buying || loading ? "Buying…" : `Buy ${amount} PROMPT`}
          </Button>
        </div>

        {/* Optional: quick 1-buy */}
        <Button onClick={handleBuyOne} disabled={!connected || buying || loading || fetching}>
          {buying || loading ? "Buying…" : "Buy 1 PROMPT"}
        </Button>

        {/* Connect/Disconnect */}
        {account ? (
          <Button variant="outline" onClick={handleDisconnect}>Disconnect</Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Connect Wallet</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {wallets.map((w: any) => (
                <DropdownMenuItem key={w.name} onClick={() => handleConnect(w.name)}>
                  {w.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {(error || success || lastTxHash) && (
        <div className="mx-auto max-w-6xl px-4 pb-2 space-y-1">
          {error && <div className="text-sm text-red-600">{error}</div>}
          {success && <div className="text-sm text-green-700">{success}</div>}
          {lastTxHash && (
            <div className="text-sm">
              <a
                className="text-blue-600 underline"
                href={`https://explorer.aptoslabs.com/txn/${lastTxHash}?network=testnet`}
                target="_blank" rel="noreferrer"
              >
                View transaction on Aptos Explorer
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

