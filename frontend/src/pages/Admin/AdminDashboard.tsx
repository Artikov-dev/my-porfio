import React from 'react';
import { useSocket } from '@/hooks/useSocket';
import { Users, Eye, MessageSquare, Briefcase } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const AdminDashboard = () => {
  const { activeUsers } = useSocket();

  const stats = [
    { label: 'Active Visitors', value: activeUsers, icon: <Users className="text-blue-400" />, color: 'border-blue-400/20 bg-blue-400/5' },
    { label: 'Total Page Views', value: '1,248', icon: <Eye className="text-purple-400" />, color: 'border-purple-400/20 bg-purple-400/5' },
    { label: 'Total Messages', value: '24', icon: <MessageSquare className="text-teal-400" />, color: 'border-teal-400/20 bg-teal-400/5' },
    { label: 'Active Projects', value: '8', icon: <Briefcase className="text-orange-400" />, color: 'border-orange-400/20 bg-orange-400/5' },
  ];

  const areaData = [
    { name: 'Mon', views: 120 },
    { name: 'Tue', views: 250 },
    { name: 'Wed', views: 180 },
    { name: 'Thu', views: 300 },
    { name: 'Fri', views: 280 },
    { name: 'Sat', views: 420 },
    { name: 'Sun', views: 380 },
  ];

  const barData = [
    { name: 'Proj A', clicks: 45 },
    { name: 'Proj B', clicks: 80 },
    { name: 'Proj C', clicks: 35 },
    { name: 'Proj D', clicks: 110 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <div key={stat.label} className={`p-6 rounded-2xl border ${stat.color} flex items-center justify-between`}>
            <div>
              <p className="text-foreground/60 text-sm font-medium mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-foreground dark:text-white">{stat.value}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center backdrop-blur-md">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Chart */}
        <div className="glass p-6 rounded-2xl border border-white/5 h-96 flex flex-col">
          <h3 className="text-foreground dark:text-white font-medium mb-4">Traffic Overview (Last 7 Days)</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#14b8a6' }}
                />
                <Area type="monotone" dataKey="views" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Bar Chart */}
        <div className="glass p-6 rounded-2xl border border-white/5 h-96 flex flex-col">
          <h3 className="text-foreground dark:text-white font-medium mb-4">Top Project Engagements</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#a855f7' }}
                />
                <Bar dataKey="clicks" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
