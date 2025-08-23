# Site Management API - Postman Collection

This Postman collection provides comprehensive testing for the Site Management API endpoints in the QMS (Quality Management System).

## 📁 Files Included

- `Site-API.postman_collection.json` - Main collection with all site endpoints
- `Site-API.postman_environment.json` - Environment variables for testing

## 🚀 Quick Setup

### 1. Import Collection
1. Open Postman
2. Click "Import" button
3. Select `Site-API.postman_collection.json`
4. Import `Site-API.postman_environment.json`

### 2. Configure Environment
1. Select "Site API Environment" from the environment dropdown
2. Update the following variables:
   - `baseUrl`: Your API base URL (default: http://localhost:3000)
   - `token`: JWT authentication token (set after login)

## 🔗 Available Endpoints

### 1. **Create Site** - `POST /v1/sites`
Creates a new site with the following payload:
```json
{
  "name": "Main Production Site",
  "location": "New York, USA",
  "timeZone": "America/New_York",
  "siteCode": "NYC001",
  "note": "Primary manufacturing facility",
  "modules": ["moduleId1", "moduleId2"]
}
```

**Required Fields:**
- `name` (string, max 100 chars)
- `location` (string, max 100 chars)
- `timeZone` (string, max 100 chars)
- `note` (string, max 500 chars)

**Optional Fields:**
- `siteCode` (string, max 100 chars)
- `modules` (array of module IDs)

### 2. **Get All Sites** - `GET /v1/sites`
Retrieves all sites with pagination and search support.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search term for site names

**Role-based Access:**
- **Admin**: Can see sites they created
- **Sub-admin**: Can see sites created by their parent admin

### 3. **Get Site by ID** - `GET /v1/sites/:id`
Retrieves a specific site by its ID.

### 4. **Update Site** - `PATCH /v1/sites/:id`
Updates an existing site. Same payload structure as create, but all fields are optional.

**Role-based Access:**
- **Admin**: Can update sites they created
- **Sub-admin**: Can update sites created by their parent admin

### 5. **Delete Site** - `DELETE /v1/sites/:id`
Deletes a site.

**Role-based Access:**
- **Admin**: Can delete sites they created
- **Sub-admin**: Can delete sites created by their parent admin

### 6. **Get Site Names by Module** - `GET /v1/sites/names/:moduleId`
Retrieves site names associated with a specific module.

## 🔐 Authentication

All endpoints require authentication using JWT tokens. Set the `token` environment variable with your JWT token:

```
Authorization: Bearer {{token}}
```

## 🛡️ Permissions

All endpoints require the `manageSites` permission. The system enforces role-based access control:

- **Admin users**: Can manage sites they created
- **Sub-admin users**: Can manage sites created by their parent admin
- **Unauthorized users**: Will receive an error

## 📊 Response Examples

### Successful Site Creation (201)
```json
{
  "_id": "64f1234567890abcdef12345",
  "name": "Main Production Site",
  "location": "New York, USA",
  "timeZone": "America/New_York",
  "siteCode": "NYC001",
  "note": "Primary manufacturing facility",
  "modules": ["64f1234567890abcdef12346"],
  "createdBy": "64f1234567890abcdef12347",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "isDeleted": false
}
```

### Paginated Sites Response (200)
```json
{
  "data": [
    {
      "_id": "64f1234567890abcdef12345",
      "name": "Main Production Site",
      "location": "New York, USA",
      "timeZone": "America/New_York",
      "siteCode": "NYC001",
      "note": "Primary manufacturing facility",
      "modules": ["64f1234567890abcdef12346"],
      "createdBy": "64f1234567890abcdef12347",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "isDeleted": false
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

### Error Response (400/401/403)
```json
{
  "error": {
    "statusCode": 400,
    "message": "Validation error",
    "details": "Name is required"
  }
}
```

## 🧪 Testing Workflow

### Prerequisites
1. Have a valid JWT token
2. Have necessary permissions (`manageSites`)
3. Have valid module IDs for testing

### Recommended Test Flow
1. **Authentication**: Get JWT token from auth endpoints
2. **Create Site**: Test site creation with valid payload
3. **Get All Sites**: Verify the site appears in the list
4. **Get Site by ID**: Retrieve the specific site
5. **Update Site**: Modify site information
6. **Get Site Names by Module**: Test module-based filtering
7. **Delete Site**: Clean up test data

## 🐛 Common Issues

### 401 Unauthorized
- Ensure JWT token is valid and not expired
- Check if token is properly set in environment variables

### 403 Forbidden
- Verify user has `manageSites` permission
- Check if user role allows the operation (admin/sub-admin)

### 400 Bad Request
- Validate required fields are present
- Check field length limits
- Ensure proper data types

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `baseUrl` | API base URL | `http://localhost:3000` |
| `token` | JWT auth token | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `siteId` | Site ID for testing | `64f1234567890abcdef12345` |
| `moduleId` | Module ID | `64f1234567890abcdef12346` |
| `moduleId1` | Test module ID 1 | `64f1234567890abcdef12345` |
| `moduleId2` | Test module ID 2 | `64f1234567890abcdef12346` |
| `moduleId3` | Test module ID 3 | `64f1234567890abcdef12347` |

## 🔧 Customization

You can customize the collection by:
1. Modifying payload examples in request bodies
2. Adding additional test scripts
3. Creating different environments for dev/staging/prod
4. Adding more detailed assertions in test scripts

## 📞 Support

For issues with the API endpoints, refer to the main QMS documentation or contact the development team.
