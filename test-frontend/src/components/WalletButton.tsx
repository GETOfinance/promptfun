'use client';

import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export function WalletButton() {
    const { account, connect, disconnect, wallets = [] } = useWallet();

    const formatAddress = (addr: any) => {
        const addressStr = typeof addr === 'string' ? addr : addr.toString();
        return `${addressStr.slice(0, 6)}...${addressStr.slice(-4)}`;
    };

    const handleConnect = async (walletName: string) => {
        try {
            await connect(walletName);
        } catch (error) {
            console.error('Failed to connect to wallet:', error);
        }
    };

    const handleDisconnect = async () => {
        try {
            await disconnect();
        } catch (error) {
            console.error('Failed to disconnect wallet:', error);
        }
    };

    if (account) {
        return (
            <Button
                onClick={handleDisconnect}
                variant="default"
                className="gap-2"
            >
                <span className="w-2 h-2 rounded-full bg-green-300"></span>
                {formatAddress(account.address)}
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                    Connect Wallet
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {wallets.map((wallet) => (
                    <DropdownMenuItem
                        key={wallet.name}
                        onClick={() => handleConnect(wallet.name)}
                    >
                        {wallet.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 