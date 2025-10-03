import { useCallback, useState } from 'react';
import { AptosClient } from 'aptos';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
const NODE_URL = 'https://fullnode.testnet.aptoslabs.com/v1';

// Helper to call init_xp
export async function initXP(account: any, signAndSubmitTransaction: any) {
  if (!account || typeof signAndSubmitTransaction !== 'function') {
    throw new Error('Wallet not connected');
  }
  const payload = {
    sender: account.address,
    data: {
      function: `${CONTRACT_ADDRESS}::XPSystem::init_xp`,
      typeArguments: [],
      functionArguments: []
    }
  };
  return await signAndSubmitTransaction(payload);
}

export function useGetXP(account?: any, signAndSubmitTransaction?: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [xp, setXP] = useState<number | null>(null);
  const [xpStoreExists, setXpStoreExists] = useState<boolean>(false);

  const getXP = useCallback(async (address: string) => {
    setLoading(true);
    setError(null);
    setXP(null);
    
    try {
      const client = new AptosClient(NODE_URL);
      // 1. Get the XPStore resource
      const resource = await client.getAccountResource(address, `${CONTRACT_ADDRESS}::XPSystem::XPStore`);
      setXpStoreExists(true);
      const tableHandle = (resource.data as any).points.handle;
      // 2. Query the table for the user's XP
      const tableItem = {
        key_type: "address",
        value_type: "u64",
        key: address
      };
      try {
        const xpValue = await client.getTableItem(tableHandle, tableItem);
        setXP(Number(xpValue));
      } catch (tableErr: any) {
        // If the user has no XP entry, treat as 0
        setXP(0);
      }
      setError(null);
    } catch (resourceError: any) {
      // If resource not found, try to init_xp
      if (resourceError?.message && resourceError.message.includes('resource_not_found') && account && signAndSubmitTransaction) {
        try {
          await initXP(account, signAndSubmitTransaction);
          setXpStoreExists(true);
          setXP(0);
          setError(null);
        } catch (initErr: any) {
          setError('Failed to initialize XP: ' + (initErr?.message || JSON.stringify(initErr)));
        }
      } else {
        setXpStoreExists(false);
        setError('XP store not found. Please initialize XP first.');
      }
    } finally {
      setLoading(false);
    }
  }, [account, signAndSubmitTransaction]);

  return { 
    getXP, 
    loading, 
    error, 
    xp, 
    xpStoreExists,
    initXP: (account && signAndSubmitTransaction) ? () => initXP(account, signAndSubmitTransaction) : undefined 
  };
} 