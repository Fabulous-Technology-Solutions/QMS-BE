"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttentionController = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const http_status_1 = __importDefault(require("http-status"));
const action_service_1 = require("../library/action/action.service");
const risklibrary_service_1 = require("../library/risklibrary.service");
exports.AttentionController = (0, catchAsync_1.default)(async (req, res) => {
    const { page = 1, limit = 10, search = '', filterData } = req.query;
    if (!filterData) {
        throw new ApiError_1.default('Filter data is required', http_status_1.default.BAD_REQUEST);
    }
    console.log('Filter data:', filterData);
    if (filterData === 'action') {
        const actions = await (0, action_service_1.getActionsByWorkspace)(req.params['workspaceId'], Number(page), Number(limit), search);
        res.status(200).json(actions);
    }
    else if (filterData === 'library') {
        const libraries = await (0, risklibrary_service_1.getLibrariesfilterData)(req.params['workspaceId'], Number(page), Number(limit), search);
        res.status(200).json(libraries);
    }
    else {
        throw new ApiError_1.default('Invalid filter data', http_status_1.default.BAD_REQUEST);
    }
});
