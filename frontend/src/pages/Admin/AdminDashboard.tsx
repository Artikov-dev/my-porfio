import React from 'react';
import { useSocket } from '@/hooks/useSocket';
import { Users, Eye, MessageSquare, Briefcase } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';

export const AdminDashboard = () => {
  const { activeUsers } = useSocket();

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await api.get('/analytics');
      return res.data.data;
    }
  });

  if (isLoading || !analytics) {
    return (
      <div className="space-y-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  const { overview, chat_activity, top_projects, top_blogs, visitors_over_time, visitors_by_country } = analytics;
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const stats = [
    { label: 'Active Visitors', value: activeUsers, icon: <Users className="text-blue-400" />, color: 'border-blue-400/20 bg-blue-400/5' },
    { label: 'Total Unique Visitors', value: overview.total_visitors || 0, icon: <Users className="text-indigo-400" />, color: 'border-indigo-400/20 bg-indigo-400/5' },
    { label: 'Total Page Views', value: (overview.total_blog_views || 0) + (overview.total_project_views || 0), icon: <Eye className="text-purple-400" />, color: 'border-purple-400/20 bg-purple-400/5' },
    { label: 'Total Projects & Blogs', value: (overview.total_projects || 0) + (overview.total_blogs || 0), icon: <Briefcase className="text-orange-400" />, color: 'border-orange-400/20 bg-orange-400/5' },
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
        {/* Area Chart: Visitors */}
        <div className="glass p-6 rounded-2xl border border-white/5 h-96 flex flex-col shadow-xl">
          <h3 className="text-foreground dark:text-white font-medium mb-4">Unique Visitors (Last 30 Days)</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitors_over_time} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Area type="monotone" dataKey="visitors" name="Visitors" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Visitors by Country */}
        <div className="glass p-6 rounded-2xl border border-white/5 h-96 flex flex-col shadow-xl">
          <h3 className="text-foreground dark:text-white font-medium mb-4">Visitors by Country</h3>
          <div className="flex-1 w-full flex items-center justify-center">
            {visitors_by_country && visitors_by_country.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={visitors_by_country}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {visitors_by_country.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-foreground/50 text-sm">No country data yet.</p>
            )}
          </div>
        </div>

        {/* Bar Chart: Top Projects */}
        <div className="glass p-6 rounded-2xl border border-white/5 h-96 flex flex-col shadow-xl">
          <h3 className="text-foreground dark:text-white font-medium mb-4">Top Projects by Views</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top_projects} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#a855f7' }}
                />
                <Bar dataKey="views" name="Views" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Top Blogs */}
        <div className="glass p-6 rounded-2xl border border-white/5 h-96 flex flex-col shadow-xl">
          <h3 className="text-foreground dark:text-white font-medium mb-4">Top Blogs by Views</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top_blogs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#ef4444' }}
                />
                <Bar dataKey="views" name="Reads" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
