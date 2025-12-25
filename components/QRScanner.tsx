
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';

interface QRScannerProps {
  profile: UserProfile | null;
}

const QRScanner: React.FC<QRScannerProps> = ({ profile }) => {
  const navigate = useNavigate();
  const [permission, setPermission] = useState<'pending' | 'granted' | 'denied'>('pending');

  useEffect(() => {
    // Simulate camera check
    setTimeout(() => {
      setPermission('granted');
    }, 1500);
  }, []);

  const handleManualEntry = () => {
    navigate('/transfer');
  };

  return (
    <div className="bg-black min-h-screen relative flex flex-col">
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 text-white">
        <button onClick={() => navigate('/')} className="bg-white/20 p-3 rounded-full backdrop-blur-md">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
        <span className="font-bold text-lg">Scan QR Code</span>
        <button className="bg-white/20 p-3 rounded-full backdrop-blur-md">
          <i className="fa-solid fa-bolt"></i>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative px-8">
        <div className="w-full aspect-square relative">
          {/* Scanner Frame */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-blue-500 rounded-tl-3xl"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-blue-500 rounded-tr-3xl"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-blue-500 rounded-bl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-blue-500 rounded-br-3xl"></div>
          
          <div className="w-full h-full flex items-center justify-center bg-white/5 backdrop-blur-[2px]">
            {permission === 'pending' && <p className="text-white/50 animate-pulse text-sm">Requesting camera...</p>}
            {permission === 'granted' && (
              <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                 <div className="w-full h-[2px] bg-blue-400 absolute animate-scan-line shadow-[0_0_15px_#60a5fa]"></div>
                 <i className="fa-solid fa-qrcode text-[200px] text-white/10"></i>
              </div>
            )}
          </div>
        </div>
        <p className="mt-12 text-white/70 text-sm text-center font-medium">Align the QR code within the frame to scan automatically.</p>
      </div>

      <div className="p-10 bg-gradient-to-t from-black to-transparent">
        <button 
          onClick={handleManualEntry}
          className="w-full bg-white text-black py-4 rounded-3xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl"
        >
          <i className="fa-solid fa-keyboard"></i>
          Enter UPI ID Manually
        </button>
      </div>

      <style>{`
        @keyframes scan-line {
          0% { transform: translateY(-150px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(150px); opacity: 0; }
        }
        .animate-scan-line {
          animation: scan-line 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default QRScanner;
