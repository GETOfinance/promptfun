"use client"

import type React from "react"
import { useWallet } from "../../contexts/WalletContext"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"

interface TailwindConnectButtonProps {
  children: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  showArrow?: boolean
}

export function TailwindConnectButton({
  children,
  onClick,
  className = "",
  showArrow = false,
}: TailwindConnectButtonProps) {
  const { account, connect, disconnect, wallets = [] } = useWallet();
  const petra = wallets.find((w) => w.name.toLowerCase().includes("petra"));
  const router = useRouter();
  const wasConnected = useRef(!!account);

  useEffect(() => {
    // If the wallet was not connected and now is, redirect to /chat
    if (!wasConnected.current && account) {
      router.push("/chat");
    }
    wasConnected.current = !!account;
  }, [account, router]);

  const formatAddress = (addr: any) => {
    const addressStr = typeof addr === 'string' ? addr : addr?.toString();
    return addressStr ? `${addressStr.slice(0, 6)}...${addressStr.slice(-4)}` : '';
  };

  // Always use the provided visual style
  const buttonClass = `relative rounded-full bg-zinc-950 px-8 py-4 text-white font-light text-lg flex items-center justify-center shadow-[0_0_10px_0_rgba(0,212,255,0.25)] border border-cyan-500/10 transition-all duration-150 hover:shadow-[0_0_16px_2px_rgba(0,212,255,0.3)] focus:outline-none ${className}`;

  if (account) {
    return (
      <button
        className={buttonClass}
        onClick={() => router.push("/chat")}
        type="button"
      >
        Launch App
        {showArrow && <span>&rarr;</span>}
      </button>
    );
  }

  // Only show Petra, and connect directly if available
  const handleConnect = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (petra) {
      connect(petra.name);
    } else {
      window.open("https://petra.app/", "_blank");
    }
    if (onClick) onClick(e);
  };

  return (
    <button
      className={buttonClass}
      type="button"
      onClick={handleConnect}
    >
      {children || "Connect Wallet"}
      {showArrow && <span>&rarr;</span>}
    </button>
  );
}
