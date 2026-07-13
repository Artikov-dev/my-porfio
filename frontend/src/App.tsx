// Trigger frontend deployment
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CommandPalette } from '@/components/CommandPalette';
import { Home } from '@/pages/Home';
import { Projects } from '@/pages/Projects';
import { Blogs } from '@/pages/Blogs';
import { ResumeViewer } from '@/pages/ResumeViewer';
import { FloatingNav } from '@/components/Navigation/FloatingNav';
import { LiveStatus } from '@/components/ui/LiveStatus';
import { LiveChat } from '@/components/ui/LiveChat';
import { Navbar } from '@/components/Navigation/Navbar';
import { Footer } from '@/components/Navigation/Footer';
import { TerminalOverlay } from '@/components/Terminal/TerminalOverlay';
import { Spotlight } from '@/components/ui/Spotlight';
import { MusicPlayer } from '@/components/ui/MusicPlayer';
import { MobileFAB } from '@/components/ui/MobileFAB';

// Admin imports
import { AdminLogin } from '@/pages/Admin/AdminLogin';
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';
import { AdminLayout } from '@/components/Layout/AdminLayout';
import { AdminDashboard } from '@/pages/Admin/AdminDashboard';
import { AdminMessages } from '@/pages/Admin/AdminMessages';
import { AdminProjects } from '@/pages/Admin/AdminProjects';
import { AdminBlogs } from '@/pages/Admin/AdminBlogs';
import { AdminSEO } from '@/pages/Admin/AdminSEO';
import { MatrixRain } from '@/components/Terminal/MatrixRain';
import { useAnalytics } from '@/hooks/useAnalytics';

function App() {
  useAnalytics();
  const [showMatrix, setShowMatrix] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    let typed = '';
    const target = 'matrix';
    
    const handleKeyDown = (e: KeyboardEvent) => {
      typed += e.key.toLowerCase();
      if (typed.length > target.length) {
        typed = typed.slice(typed.length - target.length);
      }
      if (typed === target) {
        setShowMatrix(prev => !prev);
        typed = '';
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isResumePage = location.pathname === '/resume';
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/aadminsecret';
  const hidePublicUI = isResumePage || isAdminRoute;

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary selection:text-white flex flex-col overflow-x-hidden w-full">
      {!hidePublicUI && <FloatingNav />}
      {!hidePublicUI && <LiveStatus />}
      {!hidePublicUI && <LiveChat />}
      {!isAdminRoute && <CommandPalette />}
      {!isAdminRoute && <TerminalOverlay />}
      {!hidePublicUI && <Spotlight />}
      {!hidePublicUI && <MusicPlayer />}
      {!hidePublicUI && <MobileFAB />}
      
      {!hidePublicUI && <Navbar />}

      <div className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/resume" element={<ResumeViewer />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/blogs" element={<Blogs />} />
            
            {/* Secret Admin Route */}
            <Route path="/aadminsecret" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="blogs" element={<AdminBlogs />} />
                <Route path="seo" element={<AdminSEO />} />
              </Route>
            </Route>
          </Routes>
        </AnimatePresence>
      </div>

      {!hidePublicUI && <Footer />}
      
      {showMatrix && (
        <div className="fixed inset-0 z-[99999] pointer-events-none mix-blend-screen opacity-75">
          <MatrixRain onComplete={() => setShowMatrix(false)} />
        </div>
      )}
    </div>
  );
}

export default App;
