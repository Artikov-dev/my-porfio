import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Lock, Mail, Key } from 'lucide-react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      await api.post('/auth/login', { email, password });
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      
      <div className="w-full max-w-md z-10">
        <div className="glass border border-white/5 p-8 rounded-3xl shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500 opacity-50"></div>
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 border border-primary/30">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-white">System Override</h1>
            <p className="text-foreground/60 text-sm mt-2">Enter credentials to access the command center</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Operator Email
              </label>
              <input 
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                placeholder="operator@system.com"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                <Key className="w-4 h-4" /> Passcode
              </label>
              <input 
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                placeholder="••••••••"
              />
            </div>

            {status === 'error' && (
              <div className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">
                Access Denied. Invalid credentials.
              </div>
            )}

            <button 
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-primary text-white font-medium py-3 rounded-xl hover:bg-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(20,184,166,0.2)]"
            >
              {status === 'loading' ? 'Authenticating...' : 'Initialize Uplink'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
