"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSitesNames = exports.getAllSites = exports.getSiteNamesByModule = exports.getSitesByModule = exports.getSite = exports.deleteSite = exports.updateSite = exports.createSite = void 0;
const site_services_1 = __importDefault(require("./site.services"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const createSite = (0, catchAsync_1.default)(async (req, res) => {
    const site = await site_services_1.default.createSiteService({ ...req.body, createdBy: req.user.id });
    res.status(201).json(site);
});
exports.createSite = createSite;
const updateSite = (0, catchAsync_1.default)(async (req, res) => {
    const site = await site_services_1.default.updateSiteService(req.params["id"], req.body, req.user);
    res.status(200).json(site);
});
exports.updateSite = updateSite;
const deleteSite = (0, catchAsync_1.default)(async (req, res) => {
    await site_services_1.default.deleteSiteService(req.params["id"], req.user);
    res.status(204).send();
});
exports.deleteSite = deleteSite;
const getSite = (0, catchAsync_1.default)(async (req, res) => {
    const site = await site_services_1.default.getSiteService(req.params["id"]);
    res.status(200).json(site);
});
exports.getSite = getSite;
const getSitesByModule = (0, catchAsync_1.default)(async (req, res) => {
    const sites = await site_services_1.default.getSiteServiceByModule(req.params["moduleId"], req.query);
    res.status(200).json(sites);
});
exports.getSitesByModule = getSitesByModule;
const getSiteNamesByModule = (0, catchAsync_1.default)(async (req, res) => {
    const siteNames = await site_services_1.default.getSiteServiceNamesByModule(req.params["moduleId"]);
    res.status(200).json(siteNames);
});
exports.getSiteNamesByModule = getSiteNamesByModule;
const getAllSites = (0, catchAsync_1.default)(async (req, res) => {
    const sites = await site_services_1.default.getAllSitesService(req.query, req.user);
    res.status(200).json(sites);
});
exports.getAllSites = getAllSites;
const getAllSitesNames = (0, catchAsync_1.default)(async (req, res) => {
    const siteNames = await site_services_1.default.getAllSitesNamesService(req.user);
    res.status(200).json(siteNames);
});
exports.getAllSitesNames = getAllSitesNames;
