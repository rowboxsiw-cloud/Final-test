
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, Transaction } from '../types';
import { db } from '../services/firebase';
import { ref, get, update, push, set, runTransaction } from 'firebase/database';

interface TransferProps {
  profile: UserProfile | null;
}

const Transfer: React.FC<TransferProps> = ({ profile }) => {
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTransfer = async () => {
    if (!profile) return;
    const sendAmount = parseFloat(amount);

    if (!upiId || isNaN(sendAmount) || sendAmount <= 0) {
      alert("Invalid UPI ID or Amount");
      return;
    }

    if (sendAmount > profile.balance) {
      alert("Insufficient funds");
      return;
    }

    setLoading(true);

    try {
      // Find receiver by UPI ID
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);
      let receiver: UserProfile | null = null;
      
      if (snapshot.exists()) {
        const users = snapshot.val();
        for (let uid in users) {
          if (users[uid].upiId === upiId) {
            receiver = users[uid];
            break;
          }
        }
      }

      if (!receiver) {
        alert("User with this UPI ID not found.");
        setLoading(false);
        return;
      }

      if (receiver.uid === profile.uid) {
        alert("You cannot send money to yourself.");
        setLoading(false);
        return;
      }

      // Perform Atomic Update
      const senderRef = ref(db, `users/${profile.uid}`);
      const receiverRef = ref(db, `users/${receiver.uid}`);

      // Transaction Record
      const transRef = push(ref(db, 'transactions'));
      const transData: Transaction = {
        id: transRef.key || Date.now().toString(),
        senderUid: profile.uid,
        senderName: profile.displayName,
        senderUpiId: profile.upiId,
        receiverUid: receiver.uid,
        receiverName: receiver.displayName,
        receiverUpiId: receiver.upiId,
        amount: sendAmount,
        timestamp: Date.now(),
        note: note,
        status: 'SUCCESS'
      };

      await update(senderRef, { balance: profile.balance - sendAmount });
      await update(receiverRef, { balance: receiver.balance + sendAmount });
      await set(transRef, transData);

      alert("Payment Successful!");
      navigate('/');
    } catch (error) {
      console.error(error);
      alert("Transaction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="p-6 flex items-center gap-4 border-b">
        <button onClick={() => navigate('/')} className="text-slate-600 hover:text-blue-600">
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>
        <h2 className="text-xl font-bold text-slate-800">Transfer Money</h2>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
          <p className="text-xs text-blue-600 font-bold mb-1">AVAILABLE BALANCE</p>
          <p className="text-2xl font-bold text-slate-800">₹{profile?.balance.toFixed(2)}</p>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">Receiver UPI ID</label>
          <input 
            type="text"
            placeholder="example123@swiftpay"
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:outline-none focus:border-blue-500 transition-all font-medium"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">Amount (₹)</label>
          <input 
            type="number"
            placeholder="0.00"
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:outline-none focus:border-blue-500 transition-all font-bold text-3xl"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">Add a Note (Optional)</label>
          <input 
            type="text"
            placeholder="What's this for?"
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:outline-none focus:border-blue-500 transition-all"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <button 
          onClick={handleTransfer}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-5 rounded-3xl font-bold text-lg shadow-xl shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-shield-check"></i>}
          {loading ? "Processing..." : "Pay Securely"}
        </button>
      </div>
    </div>
  );
};

export default Transfer;
