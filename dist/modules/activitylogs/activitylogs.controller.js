"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogsByIdController = void 0;
const utils_1 = require("../utils");
const http_status_1 = __importDefault(require("http-status"));
const activitylogs_services_1 = require("./activitylogs.services");
exports.getLogsByIdController = (0, utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const options = {
        page: Number(req.query["page"]) || 1,
        limit: Number(req.query["limit"]) || 10,
    };
    try {
        const logs = await (0, activitylogs_services_1.getlogsByid)(id, options);
        res.status(http_status_1.default.OK).send({
            success: true,
            data: logs,
        });
    }
    catch (error) {
        next(error);
    }
});
