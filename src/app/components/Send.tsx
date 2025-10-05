'use client';

import { useState } from 'react';
import { ethers } from 'ethers';

interface SendProps {
  privateKey: string;
}

const Send = ({ privateKey }: SendProps) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setError(null);
    setSuccess(null);

    if (!recipient || !amount || !privateKey) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      // NOTE: This is highly insecure and for demonstration purposes only.
      // In a real application, you should NEVER handle private keys on the frontend.
      // The private key should be managed in a secure backend or a browser extension like MetaMask.

      // Connect to a public Ethereum provider.
      // For a real application, you would use a reliable provider like Infura or Alchemy.
      // Using a public RPC URL is necessary for the app to work when deployed on Vercel.
      const provider = new ethers.JsonRpcProvider('https://ethereum.public.blockpi.network/v1/rpc/public');
      const wallet = new ethers.Wallet(privateKey, provider);

      // Create and send the transaction.
      const tx = await wallet.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount),
      });

      setSuccess(`Transaction sent! Waiting for confirmation... Hash: ${tx.hash}`);
      await tx.wait(); // Wait for the transaction to be mined.

      setSuccess(`Transaction confirmed! Hash: ${tx.hash}`);
      setRecipient('');
      setAmount('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 mt-4 border rounded-lg">
      <h3 className="text-lg font-bold mb-2">Send Funds (Real Transaction)</h3>
      <div className="mb-4">
        <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
          Recipient Address
        </label>
        <input
          type="text"
          id="recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          disabled={loading}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount (ETH)
        </label>
        <input
          type="text"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          disabled={loading}
        />
      </div>
      <button
        onClick={handleSend}
        className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send'}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-500 mt-4">{success}</p>}
    </div>
  );
};

export default Send;