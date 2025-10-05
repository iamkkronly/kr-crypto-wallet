'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Send from './components/Send';
import Receive from './components/Receive';

export default function Home() {
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null);

  useEffect(() => {
    const newWallet = ethers.Wallet.createRandom();
    setWallet(newWallet);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Crypto Wallet</h1>
      {wallet ? (
        <div className="w-full max-w-2xl">
          <div className="p-4 mb-4 border rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Your New Wallet</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Public Address</h3>
                <p className="text-sm break-all bg-gray-100 p-2 rounded">{wallet.address}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Private Key</h3>
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
        <p>Generating wallet...</p>
      )}
    </main>
  );
}