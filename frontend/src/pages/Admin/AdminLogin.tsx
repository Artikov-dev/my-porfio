import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useSocketContext } from '@/contexts/SocketContext';
import { Lock, Mail, Key, ShieldCheck } from 'lucide-react';

const getErrorMessage = (err: any) => {
  if (!err?.response) return 'Server is not responding (it may be waking up). Please try again in a moment.';
  if (err.response.status === 429) return 'Too many attempts. Please try again later.';
  if (err.response.status === 503) return 'Admin login is not configured on the server.';
  return err.response.data?.message || 'Access Denied. Invalid credentials.';
};

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { socket } = useSocketContext();

  const onAuthenticated = () => {
    localStorage.setItem('isAdmin', 'true'); // UI hint only — access is always verified by the server
    // Reconnect so the socket handshake carries the new auth cookie (admin chat room)
    socket?.disconnect().connect();
    navigate('/admin/dashboard');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    try {
      await api.post('/auth/verify-2fa', { token: otp.trim() });
      onAuthenticated();
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err));
      setStatus('error');
      if (err?.response?.status === 401 && /expired/i.test(err.response.data?.message || '')) {
        setStep('credentials');
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setErrorMessage('Please enter both email and passcode.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    
    try {
      // Authentication is decided by the server only — there is no client-side fallback
      const res = await api.post('/auth/login', { email: cleanEmail, password: cleanPass });
      if (res.data?.data?.require2FA) {
        setStep('otp');
        setStatus('idle');
        return;
      }
      onAuthenticated();
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err));
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
            <h1 className="text-2xl font-bold text-foreground dark:text-white">System Override</h1>
            <p className="text-foreground/60 text-sm mt-2">Enter credentials to access the command center</p>
          </div>

          {step === 'otp' ? (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Authenticator Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                autoFocus
                autoComplete="one-time-code"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground dark:text-white text-center text-2xl tracking-[0.5em] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                placeholder="000000"
              />
            </div>

            {status === 'error' && (
              <div className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading' || otp.length !== 6}
              className="w-full bg-primary text-white font-medium py-3 rounded-xl hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(94,142,203,0.3)] cursor-pointer"
            >
              {status === 'loading' ? 'Verifying...' : 'Verify'}
            </button>
          </form>
          ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Operator Email
              </label>
              <input 
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                placeholder="you@example.com"
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
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                placeholder="••••••••"
              />
            </div>

            {status === 'error' && (
              <div className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">
                {errorMessage || 'Access Denied. Invalid credentials.'}
              </div>
            )}

            <button 
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-primary text-white font-medium py-3 rounded-xl hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(94,142,203,0.3)] cursor-pointer"
            >
              {status === 'loading' ? 'Authenticating...' : 'Initialize Uplink'}
            </button>
          </form>
          )}
        </div>
      </div>
    </div>
  );
};

