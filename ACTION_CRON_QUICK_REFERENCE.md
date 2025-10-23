# Action Cron Job - Quick Reference

## Current Configuration

**File**: `src/modules/capa/workspace/capalibrary/action/action.cron.ts`

**Schedule**: `* * * * *` (Every minute - for testing)

**Socket Event**: `taskdeadlinereminder`

**For Production**, change to: `0 * * * *` (Every hour at minute 0)

## What the Cron Job Does

1. ✅ Runs on schedule (currently every minute)
2. ✅ Finds actions with deadline within next 24 hours
3. ✅ Filters out: deleted, completed, unassigned actions
4. ✅ For each eligible action:
   - Calculates time remaining (hours/days)
   - Gets all assigned accounts
   - Sends notification to each assigned user
   - Includes action name, library name, time remaining
   - Includes email notification
5. ✅ Logs success/failure of each operation

## Fixed Issues

### Issue 1: StrictPopulateError
**Error**: `Cannot populate path 'library.workspace.organization'`
**Fixed**: Removed non-existent `organization` populate

### Issue 2: Missing Link Fields
**Error**: Trying to access `moduleId` on workspace
**Fixed**: Simplified link to `/capa/workspace/{WORKSPACE_ID}/my-tasks`

## Testing Quick Start

### 1. Create Test Action
```bash
POST /api/capa/{moduleId}/workspace/{workspaceId}/library/{libraryId}/action

{
  "name": "Test Task",
  "assignedTo": ["ACCOUNT_ID"],
  "endDate": "2025-10-23T22:00:00Z",  // 12 hours from now
  "status": "pending"
}
```

### 2. Watch Server Logs
```
⏰ Cron Job Started: Checking CAPA action deadlines
📋 Found 1 actions with upcoming deadlines
✅ Deadline reminder sent to user@example.com for task: Test Task
🎉 Deadline Reminder Cron Job Completed Successfully
```

### 3. Verify Notifications
Database query:
```javascript
db.notifications.findOne({ 
  forId: ObjectId("ACTION_ID"),
  type: "task"
})
```

## File Structure

```
src/modules/capa/workspace/capalibrary/action/
├── action.cron.ts          ← Main cron file
├── action.service.ts       ← Action CRUD operations
├── action.modal.ts         ← Action schema
├── action.controller.ts    ← API endpoints
├── action.interfaces.ts    ← TypeScript interfaces
├── action.validation.ts    ← Request validation
└── index.ts                ← Exports
```

## Initialization

**File**: `src/index.ts`

```typescript
import { ActionCron } from './modules/capa/workspace/capalibrary/action';

// When server starts:
ActionCron.startActionDeadlineReminderCron();
```

## Query Filters

The cron finds actions matching ALL of:
- ✅ `isDeleted: false` - Not deleted
- ✅ `status: { $ne: 'completed' }` - Not completed
- ✅ `endDate: { $gte: now, $lte: now + 24h }` - Deadline within 24 hours

## Notification Structure

```json
{
  "userId": "USER_ID",
  "title": "Task Deadline Reminder",
  "message": "⏰ Reminder: The task 'Task Name' in Library Name is due in 12 hours",
  "type": "task",
  "notificationFor": "Action",
  "forId": "ACTION_ID",
  "sendEmailNotification": true,
  "accountId": "ACCOUNT_ID",
  "subId": "SUBSCRIPTION_ID",
  "link": "/capa/workspace/WORKSPACE_ID/my-tasks"
}
```

## Time Remaining Display

| Condition | Display |
|-----------|---------|
| < 1 hour | "less than 1 hour" |
| 1-23 hours | "X hour(s)" |
| ≥ 24 hours | "X day(s)" |

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| StrictPopulateError | Trying to populate non-existent path | Already fixed ✓ |
| Cannot read property 'workspace' | Action/library not populated | Check populate() calls |
| No notifications created | Action doesn't match filters | Check action status, deadline, assignees |
| Duplicate notifications | Cron runs multiple times | Expected with current schedule |
| Email not sent | Email service issue | Check notification service config |

## Change Schedule

Edit `action.cron.ts`:

```typescript
// Current (for testing - every minute):
cron.schedule('* * * * *', async () => {

// For production (hourly):
cron.schedule('0 * * * *', async () => {

// Every 4 hours:
cron.schedule('0 */4 * * *', async () => {

// Every day at 9 AM:
cron.schedule('0 9 * * *', async () => {
```

## Cron Expression Reference

```
*     *     *     *     *
│     │     │     │     │
│     │     │     │     └─ Day of week (0-7) (0 = Sunday)
│     │     │     └─────── Month (1-12)
│     │     └───────────── Day of month (1-31)
│     └───────────────────── Hour (0-23)
└─────────────────────────── Minute (0-59)
```

## Check If Cron Is Running

1. Look for initialization log when server starts
2. Check console logs for scheduled outputs
3. Query database for recently created notifications
4. Check email logs for sent reminder emails

## Database Queries

### Find Matching Actions
```javascript
db.actions.find({
  isDeleted: false,
  status: { $ne: 'completed' },
  endDate: { $exists: true }
}).sort({ endDate: 1 })
```

### Find Notifications from Last Hour
```javascript
db.notifications.find({
  notificationFor: "Action",
  createdAt: { $gte: new Date(Date.now() - 3600000) }
}).sort({ createdAt: -1 })
```

### Check All Task Reminders
```javascript
db.notifications.find({
  notificationFor: "Action",
  type: "task"
}).limit(20).sort({ createdAt: -1 })
```

## Production Checklist

- [ ] Change cron schedule to `0 * * * *` (hourly)
- [ ] Test with production data
- [ ] Monitor cron execution time
- [ ] Set up error alerts
- [ ] Verify email service is working
- [ ] Check timezone settings
- [ ] Monitor database query performance
- [ ] Add notification deduplication (prevent duplicates)
- [ ] Document in runbooks
- [ ] Set up log aggregation

## Support

For issues:
1. Check server logs for error messages
2. Verify action exists with correct filters
3. Check database for notifications
4. Verify email service configuration
5. Review schema definitions
