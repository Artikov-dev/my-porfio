import React, { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [token2FA, setToken2FA] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.data.require2FA) {
        setStep(2);
      }
    } catch (err) {
      alert('Login failed. Check credentials.');
    }
  };

  const handle2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/verify-2fa', { token: token2FA });
      window.location.href = '/admin/dashboard';
    } catch (err) {
      alert('Invalid 2FA code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full glass p-8 rounded-xl shadow-2xl border-t border-primary/50">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Admin Secure Login</h2>
        
        {step === 1 ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full bg-white/5 border border-border rounded-md px-4 py-2 text-white focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full bg-white/5 border border-border rounded-md px-4 py-2 text-white focus:outline-none focus:border-primary" />
            </div>
            <Button type="submit" className="w-full">Continue</Button>
          </form>
        ) : (
          <form onSubmit={handle2FA} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Authenticator Code (TOTP)</label>
              <input type="text" maxLength={6} value={token2FA} onChange={e=>setToken2FA(e.target.value)} required className="w-full bg-white/5 border border-border rounded-md px-4 py-2 text-white focus:outline-none focus:border-primary text-center text-2xl tracking-widest" />
            </div>
            <Button type="submit" className="w-full">Verify & Access</Button>
          </form>
        )}
      </div>
    </div>
  );
};
