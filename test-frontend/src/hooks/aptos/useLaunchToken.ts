import { useCallback, useState } from 'react';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
const NODE_URL = 'https://fullnode.testnet.aptoslabs.com/v1';

// Helper to call add_xp
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

export function useLaunchToken(account: any, signAndSubmitTransaction: any) {
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
      
      console.log('Initializing store with payload:', payload);
      const response = await signAndSubmitTransaction(payload);
      console.log('Store initialization response:', response);
      
      if (response && response.hash) {
        setSuccess(`Store initialized successfully! Hash: ${response.hash}`);
      } else {
        setError('Store initialization submitted but no hash received');
      }
    } catch (e: any) {
      console.error('Store initialization error:', e);
      // Don't set error for initialization - it might already be initialized
      console.log('Store might already be initialized');
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
      console.log('Launching token with payload:', { name, symbol, supply });
      console.log('Account:', account);
      console.log('signAndSubmitTransaction type:', typeof signAndSubmitTransaction);
      
      const payload = {
        sender: account.address,
        data: {
          function: `${CONTRACT_ADDRESS}::PromptToken::create_token`,
          typeArguments: [],
          functionArguments: [name, symbol, supply]
        }
      };
      
      console.log('Transaction payload:', payload);
      
      // Execute the transaction
      const response = await signAndSubmitTransaction(payload);
      console.log('Transaction response:', response);
      
      if (response && response.hash) {
        setSuccess(`Token launched successfully! Hash: ${response.hash}`);
        // Award XP for launching a token
        try {
          await addXP(account, signAndSubmitTransaction, account.address, 100);
          console.log('XP awarded for launching token');
        } catch (xpErr) {
          console.error('Failed to award XP:', xpErr);
        }
      } else {
        setError('Transaction submitted but no hash received');
      }
    } catch (e: any) {
      console.error('Launch token error:', e);
      setError(typeof e === 'string' ? e : e?.message || JSON.stringify(e) || 'Failed to launch token');
    } finally {
      setLoading(false);
    }
  }, [account, signAndSubmitTransaction]);

  return { launchToken, initializeStore, loading, error, success };
} 