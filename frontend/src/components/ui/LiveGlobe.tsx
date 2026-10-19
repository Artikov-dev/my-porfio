import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { api } from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';

interface Location {
  lat: number;
  lng: number;
  country: string;
}

// Convert lat/lng to 3D Cartesian coordinates
const latLongToVector3 = (lat: number, lng: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
};

const Earth = ({ locations }: { locations: Location[] }) => {
  const earthRef = useRef<THREE.Group>(null);
  
  // Load high quality textures for a realistic look
  const [colorMap, normalMap, specularMap, cloudsMap] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'
  ]);

  // Auto-rotate
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={earthRef}>
      {/* Earth Sphere */}
      <Sphere args={[2, 64, 64]}>
        <meshPhongMaterial
          map={colorMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.5, 0.5)}
          specularMap={specularMap}
          specular={new THREE.Color('grey')}
        />
      </Sphere>

      {/* Clouds Sphere (slightly larger) */}
      <Sphere args={[2.02, 64, 64]}>
        <meshPhongMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </Sphere>

      {/* Markers for locations */}
      {locations.map((loc, i) => {
        const pos = latLongToVector3(loc.lat, loc.lng, 2.05); // slightly above clouds
        return (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color="#22c55e" /> {/* Tailwind green-500 */}
            <pointLight color="#22c55e" intensity={2} distance={0.5} />
          </mesh>
        );
      })}
    </group>
  );
};

export const LiveGlobe = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const { socket } = useSocket();

  // Fetch initial locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await api.get('/analytics/locations', { timeout: 6000 });
        if (res.data?.success && Array.isArray(res.data.data)) {
          setLocations(res.data.data);
        }
      } catch {
        // Globe stays empty if the API is unavailable
      }
    };
    fetchLocations();
  }, []);

  // Listen for new locations
  useEffect(() => {
    if (!socket) return;
    
    const handleNewLocation = (loc: Location) => {
      setLocations((prev) => {
        if (prev.some((p) => p.lat === loc.lat && p.lng === loc.lng)) return prev;
        return [loc, ...prev].slice(0, 100);
      });
    };

    socket.on('new_visitor_location', handleNewLocation);
    return () => {
      socket.off('new_visitor_location', handleNewLocation);
    };
  }, [socket]);

  // Real visitor locations only — no demo markers that look like real visitors
  const displayLocations = locations;

  return (
    <div className="w-full max-w-[400px] md:max-w-[500px] aspect-square mx-auto relative flex items-center justify-center cursor-grab active:cursor-grabbing rounded-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-transparent blur-3xl mix-blend-screen pointer-events-none" />
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} />
        
        <React.Suspense fallback={null}>
          <Earth locations={displayLocations} />
        </React.Suspense>
        
        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          minDistance={3} 
          maxDistance={7}
          autoRotate={false} 
        />
      </Canvas>
    </div>
  );
};
