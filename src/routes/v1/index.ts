import express, { Router } from 'express';
import authRoute from './auth.route';
import docsRoute from './swagger.route';
import userRoute from './user.route';
import uploadRoute from "./upload.route";
import planRoute from '../../modules/plans/plans.route';
import { subscriptionRoutes, webhookRouter } from '../../modules/subscription';
import config from '../../config/config';
import logsRoutes from './logs.route';
import SiteRoutes from "./site.route"
import ProcessRoutes from "./process.route";
import * as capa from "./capa"
import * as risk from "./risk"
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
    path: '/subscriptions',
    route: subscriptionRoutes,
  },
  {
    path: '/upload',
    route: uploadRoute,
  },
  {
    path: '/attachments',
    route: capa.attachmentroute,
  },
  {
    path: '/logs',
    route: logsRoutes,
  },
  {
    path: '/sites',
    route: SiteRoutes,
  },
  {
    path: '/processes',
    route: ProcessRoutes,
  },
];
const capaIRoute: IRoute[] = [
 
  {
    path: '/capa',
    route: capa.capaRoute,
  },
  {
    path: '/roles',
    route: capa.roleRoute,
  },
  {
    path: '/attachments',
    route: capa.attachmentroute,
  },
  {
    path: '/groups',
    route: capa.groupRoute,
  },
  {
    path: '/workspace-users',
    route: capa.workspaceUser,
  },
  {
    path: '/libraries',
    route: capa.libraryroute,
  },
  {
    path: '/actions',
    route: capa.actionroute,
  },
  {
    path: '/causes',
    route: capa.causeroute,
  },
  {
    path: '/five-whys',
    route: capa.FiveWhyRoutes,
  },
  {
    path: '/checklist',
    route: capa.checklistroute,
  },
  {
    path: '/checklistItem',
    route: capa.CheckListItemRoute,
  },
  {
    path: '/checklisthistory',
    route: capa.checklisthistoryRoute,
  },
  {
    path: '/ishikawa',
    route: capa.IshikawaRoutes,
  },
  {
    path: '/reports',
    route: capa.ReportReport,
  },
  {
    path: '/report-history',
    route: capa.ReportHistory,
  },
  {
    path: '/cron',
    route: capa.cronRoute,
  },
];
const riskIRoute: IRoute[] = [

  {
    path: '/',
    route: capa.capaRoute,
  },
  {
    path: '/libraries',
    route: risk.riskLibraryRoute,
  },
  {
    path: '/controls',
    route: risk.riskControlRoute,
  },
  {
    path: '/consequences',
    route: risk.riskConsequenceRoute,
  },
  {
    path: '/causes',
    route: risk.riskCause,
  },
  {
    path: '/actions',
    route: risk.riskAction,
  },
  {
    path: '/five-whys',
    route: risk.riskFivewhys,
  },
  {
    path: '/ishikawa',
    route: risk.riskIsikawaRoute,
  },
  {
    path: '/attachments',
    route: risk.riskAttachment,
  },
  {
    path: '/assessments',
    route: risk.riskAssessment,
  },
  {
    path: '/attention',
    route: risk.riskAttention,
  },
  {
    path: '/reports',
    route: risk.riskReport,
  },
  {
    path: '/report-history',
    route: risk.riskReportHistory,
  }
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

// Globally Routes
defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

// Capa Routes
capaIRoute.forEach((route) => {
  router.use(route.path, route.route);
});
// Risk Routes
riskIRoute.forEach((route) => {
  router.use(`/risk${route.path}`, route.route);
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
