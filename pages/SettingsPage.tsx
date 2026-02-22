
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Storage } from '../services/storage';

const SettingsPage: React.FC = () => {
  const [user, setUser] = useState(Storage.getUser());
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [notifications, setNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 600));
    
    const updatedUser = { ...user, name, email };
    Storage.setUser(updatedUser);
    setUser(updatedUser);
    Storage.addNotification("Profile settings updated successfully.");
    
    setIsSaving(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <Layout activePage="settings">
      <div className="max-w-4xl mx-auto space-y-10 pb-20">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-2">Account Control</h2>
            <p className="text-gray-400 font-medium">Manage your personal presence and preferences.</p>
          </div>
          {showToast && (
            <div className="bg-[#00E65A] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#00E65A30] animate-in slide-in-from-right-10 duration-300">
              ✓ Changes Saved
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-10">
           <div className="relative group">
              <div className="w-32 h-32 rounded-[32px] bg-gray-100 overflow-hidden ring-4 ring-gray-50 ring-offset-4 transition-all group-hover:ring-[#00E65A50]">
                <img 
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} 
                  className="w-full h-full object-cover" 
                  alt="avatar" 
                />
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#00E65A] rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
           </div>
           <div className="text-center md:text-left flex-1">
              <h3 className="text-3xl font-black text-gray-900">{user.name}</h3>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Tier: Disciplined Saver</p>
              <div className="flex gap-2 mt-4 justify-center md:justify-start">
                 <div className="bg-[#00E65A10] text-[#00E65A] text-[10px] font-black px-4 py-2 rounded-xl">VERIFIED USER</div>
                 <div className="bg-blue-50 text-blue-500 text-[10px] font-black px-4 py-2 rounded-xl uppercase">Beta Tester</div>
              </div>
           </div>
        </div>

        {/* Form Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
            <h4 className="text-lg font-black text-gray-900">Personal Data</h4>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Legal Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-100 bg-gray-50 rounded-2xl focus:bg-white focus:border-[#00E65A] outline-none transition-all font-bold text-gray-700" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Electronic Mail</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-100 bg-gray-50 rounded-2xl focus:bg-white focus:border-[#00E65A] outline-none transition-all font-bold text-gray-700" 
                />
              </div>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSaving ? 'Syncing...' : 'Update Records'}
              </button>
            </div>
          </div>

          <div className="space-y-10">
            {/* Notifications Toggle */}
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex items-center justify-between group">
               <div>
                 <h4 className="font-black text-gray-900">Smart Alerts</h4>
                 <p className="text-xs text-gray-400 font-medium">Get reminders about ending locks.</p>
               </div>
               <button
                 onClick={() => setNotifications(!notifications)}
                 className={`w-16 h-10 rounded-[20px] transition-all relative ${notifications ? 'bg-[#00E65A] shadow-lg shadow-[#00E65A30]' : 'bg-gray-100'}`}
               >
                 <div className={`absolute top-1.5 w-7 h-7 bg-white rounded-full transition-all shadow-sm flex items-center justify-center ${notifications ? 'left-7.5' : 'left-1.5'}`}>
                    {notifications && <span className="text-[#00E65A] font-black text-[10px]">ON</span>}
                 </div>
               </button>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                 <h4 className="font-black text-gray-900">Billing Interface</h4>
                 <span className="text-[#00E65A] text-[10px] font-black uppercase bg-[#00E65A10] px-3 py-1 rounded-full">Primary</span>
              </div>
              <div className="flex items-center justify-between p-5 bg-gray-50 rounded-3xl border border-gray-100">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-xs font-black text-gray-900 border border-gray-100">
                       UPI
                    </div>
                    <div>
                       <div className="font-black text-gray-900">Google Pay</div>
                       <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">ID: user.77@okaxis</div>
                    </div>
                 </div>
              </div>
              <button className="w-full py-4 text-[10px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-all">
                Add Alternative Method
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 p-10 rounded-[40px] border border-red-100 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="text-center md:text-left">
              <h4 className="font-black text-red-600 mb-1">Critical Operations</h4>
              <p className="text-xs text-red-400 font-medium">Removing your account will result in permanent loss of discipline data.</p>
           </div>
           <button className="bg-white border border-red-200 text-red-500 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
             Exterminate Account
           </button>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
