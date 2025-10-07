"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleWareSocket = async (socket, next) => {
    try {
        const authorization = socket.handshake.auth['token'] || socket.handshake.headers['token'];
        console.log('Socket Authorization Header:', authorization, socket.handshake.headers);
        if (!authorization) {
            return next(new Error('You must be logged in'));
        }
        console.log('authorization', authorization);
        const jwtSecret = process.env['JWT_SECRET'];
        if (!jwtSecret) {
            return next(new Error('JWT secret not configured'));
        }
        const decoded = jsonwebtoken_1.default.verify(authorization, jwtSecret);
        const currentUser = decoded?.sub ? { _id: decoded.sub } : decoded?.user;
        if (!currentUser) {
            return next(new Error('Invalid token.'));
        }
        const user = await user_1.User.findById(currentUser._id);
        if (!user) {
            return next(new Error('User not found.'));
        }
        socket.user = user;
        next();
    }
    catch (error) {
        console.error('JWT decoding error:', error.message);
        return next(new Error(error.message || 'Authentication error'));
    }
};
exports.default = authMiddleWareSocket;
