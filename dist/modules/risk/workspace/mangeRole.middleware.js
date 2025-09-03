"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
// import { checkAdminBelongsToWorkspace, checkWorkSubadminBelongsToWorkspace } from './manageRole/manageRole.service';
const workspace_modal_1 = __importDefault(require("./workspace.modal"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const checkCreateRole = (0, catchAsync_1.default)(async (req, _, next) => {
    const { user } = req;
    if (user.role === 'admin') {
        // await checkAdminBelongsToWorkspace(user._id, req.params['workspaceId'] || req.body.workspace);
    }
    else if (user.role === 'subadmin') {
        // await checkWorkSubadminBelongsToWorkspace(user._id, req.params['workspaceId'] || req.body.workspace);
    }
    else if (user.role === 'workspaceUser') {
        console.log(req.params['workspaceId'], "well....................");
        if ((req.params['workspaceId'] || req.body.workspace) !== user['workspace']?.toString()) {
            throw new Error('Unauthorized role for performing this action');
        }
        const findworkspace = await workspace_modal_1.default.findOne({
            _id: req.params['workspaceId'] || req.body.workspace,
            isDeleted: false,
        });
        if (!findworkspace) {
            throw new ApiError_1.default('Workspace not found', http_status_1.default.NOT_FOUND);
        }
    }
    else {
        throw new Error('Unauthorized role for creating a role');
    }
    next();
});
exports.default = checkCreateRole;
