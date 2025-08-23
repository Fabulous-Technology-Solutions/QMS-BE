"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const site_modal_1 = __importDefault(require("./site.modal"));
const createSiteService = async (siteData) => {
    const newSite = new site_modal_1.default(siteData);
    return await newSite.save();
};
const updateSiteService = async (siteId, siteData, user) => {
    const query = { _id: siteId };
    if (user && user.role === 'admin') {
        query.createdBy = user._id;
    }
    else if (user && user.role === 'sub-admin') {
        query.createdBy = user.createdBy;
    }
    else {
        throw new Error("Unauthorized");
    }
    return await site_modal_1.default.findOneAndUpdate(query, siteData, { new: true });
};
const deleteSiteService = async (siteId, user) => {
    const query = { _id: siteId };
    if (user && user.role === 'admin') {
        query.createdBy = user._id;
    }
    else if (user && user.role === 'sub-admin') {
        query.createdBy = user.createdBy;
    }
    else {
        throw new Error("Unauthorized");
    }
    return await site_modal_1.default.findOneAndDelete(query);
};
const getSiteService = async (siteId) => {
    return await site_modal_1.default.findById(siteId);
};
const getSiteServiceByModule = async (moduleId, options) => {
    const { page = 1, limit = 10, search = "" } = options || {};
    const query = { modules: { $in: [moduleId] } };
    if (search) {
        query.name = { $regex: search, $options: "i" };
    }
    const sites = await site_modal_1.default.find(query)
        .skip((page - 1) * limit)
        .limit(limit);
    const total = await site_modal_1.default.countDocuments(query);
    return {
        data: sites,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};
const getSiteServiceNamesByModule = async (moduleId) => {
    return await site_modal_1.default.find({ modules: { $in: [moduleId] } }).select("name");
};
const getAllSitesService = async (options, user) => {
    const { page = 1, limit = 10, search = "" } = options || {};
    const query = {};
    if (search) {
        query.name = { $regex: search, $options: "i" };
    }
    if (user && user.role === 'admin') {
        query.createdBy = user._id;
    }
    else if (user && user.role === 'sub-admin') {
        query.createdBy = user.createdBy;
    }
    else {
        throw new Error("Unauthorized");
    }
    const sites = await site_modal_1.default.find(query).populate({
        path: "modules",
        populate: {
            path: "planId",
            select: "name price", // choose fields from planId (optional)
        },
        select: "_id", // choose fields from modules (optional)
    })
        .skip((page - 1) * limit)
        .limit(limit);
    const total = await site_modal_1.default.countDocuments(query);
    return {
        data: sites,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};
const getAllSitesNamesService = async (user) => {
    const query = {};
    if (user && user.role === 'admin') {
        query.createdBy = user._id;
    }
    else if (user && user.role === 'sub-admin') {
        query.createdBy = user.createdBy?.toString() || "";
    }
    else {
        throw new Error("Unauthorized");
    }
    const sites = await site_modal_1.default.find(query).select("name");
    return {
        data: sites,
    };
};
exports.default = {
    createSiteService,
    updateSiteService,
    deleteSiteService,
    getSiteService,
    getSiteServiceByModule,
    getSiteServiceNamesByModule,
    getAllSitesService,
    getAllSitesNamesService
};
