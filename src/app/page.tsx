'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import Send from './components/Send';
import Receive from './components/Receive';

export default function Home() {
  const [wallet, setWallet] = useState<{ address: string; privateKey: string } | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);

  const fetchBalance = useCallback(async () => {
    if (!wallet) return;
    setLoadingBalance(true);
    try {
      const provider = new ethers.JsonRpcProvider('https://rpc.ankr.com/eth');
      const balanceInWei = await provider.getBalance(wallet.address);
      setBalance(ethers.formatEther(balanceInWei));
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      setBalance('Error');
    } finally {
      setLoadingBalance(false);
    }
  }, [wallet]);

  useEffect(() => {
    const loadOrCreateWallet = () => {
      const savedPrivateKey = localStorage.getItem('walletPrivateKey');
      let walletInstance;

      if (savedPrivateKey) {
        try {
          walletInstance = new ethers.Wallet(savedPrivateKey);
        } catch (error) {
          console.error("Failed to load wallet from saved private key:", error);
          walletInstance = ethers.Wallet.createRandom();
          localStorage.setItem('walletPrivateKey', walletInstance.privateKey);
        }
      } else {
        walletInstance = ethers.Wallet.createRandom();
        localStorage.setItem('walletPrivateKey', walletInstance.privateKey);
      }

      setWallet({ address: walletInstance.address, privateKey: walletInstance.privateKey });
    };

    loadOrCreateWallet();
  }, []);

  useEffect(() => {
    if (wallet) {
      fetchBalance();
    }
  }, [wallet, fetchBalance]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Crypto Wallet</h1>
      {wallet ? (
        <div className="w-full max-w-2xl">
          <div className="p-4 mb-4 border rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Your Wallet</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Balance</h3>
                <p className="text-lg bg-gray-100 p-2 rounded font-mono">
                  {loadingBalance ? 'Loading...' : `${balance} ETH`}
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
              <div>
                <h3 className="text-lg font-semibold">Private Key (Keep Safe!)</h3>
                <p className="text-sm break-all bg-gray-100 p-2 rounded">{wallet.privateKey}</p>
              </div>
              <div className="p-4 mt-4 border-l-4 border-red-500 bg-red-100 text-red-700">
                <h4 className="font-bold">Security Warning!</h4>
                <p>This private key is displayed for educational purposes only. Do not use this wallet for real funds. Anyone with this private key can access your wallet and steal your funds.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Receive address={wallet.address} />
            <Send privateKey={wallet.privateKey} />
          </div>
        </div>
      ) : (
        <p>Loading wallet...</p>
      )}
    </main>
  );
}