# Get Message Reactions Socket Event

## Overview
This socket event allows you to retrieve all reactions on a message along with the details of users who reacted. **Supports pagination** for efficient loading of large reaction lists.

## Socket Event Implementation

### Event: `get-message-reactions`

**Emit to server:**
```javascript
socket.emit('get-message-reactions', {
  messageId: '507f1f77bcf86cd799439011',
  page: 1,        // Optional, default: 1
  limit: 20       // Optional, default: 20, max: 100
});
```

**Listen for response:**
```javascript
socket.on('message-reactions-response', (data) => {
  console.log('Reactions:', data);
  /*
  {
    success: true,
    messageId: '507f1f77bcf86cd799439011',
    page: 1,
    limit: 20,
    total: 45,
    totalPages: 3,
    reactions: [...],
    reactionsByEmoji: [...]
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
  messageId: string,
  page: number,           // Current page number
  limit: number,          // Items per page
  total: number,          // Total reaction count
  totalPages: number,     // Total number of pages
  reactions: Array<{      // Paginated reactions list
    reactionId: string,
    emoji: string,
    userId: string,
    userName: string,
    userProfilePicture: string,
    userEmail: string,
    createdAt: Date
  }>,
  reactionsByEmoji: Array<{  // Summary of all reactions (not paginated)
    emoji: string,
    count: number,
    users: Array<{
      userId: string,
      userName: string,
      userProfilePicture: string
    }>
  }>
}
```

## Example Response

```json
{
  "success": true,
  "messageId": "507f1f77bcf86cd799439011",
  "page": 1,
  "limit": 20,
  "total": 45,
  "totalPages": 3,
  "reactions": [
    {
      "reactionId": "507f1f77bcf86cd799439012",
      "emoji": "👍",
      "userId": "507f1f77bcf86cd799439013",
      "userName": "John Doe",
      "userProfilePicture": "https://example.com/profile.jpg",
      "userEmail": "john@example.com",
      "createdAt": "2025-10-13T10:30:00.000Z"
    },
    {
      "reactionId": "507f1f77bcf86cd799439014",
      "emoji": "👍",
      "userId": "507f1f77bcf86cd799439015",
      "userName": "Jane Smith",
      "userProfilePicture": "https://example.com/profile2.jpg",
      "userEmail": "jane@example.com",
      "createdAt": "2025-10-13T10:31:00.000Z"
    }
  ],
  "reactionsByEmoji": [
    {
      "emoji": "👍",
      "count": 25,
      "users": [
        {
          "userId": "507f1f77bcf86cd799439013",
          "userName": "John Doe",
          "userProfilePicture": "https://example.com/profile.jpg"
        },
        {
          "userId": "507f1f77bcf86cd799439015",
          "userName": "Jane Smith",
          "userProfilePicture": "https://example.com/profile2.jpg"
        }
        // ... all users who used 👍
      ]
    },
    {
      "emoji": "❤️",
      "count": 20,
      "users": [
        // ... all users who used ❤️
      ]
    }
  ]
}
```

## Pagination Examples

### Get first page (default):
```javascript
socket.emit('get-message-reactions', {
  messageId: '507f1f77bcf86cd799439011'
});
```

### Get specific page:
```javascript
socket.emit('get-message-reactions', {
  messageId: '507f1f77bcf86cd799439011',
  page: 2,
  limit: 10
});
```

### Load more pattern:
```javascript
let currentPage = 1;
const limit = 20;

function loadReactions(page) {
  socket.emit('get-message-reactions', {
    messageId: messageId,
    page: page,
    limit: limit
  });
}

socket.on('message-reactions-response', (data) => {
  // Append reactions to your list
  appendReactions(data.reactions);
  
  // Check if there are more pages
  if (data.page < data.totalPages) {
    // Show "Load More" button
    showLoadMoreButton();
  } else {
    // Hide "Load More" button
    hideLoadMoreButton();
  }
});

function onLoadMore() {
  currentPage++;
  loadReactions(currentPage);
}
```

## Features

✅ **Pagination Support**: Efficient loading with page and limit parameters  
✅ **User Details**: Complete user information (name, profile picture, email)  
✅ **Sorted by Time**: Newest reactions first  
✅ **Grouped Summary**: `reactionsByEmoji` provides counts for all emojis  
✅ **Validation**: Page/limit validation (limit max: 100)  
✅ **Error Handling**: Proper error messages via `socket-error` event  
✅ **Real-time**: Socket-based for live updates  

## Pagination Rules

- **Default page**: 1
- **Default limit**: 20
- **Maximum limit**: 100 (automatically capped)
- **Minimum page**: 1 (automatically adjusted)
- **Minimum limit**: 1 (automatically adjusted)

## Use Cases

1. **Initial Load**: Load first page of reactions (20 items)
2. **Load More**: Fetch next page when user scrolls or clicks "Load More"
3. **Emoji Summary**: Always shows complete emoji counts (not paginated)
4. **User List**: Click emoji to see all users who used that reaction
5. **Infinite Scroll**: Automatically load next page on scroll

## Service Function

**File:** `src/modules/chat/chat.services.ts`

**Function:** `getMessageReactions(params: { messageId: string; page?: number; limit?: number })`

## Files Modified

1. ✅ `src/modules/chat/chat.services.ts` - Updated `getMessageReactions` with pagination
2. ✅ `src/modules/chat/chat.socket.ts` - Updated socket event with pagination support
