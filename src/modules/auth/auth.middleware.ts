import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from '../errors/ApiError';
import { roleRights } from '../../config/roles';
import { IUserDoc } from '../user/user.interfaces';
import { getRoleById } from '../capa/workspace/manageRole/manageRole.service';

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
      let userRights: string[] = [];
      // console.log('Required rights:', roleRights);

      if (user.role === 'admin') {
        userRights = roleRights.get(user.role) || [];
      } else if (user.role === 'subAdmin') {
        userRights = roleRights.get(user?.subAdminRole as string) || [];
      } else if (user.role === 'workspaceUser') {
        const workspaceUserRole = await getRoleById(user['roleId']?.toString() || '');
        userRights = roleRights.get(workspaceUserRole?.permissions) || [];
      }
      console.log('User rights:', userRights);

      if (!userRights)
        return reject(new ApiError('you do not have permission to perform this action', httpStatus.FORBIDDEN));
      const hasRequiredRights = requiredRights.every((requiredRight: string) => userRights.includes(requiredRight));
      if (!hasRequiredRights && req.params['userId'] !== user.id) {
        return reject(new ApiError('you do not have permission to perform this action', httpStatus.FORBIDDEN));
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
