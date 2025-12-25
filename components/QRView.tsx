
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';

interface QRViewProps {
  profile: UserProfile | null;
}

const QRView: React.FC<QRViewProps> = ({ profile }) => {
  const navigate = useNavigate();

  if (!profile) return null;

  return (
    <div className="bg-blue-600 min-h-screen flex flex-col items-center p-6 pt-12">
      <div className="w-full flex justify-between items-center mb-12">
        <button onClick={() => navigate('/')} className="text-white bg-white/20 p-3 rounded-2xl">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h2 className="text-white font-bold text-xl">My Payment QR</h2>
        <div className="w-10"></div>
      </div>

      <div className="bg-white p-8 rounded-[40px] shadow-2xl w-full flex flex-col items-center">
        <img src={profile.photoURL} className="w-16 h-16 rounded-full border-4 border-slate-50 -mt-16 mb-6 shadow-md" />
        <h3 className="font-bold text-xl text-slate-800">{profile.displayName}</h3>
        <p className="text-slate-400 text-sm mb-8 font-medium">{profile.upiId}</p>

        <div className="w-64 h-64 bg-slate-50 rounded-3xl p-4 border-4 border-blue-50 mb-8 flex items-center justify-center">
          {/* Simulated QR - In a real app we use qrcode.react */}
          <div className="relative">
             <i className="fa-solid fa-qrcode text-[180px] text-slate-800 opacity-90"></i>
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="bg-white p-2 rounded-xl border-2 border-blue-600 shadow-md">
                 <i className="fa-solid fa-paper-plane text-blue-600 text-xl"></i>
               </div>
             </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 font-bold tracking-widest uppercase mb-6">Scan and Pay with SwiftPay</p>

        <div className="flex gap-4 w-full">
           <button className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200">
             <i className="fa-solid fa-share-nodes"></i>
             Share
           </button>
           <button className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200">
             <i className="fa-solid fa-download"></i>
             Save
           </button>
        </div>
      </div>

      <div className="mt-12 text-center">
         <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-white text-xs backdrop-blur-md">
           <i className="fa-solid fa-lock text-[10px]"></i>
           <span>Secure Peer-to-Peer Encryption</span>
         </div>
      </div>
    </div>
  );
};

export default QRView;
