import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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

// Admin imports
import { AdminLogin } from '@/pages/Admin/AdminLogin';
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';
import { AdminLayout } from '@/components/Layout/AdminLayout';
import { AdminDashboard } from '@/pages/Admin/AdminDashboard';
import { AdminMessages } from '@/pages/Admin/AdminMessages';
import { AdminProjects } from '@/pages/Admin/AdminProjects';

function App() {
  const location = useLocation();

  const isResumePage = location.pathname === '/resume';
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/aadminsecrect';
  const hidePublicUI = isResumePage || isAdminRoute;

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary selection:text-white transition-colors duration-500 flex flex-col">
      {!hidePublicUI && <FloatingNav />}
      {!hidePublicUI && <LiveStatus />}
      {!hidePublicUI && <LiveChat />}
      {!isAdminRoute && <CommandPalette />}
      {!isAdminRoute && <TerminalOverlay />}
      
      {!hidePublicUI && <Navbar />}

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resume" element={<ResumeViewer />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/blogs" element={<Blogs />} />
          
          {/* Secret Admin Route */}
          <Route path="/aadminsecrect" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="blogs" element={<div className="text-white p-6">Blogs Management (Coming Soon)</div>} />
            </Route>
          </Route>
        </Routes>
      </div>

      {!hidePublicUI && <Footer />}
    </div>
  );
}

export default App;
