# Week 1 Task Checklist: API Hardening & Reliability

## Priority Tasks (Day 1-2)

### Task 1.1: Document Current API Response Shapes ✅
**Goal:** Freeze current contract to avoid silent breaking changes.

- [ ] Create `API_CONTRACT.md` in project root
- [ ] Document auth endpoints:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
  - `POST /api/auth/logout`
- [ ] Document job endpoints:
  - `GET /jobs` (with pagination)
  - `GET /jobs/:id`
  - `POST /jobs` (recruiter)
  - `PATCH /jobs/:id` (recruiter)
  - `DELETE /jobs/:id` (recruiter)
  - `GET /jobs/my-jobs` (recruiter)
- [ ] Document application endpoints
- [ ] Document profile endpoints
- [ ] Include query params, request body, response shapes, and status codes

**Acceptance Criteria:**
- All existing client code calls match documented endpoints
- Response shape inconsistencies noted for fixing

---

### Task 1.2: Standardize API Response Format ✅
**Goal:** Single clean contract for all JSON responses.

#### Files to modify:
- `controllers/jobController.js`
- `controllers/applicationController.js`
- `controllers/profileController.js`
- `controllers/userController.js`

#### Standard formats:
```javascript
// Success
{
  success: true,
  data: { ... },          // Main payload
  message?: string,       // Optional friendly message
  pagination?: { ... }    // For paginated responses
}

// Error
{
  success: false,
  error: {
    code: 'ERROR_CODE',   // e.g., 'VALIDATION_ERROR', 'NOT_FOUND'
    message: 'User-friendly error message',
    details?: [ ... ]     // Optional validation details
  }
}
```

#### Checklist per controller:
- [ ] Remove `res.redirect()` from API-only handlers
- [ ] Wrap all successful responses in standard format
- [ ] Wrap all error responses in standard format
- [ ] Keep stack traces out of production error responses
- [ ] Test each endpoint manually with Postman/curl

**Acceptance Criteria:**
- All API responses use standard shape
- No redirect responses from API handlers
- Frontend can parse responses without conditional checks

---

### Task 1.3: Add Request Correlation IDs ✅
**Goal:** Track request lifecycle across logs.

#### Create middleware:
**File:** `middleware/requestId.js`

```javascript
const { randomUUID } = require('crypto');

function requestIdMiddleware(req, res, next) {
  req.id = req.headers['x-request-id'] || randomUUID();
  res.setHeader('x-request-id', req.id);
  next();
}

module.exports = requestIdMiddleware;
```

#### Apply in `index.js`:
- [ ] Import and add middleware early in chain
- [ ] Update all `console.log` calls to include `req.id`
- [ ] Update error handler to include request ID in logs

**Acceptance Criteria:**
- Every API response includes `x-request-id` header
- Every log line includes the request ID
- Can trace end-to-end request through logs

---

### Task 1.4: Improve Error Handler Middleware ✅
**Goal:** Safe, structured error responses.

**File:** `middleware/errorHandler.js`

#### Improvements:
- [ ] Never send stack traces in production (`NODE_ENV !== 'development'`)
- [ ] Log full error details server-side with request ID
- [ ] Return user-safe messages only
- [ ] Add error codes for common cases
- [ ] Handle async errors properly

**Acceptance Criteria:**
- No stack traces leak to production clients
- All errors logged with request ID
- User-friendly error messages

---

### Task 1.5: Enhanced Health Check Endpoint ✅
**Goal:** Deployment platforms and monitors can verify app health.

**File:** `index.js` (already exists, needs enhancement)

#### Current health check location:
Around line 230-240

#### Enhancements:
- [ ] Add database connection status
- [ ] Add response time check
- [ ] Return appropriate status code (200 for healthy, 503 for degraded)

```javascript
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };

  const statusCode = health.database === 'connected' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

**Acceptance Criteria:**
- Health endpoint returns 503 when DB is down
- Health endpoint returns 200 when all systems are up

---

## Secondary Tasks (Day 3-5)

### Task 1.6: Split Web and API Routes Cleanly ✅
**Goal:** Avoid confusion between EJS page routes and API routes.

#### Suggested structure:
```
routes/
  web/
    home.js
    student.js
    recruiter.js
  api/
    auth.js       (existing apiAuth.js)
    jobs.js
    applications.js
    profiles.js
```

- [ ] Group all API routes under `/api/*` prefix
- [ ] Keep web routes for EJS rendering separate
- [ ] Update `index.js` to mount routes clearly

**Acceptance Criteria:**
- Clear separation in codebase
- No API route returns HTML/redirect
- No web route returns raw JSON

---

### Task 1.7: Verify Rate Limiter Configuration ✅
**Goal:** Ensure rate limits are production-appropriate.

**File:** `middleware/rateLimiter.js`

- [ ] Review `apiLimiter` (100 req/min) - is this suitable for your traffic?
- [ ] Review `authLimiter` (5 attempts/15min) - appropriate for brute force protection?
- [ ] Consider separate limits for read vs write endpoints
- [ ] Add rate limit headers to responses
- [ ] Log when rate limits are hit

**Acceptance Criteria:**
- Rate limits tested under realistic load
- Documented rate limit policy
- No false positives blocking legitimate users

---

### Task 1.8: Security Headers Verification ✅
**Goal:** Ensure helmet and CORS are properly configured.

**File:** `index.js`

#### Check:
- [ ] Helmet middleware is active
- [ ] CORS whitelist is environment-aware
- [ ] CSP headers appropriate for your frontend
- [ ] No sensitive data in headers

**Acceptance Criteria:**
- Security headers present in all responses
- CORS only allows known origins
- Passes basic security header scan

---

## Testing & Validation (End of Week 1)

### Manual Testing Checklist:
- [ ] Register new user (student)
- [ ] Register new user (recruiter)
- [ ] Login as student
- [ ] Browse jobs as student
- [ ] Apply to job as student
- [ ] Login as recruiter
- [ ] Post job as recruiter
- [ ] View applications as recruiter
- [ ] Profile update for both roles
- [ ] All responses follow standard format
- [ ] Error cases return proper error format
- [ ] Rate limits work as expected

### Automated Checks:
- [ ] Linting passes (`npm run lint` or equivalent)
- [ ] No console errors in normal flows
- [ ] Request IDs present in all API responses
- [ ] Health check returns correct status

---

## Week 1 Definition of Done

✅ All API endpoints return consistent JSON format  
✅ Request correlation works end-to-end  
✅ Error handling is production-safe  
✅ Health check is monitoring-ready  
✅ Manual smoke test passed for all roles  
✅ API contract documented  
✅ No blockers for Week 2 React integration  

---

## Quick Start Command

```bash
# 1. Create API contract doc
touch API_CONTRACT.md

# 2. Create request ID middleware
touch middleware/requestId.js

# 3. Run existing app to verify
npm start

# 4. Open Postman/Thunder Client and test all endpoints
# Document request/response shapes in API_CONTRACT.md

# 5. Start standardizing controllers one by one
```

---

## Need Help?
- Standardized response patterns are in `routes/apiAuth.js` - use as reference
- Error handler template is in `middleware/errorHandler.js`
- For request ID pattern, see popular Node.js correlation ID libraries

---

## Rollback Plan Week 1
If any standardization breaks existing functionality:
1. Revert specific controller file to previous commit
2. Keep request ID middleware (safe addition)
3. Document breaking change for later fix
4. Continue with other tasks

---

**Start with Task 1.1 and 1.2 - they are foundational for everything else.**
