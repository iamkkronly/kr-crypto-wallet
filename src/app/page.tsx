'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import Send from './components/Send';
import Receive from './components/Receive';
import Login from './components/Login';

export default function Home() {
  const [wallet, setWallet] = useState<{ address: string; privateKey: string } | null>(null);
  const [balance, setBalance] = useState<string>('0.0000000000');
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  const handleLogin = (privateKey: string) => {
    try {
      const walletInstance = new ethers.Wallet(privateKey);
      setWallet({ address: walletInstance.address, privateKey: walletInstance.privateKey });
    } catch (error) {
      console.error("Failed to load wallet from private key:", error);
      // This case should be handled in the Login component, but as a fallback:
      alert("Invalid private key provided.");
    }
  };

  const fetchBalance = useCallback(async () => {
    if (!wallet) return;
    setLoadingBalance(true);
    setBalanceError(null);
    try {
      const provider = new ethers.JsonRpcProvider('https://ethereum.public.blockpi.network/v1/rpc/public');
      const balanceInWei = await provider.getBalance(wallet.address);
      const etherString = ethers.formatEther(balanceInWei);
      const formattedBalance = parseFloat(etherString).toFixed(10);
      setBalance(formattedBalance);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      setBalanceError('Could not fetch balance.');
    } finally {
      setLoadingBalance(false);
    }
  }, [wallet]);

  useEffect(() => {
    if (wallet) {
      fetchBalance();
    }
  }, [wallet, fetchBalance]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Crypto Wallet</h1>
      {!wallet ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="w-full max-w-2xl">
          <div className="p-4 mb-4 border rounded-lg text-center bg-white shadow">
            <h2 className="text-2xl font-bold mb-4">Your Wallet</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Balance</h3>
                <p className="text-lg bg-gray-100 p-2 rounded font-mono">
                  {loadingBalance
                    ? 'Loading...'
                    : balanceError
                    ? <span className="text-red-500">{balanceError}</span>
                    : `${balance} ETH`}
                </p>
                <button
                  onClick={fetchBalance}
                  disabled={loadingBalance}
                  className="mt-2 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded disabled:bg-gray-400"
                >
                  Refresh
                </button>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Public Address</h3>
                <p className="text-sm break-all bg-gray-100 p-2 rounded">{wallet.address}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Receive address={wallet.address} />
            <Send privateKey={wallet.privateKey} />
          </div>
        </div>
      )}
    </main>
  );
}