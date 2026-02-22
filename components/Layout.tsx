
import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Icons } from '../constants';
import { Storage, Notification } from '../services/storage';

interface LayoutProps {
  children: ReactNode;
  activePage: string;
}

const SidebarLink: React.FC<{ to: string; icon: React.FC; label: string }> = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        isActive
          ? `bg-[#00E65A15] text-[#00E65A] font-semibold shadow-sm`
          : `text-gray-500 hover:bg-gray-50 hover:text-gray-900`
      }`
    }
  >
    <Icon />
    <span className="text-sm">{label}</span>
  </NavLink>
);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(Storage.getUser());
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>(Storage.getNotifications());
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Refresh user data if location changes (might have updated in settings)
    setUser(Storage.getUser());
    setNotifs(Storage.getNotifications());
  }, [location]);

  const handleLogout = () => {
    Storage.setUser(null);
    navigate('/');
  };

  const markRead = () => {
    Storage.markNotifsRead();
    setNotifs(Storage.getNotifications());
  };

  const stats = Storage.getStats();
  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-gray-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col fixed h-full z-40">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00E65A] rounded-xl flex items-center justify-center shadow-lg shadow-[#00E65A30]">
             <span className="text-white font-bold text-xl">S</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">SpendSense</h1>
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 mb-4">Main Menu</p>
          <SidebarLink to="/dashboard" icon={Icons.Lock} label="Dashboard" />
          <SidebarLink to="/savings" icon={Icons.Savings} label="Analysis" />
          
          <div className="pt-8">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 mb-4">Personal</p>
            <SidebarLink to="/settings" icon={Icons.Settings} label="Settings" />
            <SidebarLink to="/profile" icon={Icons.Profile} label="My Profile" />
          </div>
        </nav>

        <div className="p-6 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-72 p-10 overflow-y-auto min-h-screen">
        <header className="flex justify-between items-center mb-10 relative">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Hello, {user.name.split(' ')[0]} 👋</h2>
            <p className="text-sm text-gray-400 mt-1 font-medium">
              You've saved <span className="text-[#00E65A] font-bold">₹{stats.totalSaved.toLocaleString()}</span> so far. Keep it up!
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => { setIsNotifOpen(!isNotifOpen); if(!isNotifOpen) markRead(); }}
                className={`p-3 rounded-2xl border transition-all relative ${isNotifOpen ? 'bg-white border-[#00E65A] shadow-sm' : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'}`}
              >
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {unreadCount}
                  </span>
                )}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <span className="font-bold">Notifications</span>
                    <span className="text-[10px] font-black text-[#00E65A] uppercase bg-[#00E65A10] px-2 py-0.5 rounded">Recent</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifs.length === 0 ? (
                      <div className="p-10 text-center text-gray-400 text-sm">No notifications yet</div>
                    ) : (
                      notifs.map(n => (
                        <div key={n.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <p className="text-sm text-gray-800 font-medium">{n.text}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{new Date(n.time).toLocaleTimeString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1.5 pr-4 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 shadow-sm transition-all"
              >
                <img
                  src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"}
                  alt="avatar"
                  className="w-10 h-10 rounded-xl bg-gray-100 object-cover"
                />
                <div className="text-left hidden md:block">
                  <p className="text-xs font-black text-gray-900 leading-none">{user.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Premium User</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-4 w-56 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <button onClick={() => { navigate('/profile'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-[#00E65A10] hover:text-[#00E65A] rounded-xl transition-all font-semibold">
                      <Icons.Profile /> Profile Details
                    </button>
                    <button onClick={() => { navigate('/settings'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-[#00E65A10] hover:text-[#00E65A] rounded-xl transition-all font-semibold">
                      <Icons.Settings /> Settings
                    </button>
                  </div>
                  <div className="p-2 border-t border-gray-50">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="pb-20">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
