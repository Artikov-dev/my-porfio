import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  activeUsers: number;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  activeUsers: 0,
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socketUrl = apiUrl.replace(/\/api$/, '');

    const socketInstance = io(socketUrl, {
      withCredentials: true,
      transports: ['polling', 'websocket'], // Polling first prevents immediate WebSocket failure errors during cold-starts
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 4000,
      reconnectionDelayMax: 20000,
      timeout: 20000,
    });

    socketInstance.on('connect', () => {
      // Connected successfully
    });

    socketInstance.on('connect_error', () => {
      // Quietly handle connection errors during server sleeping/wake-up
    });

    socketInstance.on('active_users_update', (users: number) => {
      setActiveUsers(users);
    });

    socketInstance.on('new_contact_message', (data: any) => {
      // New contact message
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, activeUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
