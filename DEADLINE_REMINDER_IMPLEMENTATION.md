# CAPA Action Deadline Reminder Implementation

## Overview
A deadline reminder notification system has been implemented for CAPA actions using node-cron. This automatically sends notifications to assigned users as task deadlines approach.

## Changes Made

### 1. **nodeCrone.ts** - Added Deadline Reminder Cron Job
**File**: `src/modules/utils/nodeCrone.ts`

**What was added:**
- A new cron job that runs **every hour at minute 0** (`0 * * * *`)
- Automatically finds CAPA actions with deadlines within the next 24 hours
- Sends reminder notifications to all assigned users

**Features:**
- ✅ Runs hourly to check for approaching deadlines
- ✅ Only notifies for non-completed, non-deleted actions
- ✅ Calculates human-readable time remaining (hours/days)
- ✅ Sends both in-app and email notifications
- ✅ Includes direct link to the task in the notification
- ✅ Error handling for failed notifications

**Notification Types:**
- Title: "Task Deadline Reminder"
- Message: `⏰ Reminder: The task "Task Name" in Library Name is due in X hours/days`
- Type: `taskdeadlinereminder` (socket event)
- Includes email notification

### 2. **action.service.ts** - Updated createAction Function
**File**: `src/modules/capa/workspace/capalibrary/action/action.service.ts`

**Changes:**
- Removed duplicate condition checking
- Added comment noting that deadline reminders are automatically handled by the cron job
- Maintains existing assignment notification functionality

## How It Works

### Cron Schedule
```
0 * * * *
│ │ │ │ │
│ │ │ │ └─ Day of week (any)
│ │ │ └─── Month (any)
│ │ └───── Day of month (any)
│ └─────── Hour (any)
└───────── Minute (0 - runs every hour at the top of the hour)
```

### Notification Flow
1. **Hourly Check**: Cron job queries all actions with `endDate` within next 24 hours
2. **Filter Criteria**:
   - `isDeleted: false` - Only active actions
   - `status: { $ne: 'completed' }` - Not already completed
   - `endDate: { $gte: now, $lte: oneDayLater }` - Deadline within 24 hours
3. **Time Calculation**:
   - If less than 1 hour: "less than 1 hour"
   - If less than 24 hours: "X hours"
   - If 24 hours or more: "X days"
4. **Notification Delivery**: Sends to each assigned user with:
   - Personalized message with time remaining
   - Task details and library name
   - Direct link to task
   - Email notification enabled

## Notification Parameters

```typescript
{
  userId: account.user._id,
  title: 'Task Deadline Reminder',
  message: `⏰ Reminder: The task "${action.name}" in ${library.name} is due in ${timeRemaining}`,
  type: 'task',
  notificationFor: 'Action',
  forId: action._id,
  sendEmailNotification: true,
  accountId: account._id,
  subId: account.accountId,
  link: `/capa/${action.library}/workspace/actions/${action._id}`,
}
```

## Socket Event Type
- **Event**: `taskdeadlinereminder`
- **Sent to**: `workspace._id` (from library.workspace)

## Configuration
To adjust the reminder timing, modify the cron schedule in `nodeCrone.ts`:

| Schedule | Meaning |
|----------|---------|
| `0 * * * *` | Every hour (current) |
| `0 9 * * *` | Every day at 9 AM |
| `0 9 * * MON` | Every Monday at 9 AM |
| `0 */4 * * *` | Every 4 hours |
| `0 0 * * *` | Every day at midnight |

## Testing

To test the deadline reminder functionality:

1. Create a CAPA action with:
   - Assign it to one or more users
   - Set `endDate` to within the next 24 hours
   - Ensure `status` is NOT "completed"

2. The cron job will automatically:
   - Run at the top of each hour
   - Detect this action
   - Send notifications to assigned users

3. Check logs for output like:
   ```
   ⏰ Cron Job Started: Checking CAPA action deadlines
   📋 Found X actions with upcoming deadlines
   ✅ Deadline reminder sent to user@example.com for task: Task Name
   🎉 Deadline Reminder Cron Job Completed Successfully
   ```

## Integration Points

The implementation integrates with:
- **Action Model**: `src/modules/capa/workspace/capalibrary/action/action.modal.ts`
- **Account Model**: `src/modules/account/account.modal.ts`
- **Notification Service**: `src/modules/notification/notification.services.ts` (`createNotification`)
- **Database**: MongoDB queries for actions and accounts

## Error Handling

The cron job includes comprehensive error handling:
- Try-catch blocks for database queries
- Individual notification error handling
- Detailed console logging for debugging
- Non-blocking error handling (one failed notification doesn't stop others)

## Dependencies

- **node-cron**: Already installed (`^4.2.1`)
- **mongoose**: Used for queries
- **Existing notification infrastructure**: Uses existing `createNotification` function

## Future Enhancements

Possible improvements:
- Add configurable reminder time before deadline (e.g., 48 hours, 72 hours)
- Store reminder history to avoid duplicate notifications
- Add user preference for reminder frequency
- Implement multiple reminder levels (warning, critical, overdue)
- Add batch email sending for efficiency
