# Action Deadline Reminder Cron Job - Testing Guide

## Overview
Complete testing guide for the action deadline reminder cron job functionality.

## Issue Fixed
**Error**: `StrictPopulateError: Cannot populate path 'library.workspace.organization'`
**Solution**: Removed the nested `organization` populate which doesn't exist in the schema. Now only populates `library` and `library.workspace`.

## Manual Testing Steps

### Step 1: Verify Cron Job is Running

Check the server logs when it starts up. You should see:
```
✅ Action Deadline Reminder Cron Job initialized
```

### Step 2: Create Test Action with Deadline in 24 Hours

Use Postman or API client to create an action:

```json
POST /capa/{moduleId}/workspace/{workspaceId}/library/{libraryId}/action

{
  "name": "Test Deadline Task",
  "description": "This task has a deadline in 12 hours",
  "createdBy": "USER_ID",
  "assignedTo": ["ACCOUNT_ID_1", "ACCOUNT_ID_2"],
  "library": "LIBRARY_ID",
  "priority": "high",
  "type": "preventive",
  "startDate": "2025-10-23T10:00:00Z",
  "endDate": "2025-10-23T22:00:00Z",
  "status": "pending"
}
```

### Step 3: Wait for Cron Job to Run

The cron is set to run every minute: `* * * * *`

Check server logs for:
```
⏰ Cron Job Started: Checking CAPA action deadlines
📋 Found 1 actions with upcoming deadlines
workspace ID: [workspace_id]
✅ Deadline reminder sent to user@example.com for task: Test Deadline Task
🎉 Deadline Reminder Cron Job Completed Successfully
```

### Step 4: Verify Notifications Created

1. **Check Database** - Query the notifications collection:
   ```javascript
   db.notifications.find({ 
     forId: ObjectId("ACTION_ID"),
     type: "taskdeadlinereminder"
   })
   ```

2. **Expected Notification Structure**:
   ```json
   {
     "userId": "USER_ID",
     "title": "Task Deadline Reminder",
     "message": "⏰ Reminder: The task \"Test Deadline Task\" in Library Name is due in 12 hours",
     "type": "task",
     "notificationFor": "Action",
     "forId": "ACTION_ID",
     "sendEmailNotification": true,
     "accountId": "ACCOUNT_ID",
     "subId": "SUBSCRIPTION_ID",
     "link": "/capa/workspace/WORKSPACE_ID/my-tasks",
     "createdAt": "2025-10-23T10:00:00Z"
   }
   ```

### Step 5: Verify Email Notifications

Check your email service logs or SMTP logs for:
- Subject: Related to task deadline reminder
- Recipients: All assigned users' email addresses
- Content: Should include task name and time remaining

## Different Test Scenarios

### Scenario 1: Action with Deadline < 1 Hour Away
```json
{
  "endDate": "2025-10-23T10:30:00Z"  // 30 minutes from now
}
```
**Expected Message**: "⏰ Reminder: The task "..." is due in less than 1 hour"

### Scenario 2: Action with Deadline 12 Hours Away
```json
{
  "endDate": "2025-10-23T22:00:00Z"  // 12 hours from now
}
```
**Expected Message**: "⏰ Reminder: The task "..." is due in 12 hours"

### Scenario 3: Action with Deadline 2 Days Away
```json
{
  "endDate": "2025-10-25T10:00:00Z"  // 2 days from now
}
```
**Expected Message**: "⏰ Reminder: The task "..." is due in 2 days"

### Scenario 4: Multiple Assigned Users
Create action with multiple accounts assigned:
```json
{
  "assignedTo": ["ACCOUNT_ID_1", "ACCOUNT_ID_2", "ACCOUNT_ID_3"]
}
```
**Expected**: Each user receives their own notification

### Scenario 5: Action Without Assigned Users (Should Skip)
```json
{
  "assignedTo": []
}
```
**Expected**: Action is skipped, no notification sent
**Log**: No entry for this action

### Scenario 6: Completed Action (Should Skip)
```json
{
  "status": "completed",
  "endDate": "2025-10-23T12:00:00Z"
}
```
**Expected**: Action is skipped
**Log**: Action not included in results

### Scenario 7: Deleted Action (Should Skip)
```json
{
  "isDeleted": true,
  "endDate": "2025-10-23T12:00:00Z"
}
```
**Expected**: Action is skipped
**Log**: Action not included in results

### Scenario 8: Deadline Beyond 24 Hours (Should Skip)
```json
{
  "endDate": "2025-10-25T11:00:00Z"  // More than 24 hours away
}
```
**Expected**: Action is skipped
**Log**: Action not included in results

## Manual Cron Job Testing

### Method 1: Directly Call the Cron Function (for testing)

In your test environment, you can manually trigger the cron:

```typescript
import { ActionCron } from './modules/capa/workspace/capalibrary/action';

// Start the cron job manually
ActionCron.startActionDeadlineReminderCron();

// Cron will run based on schedule
```

### Method 2: Modify Schedule for Testing

Temporarily change the cron schedule in `action.cron.ts` for faster testing:

```typescript
// FOR TESTING: Run every minute
cron.schedule('* * * * *', async () => {
  // ... cron logic
});

// FOR TESTING: Run every 5 seconds (very fast)
cron.schedule('*/5 * * * * *', async () => {  // Note: This requires node-cron config
  // ... cron logic
});
```

## Debugging

### Enable Detailed Logging

The cron job already includes extensive logging. Check for these messages:

```
✅ ⏰ Cron Job Started: Checking CAPA action deadlines
✅ 📋 Found X actions with upcoming deadlines
✅ workspace ID: [workspace_id]
✅ ✅ Deadline reminder sent to user@example.com for task: Task Name
✅ 🎉 Deadline Reminder Cron Job Completed Successfully

❌ ❌ Failed to send notification for task [id]: [error]
❌ ❌ Deadline Reminder Cron Job Error: [error]
```

### Check Common Issues

1. **No Actions Found**
   - Verify action exists with `isDeleted: false`
   - Verify status is NOT `'completed'`
   - Verify `endDate` is within 24 hours from now
   - Check timezone settings

2. **Notifications Not Sending**
   - Verify `accountId` and `subId` exist
   - Check notification service is working
   - Verify email service credentials
   - Check if user account has email linked

3. **Populate Errors**
   - Ensure library is properly referenced
   - Ensure workspace is properly referenced
   - Check schema definitions match actual data

## Expected Behavior

### Hourly Execution
- Runs every 60 minutes (schedule: `* * * * *` = every minute for testing)
- Can be changed to hourly: `0 * * * *`

### Query Performance
- Initial query to find matching actions
- For each action: query for assigned accounts
- For each assigned account: create notification
- All operations include error handling

### Notification Details
- **Socket Event**: `taskdeadlinereminder`
- **Email**: Enabled (`sendEmailNotification: true`)
- **Link**: `/capa/workspace/{WORKSPACE_ID}/my-tasks`

## Database Queries to Verify

### Check if Cron Found Your Action
```javascript
// Query actions that should trigger reminder
db.actions.find({
  isDeleted: false,
  status: { $ne: 'completed' },
  endDate: {
    $gte: ISODate("2025-10-23T10:00:00Z"),
    $lte: ISODate("2025-10-24T10:00:00Z")  // Within 24 hours
  }
})
```

### Check Notifications Created
```javascript
db.notifications.find({
  notificationFor: "Action",
  type: "task"
}).sort({ createdAt: -1 }).limit(10)
```

### Check Specific Action's Notifications
```javascript
db.notifications.find({
  forId: ObjectId("ACTION_ID")
}).sort({ createdAt: -1 })
```

## Performance Considerations

1. **Database Load**: Query runs every minute (adjust schedule as needed)
2. **Large Data Set**: With many actions, consider pagination
3. **Notification Bottleneck**: Email sending might be slowest part
4. **Error Resilience**: Failures in one notification don't stop others

## Success Criteria Checklist

- ✅ Cron job starts without errors
- ✅ Finds actions with deadlines within 24 hours
- ✅ Skips deleted actions
- ✅ Skips completed actions
- ✅ Skips actions without assigned users
- ✅ Calculates time remaining correctly
- ✅ Creates notifications in database
- ✅ Sends emails to all assigned users
- ✅ Logs all operations
- ✅ Handles errors gracefully

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No cron logs | Check if server started successfully, check logs |
| No actions found | Verify action exists and deadline is within 24 hours |
| Populate error | Check schema definitions and references |
| Notifications not sent | Verify notification service and email config |
| Duplicate notifications | Expected - runs every minute, create multiple actions |
| Wrong time calculation | Check server timezone settings |

## Production Considerations

1. **Change Schedule**: Update from every minute to hourly
   ```typescript
   cron.schedule('0 * * * *', async () => {  // Hourly
   ```

2. **Add Notification History**: Prevent duplicate reminders
3. **Batch Email**: Send bulk emails instead of individual
4. **Monitor Performance**: Track cron execution time
5. **Error Alerts**: Set up alerts for cron failures
