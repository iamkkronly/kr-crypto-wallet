'use client';

import { useState } from 'react';
import { ethers } from 'ethers';

const Send = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSend = async () => {
    setError(null);
    setSuccess(null);
    if (typeof window.ethereum !== 'undefined' && recipient && amount) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const tx = await signer.sendTransaction({
          to: recipient,
          value: ethers.parseEther(amount),
        });
        setSuccess(`Transaction sent! Hash: ${tx.hash}`);
        setRecipient('');
        setAmount('');
      } catch (err: any) {
        setError(err.message);
      }
    } else {
      setError('Please fill in all fields and ensure MetaMask is connected.');
    }
  };

  return (
    <div className="p-4 mt-4 border rounded-lg">
      <h3 className="text-lg font-bold mb-2">Send Funds</h3>
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
        />
      </div>
      <button
        onClick={handleSend}
        className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Send
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-500 mt-4">{success}</p>}
    </div>
  );
};

export default Send;