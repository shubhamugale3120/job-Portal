# API Contract Documentation

**Version:** 1.0  
**Last Updated:** February 22, 2026  
**Base URL:** `http://localhost:3000`  
**Frontend Base URL Config:** `VITE_API_URL=http://localhost:3000`

## Overview
This document defines the contract for all API endpoints used by the React frontend. All API responses should follow a consistent format for reliable client-side parsing.

---

## Authentication Endpoints

### 1. Register User
**Endpoint:** `POST /api/auth/register`  
**Auth Required:** No  
**Role:** Public

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "password": "string (required, min 6 chars)",
  "role": "string (required, 'student' | 'recruiter')"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "token": "string (JWT)",
  "user": {
    "_id": "string",
    "email": "string",
    "role": "string",
    "name": "string"
  }
}
```

**Response (Error - 400/409/500):**
```json
{
  "success": false,
  "message": "string (error description)"
}
```

**Status Codes:**
- `201`: Registration successful
- `400`: Invalid input (missing fields, password too short, invalid role)
- `409`: Email already registered
- `500`: Server error

---

### 2. Login User
**Endpoint:** `POST /api/auth/login`  
**Auth Required:** No  
**Role:** Public

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "token": "string (JWT)",
  "user": {
    "_id": "string",
    "email": "string",
    "role": "string",
    "name": "string"
  }
}
```

**Response (Error - 400/401/500):**
```json
{
  "success": false,
  "message": "string (error description)"
}
```

**Status Codes:**
- `200`: Login successful
- `400`: Missing email or password
- `401`: Invalid credentials
- `500`: Server error

---

### 3. Get Current User
**Endpoint:** `GET /api/auth/me`  
**Auth Required:** Yes (Bearer token)  
**Role:** Any authenticated user

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "phone": "string (optional)",
    "bio": "string (optional)",
    "company": "string (optional, recruiter only)",
    "createdAt": "ISO date string"
  }
}
```

**Response (Error - 401/404/500):**
```json
{
  "success": false,
  "message": "string (error description)"
}
```

**Status Codes:**
- `200`: User data retrieved
- `401`: Not authenticated or invalid token
- `404`: User not found
- `500`: Server error

---

### 4. Logout User
**Endpoint:** `POST /api/auth/logout`  
**Auth Required:** No (client-side token removal is primary)  
**Role:** Any

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Status Codes:**
- `200`: Always successful (stateless JWT)

---

## Job Endpoints

### 5. List Jobs (Browse)
**Endpoint:** `GET /jobs`  
**Auth Required:** No (public jobs listing)  
**Role:** Public

**Query Parameters:**
```
page: number (default: 1)
limit: number (default: 20, max: 100)
search: string (optional, searches title)
location: string (optional, searches location)
skills: string (optional, comma-separated)
jobType: string (optional, 'Full-time' | 'Part-time' | 'Contract' | 'Internship')
salaryMin: number (optional)
salaryMax: number (optional)
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "title": "string",
      "description": "string",
      "location": "string",
      "jobType": "string",
      "salary": "number",
      "skills": ["string"],
      "status": "string",
      "createdAt": "ISO date string",
      "applicationCount": "number (optional)"
    }
  ],
  "pagination": {
    "currentPage": "number",
    "limit": "number",
    "hasNextPage": "boolean",
    "hasPrevPage": "boolean"
  }
}
```

**Response (Error - 500):**
```json
{
  "error": "Failed to fetch jobs"
}
```

**Status Codes:**
- `200`: Jobs retrieved successfully
- `500`: Server error

**⚠️ Inconsistency Note:** Error response missing `success: false` wrapper

---

### 6. Get Job Details
**Endpoint:** `GET /jobs/:id`  
**Auth Required:** No  
**Role:** Public

**Response (Success - 200):**
```json
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "location": "string",
  "jobType": "string",
  "salary": "number",
  "skills": ["string"],
  "requirements": "string (optional)",
  "responsibilities": "string (optional)",
  "postedBy": "ObjectId",
  "status": "string",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

**Response (Error - 404/500):**
```json
{
  "error": "Job not found" // or "Failed to fetch job"
}
```

**Status Codes:**
- `200`: Job details retrieved
- `404`: Job not found
- `500`: Server error

**⚠️ Inconsistency Note:** Success response missing `success: true` wrapper; error missing `success: false`

---

### 7. Get My Jobs (Recruiter)
**Endpoint:** `GET /jobs/my-jobs`  
**Auth Required:** Yes  
**Role:** `recruiter`, `admin`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "title": "string",
      "description": "string",
      "location": "string",
      "jobType": "string",
      "salary": "number",
      "skills": ["string"],
      "status": "string",
      "createdAt": "ISO date string",
      "applicationCount": "number"
    }
  ]
}
```

**Response (Error - 500):**
```json
{
  "success": false,
  "error": "Failed to fetch jobs"
}
```

**Status Codes:**
- `200`: Recruiter's jobs retrieved
- `401`: Not authenticated
- `403`: Not a recruiter/admin
- `500`: Server error

---

### 8. Create Job (Recruiter)
**Endpoint:** `POST /jobs`  
**Auth Required:** Yes  
**Role:** `recruiter`, `admin`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "location": "string (required)",
  "jobType": "string (required)",
  "salary": "number (required)",
  "skills": ["string"] (required),
  "requirements": "string (optional)",
  "responsibilities": "string (optional)"
}
```

**Response (Success - 302):**
```
Redirect to: /recruiter/dashboard?success=Job posted successfully
```

**Response (Error - 302):**
```
Redirect to: /recruiter/post-job?error=<error_message>
```

**Status Codes:**
- `302`: Redirect (both success and error)

**⚠️ Critical Issue:** This endpoint returns HTML redirects, not JSON. **Must be changed for React SPA.**

---

### 9. Update Job (Recruiter)
**Endpoint:** `PATCH /jobs/:id` or `POST /jobs/:id/update`  
**Auth Required:** Yes  
**Role:** `recruiter`, `admin` (and must be job owner)

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "location": "string (optional)",
  "jobType": "string (optional)",
  "salary": "number (optional)",
  "skills": ["string"] (optional)",
  "status": "string (optional)"
}
```

**Response (Success - 302):**
```
Redirect to: /recruiter/dashboard?success=Job updated successfully
```

**Response (Error - 302):**
```
Redirect to: /recruiter/edit-job/:id?error=<error_message>
```

**Status Codes:**
- `302`: Redirect (both success and error)

**⚠️ Critical Issue:** Returns HTML redirects, not JSON. **Must be changed for React SPA.**

---

### 10. Delete Job (Recruiter)
**Endpoint:** `DELETE /jobs/:id` or `POST /jobs/:id/delete`  
**Auth Required:** Yes  
**Role:** `recruiter`, `admin` (and must be job owner)

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 302):**
```
Redirect to: /recruiter/dashboard?success=Job deleted successfully
```

**Response (Error - 302):**
```
Redirect to: /recruiter/dashboard?error=<error_message>
```

**Status Codes:**
- `302`: Redirect (both success and error)

**⚠️ Critical Issue:** Returns HTML redirects, not JSON. **Must be changed for React SPA.**

---

### 11. Get My Applications (Recruiter)
**Endpoint:** `GET /jobs/my-applications`  
**Auth Required:** Yes  
**Role:** `recruiter`, `admin`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "studentId": {
        "name": "string",
        "email": "string"
      },
      "jobId": {
        "title": "string",
        "location": "string"
      },
      "status": "string",
      "appliedAt": "ISO date string",
      "resumeUrl": "string",
      "coverLetter": "string"
    }
  ]
}
```

**Response (Error - 500):**
```json
{
  "success": false,
  "error": "Failed to fetch applications"
}
```

**Status Codes:**
- `200`: Applications retrieved
- `401`: Not authenticated
- `403`: Not a recruiter/admin
- `500`: Server error

---

## Application Endpoints

### 12. Apply to Job (Student)
**Endpoint:** `POST /applications/:jobId/apply`  
**Auth Required:** Yes  
**Role:** `student`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "resumeUrl": "string (required)",
  "coverLetter": "string (optional)"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Applied successfully! Check your applications page.",
  "data": {
    "_id": "string",
    "jobId": "string",
    "studentId": "string",
    "resumeUrl": "string",
    "coverLetter": "string",
    "status": "APPLIED",
    "appliedAt": "ISO date string"
  }
}
```

**Response (Error - 400/409/500):**
```json
{
  "success": false,
  "error": "string (error description)"
}
```

**Status Codes:**
- `201`: Application created successfully
- `400`: Missing resume URL
- `401`: Not authenticated
- `403`: Not a student
- `409`: Already applied to this job
- `500`: Server error

---

### 13. Check Application Status (Student)
**Endpoint:** `GET /applications/:jobId/check`  
**Auth Required:** Yes  
**Role:** `student`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200, Not Applied):**
```json
{
  "success": true,
  "hasApplied": false
}
```

**Response (Success - 200, Applied):**
```json
{
  "success": true,
  "hasApplied": true,
  "status": "APPLIED",
  "appliedAt": "ISO date string"
}
```

**Response (Error - 500):**
```json
{
  "success": false,
  "error": "Failed to check application status"
}
```

**Status Codes:**
- `200`: Status checked successfully
- `401`: Not authenticated
- `403`: Not a student
- `500`: Server error

---

### 14. Get Applied Jobs List (Student)
**Endpoint:** `GET /applications/applied/list`  
**Auth Required:** Yes  
**Role:** `student`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "jobId": "string",
      "status": "string",
      "appliedAt": "ISO date string"
    }
  ]
}
```

**Response (Error - 500):**
```json
{
  "success": false,
  "error": "Failed to fetch applied jobs"
}
```

**Status Codes:**
- `200`: Applied jobs list retrieved
- `401`: Not authenticated
- `403`: Not a student
- `500`: Server error

---

### 15. Get My Applications (Student)
**Endpoint:** `GET /applications/me`  
**Auth Required:** Yes  
**Role:** `student`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
[
  {
    "_id": "string",
    "jobId": {
      "title": "string",
      "description": "string",
      "location": "string",
      "jobType": "string",
      "salary": "number",
      "skills": ["string"],
      "createdAt": "ISO date string"
    },
    "studentId": "string",
    "resumeUrl": "string",
    "coverLetter": "string",
    "status": "string (lowercase)",
    "appliedAt": "ISO date string"
  }
]
```

**Response (Error - 500):**
```json
{
  "error": "Failed to fetch applications"
}
```

**Status Codes:**
- `200`: Student's applications retrieved
- `401`: Not authenticated
- `403`: Not a student
- `500`: Server error

**⚠️ Inconsistency Note:** Success response is array (not wrapped in `{ success, data }`); error missing `success: false`

---

### 16. Get Applications for Job (Recruiter)
**Endpoint:** `GET /applications/job/:jobId`  
**Auth Required:** Yes  
**Role:** `recruiter`, `admin`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
[
  {
    "_id": "string",
    "studentId": {
      "name": "string",
      "email": "string"
    },
    "jobId": {
      "title": "string"
    },
    "resumeUrl": "string",
    "coverLetter": "string",
    "status": "string",
    "appliedAt": "ISO date string"
  }
]
```

**Response (Error - 500):**
```json
{
  "error": "Failed to fetch applicants"
}
```

**Status Codes:**
- `200`: Applications for job retrieved
- `401`: Not authenticated
- `403`: Not a recruiter/admin
- `500`: Server error

**⚠️ Inconsistency Note:** Success response is array (not wrapped in `{ success, data }`); error missing `success: false`

---

### 17. Update Application Status (Recruiter)
**Endpoint:** `PATCH /applications/:id/status` or `POST /applications/:id/status`  
**Auth Required:** Yes  
**Role:** `recruiter`, `admin`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "string (required, e.g., 'SHORTLISTED', 'REJECTED', 'ACCEPTED')"
}
```

**Response:** Not fully documented in controller (needs review)

**Status Codes:**
- TBD (implementation incomplete in visible code)

---

## Profile Endpoints

### 18. Get My Profile
**Endpoint:** `GET /profile/me`  
**Auth Required:** Yes  
**Role:** `student`, `recruiter`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200, Student):**
```json
{
  "_id": "string",
  "userId": "string",
  "resumeUrl": "string (optional)",
  "skills": ["string"],
  "education": "string (optional)",
  "experience": "string (optional)",
  "profilePicture": "string (optional)",
  "bio": "string (optional)",
  "phone": "string (optional)",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

**Response (Success - 200, Recruiter):**
```json
{
  "_id": "string",
  "userId": "string",
  "company": "string (optional)",
  "companyLogo": "string (optional)",
  "bio": "string (optional)",
  "phone": "string (optional)",
  "website": "string (optional)",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

**Response (Error - 403/404/500):**
```json
{
  "error": "string (error description)"
}
```

**Status Codes:**
- `200`: Profile retrieved
- `401`: Not authenticated
- `403`: Unauthorized role
- `404`: Profile not found
- `500`: Server error

**⚠️ Inconsistency Note:** Success response missing `success: true` wrapper; error missing `success: false`

---

### 19. Update My Profile
**Endpoint:** `PATCH /profile/me`  
**Auth Required:** Yes  
**Role:** `student`, `recruiter`

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
```
// For students:
skills: string[] (optional)
education: string (optional)
experience: string (optional)
bio: string (optional)
phone: string (optional)
resumeUrl: file (optional)
profilePicture: file (optional)

// For recruiters:
company: string (optional)
bio: string (optional)
phone: string (optional)
website: string (optional)
companyLogo: file (optional)
profilePicture: file (optional)
```

**Response (Success - 200):**
```json
{
  "_id": "string",
  "userId": "string",
  // ... updated profile fields
  "updatedAt": "ISO date string"
}
```

**Response (Error - 403/500):**
```json
{
  "error": "string (error description)"
}
```

**Status Codes:**
- `200`: Profile updated (or created if not exists)
- `401`: Not authenticated
- `403`: Unauthorized role
- `500`: Server error

**⚠️ Inconsistency Note:** Success response missing `success: true` wrapper; error missing `success: false`

---

## Recommendation Endpoints

### 20. Get Job Recommendations (Student)
**Endpoint:** `GET /api/recommendations/jobs`  
**Auth Required:** Yes  
**Role:** `student`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response:** Not fully analyzed yet (requires reviewing recommendations route)

---

## Response Format Inconsistencies Summary

### ✅ Consistent (Follow Standard):
- Auth endpoints (`/api/auth/*`)
- Application endpoints (mostly consistent with `success` field)
- Profile endpoints need wrapper

### ⚠️ Needs Standardization:
1. **Job endpoints** - Mix of wrapped and unwrapped responses
2. **Application list endpoints** - Return bare arrays instead of wrapped objects
3. **Profile endpoints** - Missing `success` field
4. **Job create/update/delete** - Return redirects instead of JSON for API routes

### 🔴 Critical Issues for React SPA:
1. Job create/update/delete return HTTP redirects → **Must return JSON**
2. Inconsistent error format across controllers
3. Some endpoints return bare arrays, others return `{ data: [] }`
4. Status codes not always predictable

---

## Standard Response Format (Target)

All API endpoints should follow this format:

**Success:**
```json
{
  "success": true,
  "data": {},           // or array []
  "message": "string (optional)",
  "pagination": {}      // for list endpoints
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly message",
    "details": []       // optional validation errors
  }
}
```

---

## Next Steps for Standardization

1. ✅ Auth endpoints - Already standardized
2. ⚠️ Job controller - Needs response wrapper + remove redirects
3. ⚠️ Application controller - Needs consistent wrapper for list endpoints
4. ⚠️ Profile controller - Needs response wrapper
5. ⚠️ Error handler - Ensure all errors follow standard format

---

## Rate Limiting

Current limits (from `middleware/rateLimiter.js`):
- **General API:** 100 requests/minute
- **Auth endpoints:** 5 attempts/15 minutes
- **Job posting:** 10 posts/hour
- **Applications:** 20 applications/hour
- **File uploads:** 10 uploads/10 minutes

---

## Notes

- All authenticated endpoints require `Authorization: Bearer <token>` header
- Tokens are JWT, stored in frontend localStorage
- Token validation happens in `middleware/authentication.js`
- Role authorization happens in `middleware/authorization.js`
- File uploads use multer middleware with size/type restrictions

---

**Document Status:** ✅ Complete (Task 1.1 done)  
**Next Action:** Task 1.2 - Standardize all responses to follow consistent format
