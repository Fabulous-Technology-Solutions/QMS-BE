"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigration = exports.migrateUsersToStripe = void 0;
const user_model_1 = __importDefault(require("../user/user.model"));
const subscription_service_1 = require("./subscription.service");
/**
 * Migration script to sync existing users with Stripe customers
 * Run this once after implementing the Stripe integration
 */
const migrateUsersToStripe = async () => {
    try {
        console.log('Starting user migration to Stripe...');
        // Find all users without a Stripe customer ID
        const usersWithoutStripeId = await user_model_1.default.find({
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
                const stripeCustomerId = await (0, subscription_service_1.syncUserWithStripe)(user._id.toString());
                console.log(`✅ Synced user ${user.email} with Stripe customer ${stripeCustomerId}`);
                successCount++;
            }
            catch (error) {
                console.error(`❌ Failed to sync user ${user.email}:`, error);
                errorCount++;
            }
        }
        console.log(`Migration completed: ${successCount} successful, ${errorCount} failed`);
    }
    catch (error) {
        console.error('Migration failed:', error);
        throw error;
    }
};
exports.migrateUsersToStripe = migrateUsersToStripe;
/**
 * Function to run the migration from command line
 * Usage: node -e "require('./dist/src/modules/subscription/migration').runMigration()"
 */
const runMigration = async () => {
    try {
        // Connect to MongoDB (you might need to adjust this based on your setup)
        const mongoose = require('mongoose');
        await mongoose.connect('mongodb://localhost:27017/qms');
        await (0, exports.migrateUsersToStripe)();
        await mongoose.disconnect();
        console.log('Migration completed and database connection closed');
    }
    catch (error) {
        console.error('Migration script failed:', error);
        process.exit(1);
    }
};
exports.runMigration = runMigration;
