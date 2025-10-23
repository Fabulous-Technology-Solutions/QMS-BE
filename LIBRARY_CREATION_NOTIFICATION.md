# Library Creation Notification Feature

## Overview
When a new CAPA library is created, notifications are automatically sent to all assigned managers informing them of the new library and their role.

## Implementation Details

### Modified File
**File**: `src/modules/capa/workspace/capalibrary/capalibrary.service.ts`

### Changes Made

#### 1. Added Imports
```typescript
import AccountModel from '../../../../modules/account/account.modal';
import { createNotification } from '../../../../modules/notification/notification.services';
```

#### 2. Updated CreateLibrary Function
The function now:
1. Creates the library
2. Creates associated chat
3. **Sends notifications to all assigned managers** (NEW)
4. Returns the saved library

### Notification Details

**When Triggered**: When a new library is created with managers assigned

**Who Receives**: All accounts in the `managers` array of the library creation request

**Notification Content**:
- **Title**: "New Library Created"
- **Message**: "📚 A new library \"[Library Name]\" has been created and you have been assigned as a manager."
- **Type**: `library`
- **Notification For**: `Library`
- **Link**: `/capa/workspace/{WORKSPACE_ID}/library/{LIBRARY_ID}`
- **Socket Event**: `librarycreated`
- **Email**: Enabled

### Request Structure

When creating a library, include managers:

```json
POST /api/capa/{moduleId}/workspace/{workspaceId}/library

{
  "name": "New CAPA Library",
  "description": "Description of the library",
  "workspace": "WORKSPACE_ID",
  "createdBy": "USER_ID",
  "managers": ["ACCOUNT_ID_1", "ACCOUNT_ID_2"],
  "members": ["ACCOUNT_ID_1", "ACCOUNT_ID_2", "ACCOUNT_ID_3"],
  "priority": "high",
  "status": "pending"
}
```

### Notification Flow

```
1. CreateLibrary() called with body containing managers[]
2. Workspace validation
3. Library created and saved
4. Chat created for library
5. → For each manager:
     - Fetch manager account with user details
     - Create notification parameters
     - Send notification via socket event
     - Send email notification
6. Return saved library
```

### Error Handling

- ✅ **Resilient**: If notification sending fails, it won't block library creation
- ✅ **Logged**: All notification attempts are logged (success and failure)
- ✅ **Skipped**: If account has no linked user, it's skipped with a continue
- ✅ **Caught**: Top-level try-catch prevents notification errors from affecting library creation

### Notification Parameters

```typescript
{
  userId: "USER_ID",
  title: "New Library Created",
  message: "📚 A new library \"Library Name\" has been created and you have been assigned as a manager.",
  type: "library",
  notificationFor: "Library",
  forId: "LIBRARY_ID",
  sendEmailNotification: true,
  accountId: "ACCOUNT_ID",
  subId: "SUBSCRIPTION_ID",
  link: "/capa/workspace/WORKSPACE_ID/library/LIBRARY_ID"
}
```

## Console Logging

The implementation includes helpful logging:

```
✅ Library creation notification sent to manager@example.com

❌ Failed to send library creation notification to manager@example.com: [error]

❌ Error sending library creation notifications: [error]
```

## Features

✅ **Automatic**: Sends notifications without additional API calls
✅ **Batch**: All managers get notified simultaneously
✅ **Email**: Email notifications are enabled by default
✅ **Personalized**: Each manager gets their own notification
✅ **Error Resilient**: Notifications don't block library creation
✅ **Logged**: Detailed logging for debugging
✅ **Link Included**: Direct link to the new library in the notification

## Usage Example

### API Call
```bash
POST /api/capa/moduleId123/workspace/workspaceId456/library

{
  "name": "Quality Assurance Library",
  "description": "Library for QA processes",
  "workspace": "workspaceId456",
  "createdBy": "userId789",
  "managers": ["accountId001", "accountId002"],
  "members": ["accountId001", "accountId002", "accountId003"],
  "priority": "high",
  "status": "pending"
}
```

### Expected Response
```json
{
  "_id": "libraryId123",
  "name": "Quality Assurance Library",
  "description": "Library for QA processes",
  "workspace": "workspaceId456",
  "createdBy": "userId789",
  "managers": ["accountId001", "accountId002"],
  "members": ["accountId001", "accountId002", "accountId003"],
  "priority": "high",
  "status": "pending",
  "createdAt": "2025-10-23T10:00:00Z",
  "updatedAt": "2025-10-23T10:00:00Z"
}
```

### Expected Notifications
Each manager receives:
1. **In-App Notification**: Via socket event `librarycreated`
2. **Email Notification**: With library details and direct link

### Server Logs
```
✅ Library creation notification sent to manager1@example.com
✅ Library creation notification sent to manager2@example.com
```

## Socket Event

**Event Type**: `librarycreated`
**Workspace**: Sent to the workspace where library was created
**Data**: Includes notification parameters and library ID

## Integration Points

The feature integrates with:
- **Library Model**: `capalibrary.modal.ts`
- **Account Model**: `account.modal.ts`
- **Notification Service**: `notification.services.ts`
- **Chat Service**: `chat.services.ts` (existing)

## Testing

### Test Case 1: Library with Managers
1. Create library with managers array populated
2. Check server logs for notification messages
3. Verify notifications in database
4. Verify emails sent to managers

### Test Case 2: Library without Managers
1. Create library with empty managers array
2. No notifications should be sent
3. Library should be created successfully

### Test Case 3: Manager with No User Link
1. Create library with manager account that has no user link
2. Account should be skipped gracefully
3. No error thrown

### Manual Testing
```typescript
// Test in node shell or API
const body = {
  name: "Test Library",
  description: "Test",
  workspace: "WORKSPACE_ID",
  createdBy: "USER_ID",
  managers: ["ACCOUNT_ID_1"],
  members: ["ACCOUNT_ID_1"]
};

const result = await CreateLibrary(body);
console.log(result);
```

## Database Queries

### Check Notifications Created
```javascript
db.notifications.find({
  notificationFor: "Library",
  type: "library"
}).sort({ createdAt: -1 }).limit(10)
```

### Check Specific Library Notifications
```javascript
db.notifications.find({
  forId: ObjectId("LIBRARY_ID"),
  notificationFor: "Library"
})
```

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| No notifications sent | No managers in request | Include managers array in request |
| Manager not receiving | Account has no user link | Ensure account has valid user reference |
| Email not sent | Email service config issue | Check notification service configuration |
| Library not created | Workspace validation failed | Verify workspace exists and is active |

## Future Enhancements

- [ ] Send notification to library members (not just managers)
- [ ] Add library creation summary email
- [ ] Add notification for library updates
- [ ] Add bulk notification for multiple managers
- [ ] Add notification history/logs
- [ ] Add user preference for notification frequency
- [ ] Send notification to workspace admins
- [ ] Add activity log for library creation with managers

## Related Features

- **Action Creation Notifications**: Similar pattern used in `action.service.ts`
- **Action Status Change Notifications**: Sends notifications on completion
- **Action Deadline Reminder**: Scheduled cron job for deadline reminders
- **Chat Creation**: Automatically creates chat for new library

## Notes

- Notifications are sent asynchronously (non-blocking)
- If notification service fails, library creation continues
- Each manager gets an individual notification
- Email notifications are enabled by default
- Direct link to library is included for quick access
