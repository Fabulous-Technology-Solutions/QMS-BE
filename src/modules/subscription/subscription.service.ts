import Subscription from './subscription.model';
import Plan from '../plans/plans.modal';
import User from '../user/user.model';
import { ApiError } from '../errors';
import httpStatus from 'http-status';
import subscriptionUtils from '../utils/subscription.utils';
import {
  ISubscription,
  ICreateSubscriptionRequest,
  IUpdateSubscriptionRequest,
  ISubscriptionWithDetails,
  IPaymentMethodRequest,
  ImoduleswithWorkspaces,
} from './subscription.interfaces';
import Stripe from 'stripe';
import mongoose from 'mongoose';



/**
 * Create a new                                                                                                                                        subscription
 */
export const createSubscription = async (data: ICreateSubscriptionRequest): Promise<ISubscription> => {
  const { userId, planId, priceId, paymentMethodId, billingCycle } = data;

  try {
    // Validate plan exists
    const plan = await Plan.findById(planId);
    if (!plan) {
      throw new ApiError('Plan not found', httpStatus.NOT_FOUND,);
    }

    // Check if user already has an active subscription
    const existingSubscription = await Subscription.findOne({
      userId,
      planId,
      status: { $in: ['active', 'trialing'] },
    });

    if (existingSubscription) {
      throw new ApiError('User already has an active subscription', httpStatus.BAD_REQUEST);
    }

    // Create Stripe customer if not exists (you'll need to implement this based on your user model)
    // For now, assuming stripeCustomerId is passed or retrieved from user
    const stripeCustomerId = await getOrCreateStripeCustomer(userId);

    // Attach payment method to customer
    await subscriptionUtils.attachPaymentMethod({
      paymentMethodId,
      customerId: stripeCustomerId,
    });

    // Create Stripe subscription
    const stripeSubscription = await subscriptionUtils.createSubscription({
      customerId: stripeCustomerId,
      priceId,
    });

    console.log('Stripe subscription created:', stripeSubscription);

    let invoice: Stripe.Invoice | undefined;
    if (stripeSubscription.latest_invoice && typeof stripeSubscription.latest_invoice !== 'string') {
      invoice = stripeSubscription.latest_invoice as Stripe.Invoice;
    }


    const endTimestamp = invoice?.lines?.data?.[0]?.period?.end;
    // Create local subscription record
    const subscription = await Subscription.create({
      userId,
      planId,
      stripeCustomerId,
      stripeSubscriptionId: stripeSubscription.id,
      stripePriceId: priceId,
      status: stripeSubscription.status,
      billingCycle,
      currentPeriodStart: stripeSubscription.start_date
        ? new Date(stripeSubscription.start_date * 1000)
        : undefined,
      currentPeriodEnd: endTimestamp ? new Date(endTimestamp * 1000) : undefined,
      paymentMethodId,
      trialStart: stripeSubscription.trial_start
        ? new Date(stripeSubscription.trial_start * 1000)
        : undefined,
      trialEnd: stripeSubscription.trial_end
        ? new Date(stripeSubscription.trial_end * 1000)
        : undefined,
    });


    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

/**
 * Get user's subscription
 */
export const getUserSubscription = async (userId: string): Promise<ISubscriptionWithDetails[]> => {
  const subscription = await Subscription.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        status: { $in: ['active', 'trialing', 'past_due'] },
      },
    },
    {
      $lookup: {
        from: 'plans',
        localField: 'planId',
        foreignField: '_id',
        as: 'plan',
      },
    },
    {
      $unwind: {
        path: '$plan',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        userId: 1,
        planId: 1,
        status: 1,
        billingCycle: 1,
        currentPeriodStart: 1,
        currentPeriodEnd: 1,
        name: '$plan.name',
        category: '$plan.category',
        description: '$plan.description',
        features: '$plan.features'
      },
    },
  ]);

  return subscription as ISubscriptionWithDetails[];
};
export const getActiveSubscriptionwithPlan = async (userId: string): Promise<ISubscriptionWithDetails[]> => {
  const subscription = await Subscription.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        status: { $in: ['active', 'trialing', 'past_due'] },
      },
    },
    {
      $lookup: {
        from: 'plans',
        localField: 'planId',
        foreignField: '_id',
        as: 'plan',
      },
    },
    {
      $unwind: {
        path: '$plan',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        userId: 1,
        planId: 1,
        name: '$plan.name',
        category: '$plan.category',
        description: '$plan.description',
        features: '$plan.features',
        userLimit: "$plan.userLimit",
        workspaceLimit: "$plan.workspaceLimit",
        cloudStorage: "$plan.cloudStorage",
        certifications: "$plan.certifications",
        pricing: "$plan.pricing",
        subscription: {
          id: "$_id",
          status: "$status",
          billingCycle: "$billingCycle",
          currentPeriodStart: "$currentPeriodStart",
          currentPeriodEnd: "$currentPeriodEnd",
        }


      },
    },
  ]);

  return subscription as ISubscriptionWithDetails[];
};

export const getUserSubscriptionsandWorkspaces = async (userId: string): Promise<ImoduleswithWorkspaces[]> => {
  const subscription = await Subscription.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        status: { $in: ['active', 'trialing', 'past_due'] },
      },
    },
    {
      $lookup: {
        from: 'plans',
        localField: 'planId',
        foreignField: '_id',
        as: 'plan',
      },
    },
    {
      $unwind: {
        path: '$plan',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'capaworkspaces',
        let: { moduleId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$moduleId', '$$moduleId'] },
                  { $eq: ['$isDeleted', false] }
                ]
              }
            }
          }
        ],
        as: 'workspaces'
      }
    },

    {
      $project: {
        _id: 1,
        status: 1,
        name: '$plan.name',
        workspaces: {
          $map: {
            input: '$workspaces',
            as: 'ws',
            in: {
              _id: '$$ws._id',
              name: '$$ws.name',
              createdAt: '$$ws.createdAt'
            }
          }
        }

      },
    },
  ]);

  return subscription as ImoduleswithWorkspaces[];
};





/**
 * Get subscription by ID
 */
export const getSubscriptionById = async (subscriptionId: string): Promise<ISubscription> => {
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) {
    throw new ApiError('Subscription not found', httpStatus.NOT_FOUND);
  }
  return subscription;
};

/**
 * Update subscription
 */
export const updateSubscription = async (data: IUpdateSubscriptionRequest): Promise<ISubscription> => {
  const { subscriptionId, newPriceId, newPaymentMethodId, cancelAtPeriodEnd } = data;

  try {
    const subscription = await getSubscriptionById(subscriptionId);

    // Update Stripe subscription if needed
    if (newPriceId) {
      await subscriptionUtils.upgradeSubscription({
        subscriptionId: subscription.stripeSubscriptionId,
        newPriceId,
      });
      subscription.stripePriceId = newPriceId;
    }

    if (newPaymentMethodId) {
      await subscriptionUtils.updateSubscriptionPaymentMethod(
        subscription.stripeSubscriptionId,
        newPaymentMethodId
      );
      subscription.paymentMethodId = newPaymentMethodId;
    }

    if (cancelAtPeriodEnd !== undefined) {
      // Update Stripe subscription to cancel at period end
      if (cancelAtPeriodEnd) {
        await subscriptionUtils.cancelSubscription({
          subscriptionId: subscription.stripeSubscriptionId,
        });
      }
      subscription.cancelAtPeriodEnd = cancelAtPeriodEnd;
    }

    await subscription.save();
    return subscription;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

/**
 * Cancel subscription
 */
export const cancelSubscription = async (subscriptionId: string): Promise<ISubscription> => {
  try {
    const subscription = await getSubscriptionById(subscriptionId);

    // Cancel in Stripe
    await subscriptionUtils.cancelSubscription({
      subscriptionId: subscription.stripeSubscriptionId,
    });

    // Update local record
    subscription.status = 'canceled';
    subscription.canceledAt = new Date();
    subscription.cancelAtPeriodEnd = true;

    await subscription.save();
    return subscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

/**
 * Update payment method
 */
export const updatePaymentMethod = async (data: IPaymentMethodRequest): Promise<void> => {
  const { customerId, paymentMethodId } = data;

  try {
    // Attach new payment method
    await subscriptionUtils.attachPaymentMethod({
      paymentMethodId,
      customerId,
    });

    // Update all active subscriptions for this customer
    const subscriptions = await Subscription.find({
      stripeCustomerId: customerId,
      status: { $in: ['active', 'trialing'] },
    });

    for (const subscription of subscriptions) {
      await subscriptionUtils.updateSubscriptionPaymentMethod(
        subscription.stripeSubscriptionId,
        paymentMethodId
      );
      subscription.paymentMethodId = paymentMethodId;
      await subscription.save();
    }
  } catch (error) {
    console.error('Error updating payment method:', error);
    throw error;
  }
};

/**
 * Get customer's payment methods
 */
export const getPaymentMethods = async (customerId: string) => {
  try {
    return await subscriptionUtils.getPaymentMethods(customerId);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
};

/**
 * Create setup intent for saving payment method
 */
export const createSetupIntent = async (customerId: string) => {
  try {
    return await subscriptionUtils.createSetupIntent(customerId);
  } catch (error) {
    console.error('Error creating setup intent:', error);
    throw error;
  }
};

/**
 * Create customer portal session
 */
export const createCustomerPortalSession = async (customerId: string, returnUrl: string) => {
  try {
    return await subscriptionUtils.createCustomerPortalSession(customerId, returnUrl);
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    throw error;
  }
};

/**
 * Handle Stripe webhook events
 */
export const handleWebhookEvent = async (event: any): Promise<void> => {
  try {
    switch (event.type) {
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error handling webhook event:', error);
    throw error;
  }
};

// Helper functions
async function getOrCreateStripeCustomer(userId: string): Promise<string> {
  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError('User not found', httpStatus.NOT_FOUND);
    }

    // If user already has a Stripe customer ID, return it
    if (user.stripeCustomerId) {
      return user.stripeCustomerId;
    }

    // Create a new Stripe customer using the utils
    const stripeCustomer = await subscriptionUtils.createCustomer({
      email: user.email,
      name: `${user.name}`,
      metadata: {
        userId: user._id.toString(),
        name: `${user.name}`
      },
      ...(user.contact && { phone: user.contact }), // Add phone if available
    });

    // Save the Stripe customer ID to the user record
    user.stripeCustomerId = stripeCustomer.id;
    await user.save();

    return stripeCustomer.id;
  } catch (error) {
    console.error('Error creating/retrieving Stripe customer:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to create Stripe customer', httpStatus.INTERNAL_SERVER_ERROR);
  }
}

async function handleSubscriptionUpdated(subscription: any): Promise<void> {
  const localSubscription = await Subscription.findOne({
    stripeSubscriptionId: subscription.id,
  });

  if (localSubscription) {
    localSubscription.status = subscription.status;
    await localSubscription.save();
  }
}

async function handleSubscriptionDeleted(subscription: any): Promise<void> {
  const localSubscription = await Subscription.findOne({
    stripeSubscriptionId: subscription.id,
  });

  if (localSubscription) {
    localSubscription.status = 'canceled';
    localSubscription.canceledAt = new Date();
    await localSubscription.save();
  }
}

async function handlePaymentSucceeded(invoice: any): Promise<void> {
  if (invoice.subscription) {
    const localSubscription = await Subscription.findOne({
      stripeSubscriptionId: invoice.subscription,
    });

    if (localSubscription) {
      localSubscription.lastPaymentDate = new Date();
      localSubscription.nextPaymentDate = new Date(invoice.next_payment_attempt * 1000);
      await localSubscription.save();
    }
  }
}

async function handlePaymentFailed(invoice: any): Promise<void> {
  if (invoice.subscription) {
    const localSubscription = await Subscription.findOne({
      stripeSubscriptionId: invoice.subscription,
    });

    if (localSubscription) {
      localSubscription.status = 'past_due';
      await localSubscription.save();
    }
  }
}

/**
 * Get user's Stripe customer ID
 */
export const getUserStripeCustomerId = async (userId: string): Promise<string> => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError('User not found', httpStatus.NOT_FOUND);
    }

    if (!user.stripeCustomerId) {
      // If user doesn't have a Stripe customer ID, create one
      return await getOrCreateStripeCustomer(userId);
    }

    return user.stripeCustomerId;
  } catch (error) {
    console.error('Error getting user Stripe customer ID:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to get Stripe customer ID', httpStatus.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Sync existing user with Stripe customer (for users who don't have stripeCustomerId)
 */
export const syncUserWithStripe = async (userId: string): Promise<string> => {
  return await getOrCreateStripeCustomer(userId);
};

/**
 * Update Stripe customer information
 */
export const updateStripeCustomer = async (userId: string, updateData: {
  email?: string;
  name?: string;
  phone?: string;
}): Promise<void> => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError('User not found', httpStatus.NOT_FOUND);
    }

    const stripeCustomerId = await getUserStripeCustomerId(userId);

    await subscriptionUtils.updateCustomer(stripeCustomerId, updateData);
  } catch (error) {
    console.error('Error updating Stripe customer:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to update Stripe customer', httpStatus.INTERNAL_SERVER_ERROR);
  }
};
