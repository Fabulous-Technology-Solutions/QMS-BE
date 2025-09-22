import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: Server | undefined;

export function initializeSocket(server: HttpServer) {
  if (!io) {
    console.log('Socket.io is not initialized.');
    io = new Server(server, { cors: { origin: '*' } });
  }
}
