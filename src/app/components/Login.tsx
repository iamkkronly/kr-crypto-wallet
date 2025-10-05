'use client';

import { useState } from 'react';

interface LoginProps {
  onLogin: (privateKey: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [privateKey, setPrivateKey] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    if (!privateKey.trim()) {
      setError('Private key cannot be empty.');
      return;
    }
    // Basic validation for a hex string, private keys are typically 64 hex characters
    if (!/^(0x)?[0-9a-fA-F]{64}$/.test(privateKey.trim())) {
      setError('Invalid private key format.');
      return;
    }
    setError(null);
    onLogin(privateKey.trim());
  };

  return (
    <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Login with Private Key</h2>
      <div className="mb-4">
        <label htmlFor="privateKey" className="block mb-2 text-sm font-medium text-gray-900">
          Enter Your Private Key
        </label>
        <input
          type="password" // Use password type to obscure the key
          id="privateKey"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="0x..."
        />
      </div>
      {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
      <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
        <span className="font-bold">Security Warning!</span> Never enter your private key on a website you do not trust. This is for demonstration purposes only.
      </div>
      <button
        onClick={handleLogin}
        className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Login
      </button>
    </div>
  );
};

export default Login;