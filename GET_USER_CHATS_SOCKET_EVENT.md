# Get User Chats Socket Event

## Overview
This socket event allows you to retrieve all chats for a user with:
- **Unread message counts** per chat
- **Library names** associated with each chat
- **Last message** details for each chat
- **Pagination support** for efficient loading

## Socket Event Implementation

### Event: `get-user-chats`

**Emit to server:**
```javascript
socket.emit('get-user-chats', {
  page: 1,        // Optional, default: 1
  limit: 20       // Optional, default: 20, max: 100
});
```

**Listen for response:**
```javascript
socket.on('user-chats-response', (data) => {
  console.log('User Chats:', data);
  /*
  {
    success: true,
    page: 1,
    limit: 20,
    total: 45,
    totalPages: 3,
    chats: [...]
  }
  */
});

socket.on('socket-error', (error) => {
  console.error('Error:', error.message);
});
```

## Response Structure

### Success Response:
```typescript
{
  success: boolean,
  page: number,           // Current page number
  limit: number,          // Items per page
  total: number,          // Total chat count
  totalPages: number,     // Total number of pages
  chats: Array<{
    chatId: string,
    chatOf: string,       // Type of chat (e.g., 'Library')
    libraryId: string,    // ID of the associated library
    libraryName: string,  // Name/title of the library
    unreadCount: number,  // Number of unread messages
    lastMessage: {
      content: string,
      contentType: string,
      createdAt: Date,
      senderId: string
    } | null,
    createdAt: Date
  }>
}
```

## Example Response

```json
{
  "success": true,
  "page": 1,
  "limit": 20,
  "total": 45,
  "totalPages": 3,
  "chats": [
    {
      "chatId": "507f1f77bcf86cd799439011",
      "chatOf": "Library",
      "libraryId": "507f1f77bcf86cd799439012",
      "libraryName": "Risk Management Library",
      "unreadCount": 5,
      "lastMessage": {
        "content": "Let's review the risk assessment",
        "contentType": "text",
        "createdAt": "2025-10-13T10:30:00.000Z",
        "senderId": "507f1f77bcf86cd799439013"
      },
      "createdAt": "2025-10-01T08:00:00.000Z"
    },
    {
      "chatId": "507f1f77bcf86cd799439014",
      "chatOf": "Library",
      "libraryId": "507f1f77bcf86cd799439015",
      "libraryName": "CAPA Investigation",
      "unreadCount": 0,
      "lastMessage": {
        "content": "Action plan completed",
        "contentType": "text",
        "createdAt": "2025-10-12T15:20:00.000Z",
        "senderId": "507f1f77bcf86cd799439016"
      },
      "createdAt": "2025-09-28T14:00:00.000Z"
    },
    {
      "chatId": "507f1f77bcf86cd799439017",
      "chatOf": "Library",
      "libraryId": "507f1f77bcf86cd799439018",
      "libraryName": "Quality Metrics",
      "unreadCount": 12,
      "lastMessage": {
        "content": "Check the latest metrics report",
        "contentType": "text",
        "createdAt": "2025-10-13T09:00:00.000Z",
        "senderId": "507f1f77bcf86cd799439019"
      },
      "createdAt": "2025-10-05T10:00:00.000Z"
    }
  ]
}
```

## Pagination Examples

### Get first page (default):
```javascript
socket.emit('get-user-chats', {});
// or
socket.emit('get-user-chats', { page: 1, limit: 20 });
```

### Get specific page:
```javascript
socket.emit('get-user-chats', {
  page: 2,
  limit: 10
});
```

### Load more pattern:
```javascript
let currentPage = 1;
const limit = 20;
let allChats = [];

function loadChats(page) {
  socket.emit('get-user-chats', {
    page: page,
    limit: limit
  });
}

socket.on('user-chats-response', (data) => {
  // Append chats to your list
  allChats = [...allChats, ...data.chats];
  displayChats(allChats);
  
  // Check if there are more pages
  if (data.page < data.totalPages) {
    showLoadMoreButton();
  } else {
    hideLoadMoreButton();
  }
  
  // Update unread badge totals
  const totalUnread = data.chats.reduce((sum, chat) => sum + chat.unreadCount, 0);
  updateUnreadBadge(totalUnread);
});

function onLoadMore() {
  currentPage++;
  loadChats(currentPage);
}
```

### Real-time updates:
```javascript
// Load initial chats
socket.emit('get-user-chats', { page: 1, limit: 20 });

// Listen for new messages (update unread counts)
socket.on('message', (newMessage) => {
  // Find chat in your list and increment unread count
  const chat = allChats.find(c => c.chatId === newMessage.chatId);
  if (chat) {
    chat.unreadCount++;
    chat.lastMessage = {
      content: newMessage.content,
      contentType: newMessage.contentType,
      createdAt: newMessage.createdAt,
      senderId: newMessage.senderId
    };
  }
  refreshChatList();
});

// Listen for messages marked as read
socket.on('mark-message-read-response', (data) => {
  const chat = allChats.find(c => c.chatId === data.chatId);
  if (chat && data.allMsgsRead) {
    chat.unreadCount = 0;
  }
  refreshChatList();
});
```

## Features

✅ **Unread Counts**: Shows number of unread messages per chat  
✅ **Library Names**: Displays the name/title of each library  
✅ **Last Message**: Shows the most recent message preview  
✅ **Pagination**: Efficient loading with page and limit parameters  
✅ **Sorted**: Chats sorted by last message time (most recent first)  
✅ **User Context**: Only shows chats where user is a participant  
✅ **Real-time Ready**: Can be combined with message events for live updates  
✅ **Validation**: Page/limit validation (limit max: 100)  

## Pagination Rules

- **Default page**: 1
- **Default limit**: 20
- **Maximum limit**: 100 (automatically capped)
- **Minimum page**: 1 (automatically adjusted)
- **Minimum limit**: 1 (automatically adjusted)

## Use Cases

1. **Chat List**: Display all user's chats with unread badges
2. **Initial Load**: Load first page of chats (20 items)
3. **Load More**: Fetch next page when user scrolls
4. **Unread Badge**: Show total unread count in navigation
5. **Chat Preview**: Display last message for each chat
6. **Library Context**: Show which library each chat belongs to
7. **Infinite Scroll**: Automatically load next page on scroll

## How Unread Count Works

A message is considered unread for a user if:
- The user is NOT the sender of the message, AND
- One of these conditions is true:
  - No `userSettings` exists for the message
  - `userSettings` array is empty
  - User's `readAt` field doesn't exist or is null in `userSettings`

When a user marks messages as read using `mark-message-as-read` event, the unread count will become 0.

## Integration Example

```javascript
// Chat List Component
class ChatList {
  constructor() {
    this.chats = [];
    this.currentPage = 1;
    this.limit = 20;
    this.hasMorePages = false;
    
    this.setupSocketListeners();
    this.loadChats();
  }
  
  setupSocketListeners() {
    socket.on('user-chats-response', (data) => {
      if (data.success) {
        this.chats = [...this.chats, ...data.chats];
        this.hasMorePages = data.page < data.totalPages;
        this.renderChats();
      }
    });
    
    socket.on('message', (newMessage) => {
      this.updateChatWithNewMessage(newMessage);
    });
    
    socket.on('mark-message-read-response', (data) => {
      this.updateUnreadCount(data.chatId, 0);
    });
  }
  
  loadChats() {
    socket.emit('get-user-chats', {
      page: this.currentPage,
      limit: this.limit
    });
  }
  
  loadMore() {
    if (this.hasMorePages) {
      this.currentPage++;
      this.loadChats();
    }
  }
  
  updateChatWithNewMessage(message) {
    const chat = this.chats.find(c => c.chatId === message.chatId);
    if (chat) {
      chat.unreadCount++;
      chat.lastMessage = {
        content: message.content,
        contentType: message.contentType,
        createdAt: message.createdAt,
        senderId: message.senderId
      };
      this.renderChats();
    }
  }
  
  updateUnreadCount(chatId, count) {
    const chat = this.chats.find(c => c.chatId === chatId);
    if (chat) {
      chat.unreadCount = count;
      this.renderChats();
    }
  }
  
  getTotalUnread() {
    return this.chats.reduce((sum, chat) => sum + chat.unreadCount, 0);
  }
  
  renderChats() {
    // Render your chat list UI
    // Show unread badges
    // Display library names
    // Show last message previews
  }
}
```

## Service Function

**File:** `src/modules/chat/chat.services.ts`

**Function:** `getUserChats(params: { userId: string; page?: number; limit?: number })`

## Files Modified

1. ✅ `src/modules/chat/chat.services.ts` - Added `getUserChats` function
2. ✅ `src/modules/chat/chat.socket.ts` - Added `get-user-chats` socket event

## Notes

- **Relationship Chain**: User -> Account -> Library -> Chat
- User's accounts are looked up first, then libraries where those accounts are members/managers
- Also includes libraries where the user is the workspace subscription owner
- The library name is taken from either the `name` or `title` field of the library
- Last message includes sender details (name, profile picture)
- Last message is sorted by `createdAt` (most recent)
- Chats without messages will have `lastMessage: null`
- Unread count only includes messages sent by other users

## How It Works

1. **User -> Account Lookup**: System finds all accounts where `account.user === userId`
2. **Account -> Library Lookup**: Finds libraries where the user's accounts are in `members` or `managers` arrays
3. **Workspace Owner Check**: Also includes libraries from workspaces owned by the user
4. **Chat Filtering**: Returns chats associated with these accessible libraries
5. **Unread Count**: Calculates unread messages for each chat
6. **Last Message**: Fetches the most recent message with sender details
