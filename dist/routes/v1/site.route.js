"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../modules/validate");
const auth_1 = require("../../modules/auth");
const sites_1 = require("../../modules/businessManagement/sites");
const activitylogs_middleware_1 = require("../../modules/activitylogs/activitylogs.middleware");
const router = express_1.default.Router();
router
    .route('/')
    .post((0, auth_1.auth)('manageSites'), (0, validate_1.validate)(sites_1.SiteValidation.createSiteSchema), activitylogs_middleware_1.activityLoggerMiddleware, sites_1.siteController.createSite)
    .get((0, auth_1.auth)('manageSites'), sites_1.siteController.getAllSites);
router.get('/names', (0, auth_1.auth)('manageSites'), sites_1.siteController.getAllSitesNames);
router
    .route('/:id')
    .get((0, auth_1.auth)('manageSites'), sites_1.siteController.getSite)
    .patch((0, auth_1.auth)('manageSites'), (0, validate_1.validate)(sites_1.SiteValidation.updateSiteSchema), activitylogs_middleware_1.activityLoggerMiddleware, sites_1.siteController.updateSite)
    .delete((0, auth_1.auth)('manageSites'), activitylogs_middleware_1.activityLoggerMiddleware, sites_1.siteController.deleteSite);
router.get('/names/:moduleId', sites_1.siteController.getSiteNamesByModule);
exports.default = router;
