import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';

export interface IPlanFeature {
  name: string;
  description?: string;
  included: boolean;
}

export interface IPricingTier {
  monthly: number;
  yearly: number;
  currency: string;
}

export interface IPlanDoc extends mongoose.Document {
  name: string;
  slug: string;
  description: string;
  category: 'document-control' | 'audit-management' | 'capa-management' | 'risk-management';
  pricing: IPricingTier;
  features: IPlanFeature[];
  userLimit: number;
  workspaceLimit: number;
  cloudStorage: number; // in GB
  emailBoarding: boolean;
  certifications: string[];
  isActive: boolean;
  isPopular: boolean;
  createdAt: Date;
  updatedAt: Date;
  yearlyDiscount: number; // virtual property
}

export interface IPlanModel extends mongoose.Model<IPlanDoc> {
  paginate(filter: object, options: object): Promise<any>;
  getActiveByCategory(category: string): Promise<IPlanDoc[]>;
  getActivePlans(): Promise<IPlanDoc[]>;
  getPopularPlans(): Promise<IPlanDoc[]>;
}

const planFeatureSchema = new mongoose.Schema<IPlanFeature>({
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

const pricingTierSchema = new mongoose.Schema<IPricingTier>({
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

const planSchema = new mongoose.Schema<IPlanDoc, IPlanModel>(
  {
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
  },
  {
    timestamps: true,
  }
);

// Add plugins
planSchema.plugin(toJSON);
planSchema.plugin(paginate);

// Indexes
planSchema.index({ category: 1, isActive: 1 });
planSchema.index({ slug: 1 });
planSchema.index({ isPopular: -1, 'pricing.monthly': 1 });

// Virtual for yearly discount percentage
planSchema.virtual('yearlyDiscount').get(function (this: IPlanDoc) {
  const monthlyTotal = this.pricing.monthly * 12;
  const yearlyPrice = this.pricing.yearly;
  return Math.round(((monthlyTotal - yearlyPrice) / monthlyTotal) * 100);
});

// Static method to get active plans by category
planSchema.statics['getActiveByCategory'] = function (category: string) {
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

const Plan = mongoose.model<IPlanDoc, IPlanModel>('Plan', planSchema);

export default Plan;