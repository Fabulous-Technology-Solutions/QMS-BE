import User from '../user/user.model';
import { syncUserWithStripe } from './subscription.service';

/**
 * Migration script to sync existing users with Stripe customers
 * Run this once after implementing the Stripe integration
 */
export const migrateUsersToStripe = async (): Promise<void> => {
  try {
    console.log('Starting user migration to Stripe...');

    // Find all users without a Stripe customer ID
    const usersWithoutStripeId = await User.find({
      $or: [
        { stripeCustomerId: { $exists: false } },
        { stripeCustomerId: null },
        { stripeCustomerId: '' }
      ]
    });

    console.log(`Found ${usersWithoutStripeId.length} users without Stripe customer ID`);

    let successCount = 0;
    let errorCount = 0;

    for (const user of usersWithoutStripeId) {
      try {
        const stripeCustomerId = await syncUserWithStripe(user._id.toString());
        console.log(`✅ Synced user ${user.email} with Stripe customer ${stripeCustomerId}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to sync user ${user.email}:`, error);
        errorCount++;
      }
    }

    console.log(`Migration completed: ${successCount} successful, ${errorCount} failed`);
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

/**
 * Function to run the migration from command line
 * Usage: node -e "require('./dist/src/modules/subscription/migration').runMigration()"
 */
export const runMigration = async (): Promise<void> => {
  try {
    // Connect to MongoDB (you might need to adjust this based on your setup)
    const mongoose = require('mongoose');
    await mongoose.connect('mongodb://localhost:27017/qms');
    
    await migrateUsersToStripe();
    
    await mongoose.disconnect();
    console.log('Migration completed and database connection closed');
  } catch (error) {
    console.error('Migration script failed:', error);
    process.exit(1);
  }
};
