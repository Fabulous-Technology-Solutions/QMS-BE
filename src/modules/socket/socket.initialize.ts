import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import authMiddleWareSocket, { AuthenticatedSocket } from './socket.middleware';

let io: Server | undefined;

export function initializeSocket(server: HttpServer) {
  if (!io) {
    console.log('Socket.io is not initialized.');
    io = new Server(server, { cors: { origin: '*' } });
  }
  io.use(authMiddleWareSocket);
  io.on('connection', async (socket: AuthenticatedSocket) => {
    const username = socket?.user?.name ?? socket?.user?.name;
    // const user = socket?.user;
    // const subAdmin = socket?.subAdmin?.toObject();
    const userId = socket?.user?._id.toString();

    if (userId) {
      socket.join(userId.toString());
      console.log(`User ${userId}  ${username} connected and joined room `);
    }

    // You can access the authenticated user via socket.user
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}
