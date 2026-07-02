import React from 'react';
import { useSocket } from '@/hooks/useSocket';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', visitors: 40 },
  { name: 'Tue', visitors: 30 },
  { name: 'Wed', visitors: 20 },
  { name: 'Thu', visitors: 27 },
  { name: 'Fri', visitors: 18 },
  { name: 'Sat', visitors: 23 },
  { name: 'Sun', visitors: 34 },
];

export const Dashboard = () => {
  const { activeUsers } = useSocket();

  return (
    <div className="min-h-screen bg-background pt-32 px-6 pb-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground dark:text-white mb-10">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="glass p-6 rounded-xl border-l-4 border-l-primary">
            <p className="text-foreground/60 text-sm">Live Active Users</p>
            <h2 className="text-4xl font-bold text-foreground dark:text-white mt-2 animate-pulse">{activeUsers}</h2>
            <p className="text-xs text-green-400 mt-2">Connected via WebSockets</p>
          </div>
          <div className="glass p-6 rounded-xl">
            <p className="text-foreground/60 text-sm">Total Projects</p>
            <h2 className="text-4xl font-bold text-foreground dark:text-white mt-2">12</h2>
          </div>
          <div className="glass p-6 rounded-xl">
            <p className="text-foreground/60 text-sm">Total Blog Posts</p>
            <h2 className="text-4xl font-bold text-foreground dark:text-white mt-2">8</h2>
          </div>
        </div>

        <div className="glass p-6 rounded-xl h-[400px]">
          <h3 className="text-lg font-semibold text-foreground dark:text-white mb-6">Weekly Traffic</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#1E293B' }} />
              <Area type="monotone" dataKey="visitors" stroke="#2563EB" fillOpacity={1} fill="url(#colorVis)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
