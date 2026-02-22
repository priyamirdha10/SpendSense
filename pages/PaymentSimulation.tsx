
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Storage } from '../services/storage';

const PaymentSimulation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const lockId = searchParams.get('id');
  const [method, setMethod] = useState('upi');
  const [isPaying, setIsPaying] = useState(false);

  const handlePay = () => {
    setIsPaying(true);
    setTimeout(() => {
      // Process penalty
      const locks = Storage.getLocks();
      const updatedLocks = locks.map(l => {
        if (l.id === lockId) return { ...l, status: 'broken' as const };
        return l;
      });
      Storage.saveLocks(updatedLocks);
      Storage.addNotification("Penalty of ₹2,000 paid for breaking a lock early.");

      setIsPaying(false);
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-[48px] shadow-2xl shadow-gray-200/50 p-12 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
        
        <button onClick={() => navigate(-1)} className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 mb-10 hover:text-gray-900 transition-colors">
          ← ABORT TRANSACTION
        </button>

        <h1 className="text-4xl font-black text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-400 font-medium mb-12 uppercase text-[10px] tracking-widest">Mindful Friction Payment</p>

        <div className="bg-gray-900 p-10 rounded-[40px] shadow-xl shadow-gray-900/10 flex justify-between items-center mb-12 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
           <div>
              <p className="text-[10px] font-black text-[#00E65A] uppercase tracking-[0.3em] mb-2">Mandatory Penalty</p>
              <p className="text-6xl font-black text-white tracking-tighter">₹2,000</p>
              <p className="text-[10px] text-gray-500 mt-4 font-bold tracking-widest uppercase">TXN ID: {Math.random().toString(36).substr(2, 12).toUpperCase()}</p>
           </div>
           <div className="text-6xl">💸</div>
        </div>

        <div className="space-y-6 mb-12">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 mb-4 flex items-center gap-3">
             <span className="w-5 h-5 bg-[#00E65A] rounded-full flex items-center justify-center text-white text-[10px]">✓</span>
             Select Payment Gateway
          </h3>

          {[
            { id: 'upi', name: 'Instant UPI', desc: 'Secure smartphone authorization', icon: '📱' },
            { id: 'card', name: 'Vault Card', desc: 'Encrypted credit/debit access', icon: '💳' },
          ].map((item) => (
            <label key={item.id} className={`flex items-center gap-6 p-6 border rounded-[32px] cursor-pointer transition-all ${method === item.id ? 'border-[#00E65A] bg-[#00E65A05] ring-4 ring-[#00E65A05]' : 'border-gray-50 bg-gray-50/50 hover:border-gray-200'}`}>
              <input
                type="radio"
                name="payment"
                className="hidden"
                checked={method === item.id}
                onChange={() => setMethod(item.id)}
              />
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl">{item.icon}</div>
              <div className="flex-1">
                <p className="font-black text-gray-900">{item.name}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{item.desc}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${method === item.id ? 'border-[#00E65A]' : 'border-gray-200'}`}>
                {method === item.id && <div className="w-3 h-3 bg-[#00E65A] rounded-full"></div>}
              </div>
            </label>
          ))}
        </div>

        <button
          onClick={handlePay}
          disabled={isPaying}
          className="w-full bg-[#00E65A] text-white py-7 rounded-[32px] font-black text-xl flex items-center justify-center gap-4 hover:bg-[#00C84D] hover:shadow-2xl hover:shadow-[#00E65A40] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isPaying ? (
            <>
              <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              PROCESSING...
            </>
          ) : (
            <>AUTHORIZE PAYMENT 🔒</>
          )}
        </button>

        <p className="text-center text-gray-300 text-[10px] font-black uppercase tracking-[0.3em] mt-12">
          Encrypted • Secure • Mindful
        </p>
      </div>
    </div>
  );
};

export default PaymentSimulation;
