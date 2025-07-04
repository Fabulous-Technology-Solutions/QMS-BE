import express, { Router } from 'express';
import authRoute from './auth.route';
import docsRoute from './swagger.route';
import userRoute from './user.route';
import capaRoute from './capa.route';
import uploadRoute from "./upload.route";
import planRoute from '../../modules/plans/plans.route';
import { subscriptionRoutes, webhookRouter } from '../../modules/subscription';
import config from '../../config/config';

const router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoute: IRoute[] = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/plans',
    route: planRoute,
  },
  {
    path: '/capa',
    route: capaRoute,
  },
  {
    path: '/subscriptions',
    route: subscriptionRoutes,
  },
  {
    path: '/upload',
    route: uploadRoute,
  },
];

// Add webhook route separately (should be public)
const webhookIRoute: IRoute[] = [
  {
    path: '/stripe',
    route: webhookRouter,
  },
];

const devIRoute: IRoute[] = [
  // IRoute available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

// Register webhook routes (these should be public)
webhookIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devIRoute.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
