import mongoose, { Document } from 'mongoose';
import { IPlanFeature } from '../plans/plans.modal';

export interface ISubscription extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  planId: mongoose.Schema.Types.ObjectId;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
  billingCycle: 'monthly' | 'yearly';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  trialStart?: Date;
  trialEnd?: Date;
  paymentMethodId?: string;
  lastPaymentDate?: Date;
  nextPaymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateSubscriptionRequest {
  userId: string;
  planId: string;
  priceId: string;
  paymentMethodId: string;
  billingCycle: 'monthly' | 'yearly';
}

export interface IUpdateSubscriptionRequest {
  subscriptionId: string;
  newPriceId?: string;
  newPaymentMethodId?: string;
  cancelAtPeriodEnd?: boolean;
}

export interface ISubscriptionWithDetails extends ISubscription {

    name: string;
    category: string;
    features: IPlanFeature;
  
}

export interface IPaymentMethodRequest {
  customerId: string;
  paymentMethodId: string;
}

export interface ICreatePaymentIntentRequest {
  customerId: string;
  priceId: string;
  paymentMethodId: string;
}

export interface IWebhookEvent {
  type: string;
  data: {
    object: any;
  };
}
