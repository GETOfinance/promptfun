"use client";
import { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useLaunchToken } from "../hooks/aptos/useLaunchToken";
import { useBuyToken } from "../hooks/aptos/useBuyToken";
import { useGetXP } from "../hooks/aptos/useGetXP";
import { WalletButton } from "../components/WalletButton";
import { WalletStatus } from "../components/WalletStatus";

function TokenActions() {
  const { account, signAndSubmitTransaction, connected } = useWallet();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState(1000);
  const [buyAmount, setBuyAmount] = useState(1);
  const [buyPayment, setBuyPayment] = useState(10);
  const [basePrice, setBasePrice] = useState(1);
  const [xpAddress, setXPAddress] = useState("");
  const [transactionStatus, setTransactionStatus] = useState<string>("");

  const { launchToken, initializeStore, loading: launching, error: launchError, success: launchSuccess } = useLaunchToken(account, signAndSubmitTransaction);
  const { buyToken, launchTokenOnCurve, initializeCurveStore, loading: buying, error: buyError, success: buySuccess } = useBuyToken(account, signAndSubmitTransaction);
  const { getXP, loading: xpLoading, error: xpError, xp, xpStoreExists, initXP } = useGetXP(account, signAndSubmitTransaction);

  // Clear transaction status when account changes
  useEffect(() => {
    setTransactionStatus("");
  }, [account]);

  const handleInitializeStores = async () => {
    if (!connected || !account?.address || !signAndSubmitTransaction) {
      setTransactionStatus("Wallet not connected. Please connect your wallet first.");
      return;
    }
    
    setTransactionStatus("Initializing stores...");
    try {
      // Initialize both stores
      await initializeStore();
      await initializeCurveStore();
      setTransactionStatus("Stores initialized successfully!");
      setTimeout(() => setTransactionStatus(""), 3000);
    } catch (error: any) {
      console.error('Store initialization error:', error);
      setTransactionStatus(`Initialization failed: ${error.message}`);
      setTimeout(() => setTransactionStatus(""), 5000);
    }
  };

  const handleLaunchToken = async () => {
    if (!connected || !account?.address || !signAndSubmitTransaction) {
      setTransactionStatus("Wallet not connected. Please connect your wallet first.");
      return;
    }
    
    if (!name || !symbol || supply <= 0) {
      setTransactionStatus("Please fill in all fields with valid values.");
      return;
    }
    
    setTransactionStatus("Launching token...");
    try {
      await launchToken(name, symbol, supply);
      // The success/error will be handled by the hook
    } catch (error: any) {
      console.error('Launch token handler error:', error);
      setTransactionStatus(`Launch failed: ${error.message}`);
      setTimeout(() => setTransactionStatus(""), 5000);
    }
  };

  const handleLaunchTokenOnCurve = async () => {
    if (!connected || !account?.address || !signAndSubmitTransaction) {
      setTransactionStatus("Wallet not connected. Please connect your wallet first.");
      return;
    }
    
    if (!symbol || basePrice <= 0) {
      setTransactionStatus("Please fill in symbol and base price with valid values.");
      return;
    }
    
    setTransactionStatus("Launching token on bonding curve...");
    try {
      await launchTokenOnCurve(symbol, basePrice);
      // The success/error will be handled by the hook
    } catch (error: any) {
      console.error('Launch token on curve handler error:', error);
      setTransactionStatus(`Launch on curve failed: ${error.message}`);
      setTimeout(() => setTransactionStatus(""), 5000);
    }
  };

  const handleBuyToken = async () => {
    if (!connected || !account?.address || !signAndSubmitTransaction) {
      setTransactionStatus("Wallet not connected. Please connect your wallet first.");
      return;
    }
    
    if (!symbol || buyAmount <= 0 || buyPayment <= 0) {
      setTransactionStatus("Please fill in all fields with valid values.");
      return;
    }
    
    setTransactionStatus("Buying token...");
    try {
      await buyToken(symbol, buyAmount, buyPayment);
      // The success/error will be handled by the hook
    } catch (error: any) {
      console.error('Buy token handler error:', error);
      setTransactionStatus(`Purchase failed: ${error.message}`);
      setTimeout(() => setTransactionStatus(""), 5000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Transaction Status */}
      {(transactionStatus || launchSuccess || buySuccess || launchError || buyError) && (
        <div className="space-y-2">
          {transactionStatus && (
            <div className={`p-3 rounded text-sm ${
              transactionStatus.includes("successfully") ? "bg-green-100 text-green-700" : 
              transactionStatus.includes("failed") ? "bg-red-100 text-red-700" : 
              "bg-blue-100 text-blue-700"
            }`}>
              {transactionStatus}
            </div>
          )}
          
          {launchSuccess && (
            <div className="p-3 rounded text-sm bg-green-100 text-green-700">
              ✅ {launchSuccess}
            </div>
          )}
          
          {buySuccess && (
            <div className="p-3 rounded text-sm bg-green-100 text-green-700">
              ✅ {buySuccess}
            </div>
          )}
          
          {(launchError || buyError) && (
            <div className="p-3 rounded text-sm bg-red-100 text-red-700">
              <div className="mb-2">
                {launchError && <div>❌ Launch Error: {launchError}</div>}
                {buyError && <div>❌ Buy Error: {buyError}</div>}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => window.location.reload()}
                  className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Initialize Stores */}
      <div>
        <h2 className="font-bold mb-2">Initialize Stores (First Time Setup)</h2>
        <button 
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
          onClick={handleInitializeStores}
          disabled={launching || buying || !connected || !account || typeof signAndSubmitTransaction !== 'function'}
        >
          Initialize Token & Curve Stores
        </button>
        <p className="text-sm text-gray-600 mt-1">Run this once before launching or buying tokens</p>
      </div>

      <div>
        <h2 className="font-bold mb-2">Launch Token</h2>
        <div className="space-y-2">
          <input className="border px-2 py-1 mr-2 w-full" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input className="border px-2 py-1 mr-2 w-full" placeholder="Symbol" value={symbol} onChange={e => setSymbol(e.target.value)} />
          <input className="border px-2 py-1 mr-2 w-full" type="number" placeholder="Supply" value={supply} onChange={e => setSupply(Number(e.target.value))} />
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
            onClick={handleLaunchToken}
            disabled={launching || !connected || !account || typeof signAndSubmitTransaction !== 'function'}
          >
            {launching ? "Launching..." : "Launch Token"}
          </button>
        </div>
        {launchError && <div className="text-red-500 mt-2 text-sm">{typeof launchError === "object" ? JSON.stringify(launchError) : launchError}</div>}
        {launchSuccess && <div className="text-green-600 mt-2 text-sm">{typeof launchSuccess === "object" ? JSON.stringify(launchSuccess) : launchSuccess}</div>}
      </div>

      <div>
        <h2 className="font-bold mb-2">Launch Token on Bonding Curve</h2>
        <div className="space-y-2">
          <input className="border px-2 py-1 mr-2 w-full" placeholder="Symbol" value={symbol} onChange={e => setSymbol(e.target.value)} />
          <input className="border px-2 py-1 mr-2 w-full" type="number" placeholder="Base Price" value={basePrice} onChange={e => setBasePrice(Number(e.target.value))} />
          <button 
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
            onClick={handleLaunchTokenOnCurve}
            disabled={buying || !connected || !account || typeof signAndSubmitTransaction !== 'function'}
          >
            {buying ? "Launching on Curve..." : "Launch on Bonding Curve"}
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">Required before buying tokens</p>
      </div>

      <div>
        <h2 className="font-bold mb-2">Buy Token</h2>
        <div className="space-y-2">
          <input className="border px-2 py-1 mr-2 w-full" placeholder="Symbol" value={symbol} onChange={e => setSymbol(e.target.value)} />
          <input className="border px-2 py-1 mr-2 w-full" type="number" placeholder="Amount" value={buyAmount} onChange={e => setBuyAmount(Number(e.target.value))} />
          <input className="border px-2 py-1 mr-2 w-full" type="number" placeholder="Payment (APT)" value={buyPayment} onChange={e => setBuyPayment(Number(e.target.value))} />
          <button 
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
            onClick={handleBuyToken}
            disabled={buying || !connected || !account || typeof signAndSubmitTransaction !== 'function'}
          >
            {buying ? "Buying..." : "Buy Token"}
          </button>
        </div>
        {buyError && <div className="text-red-500 mt-2 text-sm">{typeof buyError === "object" ? JSON.stringify(buyError) : buyError}</div>}
        {buySuccess && <div className="text-green-600 mt-2 text-sm">{typeof buySuccess === "object" ? JSON.stringify(buySuccess) : buySuccess}</div>}
      </div>

      <div>
        <h2 className="font-bold mb-2">Get XP</h2>
        <div className="space-y-2">
          <input className="border px-2 py-1 mr-2 w-full" placeholder="Address" value={xpAddress} onChange={e => setXPAddress(e.target.value)} />
          <button 
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
            onClick={() => account && getXP(xpAddress)}
            disabled={xpLoading || !account}
          >
            {xpLoading ? "Fetching..." : "Fetch XP"}
          </button>
          {/* Manual XP initialization button */}
          {initXP && (
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full mt-2"
              onClick={() => initXP()}
              disabled={!account}
            >
              Initialize XP (Manual)
            </button>
          )}
        </div>
        {xpError && <div className="text-red-500 mt-2 text-sm">{typeof xpError === "object" ? JSON.stringify(xpError) : xpError}</div>}
        {xpStoreExists && <div className="text-green-600 mt-2 text-sm">✅ XP Store initialized</div>}
        {xp !== null && <div className="text-purple-600 mt-2 text-sm">XP: {typeof xp === "object" ? JSON.stringify(xp) : xp}</div>}
        <div className="text-gray-600 mt-2 text-sm">
          <p>• Launch tokens to earn XP</p>
          <p>• XP is awarded automatically after successful actions</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { account, signAndSubmitTransaction, connected, wallets } = useWallet();
  
  // Enhanced debug logging with wallet detection
  useEffect(() => {
    console.log("=== MAIN COMPONENT DEBUG ===");
    console.log("Connected:", connected);
    console.log("Account:", account);
    console.log("signAndSubmitTransaction:", typeof signAndSubmitTransaction);
    console.log("Available wallets:", wallets?.length || 0);
    console.log("Window.aptos:", typeof window !== 'undefined' && !!(window as any).aptos);
    console.log("Document ready state:", typeof document !== 'undefined' ? document.readyState : 'N/A');
    
    // Additional wallet state checks
    if (typeof window !== 'undefined') {
      console.log("Window.aptos object:", (window as any).aptos);
      console.log("Window.aptos.isConnected:", (window as any).aptos?.isConnected);
      console.log("Window.aptos.account:", (window as any).aptos?.account);
    }
    
    console.log("===========================");
  }, [connected, account, signAndSubmitTransaction, wallets]);

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Aptos Contract Test Frontend</h1>
        <WalletButton />
      </div>
      
      <div className="mb-4">
        <WalletStatus />
      </div>
      
      {(() => {
        try {
          if (account) {
            return (
              <div className="p-4 border rounded-lg bg-white">
                <TokenActions />
              </div>
            );
          } else {
            return (
              <div className="p-4 border rounded-lg bg-red-50 border-red-200">
                <div className="text-red-700 font-medium mb-2">⚠️ Wallet Connection Required</div>
                <div className="text-red-600 text-sm space-y-1">
                  <p>• Please connect and authorize your wallet (Petra) to use token actions</p>
                  <p>• If you are connected and still see this, try disconnecting and reconnecting your wallet</p>
                  <p>• Ensure you approve all permissions in the wallet</p>
                  <p>• Make sure you have the Petra wallet extension installed</p>
                  {wallets?.length === 0 && (
                    <p className="font-medium text-red-800">• No wallets detected - please install Petra wallet extension</p>
                  )}
                </div>
              </div>
            );
          }
        } catch (error) {
          console.error('Error rendering main content:', error);
          return (
            <div className="p-4 border rounded-lg bg-red-50 border-red-200">
              <div className="text-red-700 font-medium mb-2">⚠️ Error Loading Content</div>
              <div className="text-red-600 text-sm">
                An error occurred while loading the wallet content. Please refresh the page.
              </div>
            </div>
          );
        }
      })()}
    </main>
  );
}
