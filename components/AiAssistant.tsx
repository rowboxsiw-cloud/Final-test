
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { chatWithAi, getFinancialAdvice } from '../services/geminiService';
import { db } from '../services/firebase';
import { ref, get } from 'firebase/database';

interface AiAssistantProps {
  profile: UserProfile | null;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ profile }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: `Hi ${profile?.displayName}! I'm your SwiftPay AI assistant. How can I help you today?` }
  ]);
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState('Analyzing your spending...');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profile) {
      // Get initial advice
      const fetchAdvice = async () => {
        const transRef = ref(db, 'transactions');
        const snap = await get(transRef);
        let userTrans = [];
        if (snap.exists()) {
          userTrans = Object.values(snap.val() as any).filter((t: any) => t.senderUid === profile.uid || t.receiverUid === profile.uid);
        }
        const text = await getFinancialAdvice(profile.balance, userTrans);
        setAdvice(text || 'No data yet.');
      };
      fetchAdvice();
    }
  }, [profile]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
    const aiResponse = await chatWithAi(history, userMsg);
    
    setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <div className="p-6 bg-blue-600 text-white rounded-b-[30px] shadow-lg">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <i className="fa-solid fa-wand-magic-sparkles"></i>
          AI Financial Coach
        </h2>
        <div className="mt-4 p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 text-xs">
          <p className="font-bold mb-1 opacity-80 uppercase tracking-widest">Personal Insight</p>
          <p className="line-clamp-3 leading-relaxed">{advice}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-2">
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-6 pb-24">
        <div className="flex gap-2 bg-white p-2 rounded-[25px] shadow-lg border border-slate-100">
          <input 
            type="text" 
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 focus:outline-none text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 active:scale-90 transition-transform"
          >
            <i className="fa-solid fa-paper-plane text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
