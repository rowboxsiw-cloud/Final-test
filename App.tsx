
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
// modular imports for Auth
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { ref, onValue, set, update } from 'firebase/database';
import { auth, db, logout } from './services/firebase';
import { UserProfile } from './types';

// Components
import Dashboard from './components/Dashboard';
import Transfer from './components/Transfer';
import QRScanner from './components/QRScanner';
import QRView from './components/QRView';
import AdminPanel from './components/AdminPanel';
import AiAssistant from './components/AiAssistant';
import Login from './components/Login';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged should be called directly as a function in modular SDK
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const userRef = ref(db, `users/${u.uid}`);
        
        // Listen to profile changes
        onValue(userRef, async (snapshot) => {
          if (snapshot.exists()) {
            setProfile(snapshot.val());
          } else {
            // New User Registration
            const newUser: UserProfile = {
              uid: u.uid,
              email: u.email || '',
              displayName: u.displayName || 'User',
              photoURL: u.photoURL || `https://picsum.photos/seed/${u.uid}/100`,
              upiId: `${u.email?.split('@')[0]}${Math.floor(100 + Math.random() * 900)}@swiftpay`,
              balance: 30, // ₹30 Bonus
              lastInterestDate: Date.now(),
              joinedAt: Date.now()
            };
            await set(userRef, newUser);
            setProfile(newUser);
          }
        });
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Interest Calculation Hook
  useEffect(() => {
    if (profile) {
      const now = Date.now();
      const lastInterest = profile.lastInterestDate;
      const msPerDay = 24 * 60 * 60 * 1000;
      
      if (now - lastInterest >= msPerDay) {
        const days = Math.floor((now - lastInterest) / msPerDay);
        const interestRate = 0.0001; // 0.01% daily
        const interest = profile.balance * interestRate * days;
        
        if (interest > 0) {
          update(ref(db, `users/${profile.uid}`), {
            balance: profile.balance + interest,
            lastInterestDate: now
          });
          console.log(`Earned ₹${interest.toFixed(2)} interest!`);
        }
      }
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mb-4"></div>
          <p className="text-white font-medium">SwiftPay Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="max-w-md mx-auto min-h-screen bg-slate-50 relative pb-20 shadow-xl overflow-hidden">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Dashboard profile={profile} /> : <Navigate to="/login" />} />
          <Route path="/transfer" element={user ? <Transfer profile={profile} /> : <Navigate to="/login" />} />
          <Route path="/scan" element={user ? <QRScanner profile={profile} /> : <Navigate to="/login" />} />
          <Route path="/my-qr" element={user ? <QRView profile={profile} /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user ? <AdminPanel user={user} /> : <Navigate to="/login" />} />
          <Route path="/ai" element={user ? <AiAssistant profile={profile} /> : <Navigate to="/login" />} />
        </Routes>

        {user && (
          <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t flex justify-around py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            <Link to="/" className="flex flex-col items-center text-slate-500 hover:text-blue-600 transition-colors">
              <i className="fa-solid fa-house text-xl"></i>
              <span className="text-[10px] mt-1 font-medium">Home</span>
            </Link>
            <Link to="/scan" className="flex flex-col items-center -mt-8 bg-blue-600 text-white p-4 rounded-full shadow-lg border-4 border-slate-50 hover:bg-blue-700 transition-transform hover:scale-110">
              <i className="fa-solid fa-qrcode text-2xl"></i>
            </Link>
            <Link to="/ai" className="flex flex-col items-center text-slate-500 hover:text-blue-600 transition-colors">
              <i className="fa-solid fa-robot text-xl"></i>
              <span className="text-[10px] mt-1 font-medium">AI Help</span>
            </Link>
          </nav>
        )}
      </div>
    </HashRouter>
  );
};

export default App;
