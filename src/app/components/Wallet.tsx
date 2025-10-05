'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Receive from './Receive';
import Send from './Send';

const Wallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    setError(null);
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        const balance = await provider.getBalance(address);
        setBalance(ethers.formatEther(balance));
      } catch (err: any) {
        setError(err.message);
      }
    } else {
      setError('Please install MetaMask!');
    }
  };

  return (
    <div className="p-4 m-4 border rounded-lg">
      {account ? (
        <div>
          <p><strong>Connected Account:</strong> {account}</p>
          <p><strong>Balance:</strong> {balance} ETH</p>
          <Receive address={account} />
          <Send />
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Connect Wallet
        </button>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Wallet;