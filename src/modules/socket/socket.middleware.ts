import { User, userInterfaces } from '../user';
import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  user?: userInterfaces.IUserDoc;
}

const authMiddleWareSocket = async (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
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

    const decoded = jwt.verify(authorization, jwtSecret) as any;
    const currentUser = decoded?.sub ? { _id: decoded.sub } : decoded?.user;
    if (!currentUser) {
      return next(new Error('Invalid token.'));
    }
    const user = await User.findById(currentUser._id);

    if (!user) {
      return next(new Error('User not found.'));
    }

    socket.user = user;
    next();
  } catch (error: any) {
    console.error('JWT decoding error:', error.message);
    return next(new Error(error.message || 'Authentication error'));
  }
};

export default authMiddleWareSocket;
