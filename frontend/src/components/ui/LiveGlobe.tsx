import React, { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';
import { api } from '@/lib/api';
import { useTheme } from '@/contexts/ThemeContext';
import { useSocket } from '@/hooks/useSocket';

interface Location {
  lat: number;
  lng: number;
  country: string;
}

export const LiveGlobe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const { theme } = useTheme();
  const { socket } = useSocket();

  // Fetch initial locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await api.get('/analytics/locations');
        if (res.data?.success) {
          setLocations(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch globe locations:', err);
      }
    };
    fetchLocations();
  }, []);

  // Listen for new locations
  useEffect(() => {
    if (!socket) return;
    
    const handleNewLocation = (loc: Location) => {
      setLocations((prev) => {
        // Prevent exact duplicates
        if (prev.some(p => p.lat === loc.lat && p.lng === loc.lng)) return prev;
        return [loc, ...prev].slice(0, 100);
      });
    };

    socket.on('new_visitor_location', handleNewLocation);
    return () => {
      socket.off('new_visitor_location', handleNewLocation);
    };
  }, [socket]);

  useEffect(() => {
    let phi = 0;
    
    if (!canvasRef.current) return;
    
    const isDark = theme === 'dark';
    
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 800,
      height: 800,
      phi: 0,
      theta: 0,
      dark: isDark ? 1 : 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: isDark ? [0.1, 0.1, 0.1] : [1, 1, 1],
      markerColor: [0.133, 0.772, 0.368], // Tailwind green-500 approx
      glowColor: isDark ? [0.05, 0.05, 0.05] : [0.9, 0.9, 0.9],
      markers: locations.map(l => ({ location: [l.lat, l.lng], size: 0.06 })),
      // @ts-expect-error cobe types are missing onRender but it is supported by the library
      onRender: (state: Record<string, any>) => {
        // Auto-rotate
        state.phi = phi;
        phi += 0.005;
      },
    });

    // Make canvas visible
    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = '1';
      }
    }, 100);

    return () => {
      globe.destroy();
    };
  }, [locations, theme]);

  return (
    <div className="w-full max-w-[400px] md:max-w-[500px] aspect-square mx-auto relative flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-transparent blur-2xl rounded-full mix-blend-screen pointer-events-none" />
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          contain: 'layout paint size',
          opacity: 0,
          transition: 'opacity 1s ease',
        }}
      />
    </div>
  );
};
