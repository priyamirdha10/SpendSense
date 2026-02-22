
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout';
import { Storage, MOCK_MONTHLY_DATA } from '../services/storage';

const SavingsPage: React.FC = () => {
  const stats = Storage.getStats();

  return (
    <Layout activePage="savings">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-2">Financial Analysis</h2>
            <p className="text-gray-400 font-medium">The mathematics of your discipline and progress.</p>
          </div>
          <div className="bg-white px-6 py-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-3">
             <span className="w-3 h-3 bg-[#00E65A] rounded-full animate-pulse"></span>
             <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Live Sync Enabled</span>
          </div>
        </div>

        {/* Totals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col gap-6 relative overflow-hidden group">
             <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#00E65A08] rounded-full group-hover:scale-125 transition-transform"></div>
             <div className="w-14 h-14 bg-[#00E65A10] text-[#00E65A] rounded-2xl flex items-center justify-center text-3xl">💰</div>
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Savings</p>
                <p className="text-4xl font-black text-gray-900">₹{stats.totalSaved.toLocaleString()}</p>
                <p className="text-[10px] text-[#00E65A] font-bold mt-2">↑ 12.4% vs last period</p>
             </div>
          </div>
          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col gap-6 relative overflow-hidden group">
             <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-red-50 rounded-full group-hover:scale-125 transition-transform"></div>
             <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-3xl">⚠️</div>
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Friction Costs</p>
                <p className="text-4xl font-black text-gray-900">₹{stats.totalPenalties.toLocaleString()}</p>
                <p className="text-[10px] text-red-400 font-bold mt-2">Impulse breaking penalties</p>
             </div>
          </div>
          <div className="bg-gray-900 p-10 rounded-[40px] shadow-2xl shadow-gray-900/20 flex flex-col gap-6 relative overflow-hidden group">
             <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full group-hover:scale-125 transition-transform"></div>
             <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center text-3xl">🎯</div>
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Discipline Score</p>
                <p className="text-4xl font-black text-white">
                  {stats.totalLocked + stats.totalCompleted + stats.totalBroken === 0 
                    ? "N/A" 
                    : Math.round((stats.totalCompleted / (stats.totalCompleted + stats.totalBroken || 1)) * 100)}%
                </p>
                <div className="w-full h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden">
                   <div className="h-full bg-[#00E65A]" style={{ width: `${Math.round((stats.totalCompleted / (stats.totalCompleted + stats.totalBroken || 1)) * 100)}%` }}></div>
                </div>
             </div>
          </div>
        </div>

        {/* Primary Data Visual */}
        <div className="bg-white p-12 rounded-[48px] border border-gray-100 shadow-sm space-y-12">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h3 className="text-2xl font-black text-gray-900">Gratification Chart</h3>
                <p className="text-sm text-gray-400 font-medium">Comparison of avoided spending vs. penalty payments.</p>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-[#00E65A]"></div>
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avoided Cost</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500"></div>
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Penalties</span>
                </div>
              </div>
           </div>

           <div className="h-[450px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_MONTHLY_DATA} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f5f5f5" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#D1D5DB', fontSize: 10, fontWeight: 900 }}
                    dy={20}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#D1D5DB', fontSize: 10, fontWeight: 900 }}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(0, 230, 90, 0.05)', radius: 16 }}
                    contentStyle={{ 
                      borderRadius: '24px', 
                      border: 'none', 
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                      padding: '16px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  />
                  <Bar dataKey="savings" fill="#00E65A" radius={[12, 12, 12, 12]} barSize={32} />
                  <Bar dataKey="penalties" fill="#EF4444" radius={[12, 12, 12, 12]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
           </div>
           
           <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row gap-8 justify-between">
              <div className="flex-1 space-y-4">
                 <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest">Insight Generation</h4>
                 <p className="text-sm text-gray-500 leading-relaxed font-medium">
                   Your discipline has significantly increased in <span className="text-gray-900 font-bold">May</span>. 
                   If this trend continues, your projected annual capital retention will reach <span className="text-[#00E65A] font-bold">₹2,40,000</span>.
                 </p>
              </div>
              <button className="bg-gray-50 px-8 py-4 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:bg-gray-100 hover:text-gray-900 transition-all self-center md:self-end">
                Download Detailed Report
              </button>
           </div>
        </div>
      </div>
    </Layout>
  );
};

export default SavingsPage;
