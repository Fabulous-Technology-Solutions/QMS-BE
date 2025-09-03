"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./auth.route"));
const swagger_route_1 = __importDefault(require("./swagger.route"));
const user_route_1 = __importDefault(require("./user.route"));
const upload_route_1 = __importDefault(require("./upload.route"));
const plans_route_1 = __importDefault(require("../../modules/plans/plans.route"));
const subscription_1 = require("../../modules/subscription");
const config_1 = __importDefault(require("../../config/config"));
const logs_route_1 = __importDefault(require("./logs.route"));
const site_route_1 = __importDefault(require("./site.route"));
const process_route_1 = __importDefault(require("./process.route"));
const capa = __importStar(require("./capa"));
// import * as risk from "./risk"
const router = express_1.default.Router();
const defaultIRoute = [
    {
        path: '/auth',
        route: auth_route_1.default,
    },
    {
        path: '/users',
        route: user_route_1.default,
    },
    {
        path: '/plans',
        route: plans_route_1.default,
    },
    {
        path: '/subscriptions',
        route: subscription_1.subscriptionRoutes,
    },
    {
        path: '/upload',
        route: upload_route_1.default,
    },
    {
        path: '/attachments',
        route: capa.attachmentroute,
    },
    {
        path: '/logs',
        route: logs_route_1.default,
    },
    {
        path: '/sites',
        route: site_route_1.default,
    },
    {
        path: '/processes',
        route: process_route_1.default,
    },
];
const capaIRoute = [
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
const riskIRoute = [
    {
        path: '/risk',
        route: capa.capaRoute,
    }
];
// Add webhook route separately (should be public)
const webhookIRoute = [
    {
        path: '/stripe',
        route: subscription_1.webhookRouter,
    },
];
const devIRoute = [
    // IRoute available only in development mode
    {
        path: '/docs',
        route: swagger_route_1.default,
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
    router.use(route.path, route.route);
});
// Register webhook routes (these should be public)
webhookIRoute.forEach((route) => {
    router.use(route.path, route.route);
});
/* istanbul ignore next */
if (config_1.default.env === 'development') {
    devIRoute.forEach((route) => {
        router.use(route.path, route.route);
    });
}
exports.default = router;
