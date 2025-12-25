
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserProfile, Transaction } from '../types';
import { db, logout } from '../services/firebase';
import { ref, onValue, query, limitToLast, orderByChild } from 'firebase/database';

interface DashboardProps {
  profile: UserProfile | null;
}

const Dashboard: React.FC<DashboardProps> = ({ profile }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
      const transRef = query(ref(db, 'transactions'), limitToLast(10));
      onValue(transRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list: Transaction[] = Object.values(data);
          // Filter transactions for this user
          const userList = list.filter(t => t.senderUid === profile.uid || t.receiverUid === profile.uid);
          setTransactions(userList.sort((a, b) => b.timestamp - a.timestamp));
        }
      });
    }
  }, [profile]);

  if (!profile) return null;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-blue-600 pt-6 pb-20 px-6 rounded-b-[40px] shadow-lg relative">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <img src={profile.photoURL} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
            <div>
              <p className="text-blue-100 text-xs font-medium">Welcome back,</p>
              <h2 className="text-white font-bold">{profile.displayName}</h2>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/admin')} className="text-white bg-white/20 p-2 rounded-lg hover:bg-white/30">
              <i className="fa-solid fa-gear"></i>
            </button>
            <button onClick={() => logout()} className="text-white bg-white/20 p-2 rounded-lg hover:bg-white/30">
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-md border border-white/20 shadow-xl">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Balance</p>
              <h1 className="text-4xl font-bold text-white tracking-tight">₹{profile.balance.toFixed(2)}</h1>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-[10px] uppercase font-bold tracking-widest mb-1">UPI ID</p>
              <p className="text-white font-medium text-xs bg-blue-700/50 px-3 py-1 rounded-full border border-white/10">{profile.upiId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 -mt-10">
        <div className="bg-white rounded-3xl p-6 shadow-xl grid grid-cols-4 gap-4">
          <Link to="/scan" className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-active:scale-90 transition-transform shadow-sm">
              <i className="fa-solid fa-qrcode text-xl"></i>
            </div>
            <span className="text-[10px] font-bold text-slate-600">Scan</span>
          </Link>
          <Link to="/transfer" className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center group-active:scale-90 transition-transform shadow-sm">
              <i className="fa-solid fa-paper-plane text-xl"></i>
            </div>
            <span className="text-[10px] font-bold text-slate-600">Send</span>
          </Link>
          <Link to="/my-qr" className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-active:scale-90 transition-transform shadow-sm">
              <i className="fa-solid fa-wallet text-xl"></i>
            </div>
            <span className="text-[10px] font-bold text-slate-600">Receive</span>
          </Link>
          <button onClick={() => alert("Interest is credited daily automatically!")} className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center group-active:scale-90 transition-transform shadow-sm">
              <i className="fa-solid fa-chart-line text-xl"></i>
            </div>
            <span className="text-[10px] font-bold text-slate-600">Earnings</span>
          </button>
        </div>
      </div>

      {/* Rewards Banner */}
      <div className="px-6 mt-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 flex items-center justify-between text-white shadow-lg overflow-hidden relative">
          <div className="relative z-10">
            <p className="text-xs font-bold opacity-80">DAILY REWARD</p>
            <h3 className="text-lg font-bold">Earn 3.65% Annually</h3>
            <p className="text-[10px] mt-1">Interest credited every 24 hours.</p>
          </div>
          <i className="fa-solid fa-gift text-5xl opacity-20 absolute -right-2 top-2"></i>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-6 mt-8 pb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800">Recent Transactions</h3>
          <button className="text-blue-600 text-xs font-bold">See All</button>
        </div>

        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border-2 border-dashed border-slate-200">
               <i className="fa-solid fa-receipt text-4xl text-slate-200 mb-3"></i>
               <p className="text-slate-400 text-sm">No transactions yet.</p>
            </div>
          ) : (
            transactions.map((t) => (
              <div key={t.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.senderUid === profile.uid ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                    <i className={`fa-solid ${t.senderUid === profile.uid ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {t.senderUid === profile.uid ? `To: ${t.receiverName}` : `From: ${t.senderName}`}
                    </p>
                    <p className="text-[10px] text-slate-400">{new Date(t.timestamp).toLocaleDateString()} • {new Date(t.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${t.senderUid === profile.uid ? 'text-slate-800' : 'text-green-600'}`}>
                    {t.senderUid === profile.uid ? '-' : '+'}₹{t.amount}
                  </p>
                  <p className="text-[10px] text-blue-500 font-bold uppercase tracking-tight">Success</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
