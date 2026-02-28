/**
 * REACT + NODE AUTH INTEGRATION: QUICK START & TESTING
 * 
 * This file guides you through testing the complete auth flow
 * and troubleshooting common issues.
 */

// ============================================================================
// SETUP CHECKLIST
// ============================================================================

/*
✓ Backend changes:
  - Created routes/apiAuth.js (JSON auth endpoints)
  - Added cors middleware to index.js
  - Registered apiAuthRouter in index.js
  - Checked: npm install cors (if not already installed)

✓ Frontend changes:
  - Fixed AuthContext with proper token persistence
  - Fixed useAuth hook with safe error throwing
  - Hardened api.js with timeout and interceptors
  - Updated authService with correct /api/auth/* paths
  - Updated RegisterPage with proper form handling
  - Updated LoginPage with auth context integration
  - Updated Navbar with logout and role-based links

✓ Database:
  - MongoDB running (default: localhost:27017)
  - User model has bcrypt password hashing
  - No migrations needed

✓ Environment:
  - Backend: PORT=3000 (default)
  - Frontend: http://localhost:5173 (Vite default)
  - CORS enabled: 'http://localhost:5173'
*/

// ============================================================================
// STEP 1: START BACKEND
// ============================================================================

/*
COMMAND:
  cd Project_work_nodejs
  npm run dev

EXPECTED OUTPUT:
  ╔════════════════════════════════════════════╗
  ║     🚀 SERVER STARTED SUCCESSFULLY         ║
  ║  Environment: development                  ║
  ║  Port: 3000                                ║
  ║  PID: 12345                                ║
  ╚════════════════════════════════════════════╝
  📌 Development Mode: Hot reload enabled with nodemon
  Connected to MongoDB

VERIFY ENDPOINTS:
  - Browser: http://localhost:3000/health
  - Should return: { uptime, message: "OK", mongodb: "connected", ... }
*/

// ============================================================================
// STEP 2: START FRONTEND
// ============================================================================

/*
COMMAND (in another terminal):
  cd Project_work_nodejs/client
  npm run dev

EXPECTED OUTPUT:
  ➜  Local:   http://localhost:5173/
  ➜  Press 'o' to open browser

VERIFY:
  - Browser: http://localhost:5173
  - Should show: Job Portal with navbar (Login, Register, Browse Jobs)
*/

// ============================================================================
// STEP 3: TEST REGISTRATION
// ============================================================================

/*
TEST FLOW:
  1. Click "Register" in navbar
  2. Fill form:
     - Name: John Doe
     - Email: john@example.com
     - Password: password123
     - Role: student
  3. Click "Register"

EXPECTED:
  - No immediate error
  - Redirects to /login
  - New user created in MongoDB

TROUBLESHOOTING:
  
  Error: "CORS policy: No 'Access-Control-Allow-Origin'"
  → Backend CORS not enabled
  → Solution: Check index.js has cors middleware BEFORE routes
  
  Error: "Failed to fetch" / Network error
  → Backend not running
  → Solution: npm run dev on backend, check port 3000
  
  Error: "Email already registered"
  → User already exists
  → Solution: Use different email or delete user from MongoDB
  
  Error: "Password must be at least 6 characters"
  → Password too short
  → Solution: Use password with 6+ characters
  
  Error: "Role must be 'student' or 'recruiter'"
  → Role not valid
  → Solution: Check RegisterPage sends correct role value
*/

// ============================================================================
// STEP 4: TEST LOGIN
// ============================================================================

/*
TEST FLOW:
  1. You should be on /login page from registration redirect
  2. Fill form:
     - Email: john@example.com
     - Password: password123
  3. Click "Login"

EXPECTED:
  - No error message
  - Redirects to /jobs page
  - Navbar changes: shows "My Applications", "Logout" (if student)
  - localStorage contains 'token' key

VERIFY TOKEN IN BROWSER:
  1. Press F12 (Dev Tools)
  2. Go to Application > LocalStorage
  3. Find 'http://localhost:5173'
  4. Key 'token' should exist and have long JWT value
     Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTBmMWEyYj...

TROUBLESHOOTING:
  
  Error: "Invalid email or password"
  → Wrong credentials
  → Solution: Check email/password match what was registered
            Use same case (email lowercase recommended)
  
  Error: "Login failed"
  → Server error
  → Solution: Check backend logs for error details
            Verify MongoDB connection
  
  No redirect after login
  → Frontend get user call failing
  → Solution: Check Network tab for /api/auth/me request
            Ensure Authorization header is present
            Check backend is returning user object

  Token not appearing in localStorage
  → AuthContext login not called properly
  → Solution: Check LoginPage component calls login() with token
            Verify token is in response.data
*/

// ============================================================================
// STEP 5: TEST PROTECTED ROUTES
// ============================================================================

/*
TEST FLOW (requires: logged in as student):
  1. Click "My Applications" in navbar
  2. Should show page (even if empty)

EXPECTED:
  - Page loads
  - Empty state: "No applications yet"
  
TROUBLESHOOTING:
  
  Infinite loading
  → Protected route check not completing
  → Solution: Check AuthContext loading state
            Verify /api/auth/me returning user
  
  Redirect to /login
  → User not authenticated
  → Solution: Login first
            Check localStorage has token
            Check token not expired (7 days)
  
  403 Forbidden page
  → Wrong role
  → Solution: Verify you're logged in as 'student', not 'recruiter'
*/

// ============================================================================
// STEP 6: TEST JOBS LISTING
// ============================================================================

/*
TEST FLOW:
  1. Click "Jobs" in navbar
  2. Should show list of jobs

EXPECTED:
  - Jobs load from backend
  - Can see: title, company, location, jobType, salary, skills
  - Filters work: search, location, skills, jobType
  - Pagination: Previous/Next buttons

NETWORK INSPECTION:
  1. Press F12
  2. Go to Network tab
  3. Refresh jobs page
  4. Look for request: GET /jobs?page=1&limit=10
  5. Request headers should show:
     Authorization: Bearer <token>
  6. Response should be:
     {
       "success": true,
       "data": [ ... jobs ],
       "pagination": { "currentPage": 1, "limit": 10, "hasNextPage": false }
     }

TROUBLESHOOTING:
  
  Error: "Failed to fetch jobs"
  → API call failing
  → Solution: Check backend is running
            Check /jobs endpoint exists
            Check database has jobs (or add test jobs)
  
  No jobs showing
  → Either no jobs in database OR query params filtering wrong
  → Solution: Go to MongoDB, check 'jobs' collection
            Try clearing filters (search bar empty)
  
  Token not being sent
  → Axios interceptor not working
  → Solution: Check services/api.js has request interceptor
            Verify localStorage still has token
*/

// ============================================================================
// STEP 7: TEST STUDENT APPLY FLOW
// ============================================================================

/*
PREREQUISITE:
  - Logged in as student
  - On /jobs page
  - At least one job visible

TEST FLOW:
  1. Click "Apply" button on a job
  2. Should ask for resume URL (if implemented)
  3. Should show success message

EXPECTED:
  - Application created in backend
  - Button changes to "Already Applied"
  - Can view in "My Applications" section

CHECK IN MONGODB:
  db.applications.find({ studentId: ObjectId("...") })
  Should return one record with:
  - studentId: (your user ID)
  - jobId: (the job you applied to)
  - status: "APPLIED"

TROUBLESHOOTING:
  
  Button doesn't work
  → Apply handler not wired
  → Solution: Check JobCard.jsx Apply button implementation
            Verify applicationService is correctly imported
  
  Error: "You have already applied"
  → Good! This means backend is preventing duplicates
  → To test again: use different job or delete application from MongoDB
  
  Error: "Unauthorized" / 403
  → Not logged in as student
  → Solution: Login as student, not recruiter
            Check user.role in localStorage token
*/

// ============================================================================
// TROUBLESHOOTING: TOKEN HEADER NOT BEING SENT
// ============================================================================

/*
SYMPTOM: Backend returns 401, but you're logged in

DIAGNOSIS:
  1. Open DevTools Network tab
  2. Make any API request (e.g., click jobs, apply)
  3. Look for the request in Network
  4. Click the request
  5. Go to "Request Headers"
  6. Look for: Authorization: Bearer ...

IF AUTHORIZATION HEADER IS MISSING:
  → Axios interceptor not working

FIX:
  1. Check services/api.js has request interceptor:
     ```
     api.interceptors.request.use((config) => {
       const token = localStorage.getItem('token');
       if (token) {
         config.headers.Authorization = `Bearer ${token}`;
       }
       return config;
     });
     ```
  
  2. In browser console, run:
     ```
     localStorage.getItem('token')
     ```
     Should return JWT, not null
  
  3. If null, not logged in properly:
     - Go register/login again
     - Check LoginPage calls authContext.login(token)
  
  4. Rebuild frontend if changed:
     ```
     npm run build
     # Verify no errors
     ```
*/

// ============================================================================
// COMMON MONGODB QUERIES FOR TESTING
// ============================================================================

/*
CONNECT TO MONGODB:
  mongo mongodb://localhost:27017/jobPortalDB

CHECK USERS:
  db.students.find()
  // Should show registered users

CHECK SPECIFIC USER:
  db.students.findOne({ email: "john@example.com" })
  // Should show user with hashed password

DELETE USER (for re-testing):
  db.students.deleteOne({ email: "john@example.com" })

CHECK APPLICATIONS:
  db.applications.find()
  // Should show job applications

CHECK SPECIFIC JOB:
  db.jobs.findOne()
  // Make sure jobs collection has data for testing

ADD TEST JOB (if none exist):
  db.jobs.insertOne({
    title: "React Developer",
    description: "Build amazing UIs",
    location: "Remote",
    jobType: "Full-time",
    salary: 100000,
    skills: ["React", "Node.js"],
    postedBy: ObjectId("..."), // Any valid user ID
    status: "Active",
    createdAt: new Date()
  })
*/

// ============================================================================
// SUCCESS CHECKLIST
// ============================================================================

/*
You'll know everything is working when:

✓ Register works:
  - New user in MongoDB
  - Redirects to login

✓ Login works:
  - Token appears in localStorage
  - Navbar shows authenticated state

✓ Protected routes work:
  - Can access /student/applications (if student)
  - Cannot access /recruiter/dashboard (if student role)

✓ API calls work:
  - Jobs list loads
  - Authorization header sent automatically

✓ Student apply works:
  - Application created in database
  - Button disables after apply
  - Shows in "My Applications"

✓ Logout works:
  - Token removed from localStorage
  - Redirects to login
  - Cannot access protected routes

WHEN EVERYTHING WORKS:
  - You have a functioning full-stack auth system! 🎉
  - Ready to deploy or add more features
*/

export const testingGuide = `See comments for complete testing instructions`;
