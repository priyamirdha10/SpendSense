
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Storage } from '../services/storage';
import { Github } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    Storage.setUser({
      id: '1',
      name: 'Alex Johnson',
      email: email || 'alex@example.com',
      avatar: 'https://picsum.photos/40/40'
    });
    navigate('/dashboard');
  };

  const handleGithubLogin = async () => {
    try {
      const response = await fetch('/api/auth/github/url');
      if (!response.ok) throw new Error('Failed to get auth URL');
      const { url } = await response.json();

      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const authWindow = window.open(
        url,
        'github_oauth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!authWindow) {
        alert('Please allow popups for this site to connect your account.');
      }
    } catch (error) {
      console.error('GitHub login error:', error);
      alert('Failed to initiate GitHub login');
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin
      if (!event.origin.endsWith('.run.app') && !event.origin.includes('localhost')) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const { user } = event.data;
        Storage.setUser(user);
        navigate('/dashboard');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F0FDF4] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
        <div className="flex items-center justify-center gap-2 mb-8">
           <div className="w-10 h-10 bg-[#00E65A] rounded-xl flex items-center justify-center text-white font-bold text-xl">S</div>
           <span className="text-2xl font-bold tracking-tight">SpendSense</span>
        </div>

        <h2 className="text-xl font-bold text-center mb-8">Log in to your account</h2>

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition-colors mb-3"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          <span className="font-medium">Sign in with Google</span>
        </button>

        <button
          onClick={handleGithubLogin}
          className="w-full flex items-center justify-center gap-3 bg-[#24292F] text-white py-3 rounded-xl hover:bg-[#1a1e22] transition-colors mb-6"
        >
          <Github className="w-5 h-5" />
          <span className="font-medium">Sign in with GitHub</span>
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">OR</span></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00E65A] focus:ring-1 focus:ring-[#00E65A] outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00E65A] focus:ring-1 focus:ring-[#00E65A] outline-none transition-all"
            />
          </div>
          <div className="text-right">
             <a href="#" className="text-sm text-gray-500 hover:text-black">Forgot password?</a>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors mt-4"
          >
            Log in
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Don't have an account? <a href="#" className="text-[#00E65A] font-bold">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
