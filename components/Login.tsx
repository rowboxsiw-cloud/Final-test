
import React from 'react';
import { signInWithGoogle } from '../services/firebase';

const Login: React.FC = () => {
  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      alert("Login failed. Check console for details.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-b from-blue-600 to-indigo-700">
      <div className="bg-white/10 p-4 rounded-3xl mb-8 animate-bounce">
        <i className="fa-solid fa-paper-plane text-6xl text-white"></i>
      </div>
      
      <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">SwiftPay</h1>
      <p className="text-blue-100 mb-12 text-center text-lg">Fast. Secure. Rewarding Payments.</p>

      <div className="w-full space-y-4">
        <button 
          onClick={handleLogin}
          className="w-full bg-white text-slate-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:bg-slate-50 active:scale-95 transition-all"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
          Sign in with Google
        </button>
        
        <p className="text-xs text-blue-200 text-center px-4">
          By signing in, you agree to our terms of service and get a ₹30 bonus instantly!
        </p>
      </div>

      <div className="mt-20 flex gap-6">
         <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center text-white">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <span className="text-[10px] text-white">Secure</span>
         </div>
         <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center text-white">
              <i className="fa-solid fa-bolt"></i>
            </div>
            <span className="text-[10px] text-white">Instant</span>
         </div>
         <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center text-white">
              <i className="fa-solid fa-gift"></i>
            </div>
            <span className="text-[10px] text-white">Rewards</span>
         </div>
      </div>
    </div>
  );
};

export default Login;
