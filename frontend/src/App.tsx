// Trigger frontend deployment
import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CommandPalette } from '@/components/CommandPalette';
import { FloatingNav } from '@/components/Navigation/FloatingNav';
import { LiveStatus } from '@/components/ui/LiveStatus';
import { LiveChat } from '@/components/ui/LiveChat';
import { Navbar } from '@/components/Navigation/Navbar';
import { Footer } from '@/components/Navigation/Footer';
import { TerminalOverlay } from '@/components/Terminal/TerminalOverlay';
import { Spotlight } from '@/components/ui/Spotlight';
import { MusicPlayer } from '@/components/ui/MusicPlayer';
import { MobileFAB } from '@/components/ui/MobileFAB';

// Layout & Core
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';
import { MatrixRain } from '@/components/Terminal/MatrixRain';
import { useAnalytics } from '@/hooks/useAnalytics';

// Lazy loaded Pages
const Home = React.lazy(() => import('@/pages/Home').then(m => ({ default: m.Home })));
const Projects = React.lazy(() => import('@/pages/Projects').then(m => ({ default: m.Projects })));
const Blogs = React.lazy(() => import('@/pages/Blogs').then(m => ({ default: m.Blogs })));
const ResumeViewer = React.lazy(() => import('@/pages/ResumeViewer').then(m => ({ default: m.ResumeViewer })));

// Lazy loaded Admin Routes
const AdminLogin = React.lazy(() => import('@/pages/Admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminLayout = React.lazy(() => import('@/components/Layout/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = React.lazy(() => import('@/pages/Admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminMessages = React.lazy(() => import('@/pages/Admin/AdminMessages').then(m => ({ default: m.AdminMessages })));
const AdminProjects = React.lazy(() => import('@/pages/Admin/AdminProjects').then(m => ({ default: m.AdminProjects })));
const AdminBlogs = React.lazy(() => import('@/pages/Admin/AdminBlogs').then(m => ({ default: m.AdminBlogs })));
const AdminSEO = React.lazy(() => import('@/pages/Admin/AdminSEO').then(m => ({ default: m.AdminSEO })));

// Loading Fallback
const PageLoader = () => (
  <div className="min-h-[70vh] flex items-center justify-center w-full">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

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
          <Suspense fallback={<PageLoader />}>
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
          </Suspense>
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
