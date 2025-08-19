"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityLoggerMiddleware = void 0;
const activitylogs_modal_1 = __importDefault(require("./activitylogs.modal"));
async function activityLoggerMiddleware(req, res, next) {
    // Call next() and wait for the controller to finish
    // Then log the activity after the response is sent
    res.on("finish", async () => {
        try {
            // console.log("Activity logging middleware triggered", req.body, req.user, res);
            // You can customize how to get these values from req/res
            const performedBy = req.user?._id || null;
            const logof = res.locals['logof'] || null;
            const message = res.locals["message"] || req.body.message || null;
            const action = res.locals["action"] || req.method.toLowerCase();
            const collectionName = res.locals["collectionName"] || null;
            const documentId = res.locals["documentId"] || null;
            const changes = res.locals["changes"] || req.body || null;
            console.log("Activity logging details:", {
                action,
                performedBy,
                logof,
                message,
                collectionName,
                documentId,
                changes,
            });
            // Only log if collectionName and documentId are available
            if (collectionName) {
                await activitylogs_modal_1.default.create({
                    action,
                    collectionName,
                    documentId,
                    performedBy,
                    changes,
                    logof,
                    message,
                });
            }
        }
        catch (err) {
            console.error("Activity logging failed:", err);
        }
    });
    next();
}
exports.activityLoggerMiddleware = activityLoggerMiddleware;
