"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const socket_middleware_1 = __importDefault(require("./socket.middleware"));
let io;
function initializeSocket(server) {
    if (!io) {
        console.log('Socket.io is not initialized.');
        io = new socket_io_1.Server(server, { cors: { origin: '*' } });
    }
    io.use(socket_middleware_1.default);
    io.on('connection', async (socket) => {
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
exports.initializeSocket = initializeSocket;
