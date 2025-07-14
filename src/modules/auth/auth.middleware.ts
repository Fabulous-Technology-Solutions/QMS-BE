import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from '../errors/ApiError';
import { roleRights } from '../../config/roles';
import { IUserDoc } from '../user/user.interfaces';

const verifyCallback =
  (req: Request, resolve: any, reject: any, requiredRights: string[]) =>
  async (err: Error, user: IUserDoc, info: string) => {
    console.log('Authentication attempt:', req.headers.authorization);

    if (err || info || !user) {
      return reject(new ApiError('Please authenticate', httpStatus.UNAUTHORIZED));
    }
    req.user = user;

    console.log('User authenticated:', user);

    if (requiredRights.length) {
      // console.log('Required rights:', roleRights);
      const userRights = roleRights.get(user.role);
      if (!userRights) return reject(new ApiError('Forbidden', httpStatus.FORBIDDEN));
      const hasRequiredRights = requiredRights.every((requiredRight: string) => userRights.includes(requiredRight));
      if (!hasRequiredRights && req.params['userId'] !== user.id) {
        return reject(new ApiError('Forbidden', httpStatus.FORBIDDEN));
      }
    }

    resolve();
  };

const authMiddleware =
  (...requiredRights: string[]) =>
  async (req: Request, res: Response, next: NextFunction) =>
    new Promise<void>((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));

export default authMiddleware;
