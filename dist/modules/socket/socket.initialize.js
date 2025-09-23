"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = exports.getSocketInstance = void 0;
const socket_io_1 = require("socket.io");
const socket_middleware_1 = __importDefault(require("./socket.middleware"));
const chat_socket_1 = require("../chat/chat.socket");
let io;
function getSocketInstance() {
    return io;
}
exports.getSocketInstance = getSocketInstance;
function initializeSocket(server) {
    if (!io) {
        console.log('Initializing Socket.io...');
        io = new socket_io_1.Server(server, { cors: { origin: '*' } });
    }
    // Now io is guaranteed to be defined
    const socketServer = io;
    socketServer.use(socket_middleware_1.default);
    socketServer.on('connection', async (socket) => {
        const username = socket?.user?.name ?? socket?.user?.name;
        const userId = socket?.user?._id.toString();
        if (userId) {
            socket.join(userId.toString());
            console.log(`User ${userId}  ${username} connected and joined room `);
        }
        (0, chat_socket_1.chatEvent)(socketServer, socket);
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
}
exports.initializeSocket = initializeSocket;
