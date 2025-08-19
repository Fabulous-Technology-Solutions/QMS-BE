"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const toJSON_1 = __importDefault(require("../toJSON/toJSON"));
const paginate_1 = __importDefault(require("../paginate/paginate"));
const planFeatureSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    included: {
        type: Boolean,
        required: true,
        default: true,
    },
});
const pricingTierSchema = new mongoose_1.default.Schema({
    monthly: {
        type: Number,
        required: true,
        min: 0,
    },
    yearly: {
        type: Number,
        required: true,
        min: 0,
    },
    currency: {
        type: String,
        required: true,
        default: 'USD',
        uppercase: true,
    },
});
const planSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['document-control', 'audit-management', 'capa-management', 'risk-management'],
    },
    pricing: {
        type: pricingTierSchema,
        required: true,
    },
    features: [planFeatureSchema],
    userLimit: {
        type: Number,
        required: true,
        min: 1,
        default: 10,
    },
    workspaceLimit: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    cloudStorage: {
        type: Number,
        required: true,
        min: 1,
        default: 100, // GB
    },
    emailBoarding: {
        type: Boolean,
        default: true,
    },
    certifications: {
        type: [String],
        default: [],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isPopular: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// Add plugins
planSchema.plugin(toJSON_1.default);
planSchema.plugin(paginate_1.default);
// Indexes
planSchema.index({ category: 1, isActive: 1 });
planSchema.index({ slug: 1 });
planSchema.index({ isPopular: -1, 'pricing.monthly': 1 });
// Virtual for yearly discount percentage
planSchema.virtual('yearlyDiscount').get(function () {
    const monthlyTotal = this.pricing.monthly * 12;
    const yearlyPrice = this.pricing.yearly;
    return Math.round(((monthlyTotal - yearlyPrice) / monthlyTotal) * 100);
});
// Static method to get active plans by category
planSchema.statics['getActiveByCategory'] = function (category) {
    return this.find({ category, isActive: true }).sort({ 'pricing.monthly': 1 });
};
// Static method to get all active plans
planSchema.statics['getActivePlans'] = function () {
    return this.find({ isActive: true }).sort({ 'pricing.monthly': 1 });
};
// Static method to get popular plans
planSchema.statics['getPopularPlans'] = function () {
    return this.find({ isActive: true, isPopular: true }).sort({ 'pricing.monthly': 1 });
};
// Pre-save middleware to generate slug
planSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    }
    next();
});
const Plan = mongoose_1.default.model('Plan', planSchema);
exports.default = Plan;
