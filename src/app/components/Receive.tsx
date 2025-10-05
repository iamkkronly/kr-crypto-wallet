'use client';

import { QRCode } from 'qrcode.react';

interface ReceiveProps {
  address: string;
}

const Receive = ({ address }: ReceiveProps) => {
  return (
    <div className="p-4 mt-4 border rounded-lg">
      <h3 className="text-lg font-bold mb-2">Receive Funds</h3>
      <p className="mb-4">Share your address or QR code to receive funds.</p>
      <div className="flex items-center justify-center mb-4">
        <QRCode value={address} size={128} />
      </div>
      <p className="text-sm text-center break-all">{address}</p>
    </div>
  );
};

export default Receive;