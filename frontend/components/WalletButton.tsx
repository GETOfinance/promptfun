'use client';

import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown, LogOut } from "lucide-react";
import { useRouter } from 'next/navigation';

export function WalletButton() {
    const { account, connect, disconnect, wallets = [] } = useWallet();
    const router = useRouter();

    const handleConnect = async (walletName: string) => {
        try {
            await connect(walletName);
            router.push('/terminal');
        } catch (error) {
            console.error('Failed to connect to wallet:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await disconnect();
            router.push('/');
        } catch (error) {
            console.error('Failed to disconnect wallet:', error);
        }
    };

    if (account) {
        return (
            <Button
                onClick={handleLogout}
                variant="default"
                className="gap-2"
            >
                <LogOut className="h-4 w-4" /> Logout
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