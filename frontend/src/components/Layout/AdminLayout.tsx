import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, FolderGit2, BookOpen, LogOut } from 'lucide-react';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Messages', path: '/admin/messages', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Projects', path: '/admin/projects', icon: <FolderGit2 className="w-5 h-5" /> },
    { name: 'Blogs', path: '/admin/blogs', icon: <BookOpen className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-background/50 backdrop-blur-xl flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <span className="text-xl font-bold text-foreground dark:text-white tracking-tight">RA. Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary/20 text-primary font-medium' 
                    : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground dark:text-white'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-16 border-b border-border bg-background/50 backdrop-blur-xl flex items-center justify-between px-6">
          <h2 className="text-lg font-medium text-foreground dark:text-white">
            {navItems.find(i => location.pathname.startsWith(i.path))?.name || 'Admin'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
              RA
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
