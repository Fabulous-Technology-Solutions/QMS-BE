"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
function initializeSocket(server) {
    if (!io) {
        console.log('Socket.io is not initialized.');
        io = new socket_io_1.Server(server, { cors: { origin: '*' } });
    }
}
exports.initializeSocket = initializeSocket;
