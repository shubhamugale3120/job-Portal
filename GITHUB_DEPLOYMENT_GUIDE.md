═══════════════════════════════════════════════════════════════════════
  📤 GIT PUSH & GITHUB DEPLOYMENT GUIDE
═══════════════════════════════════════════════════════════════════════

STEP 1: VERIFY ALL CHANGES ARE DONE ✅
═════════════════════════════════════════

✅ Security fixes applied:
   ✓ Removed /debug/* endpoints
   ✓ Removed default JWT_SECRET from .env.example
   ✓ Added /health check endpoint
   ✓ Wrapped debug logs with NODE_ENV checks

✅ Configuration updated:
   ✓ package.json scripts fixed
   ✓ Engines specified (Node 18.x/20.x)
   ✓ nodemon moved to devDependencies
   ✓ Startup message improved

✅ Documentation created:
   ✓ PRODUCTION_DEPLOYMENT.md
   ✓ .env.example updated
   ✓ Testing guides created

═══════════════════════════════════════════════════════════════════════
  STEP 2: INITIALIZE GIT (IF NOT ALREADY DONE)
═════════════════════════════════════════════════════════════════════

Run these commands in Terminal:

# Navigate to project
cd "c:\Users\SHUBHAM UGALE\Documents\ASEP\SY-Documents\SKILL\Project_work_nodejs"

# Check if git is initialized
git status

If you see "not a git repository" error, initialize git:

# Initialize git
git init

# Set your git user info
git config user.name "Shubham Ugale"
git config user.email "your-email@gmail.com"

═══════════════════════════════════════════════════════════════════════
  STEP 3: VERIFY .gitignore IS CORRECT ✅
═════════════════════════════════════════════════════════════════════

Your .gitignore should contain:

node_modules/
.env
.env.local
.env.*.local
.env.production.local
dist/
build/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
.vscode/
.idea/
*.swp
uploads/
.env.production

✅ Verify file exists in your project root

═══════════════════════════════════════════════════════════════════════
  STEP 4: STAGE & COMMIT CHANGES
═════════════════════════════════════════════════════════════════════

# Check what files changed
git status

# Stage all changes for commit
git add .

# Verify staged files
git status

# Commit with descriptive message
git commit -m "Production-ready deployment: security hardening, environment setup, and deployment documentation"

═══════════════════════════════════════════════════════════════════════
  STEP 5: CREATE GITHUB REPOSITORY
═════════════════════════════════════════════════════════════════════

✅ Go to GitHub.com:

1. Click "New" button (top left)
2. Repository name: ai-job-portal
3. Description: AI-Powered Job Portal with Advanced Security
4. Choose: Public (for portfolio) or Private (for work)
5. DO NOT initialize with README (you already have one)
6. Click "Create Repository"

After creation, you'll see instructions:

git remote add origin https://github.com/your-username/ai-job-portal.git
git branch -M main
git push -u origin main

═══════════════════════════════════════════════════════════════════════
  STEP 6: PUSH TO GITHUB
═════════════════════════════════════════════════════════════════════

Copy-paste these commands from GitHub's instructions:

# Add remote repository
git remote add origin https://github.com/YOUR-USERNAME/ai-job-portal.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main

You may be asked for credentials. Choose one:

Option A: Login with GitHub credentials
Option B: Use Personal Access Token (PAT)
   - Go to GitHub → Settings → Developer settings → Personal access tokens
   - Generate new token with "repo" scope
   - Use as password when prompted

═══════════════════════════════════════════════════════════════════════
  STEP 7: VERIFY ON GITHUB
═════════════════════════════════════════════════════════════════════

1. Go to https://github.com/your-username/ai-job-portal
2. Verify you see all your files
3. Check that .env is NOT in the repository (should be in .gitignore)
4. Verify README.md displays correctly

═══════════════════════════════════════════════════════════════════════
  🚀 STEP 8: DEPLOY TO PRODUCTION (CHOOSE ONE)
═════════════════════════════════════════════════════════════════════

OPTION A: HEROKU (Easiest for beginners) ⭐
═══════════════════════════════════════════

1. Create Heroku account: https://www.heroku.com
2. Download Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
3. In terminal:

# Login to Heroku
heroku login

# Create new app
heroku create your-app-name

# Add MongoDB Atlas database
heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/jobportal

# Set JWT secret
heroku config:set JWT_SECRET=<your-64-char-random-string>

# Set environment
heroku config:set NODE_ENV=production

# Push to Heroku
git push heroku main

# View logs
heroku logs --tail

# Your app is live at: https://your-app-name.herokuapp.com

═══════════════════════════════════════════════════════════════════════

OPTION B: VERCEL (Fast for Node apps)
═════════════════════════════════════

1. Go to vercel.com and sign up with GitHub
2. Import your repository
3. Set environment variables in dashboard:
   - MONGODB_URI
   - JWT_SECRET
   - NODE_ENV=production
4. Click Deploy
5. Your app is live at: https://your-project.vercel.app

═══════════════════════════════════════════════════════════════════════

OPTION C: RAILWAY (Easy + affordable)
══════════════════════════════════════

1. Go to railway.app
2. Sign up with GitHub
3. Create new project → Deploy from GitHub repo
4. Add MongoDB addon (Railway provides free tier)
5. Set environment variables
6. Your app is live at generated URL

═══════════════════════════════════════════════════════════════════════

OPTION D: RENDER (Free tier available)
═══════════════════════════════════════

1. Go to render.com
2. Sign up with GitHub
3. Create "New Web Service"
4. Connect to your GitHub repo
5. Configure:
   - Name: ai-job-portal
   - Runtime: Node
   - Build command: npm install
   - Start command: npm start
6. Add environment variables
7. Deploy!

═══════════════════════════════════════════════════════════════════════

OPTION E: AWS EC2 (Most control, requires setup)
═════════════════════════════════════════════════

1. Create AWS account
2. Launch EC2 instance (Ubuntu 20.04)
3. Connect via SSH
4. Install Node.js:
   sudo apt update
   sudo apt install nodejs npm

5. Clone your repo:
   git clone https://github.com/you/ai-job-portal.git
   cd ai-job-portal

6. Setup:
   npm install
   
7. Create .env file with production values:
   nano .env
   (paste MongoDB URI, JWT secret, NODE_ENV=production)

8. Install PM2 (keeps app running):
   sudo npm install -g pm2
   pm2 start index.js --name "job-portal"
   pm2 startup
   pm2 save

9. Setup reverse proxy with Nginx for security
10. Get SSL certificate from Let's Encrypt

═══════════════════════════════════════════════════════════════════════
  🗄️ MONGODB SETUP (REQUIRED FOR ALL PLATFORMS)
═════════════════════════════════════════════════════════════════════

Go to mongodb.com/cloud/atlas (MongoDB Atlas):

1. Create account
2. Create new project: "job-portal-production"
3. Build a database:
   - Provider: Preferred (AWS/Google Cloud/Azure)
   - Region: Closest to your users
   - Plan: Free M0 tier

4. Create database user:
   - Username: jobportal_user
   - Password: Generate secure password
   - Save this!

5. Network Access:
   - Click "Network Access"
   - Add IP Address: "0.0.0.0/0" (allows all IPs)
   - In production, restrict this

6. Get connection string:
   - Click "Connect"
   - Choose "Drivers"
   - Copy full connection string
   - Replace <password> and <username>

Example:
mongodb+srv://jobportal_user:MySecurePassword123@cluster0.mongodb.net/jobportal?retryWrites=true&w=majority

─────────────────────────────────────────────────────

SET AS MONGODB_URI on your deployment platform:

Heroku: heroku config:set MONGODB_URI=mongodb+srv://...
Vercel: Add to project settings
Railway: Add environment variable
AWS: Set in .env file

═══════════════════════════════════════════════════════════════════════
  📋 FINAL CHECKLIST BEFORE GOING LIVE
═════════════════════════════════════════════════════════════════════

SECURITY:
☑️ .env file NOT in git (check .gitignore)
☑️ JWT_SECRET is strong random string (64 chars)
☑️ No hardcoded secrets in code
☑️ /debug endpoints removed
☑️ Helmet security headers enabled
☑️ CORS configured properly

DATABASE:
☑️ MongoDB Atlas created
☑️ Database user created
☑️ Connection string tested
☑️ Network access configured (restrict IPs in production)
☑️ Backups enabled

DEPLOYMENT:
☑️ Repository pushed to GitHub
☑️ package.json has correct scripts
☑️ .env.example created (no secrets)
☑️ NODE_ENV set to "production"
☑️ PORT environment variable set

TESTING:
☑️ Run locally: npm start
☑️ Visit http://localhost:3000
☑️ Test signup/login
☑️ Test job browse
☑️ Test View Details modal
☑️ Test apply functionality
☑️ Check /health endpoint: http://localhost:3000/health

MONITORING:
☑️ Error logging enabled
☑️ Health check endpoint working
☑️ Platform logs accessible
☑️ Email alerts configured (if needed)

═══════════════════════════════════════════════════════════════════════
  📱 TEST DEPLOYMENT
═════════════════════════════════════════════════════════════════════

After deploying:

1. Visit your live URL: https://your-app.herokuapp.com (or equivalent)
2. Test:
   - Home page loads
   - Signup works
   - Login works
   - Browse jobs page works
   - View Details modal opens
   - Apply button works
   - Student dashboard loads

3. Check health endpoint:
   https://your-app.herokuapp.com/health
   
   Should return:
   {
       "uptime": 12345.67,
       "message": "OK",
       "timestamp": 1707234567890,
       "mongodb": "connected",
       "environment": "production"
   }

═══════════════════════════════════════════════════════════════════════
  🎯 YOUR DEPLOYMENT PLAN (RECOMMENDED)
═════════════════════════════════════════════════════════════════════

1️⃣ FIRST CHOICE: Heroku + MongoDB Atlas (Easiest)
   - Heroku: Free tier available (sleeps after 30 min inactivity)
   - Upgrade to $5/mo for always-on
   - MongoDB: Free M0 tier with 512MB storage
   
2️⃣ ALTERNATIVE: Railway (Better free tier)
   - $5 credit monthly
   - MongoDB addon included
   - Better performance than Heroku free
   
3️⃣ PROFESSIONAL: AWS + MongoDB Atlas
   - Full control
   - Auto-scaling
   - Production-grade infrastructure
   - More complex setup

═══════════════════════════════════════════════════════════════════════
  ✅ COMMANDS QUICK REFERENCE
═════════════════════════════════════════════════════════════════════

# Check git status
git status

# Stage all changes
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push origin main

# Heroku: Create app
heroku create app-name

# Heroku: Set environment variables
heroku config:set MONGODB_URI=...
heroku config:set JWT_SECRET=...

# Heroku: Push to deploy
git push heroku main

# Heroku: View logs
heroku logs --tail

# Heroku: View all config
heroku config

═══════════════════════════════════════════════════════════════════════
  📞 TROUBLESHOOTING
═════════════════════════════════════════════════════════════════════

❌ "git remote already exists"
→ git remote remove origin
→ Then add again

❌ "Authentication failed"
→ Use Personal Access Token instead of password
→ Settings → Developer settings → Personal access tokens

❌ "App crashes after deployment"
→ Check logs: heroku logs --tail
→ Usually: missing environment variables
→ Set them: heroku config:set VARIABLE=value

❌ "Cannot connect to MongoDB"
→ Check connection string in env variables
→ Check network access in MongoDB Atlas
→ Make sure password is URL-encoded if special chars

❌ "Health check returns 'disconnected'"
→ MongoDB URI is wrong
→ Or MongoDB Atlas network access not set to 0.0.0.0/0

═══════════════════════════════════════════════════════════════════════

Ready to push? Follow STEPS 1-7, then choose your deployment platform!
