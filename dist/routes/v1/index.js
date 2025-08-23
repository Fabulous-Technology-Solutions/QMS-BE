"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./auth.route"));
const swagger_route_1 = __importDefault(require("./swagger.route"));
const user_route_1 = __importDefault(require("./user.route"));
const capa_route_1 = __importDefault(require("./capa.route"));
const upload_route_1 = __importDefault(require("./upload.route"));
const plans_route_1 = __importDefault(require("../../modules/plans/plans.route"));
const role_route_1 = __importDefault(require("./role.route"));
const workspaceUser_route_1 = __importDefault(require("./workspaceUser.route"));
const group_route_1 = __importDefault(require("./group.route"));
const library_route_1 = __importDefault(require("./library.route"));
const action_route_1 = __importDefault(require("./action.route"));
const attachment_route_1 = __importDefault(require("./attachment.route"));
const checklistItem_route_1 = __importDefault(require("./checklistItem.route"));
const subscription_1 = require("../../modules/subscription");
const config_1 = __importDefault(require("../../config/config"));
const causes_route_1 = __importDefault(require("./causes.route"));
const checklist_route_1 = __importDefault(require("./checklist.route"));
const checklisthistory_route_1 = __importDefault(require("./checklisthistory.route"));
const logs_route_1 = __importDefault(require("./logs.route"));
const fivewhys_route_1 = __importDefault(require("./fivewhys.route"));
const Ishikawa_route_1 = __importDefault(require("./Ishikawa.route"));
const report_route_1 = __importDefault(require("./report.route"));
const reporthistory_route_1 = __importDefault(require("./reporthistory.route"));
const site_route_1 = __importDefault(require("./site.route"));
const process_route_1 = __importDefault(require("./process.route"));
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
        path: '/capa',
        route: capa_route_1.default,
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
        path: '/roles',
        route: role_route_1.default,
    },
    {
        path: '/attachments',
        route: attachment_route_1.default,
    },
    {
        path: '/groups',
        route: group_route_1.default,
    },
    {
        path: '/workspace-users',
        route: workspaceUser_route_1.default,
    },
    {
        path: '/libraries',
        route: library_route_1.default,
    },
    {
        path: '/actions',
        route: action_route_1.default,
    },
    {
        path: '/causes',
        route: causes_route_1.default,
    },
    {
        path: '/five-whys',
        route: fivewhys_route_1.default,
    },
    {
        path: '/checklist',
        route: checklist_route_1.default,
    },
    {
        path: '/checklistItem',
        route: checklistItem_route_1.default,
    },
    {
        path: '/checklisthistory',
        route: checklisthistory_route_1.default,
    },
    {
        path: '/logs',
        route: logs_route_1.default,
    },
    {
        path: '/ishikawa',
        route: Ishikawa_route_1.default,
    },
    {
        path: '/reports',
        route: report_route_1.default,
    },
    {
        path: '/report-history',
        route: reporthistory_route_1.default,
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
defaultIRoute.forEach((route) => {
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
