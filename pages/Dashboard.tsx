
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Icons } from '../constants';
import { Storage } from '../services/storage';
import { LockedProduct, LockDuration, SpendingStats } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [duration, setDuration] = useState<LockDuration>(LockDuration.THIRTY_DAYS);
  const [locks, setLocks] = useState<LockedProduct[]>([]);
  const [stats, setStats] = useState<SpendingStats>(Storage.getStats());
  const [showBreakModal, setShowBreakModal] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLocks(Storage.getLocks());
    setStats(Storage.getStats());
  }, []);

  const handleLock = async () => {
    if (!url) return;
    setIsSubmitting(true);
    
    // Simulate API delay for premium feel
    await new Promise(r => setTimeout(r, 800));

    const domain = url.includes('://') ? url.split('/')[2] : url.split('/')[0];
    const newLock: LockedProduct = {
      id: Math.random().toString(36).substr(2, 9),
      url,
      name: domain.replace('www.', '').split('.')[0].toUpperCase() + " ITEM",
      price: Math.floor(Math.random() * 20000) + 1500,
      lockedAt: Date.now(),
      duration,
      expiresAt: Date.now() + duration * 24 * 60 * 60 * 1000,
      status: 'locked'
    };

    const updatedLocks = [newLock, ...locks];
    setLocks(updatedLocks);
    Storage.saveLocks(updatedLocks);
    Storage.addNotification(`Locked new purchase for ${duration} days. Stay strong!`);
    
    setStats(Storage.getStats());
    setUrl('');
    setIsSubmitting(false);
  };

  const handleBreakLock = (id: string) => {
    setShowBreakModal(id);
  };

  const confirmBreak = () => {
    if (showBreakModal) {
      navigate(`/payment?id=${showBreakModal}`);
    }
  };

  const activeLocks = locks.filter(l => l.status === 'locked');
  const completedLocks = locks.filter(l => l.status === 'completed');

  return (
    <Layout activePage="dashboard">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5 group hover:border-[#00E65A20] transition-all">
             <div className="w-14 h-14 bg-[#00E65A10] text-[#00E65A] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><Icons.Lock /></div>
             <div>
                <p className="text-2xl font-black text-gray-900">{stats.totalLocked}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Locks</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5 group hover:border-[#00E65A20] transition-all">
             <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">🏆</div>
             <div>
                <p className="text-2xl font-black text-gray-900">{stats.totalCompleted}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Won Challenges</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5 group hover:border-red-100 transition-all">
             <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">⚖️</div>
             <div>
                <p className="text-2xl font-black text-gray-900">{stats.totalBroken}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Failed Efforts</p>
             </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-gray-200/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E65A05] rounded-full -mr-32 -mt-32"></div>
          
          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex-1 space-y-8">
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Initialize Discipline</h3>
                <p className="text-sm text-gray-400 font-medium">Pause the impulse, think it over, save your future wealth.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Shopping URL</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#00E65A] transition-colors">
                       <Icons.Link />
                    </div>
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Amazon, Flipkart, Blinkit link..."
                      className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#00E65A] focus:ring-4 focus:ring-[#00E65A10] outline-none transition-all font-medium text-gray-700 placeholder-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Gratification Delay</label>
                  <div className="flex gap-3 bg-gray-50 p-2 rounded-2xl">
                    {[
                      { value: LockDuration.THREE_DAYS, label: '3 Days', color: 'bg-orange-50 text-orange-600' },
                      { value: LockDuration.SEVEN_DAYS, label: '1 Week', color: 'bg-blue-50 text-blue-600' },
                      { value: LockDuration.THIRTY_DAYS, label: '1 Month', color: 'bg-purple-50 text-purple-600' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setDuration(opt.value)}
                        className={`flex-1 py-4 rounded-xl text-sm font-black transition-all ${
                          duration === opt.value
                            ? 'bg-white text-gray-900 shadow-lg'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleLock}
                  disabled={isSubmitting || !url}
                  className="w-full bg-[#00E65A] text-white py-6 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-[#00C84D] hover:shadow-xl hover:shadow-[#00E65A30] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Icons.Lock />
                      LOCK PURCHASE NOW
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="w-full md:w-80 bg-[#F9FAFB] rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-gray-200">
               <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-4xl mb-2">🧠</div>
               <h4 className="font-black text-gray-900">Psychology Tip</h4>
               <p className="text-xs text-gray-500 font-medium leading-relaxed italic">
                 "90% of impulse purchases are forgotten within 48 hours. By waiting 7 days, you're 84% more likely to decide you don't actually need the item."
               </p>
               <div className="w-full h-1 bg-gray-200 rounded-full mt-4 overflow-hidden">
                  <div className="w-3/4 h-full bg-[#00E65A]"></div>
               </div>
            </div>
          </div>
        </div>

        {/* Lists Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Active Challenges */}
          <div className="space-y-6">
            <div className="flex justify-between items-end px-2">
               <h3 className="text-xl font-black text-gray-900">Active Cool-downs</h3>
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{activeLocks.length} Tracking</span>
            </div>
            
            <div className="space-y-4">
              {activeLocks.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-100 rounded-3xl p-12 text-center">
                   <p className="text-gray-300 font-bold">No active locks. Time to start saving!</p>
                </div>
              ) : (
                activeLocks.map(lock => (
                  <div key={lock.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-[#00E65A] transition-all group flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform">📦</div>
                       <div>
                          <p className="font-black text-gray-900 truncate max-w-[150px]">{lock.name}</p>
                          <p className="text-sm font-bold text-[#00E65A]">₹{lock.price.toLocaleString()}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-gray-300 uppercase tracking-tighter mb-1">Unlocks in</p>
                       <p className="text-lg font-black text-gray-900 mb-2">{Math.ceil((lock.expiresAt - Date.now()) / (1000 * 60 * 60 * 24))} Days</p>
                       <button
                         onClick={() => handleBreakLock(lock.id)}
                         className="text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1.5 rounded-full transition-colors"
                       >
                         Break Lock
                       </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Success Stories */}
          <div className="space-y-6">
            <div className="flex justify-between items-end px-2">
               <h3 className="text-xl font-black text-gray-900">Success History</h3>
               <span className="text-[10px] font-black text-[#00E65A] uppercase tracking-widest">Achieved</span>
            </div>
            
            <div className="space-y-4">
              {completedLocks.length === 0 ? (
                <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-12 text-center">
                   <p className="text-gray-400 font-medium">Your achievements will appear here.</p>
                </div>
              ) : (
                completedLocks.map(lock => (
                  <div key={lock.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm opacity-80 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-2xl">🏆</div>
                       <div>
                          <p className="font-black text-gray-400 line-through truncate max-w-[150px]">{lock.name}</p>
                          <p className="text-sm font-black text-gray-900">Saved ₹{lock.price.toLocaleString()}</p>
                       </div>
                    </div>
                    <div className="bg-green-100 text-green-700 text-[10px] font-black px-4 py-2 rounded-full uppercase">
                       Challenge Won
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Break Lock Modal */}
      {showBreakModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[48px] max-w-md w-full p-12 text-center shadow-2xl relative animate-in zoom-in duration-300">
            <div className="absolute top-0 left-0 w-full h-3 bg-red-500 rounded-t-[48px]"></div>
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 </svg>
              </div>
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Are you sure?</h2>
            <p className="text-gray-500 mb-10 font-medium leading-relaxed">
              Breaking the lock early incurs a mandatory <span className="font-black text-red-600">₹2,000 penalty</span>. 
              Discipline is the bridge between goals and accomplishment.
            </p>
            <div className="flex flex-col gap-4">
               <button
                 onClick={confirmBreak}
                 className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl shadow-gray-200"
               >
                 I Understand, Pay ₹2,000
               </button>
               <button
                 onClick={() => setShowBreakModal(null)}
                 className="w-full py-5 text-gray-400 font-black hover:text-gray-900 transition-all uppercase tracking-widest text-sm"
               >
                 Wait, I can do this
               </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
