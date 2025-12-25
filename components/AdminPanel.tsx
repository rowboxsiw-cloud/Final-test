
import React, { useState, useEffect } from 'react';
// Correctly import User as a type to avoid "no exported member" if seen as a value
import type { User } from 'firebase/auth';
import { db } from '../services/firebase';
import { ref, onValue } from 'firebase/database';
import { UserProfile } from '../types';
import { useNavigate } from 'react-router-dom';

interface AdminPanelProps {
  user: User | null;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ user }) => {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const navigate = useNavigate();

  const handleLogin = () => {
    // Hardcoded credentials as requested
    if (password === '117393993987') {
      setAuthorized(true);
    } else {
      alert("Unauthorized Access");
    }
  };

  useEffect(() => {
    if (authorized) {
      const usersRef = ref(db, 'users');
      onValue(usersRef, (snapshot) => {
        if (snapshot.exists()) {
          setUsers(Object.values(snapshot.val()));
        }
      });
    }
  }, [authorized]);

  if (!authorized) {
    return (
      <div className="p-8 min-h-screen bg-slate-900 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm bg-white/5 p-8 rounded-3xl backdrop-blur-xl border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <i className="fa-solid fa-user-shield text-blue-400"></i>
            Admin Access
          </h2>
          <input 
            type="password" 
            placeholder="Enter Admin Pin"
            className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-white focus:outline-none focus:border-blue-500 mb-6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex gap-3">
            <button onClick={() => navigate('/')} className="flex-1 text-slate-400 font-bold">Cancel</button>
            <button 
              onClick={handleLogin}
              className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20"
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Admin Panel</h2>
        <button onClick={() => navigate('/')} className="bg-white p-3 rounded-xl shadow-sm"><i className="fa-solid fa-xmark"></i></button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
           <p className="text-xs text-slate-400 font-bold mb-1">TOTAL USERS</p>
           <h3 className="text-2xl font-bold text-slate-800">{users.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
           <p className="text-xs text-slate-400 font-bold mb-1">TOTAL LIQUIDITY</p>
           <h3 className="text-2xl font-bold text-slate-800">₹{users.reduce((acc, u) => acc + u.balance, 0).toFixed(0)}</h3>
        </div>
      </div>

      <h4 className="font-bold text-slate-600 mb-4 px-2">User Management</h4>
      <div className="space-y-3">
        {users.map(u => (
          <div key={u.uid} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between border border-slate-200">
            <div className="flex items-center gap-3">
              <img src={u.photoURL} className="w-10 h-10 rounded-full" />
              <div>
                <p className="text-sm font-bold text-slate-800">{u.displayName}</p>
                <p className="text-[10px] text-slate-400">{u.upiId}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-blue-600">₹{u.balance.toFixed(2)}</p>
              <button className="text-[10px] bg-red-50 text-red-500 font-bold px-2 py-1 rounded-lg">Reset</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
