import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/poppins/300.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import '@fontsource/poppins/800.css'
import '@/styles/index.css'
import App from './App.tsx'
import { I18nProvider } from '@/contexts/I18nContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Toaster } from 'react-hot-toast'
import { MotionConfig } from 'framer-motion'

import { SocketProvider } from '@/contexts/SocketContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
    },
  },
})

// Suppress harmless Three.js and WebGL warnings in the console
const originalWarn = console.warn;
console.warn = (...args) => {
  const msg = args.join(' ');
  if (
    msg.includes('THREE.Clock: This module has been deprecated') ||
    msg.includes('THREE.WebGLProgram: Program Info Log') ||
    msg.includes('cannot be represented accurately in double precision')
  ) {
    return;
  }
  originalWarn(...args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <I18nProvider>
              <SocketProvider>
                <ErrorBoundary>
                  {/* "user": honour the OS "reduce motion" setting for all framer-motion animations */}
                  <MotionConfig reducedMotion="user">
                    <App />
                  </MotionConfig>
                  {/* Without this, every toast() call in the app rendered nothing */}
                  <Toaster
                    position="top-center"
                    toastOptions={{
                      style: {
                        background: 'var(--bg)',
                        color: 'var(--fg)',
                        border: '1px solid var(--border)',
                      },
                    }}
                  />
                </ErrorBoundary>
              </SocketProvider>
            </I18nProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>,
)
