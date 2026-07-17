import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';
import { Activity, Cpu, HardDrive, Clock, Terminal as TerminalIcon, RefreshCw } from 'lucide-react';

export const AdminSystem = () => {
  const [logType, setLogType] = useState<'error' | 'combined'>('combined');

  const { data: health, isLoading: healthLoading, refetch: refetchHealth } = useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      const res = await api.get('/system/health');
      return res.data.data;
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const { data: logsData, isLoading: logsLoading, refetch: refetchLogs, isFetching: logsFetching } = useQuery({
    queryKey: ['system-logs', logType],
    queryFn: async () => {
      const res = await api.get(`/system/logs?type=${logType}`);
      return res.data.data.logs as string[];
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Auto-scroll logs to bottom
  const logsEndRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logsData]);

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600*24));
    const h = Math.floor(seconds % (3600*24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    return `${d}d ${h}h ${m}m`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground dark:text-white">System Health</h2>
        <button 
          onClick={() => { refetchHealth(); refetchLogs(); }}
          className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-2"
        >
          <RefreshCw size={18} className={healthLoading || logsFetching ? 'animate-spin' : ''} />
          <span className="text-sm font-medium">Refresh</span>
        </button>
      </div>

      {healthLoading || !health ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Uptime */}
          <div className="p-6 rounded-2xl border border-blue-400/20 bg-blue-400/5 flex items-center justify-between">
            <div>
              <p className="text-foreground/60 text-sm font-medium mb-1">Server Uptime</p>
              <h3 className="text-2xl font-bold text-foreground dark:text-white">{formatUptime(health.uptime)}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center backdrop-blur-md">
              <Clock className="text-blue-400" />
            </div>
          </div>

          {/* RAM Usage */}
          <div className="p-6 rounded-2xl border border-indigo-400/20 bg-indigo-400/5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-foreground/60 text-sm font-medium mb-1">RAM Usage</p>
                <h3 className="text-xl font-bold text-foreground dark:text-white">
                  {formatBytes(health.memory.used)} / {formatBytes(health.memory.total)}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center backdrop-blur-md">
                <HardDrive className="text-indigo-400" />
              </div>
            </div>
            <div className="w-full bg-indigo-400/20 rounded-full h-2">
              <div className="bg-indigo-400 h-2 rounded-full" style={{ width: `${health.memory.usagePercentage}%` }}></div>
            </div>
          </div>

          {/* CPU */}
          <div className="p-6 rounded-2xl border border-purple-400/20 bg-purple-400/5 flex items-center justify-between">
            <div>
              <p className="text-foreground/60 text-sm font-medium mb-1">CPU Load (1m)</p>
              <h3 className="text-2xl font-bold text-foreground dark:text-white">
                {health.cpu.loadAverage[0].toFixed(2)}
              </h3>
              <p className="text-xs text-foreground/50 mt-1">{health.cpu.cores} Cores</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center backdrop-blur-md">
              <Cpu className="text-purple-400" />
            </div>
          </div>

          {/* Platform */}
          <div className="p-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 flex items-center justify-between">
            <div>
              <p className="text-foreground/60 text-sm font-medium mb-1">Platform</p>
              <h3 className="text-2xl font-bold text-foreground dark:text-white capitalize">
                {health.platform}
              </h3>
              <p className="text-xs text-foreground/50 mt-1">Node {health.nodeVersion}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center backdrop-blur-md">
              <Activity className="text-emerald-400" />
            </div>
          </div>
        </div>
      )}

      {/* Logs Section */}
      <div className="glass p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col h-[500px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <TerminalIcon className="text-primary" />
            <h3 className="text-lg font-bold text-foreground dark:text-white">System Logs</h3>
          </div>
          <div className="flex bg-background/50 p-1 rounded-xl">
            <button 
              onClick={() => setLogType('combined')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${logType === 'combined' ? 'bg-primary text-white shadow-md' : 'text-foreground/60 hover:text-foreground'}`}
            >
              Combined
            </button>
            <button 
              onClick={() => setLogType('error')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${logType === 'error' ? 'bg-red-500 text-white shadow-md' : 'text-foreground/60 hover:text-foreground'}`}
            >
              Errors
            </button>
          </div>
        </div>

        <div className="flex-1 bg-black/90 rounded-xl p-4 overflow-y-auto font-mono text-sm border border-white/10 relative">
          {logsLoading ? (
            <div className="flex items-center justify-center h-full text-white/50">Loading logs...</div>
          ) : logsData && logsData.length > 0 ? (
            <div className="space-y-1">
              {logsData.map((log, i) => {
                const isError = log.includes('error:');
                const isWarn = log.includes('warn:');
                return (
                  <div key={i} className={`break-words ${isError ? 'text-red-400' : isWarn ? 'text-yellow-400' : 'text-green-400/80'}`}>
                    {log}
                  </div>
                )
              })}
              <div ref={logsEndRef} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-white/50">
              No logs found for the current selection.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
