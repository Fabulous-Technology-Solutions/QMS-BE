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
const planController = __importStar(require("./plans.controller"));
const planValidation = __importStar(require("./plans.validation"));
const validate_1 = require("../validate");
const auth_1 = require("../auth");
const router = express_1.default.Router();
const optionalAuth = () => {
    return (req, res, next) => {
        if (req.headers.authorization) {
            console.log("Authorization header:", req.headers.authorization);
            return (0, auth_1.auth)()(req, res, next); // Run auth middleware manually
        }
        return next();
    };
};
// Public routes
router
    .route('/')
    .get((0, validate_1.validate)(planValidation.getPlans), optionalAuth(), planController.getPlans)
    .post((0, auth_1.auth)('managePlans'), (0, validate_1.validate)(planValidation.createPlan), planController.createPlan);
router
    .route('/popular')
    .get(planController.getPopularPlans);
router
    .route('/comparison')
    .get(planController.getPlanComparison);
router
    .route('/slug/:slug')
    .get((0, validate_1.validate)(planValidation.getPlanBySlug), planController.getPlanBySlug);
router
    .route('/:planId')
    .get((0, validate_1.validate)(planValidation.getPlanById), planController.getPlanById)
    .patch((0, auth_1.auth)('managePlans'), (0, validate_1.validate)(planValidation.updatePlan), planController.updatePlan)
    .delete((0, auth_1.auth)('managePlans'), (0, validate_1.validate)(planValidation.getPlanById), planController.deletePlan);
router
    .route('/:planId/pricing')
    .post((0, validate_1.validate)(planValidation.calculatePricing), planController.calculatePricing);
exports.default = router;
