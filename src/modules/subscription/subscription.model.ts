import mongoose from 'mongoose';
import { ISubscription } from './subscription.interfaces';

const subscriptionSchema = new mongoose.Schema<ISubscription>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Plan',
    },
    stripeCustomerId: {
      type: String,
      required: true,
    },
    stripeSubscriptionId: {
      type: String,
      required: true,
      unique: true,
    },
    stripePriceId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid'],
      default: 'incomplete',
    },
    billingCycle: {
      type: String,
      required: true,
      enum: ['monthly', 'yearly'],
    },
    currentPeriodStart: {
      type: Date,
      required: true,
    },
    currentPeriodEnd: {
      type: Date,
      required: true,
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
    canceledAt: {
      type: Date,
    },
    trialStart: {
      type: Date,
    },
    trialEnd: {
      type: Date,
    },
    paymentMethodId: {
      type: String,
    },
    lastPaymentDate: {
      type: Date,
    },
    nextPaymentDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    discriminatorKey: 'role' 
  }
);

// Indexes for better query performance
subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ stripeCustomerId: 1 });
subscriptionSchema.index({ stripeSubscriptionId: 1 });
subscriptionSchema.index({ status: 1 });

// Static methods
subscriptionSchema.statics['findByUser'] = function (userId: string) {
  return this.findOne({ userId, status: { $in: ['active', 'trialing'] } });
};

subscriptionSchema.statics['findByStripeId'] = function (stripeSubscriptionId: string) {
  return this.findOne({ stripeSubscriptionId });
};

subscriptionSchema.statics['findActiveSubscriptions'] = function () {
  return this.find({ status: { $in: ['active', 'trialing'] } });
};

// Virtual for checking if subscription is active
subscriptionSchema.virtual('isActive').get(function () {
  return ['active', 'trialing'].includes(this.status);
});

// Virtual for checking if subscription is in trial
subscriptionSchema.virtual('isInTrial').get(function () {
  return this.status === 'trialing' && this.trialEnd && new Date() < this.trialEnd;
});

// Virtual for days remaining in trial
subscriptionSchema.virtual('trialDaysRemaining').get(function () {
  if (!this.trialEnd) return 0;
  const now = new Date();
  const trialEnd = new Date(this.trialEnd);
  const diffTime = trialEnd.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
});

const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema);

export default Subscription;
