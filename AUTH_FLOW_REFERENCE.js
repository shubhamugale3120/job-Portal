/**
 * END-TO-END AUTH FLOW REFERENCE
 * 
 * This document explains how authentication works between React frontend and Node backend.
 * Follow this flow to understand and troubleshoot any auth issues.
 * 
 * ============================================================================
 * FLOW 1: USER REGISTRATION
 * ============================================================================
 * 
 * 1. USER FILLS FORM (Frontend: RegisterPage.jsx)
 *    - Name, Email, Password, Role (student/recruiter)
 *    - Clicks "Register"
 * 
 * 2. FORM SUBMIT HANDLER CALLS SERVICE (Frontend: pages/auth/RegisterPage.jsx)
 *    ```
 *    const response = await register({ name, email, password, role });
 *    // Imported from services/authService.js
 *    ```
 * 
 * 3. AUTH SERVICE MAKES HTTP REQUEST (Frontend: services/authService.js)
 *    ```
 *    export const register = async ({ name, email, password, role }) => {
 *      const response = await api.post('/api/auth/register', { name, email, password, role });
 *      return response.data;
 *    };
 *    ```
 *    - Uses Axios instance (api.js)
 *    - Target: http://localhost:3000/api/auth/register
 * 
 * 4. AXIOS INTERCEPTOR ADDS TOKEN (Frontend: services/api.js)
 *    - Request interceptor: adds Authorization header if token exists
 *    - No token on register, so skips this
 * 
 * 5. BACKEND RECEIVES POST REQUEST (Backend: routes/apiAuth.js → POST /api/auth/register)
 *    - Validates:
 *      - name, email, password, role present
 *      - password >= 6 chars
 *      - role is 'student' or 'recruiter'
 *      - email not already registered
 * 
 * 6. BACKEND CREATES USER IN DATABASE (Backend: models/user.js)
 *    - Mongoose schema auto-hashes password with bcrypt
 *    - Saves to MongoDB
 *    - Returns user object
 * 
 * 7. BACKEND GENERATES JWT TOKEN (Backend: service/authentication.js → createTokenForUser)
 *    - Token contains: _id, email, role
 *    - Expires in 7 days
 *    - Secret: process.env.JWT_SECRET or "$123shu"
 * 
 * 8. BACKEND RETURNS RESPONSE (Backend: routes/apiAuth.js)
 *    ```
 *    {
 *      success: true,
 *      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *      user: { _id, email, role, name }
 *    }
 *    ```
 * 
 * 9. AXIOS RESPONSE RECEIVED (Frontend: services/authService.js → return response.data)
 *    - Returns { success, token, user }
 * 
 * 10. REGISTER PAGE HANDLES SUCCESS (Frontend: pages/auth/RegisterPage.jsx)
 *    ```
 *    const response = await register({ name, email, password, role });
 *    // response = { success: true, token: "...", user: {...} }
 *    navigate('/login', { replace: true });
 *    ```
 *    - Redirects to login page
 * 
 * 11. USER LOGS IN WITH NEW ACCOUNT (See FLOW 2 below)
 * 
 * 
 * ============================================================================
 * FLOW 2: USER LOGIN
 * ============================================================================
 * 
 * 1. USER FILLS LOGIN FORM (Frontend: LoginPage.jsx)
 *    - Email, Password
 *    - Clicks "Login"
 * 
 * 2. FORM SUBMIT HANDLER CALLS LOGIN SERVICE (Frontend: pages/auth/LoginPage.jsx)
 *    ```
 *    const response = await login({ email, password });
 *    ```
 * 
 * 3. AUTH SERVICE MAKES HTTP REQUEST (Frontend: services/authService.js)
 *    ```
 *    export const login = async ({ email, password }) => {
 *      const response = await api.post('/api/auth/login', { email, password });
 *      return response.data;
 *    };
 *    ```
 *    - Target: http://localhost:3000/api/auth/login
 * 
 * 4. BACKEND RECEIVES POST REQUEST (Backend: routes/apiAuth.js → POST /api/auth/login)
 *    - Finds user by email in MongoDB
 *    - Compares password using bcrypt
 *    - If mismatch: returns 401 Unauthorized
 * 
 * 5. BACKEND GENERATES JWT TOKEN (Backend: service/authentication.js)
 *    - Same as registration process
 *    - Token contains user's _id, email, role
 * 
 * 6. BACKEND RETURNS RESPONSE (Backend: routes/apiAuth.js)
 *    ```
 *    {
 *      success: true,
 *      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *      user: { _id, email, role, name }
 *    }
 *    ```
 * 
 * 7. LOGIN PAGE RECEIVES RESPONSE (Frontend: pages/auth/LoginPage.jsx)
 *    ```
 *    const { token, user } = await login({ email, password });
 *    login(token, user);  // Call auth context login
 *    navigate('/jobs', { replace: true });
 *    ```
 * 
 * 8. AUTH CONTEXT STORES TOKEN & USER (Frontend: context/AuthContext.jsx)
 *    ```
 *    const login = useCallback((token, userPayload = null) => {
 *      localStorage.setItem('token', token);  // Store token in browser
 *      setUser(userPayload);  // Update auth state
 *    }, []);
 *    ```
 * 
 * 9. FRONTEND REDIRECTS TO APP (Frontend: pages/auth/LoginPage.jsx)
 *    ```
 *    navigate('/jobs', { replace: true });
 *    ```
 *    - Navigates to jobs listing page
 *    - Route guards check: user exists? ✓
 * 
 * 
 * ============================================================================
 * FLOW 3: APP STARTUP (RESTORE SESSION)
 * ============================================================================
 * 
 * 1. USER REFRESHES BROWSER OR OPENS APP (Frontend: Browser)
 *    - All state is lost
 *    - Token stored in localStorage persists
 * 
 * 2. APP MOUNTS (Frontend: main.jsx)
 *    - React renders App
 *    - AuthProvider wraps entire app
 * 
 * 3. AUTH CONTEXT INITIALIZES (Frontend: context/AuthContext.jsx → useEffect)
 *    ```
 *    useEffect(() => {
 *      refreshUser();
 *    }, [refreshUser]);
 *    ```
 *    - Calls refreshUser() on mount
 * 
 * 4. REFRESH USER READS LOCALSTORAGE (Frontend: context/AuthContext.jsx)
 *    ```
 *    const token = localStorage.getItem('token');
 *    if (!token) { setUser(null); return; }
 *    ```
 * 
 * 5. CALLS /API/AUTH/ME ENDPOINT (Frontend: services/authService.js)
 *    ```
 *    export const getCurrentUser = async () => {
 *      const response = await api.get('/api/auth/me');
 *      return response.data;
 *    };
 *    ```
 * 
 * 6. AXIOS INJECTS TOKEN IN HEADER (Frontend: services/api.js)
 *    ```
 *    api.interceptors.request.use((config) => {
 *      const token = localStorage.getItem('token');
 *      if (token) {
 *        config.headers.Authorization = `Bearer ${token}`;
 *      }
 *      return config;
 *    });
 *    ```
 *    - Request: GET /api/auth/me
 *    - Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
 * 
 * 7. BACKEND VALIDATES TOKEN (Backend: routes/apiAuth.js → GET /api/auth/me)
 *    - Middleware checkforAuthenticationCookie extracts token from Authorization header
 *    - Validates token signature using JWT_SECRET
 *    - Sets req.user from token payload
 * 
 * 8. BACKEND FETCHES FULL USER FROM DATABASE (Backend: routes/apiAuth.js)
 *    ```
 *    const user = await User.findById(req.user._id).select('-password -salt');
 *    ```
 *    - Gets full profile (not just token payload)
 * 
 * 9. BACKEND RETURNS USER (Backend: routes/apiAuth.js)
 *    ```
 *    {
 *      success: true,
 *      user: { _id, email, role, name, phone, bio, company, ... }
 *    }
 *    ```
 * 
 * 10. AUTH CONTEXT UPDATES STATE (Frontend: context/AuthContext.jsx)
 *     ```
 *     setUser(normalizedUser);  // User is now authenticated
 *     ```
 * 
 * 11. APP RENDERS WITH USER (Frontend: ProtectedRoute checks)
 *     - Navbar shows: Profile, Dashboard, Logout
 *     - Protected routes unlock
 *     - User is fully restored
 * 
 * 
 * ============================================================================
 * FLOW 4: PROTECTED API REQUESTS (JOBS LISTING)
 * ============================================================================
 * 
 * 1. USER NAVIGATES TO /JOBS (Frontend: JobsListPage.jsx)
 * 
 * 2. useJobs HOOK CALLS getJobs() (Frontend: hooks/useJobs.js)
 *    ```
 *    const response = await getJobs(query);
 *    ```
 * 
 * 3. JOB SERVICE MAKES REQUEST (Frontend: services/jobService.js)
 *    ```
 *    export const getJobs = async (params = {}) => {
 *      const response = await api.get('/jobs', { params });
 *      return response.data;
 *    };
 *    ```
 *    - Target: http://localhost:3000/jobs?page=1&limit=10
 * 
 * 4. AXIOS INTERCEPTOR INJECTS TOKEN (Frontend: services/api.js)
 *    ```
 *    Authorization: Bearer <stored_token>
 *    ```
 * 
 * 5. BACKEND RECEIVES REQUEST (Backend: routes/job.js → GET /jobs)
 *    - Middleware validates token (optional for public jobs)
 *    - Filters jobs based on query params: page, limit, search, location, skills
 *    - Returns paginated results
 * 
 * 6. FRONTEND RECEIVES JOBS (Frontend: hooks/useJobs.js)
 *    - Updates jobs state
 *    - Renders JobCard components
 * 
 * 
 * ============================================================================
 * FLOW 5: PROTECTED ACTION (STUDENT APPLIES TO JOB)
 * ============================================================================
 * 
 * 1. STUDENT CLICKS APPLY BUTTON (Frontend: JobCard.jsx)
 *    - Job ID known
 *    - Current user ID from auth context
 * 
 * 2. CALLS applicationService.applyToJob() (Frontend: services/applicationService.js)
 *    ```
 *    export const applyToJob = async (jobId, payload) => {
 *      const response = await api.post(`/applications/${jobId}/apply`, payload);
 *      return response.data;
 *    };
 *    ```
 * 
 * 3. AXIOS INJECTS TOKEN (Frontend: services/api.js)
 *    ```
 *    POST /applications/650f1a2b3c4d5e6f7g8h9i0j/apply
 *    Authorization: Bearer <token>
 *    Body: { resumeUrl, coverLetter }
 *    ```
 * 
 * 4. BACKEND CHECKS AUTHORIZATION (Backend: routes/application.js)
 *    ```
 *    router.post('/:jobId/apply', requireRole('student'), applyToJob);
 *    ```
 *    - Middleware checks req.user.role === 'student'
 *    - If not: returns 403 Forbidden
 * 
 * 5. BACKEND PREVENTS DUPLICATE APPLY (Backend: controllers/applicationController.js)
 *    ```
 *    const existing = await Application.findOne({
 *      jobId: req.params.jobId,
 *      studentId: req.user._id
 *    });
 *    if (existing) return 409 Conflict;
 *    ```
 * 
 * 6. BACKEND CREATES APPLICATION (Backend: controllers/applicationController.js)
 *    ```
 *    const application = await Application.create({
 *      jobId,
 *      studentId: req.user._id,
 *      resumeUrl,
 *      coverLetter,
 *      status: 'APPLIED'
 *    });
 *    ```
 * 
 * 7. BACKEND RETURNS SUCCESS (Backend: routes/application.js)
 *    ```
 *    {
 *      success: true,
 *      message: 'Applied successfully!',
 *      data: { _id, jobId, studentId, status, ... }
 *    }
 *    ```
 * 
 * 8. FRONTEND SHOWS SUCCESS (Frontend: JobCard.jsx)
 *    - Toast/alert: "Applied successfully!"
 *    - Button disabled: "Already applied"
 * 
 * 
 * ============================================================================
 * FLOW 6: TOKEN EXPIRY (AUTO LOGOUT)
 * ============================================================================
 * 
 * 1. TOKEN EXPIRES (After 7 days)
 *    - Token stored in localStorage still exists
 *    - Backend JWT validator rejects it as expired
 * 
 * 2. BACKEND RETURNS 401 UNAUTHORIZED (Backend: routes/apiAuth.js)
 *    ```
 *    { success: false, message: 'Token expired - please login again' }
 *    ```
 * 
 * 3. AXIOS RESPONSE INTERCEPTOR CATCHES 401 (Frontend: services/api.js)
 *    ```
 *    if (error.response?.status === 401 && !isAuthBootstrapCall) {
 *      localStorage.removeItem('token');
 *      window.location.assign('/login');
 *    }
 *    ```
 * 
 * 4. FRONTEND AUTO-REDIRECTS TO LOGIN (Frontend: App.jsx)
 *    - Clears localStorage token
 *    - Navigates user to /login
 *    - AuthContext detects no token
 *    - User must login again
 * 
 * 
 * ============================================================================
 * KEY CONCEPTS
 * ============================================================================
 * 
 * STATELESS AUTH:
 * - Server doesn't store sessions
 * - Only validates JWT signature
 * - Enables horizontal scaling (any server can validate token)
 * 
 * JWT PAYLOAD:
 * - Token contains: _id, email, role
 * - Encrypted with JWT_SECRET
 * - Expires automatically (7 days)
 * 
 * TOKEN STORAGE:
 * - localStorage (browser): persists across page refreshes
 * - Axios adds to every request: Authorization: Bearer <token>
 * - Never sent in cookies for SPA (security best practice)
 * 
 * ROLE-BASED ACCESS:
 * - student: can apply, view applications, browse jobs
 * - recruiter: can post jobs, view applicants, manage jobs
 * - admin: full access (future enhancement)
 * 
 * ERROR HANDLING:
 * - 400: Bad input (validation failed)
 * - 401: Unauthorized (invalid/expired token)
 * - 409: Conflict (duplicate email, already applied)
 * - 500: Server error
 * 
 * 
 * ============================================================================
 * NEXT STEPS
 * ============================================================================
 * 
 * 1. Test in browser:
 *    - Backend: npm run dev (port 3000)
 *    - Frontend: npm run dev (port 5173)
 * 
 * 2. Test register:
 *    - Go to http://localhost:5173/register
 *    - Create account (student or recruiter)
 *    - Check browser localStorage for token
 *    - Check MongoDB for new user
 * 
 * 3. Test login:
 *    - Go to http://localhost:5173/login
 *    - Use credentials from registration
 *    - Check navbar now shows authenticated state
 * 
 * 4. Test protected route:
 *    - Go to http://localhost:5173/student/applications
 *    - Should show content (if student role)
 *    - If not authenticated: redirected to /login
 * 
 * 5. Test API call with token:
 *    - Navigate to /jobs
 *    - useJobs hook should fetch jobs
 *    - Check Network tab: request has Authorization header
 * 
 */

export const authFlowReference = `
  See comments in this file for complete auth flow documentation.
`;
