import { io } from 'socket.io-client';

// Get the backend URL from environment variables or use default
// In Vite, environment variables are accessed via import.meta.env
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5003';

// Create socket connection
let socket;

export const initSocket = (userId) => {
  if (!socket) {
    socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true
    });
    
    // Join user room
    if (userId) {
      socket.emit('join_user', userId);
    }
    
    // Handle connection events
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });
    
    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });
    
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }
  
  return socket;
};

export const getSocket = () => {
  return socket;
};

export const subscribeToNote = (noteId) => {
  if (socket) {
    socket.emit('subscribe_to_note', noteId);
  }
};

export const unsubscribeFromNote = (noteId) => {
  if (socket) {
    socket.emit('unsubscribe_from_note', noteId);
  }
};

export const joinUserRoom = (userId) => {
  if (socket) {
    socket.emit('join_user', userId);
  }
};