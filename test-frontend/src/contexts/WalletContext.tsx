'use client';

import { PropsWithChildren, useState, useEffect } from "react";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";

export function WalletProvider({ children }: PropsWithChildren) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Wait for DOM to be fully ready and wallet extensions to load
        const timer = setTimeout(() => {
            setIsReady(true);
        }, 500);
        
        return () => clearTimeout(timer);
    }, []);

    // Don't render the wallet provider until the DOM is ready
    if (!isReady) {
        return <div className="min-h-screen flex items-center justify-center">Loading wallet...</div>;
    }

    return (
        <AptosWalletAdapterProvider
            autoConnect={false}
            dappConfig={{ network: Network.TESTNET }}
            onError={(error) => {
                // Suppress the specific wallet detection error
                const errorStr = error?.toString() || '';
                if (!errorStr.includes("Cannot use 'in' operator") && 
                    !errorStr.includes("undefined") &&
                    !errorStr.includes("function")) {
                    console.error("Wallet error:", error);
                }
            }}
        >
            {children}
        </AptosWalletAdapterProvider>
    );
}

// Export the useWallet hook from the adapter
export { useWallet } from "@aptos-labs/wallet-adapter-react"; 