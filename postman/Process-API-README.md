# Process Management API - Postman Collection

This Postman collection provides comprehensive testing for the Process Management API endpoints in the QMS (Quality Management System).

## 📁 Files Included

- `Process-API.postman_collection.json` - Main collection with all process endpoints
- `Process-API.postman_environment.json` - Environment variables for testing

## 🚀 Quick Setup

### 1. Import Collection
1. Open Postman
2. Click "Import" button
3. Select `Process-API.postman_collection.json`
4. Import `Process-API.postman_environment.json`

### 2. Configure Environment
1. Select "Process API Environment" from the environment dropdown
2. Update the following variables:
   - `baseUrl`: Your API base URL (default: http://localhost:3000)
   - `token`: JWT authentication token (set after login)
   - `siteId`: Valid site ID for testing process-site relationships

## 🔗 Available Endpoints

### 1. **Create Process** - `POST /v1/processes`
Creates a new process with the following payload:
```json
{
  "name": "Quality Control Process",
  "location": "Building A - Floor 2",
  "parentSite": "siteId",
  "processCode": "QCP-001",
  "note": "Main quality control process for incoming materials",
  "modules": ["moduleId1", "moduleId2"],
  "status": true,
  "acrossMultipleSites": false
}
```

**Required Fields:**
- `name` (string, max 100 chars)
- `location` (string, max 100 chars)
- `parentSite` (string, site ID)
- `note` (string, max 500 chars)

**Optional Fields:**
- `processCode` (string, max 100 chars)
- `modules` (array of module IDs)
- `status` (boolean, default: true)
- `acrossMultipleSites` (boolean, default: false)

### 2. **Get All Processes** - `GET /v1/processes`
Retrieves all processes with pagination and search support.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search term for process names

**Role-based Access:**
- **Admin**: Can see processes they created
- **Sub-admin**: Can see processes created by their parent admin

### 3. **Get Process by ID** - `GET /v1/processes/:id`
Retrieves a specific process by its ID.

### 4. **Update Process** - `PATCH /v1/processes/:id`
Updates an existing process. Same payload structure as create, but all fields are optional.

**Role-based Access:**
- **Admin**: Can update processes they created
- **Sub-admin**: Can update processes created by their parent admin

### 5. **Delete Process** - `DELETE /v1/processes/:id`
Deletes a process.

**Role-based Access:**
- **Admin**: Can delete processes they created
- **Sub-admin**: Can delete processes created by their parent admin

### 6. **Get Process Names by Module** - `GET /v1/processes/names/:moduleId`
Retrieves process names associated with a specific module.

### 7. **Get Processes by Module** - `GET /v1/processes/module/:moduleId`
Retrieves all processes associated with a specific module with pagination support.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search term for process names

### 8. **Get Processes by Site** - `GET /v1/processes/site/:siteId`
Retrieves all processes associated with a specific site with pagination support.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search term for process names

## 🔐 Authentication

All endpoints require authentication using JWT tokens. Set the `token` environment variable with your JWT token:

```
Authorization: Bearer {{token}}
```

## 🛡️ Permissions

All endpoints require the `manageProcesses` permission. The system enforces role-based access control:

- **Admin users**: Can manage processes they created
- **Sub-admin users**: Can manage processes created by their parent admin
- **Unauthorized users**: Will receive an error

## 📊 Response Examples

### Successful Process Creation (201)
```json
{
  "_id": "64f1234567890abcdef12345",
  "name": "Quality Control Process",
  "location": "Building A - Floor 2",
  "parentSite": "64f1234567890abcdef12346",
  "processCode": "QCP-001",
  "note": "Main quality control process for incoming materials",
  "modules": ["64f1234567890abcdef12347"],
  "status": true,
  "acrossMultipleSites": false,
  "createdBy": "64f1234567890abcdef12348",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "isDeleted": false
}
```

### Paginated Processes Response (200)
```json
{
  "data": [
    {
      "_id": "64f1234567890abcdef12345",
      "name": "Quality Control Process",
      "location": "Building A - Floor 2",
      "parentSite": {
        "_id": "64f1234567890abcdef12346",
        "name": "Main Production Site"
      },
      "processCode": "QCP-001",
      "note": "Main quality control process for incoming materials",
      "modules": [
        {
          "_id": "64f1234567890abcdef12347",
          "name": "Quality Module"
        }
      ],
      "status": true,
      "acrossMultipleSites": false,
      "createdBy": "64f1234567890abcdef12348",
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

### Process Names Response (200)
```json
[
  {
    "_id": "64f1234567890abcdef12345",
    "name": "Quality Control Process"
  },
  {
    "_id": "64f1234567890abcdef12346",
    "name": "Manufacturing Process"
  }
]
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
2. Have necessary permissions (`manageProcesses`)
3. Have valid site and module IDs for testing

### Recommended Test Flow
1. **Authentication**: Get JWT token from auth endpoints
2. **Create Process**: Test process creation with valid payload
3. **Get All Processes**: Verify the process appears in the list
4. **Get Process by ID**: Retrieve the specific process
5. **Update Process**: Modify process information
6. **Get Processes by Site**: Test site-based filtering
7. **Get Processes by Module**: Test module-based filtering
8. **Get Process Names by Module**: Test lightweight name retrieval
9. **Delete Process**: Clean up test data

## 🔄 Process-Site-Module Relationships

### Understanding the Hierarchy
- **Site**: Top-level location (e.g., "New York Factory")
- **Process**: Activities within a site (e.g., "Quality Control Process")
- **Module**: Functional areas that can span multiple processes

### Key Relationships
- Each process belongs to one `parentSite`
- Each process can be associated with multiple `modules`
- Processes can be configured to work `acrossMultipleSites`

## 🐛 Common Issues

### 401 Unauthorized
- Ensure JWT token is valid and not expired
- Check if token is properly set in environment variables

### 403 Forbidden
- Verify user has `manageProcesses` permission
- Check if user role allows the operation (admin/sub-admin)

### 400 Bad Request
- Validate required fields are present (name, location, parentSite, note)
- Check field length limits
- Ensure parentSite ID exists and is valid
- Verify module IDs exist if provided

### 404 Not Found
- Check if process ID exists
- Verify site ID exists for site-based queries
- Ensure module ID exists for module-based queries

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `baseUrl` | API base URL | `http://localhost:3000` |
| `token` | JWT auth token | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `processId` | Process ID for testing | `64f1234567890abcdef12345` |
| `siteId` | Site ID for parent site | `64f1234567890abcdef12346` |
| `moduleId` | Module ID | `64f1234567890abcdef12347` |
| `moduleId1` | Test module ID 1 | `64f1234567890abcdef12345` |
| `moduleId2` | Test module ID 2 | `64f1234567890abcdef12346` |
| `moduleId3` | Test module ID 3 | `64f1234567890abcdef12347` |

## 🔧 Advanced Usage

### Testing Cross-Site Processes
Set `acrossMultipleSites: true` to test processes that span multiple locations:
```json
{
  "name": "Global Quality Standards",
  "location": "Multi-location",
  "parentSite": "primarySiteId",
  "acrossMultipleSites": true
}
```

### Testing Process Status
Use the `status` field to test active/inactive processes:
```json
{
  "status": false  // for inactive processes
}
```

### Bulk Testing with Modules
Test processes with multiple modules to verify relationships:
```json
{
  "modules": ["qualityModuleId", "complianceModuleId", "auditModuleId"]
}
```

## 📞 Support

For issues with the API endpoints, refer to the main QMS documentation or contact the development team.
