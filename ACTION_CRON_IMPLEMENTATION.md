# CAPA Action Deadline Reminder - Separate Cron Job

## Overview
A dedicated deadline reminder notification system has been implemented for CAPA actions using node-cron. This system is now in a separate module file within the action folder for better organization and maintainability.

## File Structure
```
src/modules/capa/workspace/capalibrary/action/
├── action.modal.ts
├── action.interfaces.ts
├── action.controller.ts
├── action.service.ts
├── action.validation.ts
├── action.cron.ts          ← NEW: Deadline reminder cron job
├── index.ts                ← UPDATED: Exports ActionCron
└── ...
```

## Files Changed

### 1. **action.cron.ts** (NEW)
**Location**: `src/modules/capa/workspace/capalibrary/action/action.cron.ts`

```typescript
export const startActionDeadlineReminderCron = () => {
  // Runs every hour at minute 0
  // Finds actions with deadlines within 24 hours
  // Sends notifications to all assigned users
}
```

**Features:**
- ✅ Runs hourly to check for approaching deadlines
- ✅ Filters actions with deadlines in next 24 hours
- ✅ Sends notifications to all assigned users
- ✅ Calculates human-readable time remaining
- ✅ Includes error handling and logging

### 2. **action/index.ts** (UPDATED)
Now exports the ActionCron module:

```typescript
import * as ActionCron from './action.cron';
export { ActionController, ActionValidation, ActionService, ActionCron };
```

### 3. **src/index.ts** (UPDATED)
Initializes the cron job on server startup:

```typescript
import { ActionCron } from './modules/capa/workspace/capalibrary/action';

mongoose.connect(config.mongoose.url).then(() => {
  // ... other initialization code ...
  
  // Initialize Action Deadline Reminder Cron Job
  ActionCron.startActionDeadlineReminderCron();
  
  logger.info('Action Deadline Reminder Cron Job initialized');
});
```

### 4. **nodeCrone.ts** (CLEANED UP)
Removed action-related cron code, keeping only the Report generation cron job.

### 5. **action.service.ts** (COMMENT UPDATED)
Updated reference from main nodeCrone to the new action.cron file:

```typescript
// Note: Deadline reminders are automatically sent by the cron job 
// (action.cron.ts) for actions with upcoming deadlines within 24 hours
```

## How It Works

### Initialization Flow
1. **Server Startup** (`src/index.ts`)
   - MongoDB connection established
   - Socket initialized
   - **ActionCron.startActionDeadlineReminderCron()** called

2. **Cron Job Registration** (`action.cron.ts`)
   - Registers cron schedule: `0 * * * *` (every hour at minute 0)
   - Sets up polling for upcoming deadlines

3. **Hourly Execution**
   - Query for actions with:
     - `isDeleted: false`
     - `status !== 'completed'`
     - `endDate` within next 24 hours
   - For each action with assigned users:
     - Calculate time remaining
     - Send notification to each assigned user
     - Log success/failure

### Notification Details
```typescript
{
  userId: account.user._id,
  title: 'Task Deadline Reminder',
  message: `⏰ Reminder: The task "Task Name" in Library Name is due in X hours/days`,
  type: 'task',
  notificationFor: 'Action',
  forId: action._id,
  sendEmailNotification: true,
  accountId: account._id,
  subId: account.accountId,
  link: `/capa/${action.library}/workspace/actions/${action._id}`,
}
```

**Socket Event**: `taskdeadlinereminder`

## Cron Schedule

The current schedule is set to run **every hour**:
```
0 * * * *
│ │ │ │ │
│ │ │ │ └─ Day of week (any)
│ │ │ └─── Month (any)
│ │ └───── Day of month (any)
│ └─────── Hour (any)
└───────── Minute (0 - runs every hour at the top)
```

### To Customize Schedule

Modify the schedule string in `action.cron.ts`:

| Schedule | Meaning |
|----------|---------|
| `0 * * * *` | Every hour (current) |
| `0 9 * * *` | Every day at 9 AM |
| `0 9 * * MON` | Every Monday at 9 AM |
| `0 */4 * * *` | Every 4 hours |
| `0 0 * * *` | Every day at midnight |
| `*/30 * * * *` | Every 30 minutes |

## Time Remaining Calculation

The system intelligently formats time remaining:

```
if (hoursRemaining < 1)
  → "less than 1 hour"

else if (hoursRemaining < 24)
  → "X hours" or "X hour" (singular)

else
  → "X days" or "X day" (singular)
```

## Testing

### Create a Test Action
1. Create a CAPA action with:
   - Name: "Test Task"
   - Assigned to: One or more users
   - End Date: Within next 24 hours (e.g., 12 hours from now)
   - Status: "pending" or "in-progress"

2. Wait for the next hour mark (minute 0)

3. Check logs for output:
   ```
   ⏰ Cron Job Started: Checking CAPA action deadlines
   📋 Found 1 actions with upcoming deadlines
   ✅ Deadline reminder sent to user@example.com for task: Test Task
   🎉 Deadline Reminder Cron Job Completed Successfully
   ```

### Verify Notifications
- Check notification database for `taskdeadlinereminder` events
- Check email logs for deadline reminder emails
- Users should see in-app notifications

## Benefits of Separate Cron File

✅ **Better Organization**: Cron logic stays with action module
✅ **Easier Maintenance**: Changes to action cron don't affect report cron
✅ **Scalability**: Easy to add more action-related cron jobs
✅ **Testing**: Can be tested independently
✅ **Reusability**: Can be called from multiple places if needed
✅ **Clear Separation of Concerns**: Each module manages its own cron jobs

## Error Handling

The cron job includes comprehensive error handling:

1. **Query Errors**: Caught and logged at the top level
2. **Individual Notification Errors**: Don't stop other notifications
3. **Logging**: Detailed console logging for debugging
4. **Graceful Degradation**: Continues even if some notifications fail

## Logs

The system logs:
```
✅ Success: ⏰ Cron Job Started: Checking CAPA action deadlines
✅ Success: 📋 Found X actions with upcoming deadlines
✅ Success: ✅ Deadline reminder sent to user@email.com for task: Task Name
✅ Success: 🎉 Deadline Reminder Cron Job Completed Successfully

❌ Error: ❌ Failed to send notification for task {actionId}: {error}
❌ Error: ❌ Deadline Reminder Cron Job Error: {error}
```

## Integration Points

The system integrates with:
- **Action Model**: `action.modal.ts`
- **Account Model**: `src/modules/account/account.modal.ts`
- **Notification Service**: `src/modules/notification/notification.services.ts`
- **MongoDB**: Queries for actions and accounts
- **Socket.io**: Sends notifications via `taskdeadlinereminder` event

## Dependencies

- **node-cron**: `^4.2.1` (already installed)
- **mongoose**: Already used in project
- **Existing notification infrastructure**: Uses `createNotification` function

## Future Enhancements

Possible improvements:
- [ ] Add configurable reminder times (48 hours, 72 hours before deadline)
- [ ] Store reminder history to avoid duplicate notifications
- [ ] Add user preferences for reminder frequency
- [ ] Implement multiple reminder levels (warning, critical, overdue)
- [ ] Batch email notifications for efficiency
- [ ] Add task status updates to remind notifications
- [ ] Create admin dashboard for cron job monitoring
