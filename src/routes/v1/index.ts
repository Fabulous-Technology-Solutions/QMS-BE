import express, { Router } from 'express';
import authRoute from './auth.route';
import docsRoute from './swagger.route';
import userRoute from './user.route';
import capaRoute from './capa.route';
import uploadRoute from "./upload.route";
import planRoute from '../../modules/plans/plans.route';
import roleRoute from './role.route';
import workspaceUser from "./workspaceUser.route"
import groupRoute from './group.route';
import libraryroute from './library.route';
import actionroute from './action.route';
import attachmentroute from './attachment.route';
import CheckListItemRoute from './checklistItem.route';
import { subscriptionRoutes, webhookRouter } from '../../modules/subscription';
import config from '../../config/config';
import causeroute from "./causes.route" 
import checklistroute from './checklist.route';
import checklisthistoryRoute from './checklisthistory.route';
import logsRoutes from './logs.route';
import FiveWhyRoutes from "./fivewhys.route";
import IshikawaRoutes from "./Ishikawa.route";
import ReportReport from "./report.route"
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
  {
    path: '/roles',
    route: roleRoute,
  },
  {
    path: '/attachments',
    route: attachmentroute,
  },
  {
    path: '/groups',
    route: groupRoute,
  },
  {
    path: '/workspace-users',
    route: workspaceUser,
  },
  {
    path: '/libraries',
    route: libraryroute,
  },
  {
    path: '/actions',
    route: actionroute,
  },
  {
    path: '/causes',
    route: causeroute,
  },
  {
    path: '/five-whys',
    route: FiveWhyRoutes,
  },
  {
    path: '/checklist',
    route: checklistroute,
  },
  {
    path: '/checklistItem',
    route: CheckListItemRoute,
  },
  {
    path: '/checklisthistory',
    route: checklisthistoryRoute,
  },
  {
    path: '/logs',
    route: logsRoutes,
  },
  {
    path: '/ishikawa',
    route: IshikawaRoutes,
  },
  {
    path: '/reports',
    route: ReportReport,
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
