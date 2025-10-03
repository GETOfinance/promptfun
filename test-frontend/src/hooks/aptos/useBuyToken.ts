import { useCallback, useState } from 'react';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
const NODE_URL = 'https://fullnode.testnet.aptoslabs.com/v1';

export function useBuyToken(account: any, signAndSubmitTransaction: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const initializeCurveStore = useCallback(async () => {
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
          function: `${CONTRACT_ADDRESS}::BondingCurve::init_curve_store`,
          typeArguments: [],
          functionArguments: []
        }
      };
      
      console.log('Initializing curve store with payload:', payload);
      const response = await signAndSubmitTransaction(payload);
      console.log('Curve store initialization response:', response);
      
      if (response && response.hash) {
        setSuccess(`Curve store initialized successfully! Hash: ${response.hash}`);
      } else {
        setError('Curve store initialization submitted but no hash received');
      }
    } catch (e: any) {
      console.error('Curve store initialization error:', e);
      // Don't set error for initialization - it might already be initialized
      console.log('Curve store might already be initialized');
    } finally {
      setLoading(false);
    }
  }, [account, signAndSubmitTransaction]);

  const launchTokenOnCurve = useCallback(async (symbol: string, basePrice: number) => {
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
          function: `${CONTRACT_ADDRESS}::BondingCurve::launch_token`,
          typeArguments: [],
          functionArguments: [symbol, basePrice]
        }
      };
      
      console.log('Launching token on curve with payload:', payload);
      const response = await signAndSubmitTransaction(payload);
      console.log('Token launch on curve response:', response);
      
      if (response && response.hash) {
        setSuccess(`Token launched on curve successfully! Hash: ${response.hash}`);
      } else {
        setError('Token launch on curve submitted but no hash received');
      }
    } catch (e: any) {
      console.error('Token launch on curve error:', e);
      setError(typeof e === 'string' ? e : e?.message || JSON.stringify(e) || 'Failed to launch token on curve');
    } finally {
      setLoading(false);
    }
  }, [account, signAndSubmitTransaction]);

  const buyToken = useCallback(async (symbol: string, amount: number, payment: number) => {
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
      console.log('Buying token with payload:', { symbol, amount, payment });
      console.log('Account:', account);
      console.log('signAndSubmitTransaction type:', typeof signAndSubmitTransaction);
      
      const payload = {
        sender: account.address,
        data: {
          function: `${CONTRACT_ADDRESS}::BondingCurve::buy_token`,
          typeArguments: [],
          functionArguments: [symbol, amount, payment]
        }
      };
      
      console.log('Transaction payload:', payload);
      
      // Execute the transaction
      const response = await signAndSubmitTransaction(payload);
      console.log('Transaction response:', response);
      
      if (response && response.hash) {
        setSuccess(`Token purchased successfully! Hash: ${response.hash}`);
      } else {
        setError('Transaction submitted but no hash received');
      }
    } catch (e: any) {
      console.error('Buy token error:', e);
      setError(typeof e === 'string' ? e : e?.message || JSON.stringify(e) || 'Failed to buy token');
    } finally {
      setLoading(false);
    }
  }, [account, signAndSubmitTransaction]);

  return { buyToken, launchTokenOnCurve, initializeCurveStore, loading, error, success };
} 