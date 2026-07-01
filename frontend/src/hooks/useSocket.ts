import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    // Determine the API URL correctly based on environment
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    // Remove /api from the end if it exists, because socket.io connects to the root server
    const socketUrl = apiUrl.replace(/\/api$/, '');

    const socketInstance = io(socketUrl, {
      withCredentials: true,
    });

    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    socketInstance.on('active_users_update', (users: number) => {
      setActiveUsers(users);
    });

    socketInstance.on('new_contact_message', (data: any) => {
      console.log('New message received!', data);
      alert(`New message from ${data.name}!`);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, activeUsers };
};
