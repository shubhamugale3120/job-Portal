# 🚀 Deployment Guide - Job Portal

Complete guide to deploy your Job Portal for **FREE** with Docker, domain names, and multiple hosting options.

---

## 📋 Table of Contents

1. [Deployment Options](#deployment-options)
2. [Docker Setup](#docker-setup)
3. [Free Hosting Platforms](#free-hosting-platforms)
4. [Domain Setup](#domain-setup)
5. [MongoDB Atlas (Free)](#mongodb-atlas-free)
6. [Step-by-Step Deployment](#step-by-step-deployment)
7. [CI/CD Pipeline](#cicd-pipeline)

---

## 🌐 Deployment Options

### Free Hosting Platforms Comparison

| Platform | Free Tier | Cold Start | Custom Domain | MongoDB | Docker | Best For |
|----------|-----------|-----------|---------------|---------|--------|----------|
| **Render** | ✅ Yes | 15 sec | ✅ Yes | ✅ Atlas | ✅ Docker | Best overall |
| **Railway** | ✅ Yes ($5/mo) | 5 sec | ✅ Yes | ✅ Atlas | ✅ Docker | Fast deployment |
| **Vercel** | ✅ Yes | <1 sec | ✅ Yes | ❌ No | ❌ No | Static sites |
| **Heroku** | ❌ No (paid) | 3 sec | ✅ Yes | ✅ Atlas | ✅ Docker | Legacy option |
| **Fly.io** | ✅ Yes ($3/mo) | 5 sec | ✅ Yes | ✅ Atlas | ✅ Docker | Global deployment |
| **Replit** | ✅ Yes | 30 sec | ✅ Yes | ✅ Atlas | ❌ No | Easy setup |
| **Glitch** | ✅ Yes | 10 sec | ✅ Yes | ✅ Atlas | ❌ No | Learning |

**🏆 Recommended: Render.com** (Best free tier + Docker support)

 
---

## 🐳 Docker Setup

### Step 1: Create Dockerfile

Create a `Dockerfile` in root directory:

```dockerfile
# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["npm", "start"]
```

### Step 2: Create .dockerignore

```
node_modules
npm-debug.log
.git
.gitignore
.env
.env.local
README.md
.DS_Store
```

### Step 3: Create docker-compose.yml (For Local Testing)

```yaml
version: '3.8'

services:
  # Node.js Application
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/job_portal
      - NODE_ENV=development
      - PORT=3000
    depends_on:
      - mongo
    volumes:
      - .:/app
      - /app/node_modules

  # MongoDB
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=job_portal

volumes:
  mongo_data:
```

### Step 4: Build & Test Docker Locally

```bash
# Build Docker image
docker build -t job-portal:latest .

# Run Docker container
docker run -p 3000:3000 \
  -e MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/job_portal \
  -e NODE_ENV=production \
  job-portal:latest

# Or use docker-compose
docker-compose up

# Access at http://localhost:3000
```

### Step 5: Push to Docker Hub (Optional)

```bash
# Create Docker Hub account at hub://docker.com

# Login to Docker Hub
docker login

# Tag image
docker tag job-portal:latest your_username/job-portal:latest

# Push to Hub
docker push your_username/job-portal:latest

# Now other platforms can pull your image
docker pull your_username/job-portal:latest
```

---

## 🆓 Free Hosting Platforms

### Option 1: Render.com (⭐ RECOMMENDED)

**Why Render:**
- ✅ Truly free tier (no cold start issues if using paid tier)
- ✅ Native Docker support
- ✅ MongoDB Atlas integration
- ✅ Free SSL/HTTPS
- ✅ Custom domain support
- ✅ GitHub auto-deployment
- ✅ Environment variables easy setup

**Step-by-Step:**

1. **Create Account**
   ```
   Visit: https://render.com
   Sign up with GitHub account
   ```

2. **Create New Web Service**
   - Click "New +" → Web Service
   - Connect your GitHub repository
   - Select your project repo

3. **Configure Deployment**
   ```
   Name: job-portal
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```

4. **Set Environment Variables**
   - Click "Environment"
   - Add these variables:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/job_portal
   NODE_ENV=production
   JWT_SECRET=your_secret_key_here
   SESSION_SECRET=your_session_secret
   PORT=3000
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Render builds and deploys automatically
   - Get free URL: `job-portal-xxxxx.onrender.com`

---

### Option 2: Railway.app

**Setup:**

1. **Create Account**
   ```
   Visit: https://railway.app
   Sign up with GitHub
   ```

2. **Deploy from Git**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway auto-detects Node.js

3. **Add MongoDB**
   - Click "Add Service"
   - Select "MongoDB"
   - Railway creates database automatically

4. **Set Environment Variables**
   - Click "Variables"
   - Add all `.env` variables

5. **Auto-Deploy**
   - Push to GitHub
   - Railway auto-deploys

---

### Option 3: Replit

**For Beginners (Easiest):**

1. **Import GitHub Project**
   ```
   Visit: https://replit.com
   Click "Create Repl"
   Select "Import from GitHub"
   Paste: https://github.com/your_username/Project_work_nodejs
   ```

2. **Configure .replit File**
   ```
   Create `.replit` file in root:
   
   entryPoint = "index.js"
   modules = ["nodejs-18"]
   
   [nix]
   channel = "stable-23_05"
   
   [env]
   MONGODB_URI = "mongodb+srv://..."
   NODE_ENV = "production"
   ```

3. **Run**
   - Click "Run"
   - Replit assigns public URL

---

### Option 4: Fly.io (Global Deployment)

**Best for Global Users:**

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Launch app
flyctl launch
# Follow prompts, answers:
# App name: job-portal
# Region: Choose closest (sin = Singapore)
# Postgres: No
# Redis: No

# Set environment variables
flyctl secrets set MONGODB_URI=mongodb+srv://...
flyctl secrets set JWT_SECRET=your_secret

# Deploy
flyctl deploy

# Get URL
flyctl info
```

---

## 📊 MongoDB Atlas (Free Cloud Database)

### Setup Free Database

1. **Create Account**
   ```
   Visit: https://www.mongodb.com/cloud/atlas
   Sign up (free)
   ```

2. **Create Cluster**
   - Click "Build a Cluster"
   - Select "Free" tier
   - Choose region closest to you
   - Create cluster

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `jobportal_user`
   - Password: Generate secure password
   - Role: "Read and write to any database"

4. **Get Connection String**
   - Go to "Clusters"
   - Click "Connect"
   - Select "Drivers"
   - Copy connection string
   - Replace `<username>` and `<password>`
   - Replace `<dbname>` with `job_portal`

   **Example:**
   ```
   mongodb+srv://jobportal_user:password123@cluster0.mongodb.net/job_portal
   ```

5. **Add IP to Whitelist**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow from Anywhere" (0.0.0.0/0) for testing
   - Or add specific IP for production

6. **Update .env**
   ```env
   MONGODB_URI=mongodb+srv://jobportal_user:password123@cluster0.xxxxx.mongodb.net/job_portal
   ```

---

## 🌍 Custom Domain Setup

### Step 1: Buy Domain

**Free Domains:**
- `freenom.com` - Free (low quality)
- `name.com` - $0.99/year intro

**Paid Domains (Recommended):**
- `namecheap.com` - $0.88/year
- `godaddy.com` - $0.99/year
- `aws.amazon.com` - Route53 for DNS

### Step 2: Connect to Render.com

1. **In Render Dashboard**
   - Go to your web service
   - Click "Settings"
   - Scroll to "Custom Domain"
   - Enter domain: `jobportal.com`

2. **Update DNS Records**
   - Go to your domain registrar (Namecheap, GoDaddy, etc.)
   - Find "DNS Settings"
   - Add CNAME record:
   ```
   Type: CNAME
   Name: @ (or leave blank)
   Value: job-portal-xxxxx.onrender.com
   TTL: 3600 (or default)
   ```

3. **Verify**
   - Wait 24-48 hours for DNS propagation
   - Visit `jobportal.com`
   - Should see your app!

### Step 3: Get Free SSL/HTTPS

Most platforms include free SSL automatically:
- ✅ Render - Automatic
- ✅ Railway - Automatic
- ✅ Fly.io - Automatic
- ✅ Replit - Automatic

No extra cost!

---

## 🔄 Step-by-Step Deployment Guide

### Quick Deploy to Render (5 mins)

**Step 1: Prepare Code**
```bash
# Make sure code is committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

**Step 2: Update .env for Production**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/job_portal
NODE_ENV=production
PORT=3000
JWT_SECRET=your_very_secret_key_here
SESSION_SECRET=your_session_secret_here
```

**Step 3: Create Render Account**
- Visit https://render.com
- Sign up with GitHub

**Step 4: Deploy**
```
1. Dashboard → "New +" → "Web Service"
2. Connect GitHub repo
3. Name: job-portal
4. Build: npm install
5. Start: npm start
6. Add env variables
7. Click "Create Web Service"
```

**Step 5: Wait for Deployment**
- Render builds & deploys (2-3 mins)
- Get public URL: `https://job-portal-xxxxx.onrender.com`

**Step 6: Add Custom Domain** (Optional)
- Settings → Custom Domain
- Add your domain
- Update DNS

---

## 🔌 CI/CD Pipeline with GitHub Actions

### Automate Deployment

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Render

on:
  push:
    branches: [main, production]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}

      - name: Notify Success
        if: success()
        run: echo "✅ Deployed successfully!"

      - name: Notify Failure
        if: failure()
        run: echo "❌ Deployment failed!"
```

**Setup:**
1. Get Render deploy hook from dashboard
2. Add to GitHub Secrets: `RENDER_DEPLOY_HOOK`
3. Push to GitHub
4. Auto-deploys on every push!

---

## 📝 Production Checklist

### Before Deploying

- [ ] Update `.env` with production values
- [ ] Change JWT_SECRET and SESSION_SECRET to random values
- [ ] Enable MongoDB IP whitelist (if specific IPs)
- [ ] Test locally with production env
- [ ] Verify all routes work
- [ ] Test with real MongoDB Atlas DB
- [ ] Check for console.log statements (remove debug logs)
- [ ] Update README with deployment URL
- [ ] Test on mobile devices

### After Deploying

- [ ] Verify app loads at public URL
- [ ] Test login/signup
- [ ] Test job posting (recruiter)
- [ ] Test job application (student)
- [ ] Check database is working
- [ ] Verify SSL/HTTPS working
- [ ] Test on different browsers
- [ ] Monitor logs for errors

---

## 🔐 Security Checklist

### Before Production

```javascript
// ✅ DO THIS:
1. Use strong JWT_SECRET (64+ random chars)
2. Use HTTPS/SSL (auto on all platforms)
3. Set NODE_ENV=production
4. Restrict MongoDB IP (if possible)
5. Use environment variables (not hardcoded)
6. Enable CORS properly (origin should be your domain)
7. Sanitize user input
8. Validate all form data
9. Use bcrypt for passwords
10. Log important events

// ❌ DON'T DO THIS:
1. Commit .env to GitHub
2. Hardcode secrets in code
3. Use weak passwords
4. Allow all IPs to MongoDB
5. Debug logs in production
6. Disable HTTPS
7. Skip input validation
8. Store passwords in plain text
```

---

## 🐛 Troubleshooting Deployment

### App Won't Start

**Error:** `Cannot find module 'express'`
```bash
# Solution: Install dependencies
npm install

# Or in Docker:
docker build --no-cache .
```

### MongoDB Connection Failed

**Error:** `MongoServerError: connect ECONNREFUSED`
```
Solutions:
1. Check MONGODB_URI in .env is correct
2. Add your IP to MongoDB Atlas whitelist
3. Verify database user credentials
4. Check database name matches
```

### Cold Start (App Takes Time to Load)

**Solution:**
- Render free tier has cold starts
- Upgrade to paid tier ($7/mo) to avoid
- Or use Railway ($5/mo)

### Domain Not Working

**Error:** Domain points to wrong IP
```
Solutions:
1. Check DNS propagation: https://dnschecker.org
2. Wait 24-48 hours for full propagation
3. Verify CNAME record is correct
4. Clear browser cache
5. Try incognito/private window
```

### Logs Not Showing

**Solution:**
```
# View logs on Render
Settings → Logs

# Or in Railway
Deployments → Logs

# Or in Fly.io
flyctl logs

# Or in Docker
docker logs container_name
```

---

## 💰 Cost Breakdown (Monthly)

### Completely Free Setup

| Service | Free Tier | Cost |
|---------|-----------|------|
| **Node.js Host** | Render | $0 |
| **MongoDB** | Atlas | $0 |
| **Domain** | Freenom | $0 |
| **SSL/HTTPS** | Built-in | $0 |
| **Email** | Free tier | $0 |
| **Total** | | **$0** |

### Recommended Setup (Small Cost)

| Service | Plan | Cost |
|---------|------|------|
| **Node.js Host** | Render $7/mo | $7 |
| **MongoDB** | Atlas (free) | $0 |
| **Domain** | Namecheap | $0.88/year |
| **Total/Month** | | ~$0.58 |

### Production Setup (Scaling)

| Service | Plan | Cost |
|---------|------|------|
| **Node.js Host** | Render | $25-100 |
| **MongoDB** | Atlas M10 | $57-200 |
| **Domain** | Premium | $10-15/year |
| **CDN** (optional) | Cloudflare | $20+ |
| **Total/Month** | | $100-300+ |

---

## 🚀 Deployment Comparison

### Best for Beginners
**Replit** - Click & run, no config needed
```
Visit: https://replit.com
Import GitHub repo
Click "Run"
Done! ✅
```

### Best Free Tier
**Render** - Fastest, easiest setup
```
Link GitHub
Set env vars
Deploy
Done! ✅
```

### Best Performance
**Railway** - Fastest load times
```
Import from GitHub
Add MongoDB
Deploy
Done! ✅
```

### Best Global
**Fly.io** - Deploy globally
```
flyctl launch
flyctl deploy
Done! ✅
```

---

## 📚 Full Deployment Example

### Complete Example: Deploy to Render

```bash
# 1. Prepare code
git add .
git commit -m "Deploy ready"
git push origin main

# 2. Go to render.com
# Click "New Web Service"

# 3. Connect GitHub repo
# Select your repository
# Click "Connect"

# 4. Configure
Name: job-portal
Environment: Node
Build Command: npm install
Start Command: npm start
Plan: Free

# 5. Add Environment Variables
MONGODB_URI = mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/job_portal
NODE_ENV = production
JWT_SECRET = (generate random string: https://passwordsgenerator.net)
SESSION_SECRET = (generate random string)

# 6. Click "Create Web Service"
# Wait 2-3 minutes

# 7. You'll get URL like:
# https://job-portal-xyz123.onrender.com

# 8. Test it!
# Click the URL and verify app works
```

---

## 🎯 What Impresses Recruiters

✅ **Shows DevOps Knowledge**
- Docker containerization
- CI/CD pipeline
- Environment management

✅ **Production Readiness**
- Free tier optimization
- Security practices
- Monitoring & logging

✅ **Versatility**
- Multiple deployment options
- Database setup
- Domain configuration

✅ **Problem Solving**
- Troubleshooting documentation
- Cost optimization
- Scalability planning

---

## 📖 Quick Links

| Service | Link |
|---------|------|
| Render | https://render.com |
| Railway | https://railway.app |
| MongoDB Atlas | https://mongodb.com/cloud/atlas |
| Docker Hub | https://hub.docker.com |
| Fly.io | https://fly.io |
| Namecheap | https://namecheap.com |

---

## 🎓 Learning Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Guide](https://docs.docker.com/compose/)
- [Render Deployment Guide](https://render.com/docs)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/)
- [GitHub Actions CI/CD](https://github.com/features/actions)

---

## ✨ Summary

| Goal | Solution | Cost | Time |
|------|----------|------|------|
| **Deploy ASAP** | Render | $0 | 5 min |
| **With Docker** | Render + Docker | $0 | 15 min |
| **With Domain** | Render + Namecheap | $0.88/year | 20 min |
| **Production** | Railway + Atlas M10 | $100+ | Setup |
| **Global** | Fly.io | $3+/mo | 10 min |

**🎉 You can have a live job portal with custom domain for completely FREE!**

---

**Last Updated**: February 1, 2026
**Status**: Ready to Deploy ✅
