# 🐳 Docker Complete Setup Guide - Step by Step

A detailed, beginner-friendly guide to Docker for your Job Portal project.

---

## 📚 Table of Contents

1. [What is Docker?](#what-is-docker)
2. [Install Docker](#install-docker)
3. [Docker Basics & Terminology](#docker-basics--terminology)
4. [Create Dockerfile](#create-dockerfile)
5. [Build Docker Image](#build-docker-image)
6. [Run Docker Container](#run-docker-container)
7. [Docker Compose (Multi-Service)](#docker-compose-multi-service)
8. [Push to Docker Hub](#push-to-docker-hub)
9. [Deploy to Cloud](#deploy-to-cloud)
10. [Troubleshooting](#troubleshooting)

---

## 🤔 What is Docker?

### Simple Explanation

**Docker** is like a shipping container for your application:
- 📦 **Without Docker**: You install Node.js, MongoDB, npm, dependencies on each server → Different environments = Different results
- 📦 **With Docker**: Package everything in a container → Same environment everywhere = Consistent results

### Real-World Example

```
❌ Without Docker (Problems):
Developer's PC: Windows 10, Node v14, npm v6
Tester's PC: Mac, Node v16, npm v7
Production Server: Linux, Node v12, npm v5
Result: "Works on my machine but not production" 😤

✅ With Docker (Solution):
Create Docker image with: Linux OS + Node v18 + npm v9
Deploy to all machines
Result: Works everywhere! 🎉
```

### Docker Benefits

✅ **Consistency** - Same environment everywhere
✅ **Isolation** - Each app has its own dependencies
✅ **Scalability** - Run multiple copies easily
✅ **Portability** - Works on Windows, Mac, Linux
✅ **Easy Deployment** - One command to deploy
✅ **Version Control** - Track infrastructure changes

---

## 💾 Install Docker

### Step 1: Download Docker Desktop

**For Windows:**
```
1. Visit: https://www.docker.com/products/docker-desktop
2. Click "Download for Windows"
3. Run the installer
4. Follow installation wizard
5. Restart your computer
```

**For Mac:**
```
1. Visit: https://www.docker.com/products/docker-desktop
2. Click "Download for Mac"
3. Choose: Apple Silicon (M1/M2) OR Intel
4. Install like any other app
5. Restart your computer
```

**For Linux:**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io
sudo usermod -aG docker $USER
newgrp docker
```

### Step 2: Verify Installation

Open Command Prompt/Terminal and run:

```bash
docker --version
# Output: Docker version 24.0.0, build abc123

docker run hello-world
# Output: Hello from Docker!
```

✅ If you see both messages, Docker is installed correctly!

---

## 🎓 Docker Basics & Terminology

### Key Concepts

| Term | Explanation | Analogy |
|------|-------------|---------|
| **Image** | Blueprint/template for your app | Recipe |
| **Container** | Running instance of an image | Cooked dish |
| **Dockerfile** | Instructions to build image | Recipe instructions |
| **Docker Hub** | Repository to share images | GitHub for images |
| **Port** | How to access container | Phone number |
| **Volume** | Data storage in container | External hard drive |

### Docker Workflow

```
1. Create Dockerfile
        ↓
2. Build Image (docker build)
        ↓
3. Run Container (docker run)
        ↓
4. Access App (http://localhost:3000)
        ↓
5. Push to Hub (docker push)
        ↓
6. Deploy to Cloud
```

---

## 📝 Create Dockerfile

### Understanding Dockerfile

A **Dockerfile** is a text file with instructions to build your Docker image.

Think of it like a recipe:
```
Recipe: Chocolate Cake
Ingredients:
  - 2 cups flour
  - 1 cup sugar
  - ...

Instructions:
  1. Mix ingredients
  2. Pour in pan
  3. Bake 30 minutes
  ...
```

### Step 1: Create the Dockerfile

In your project root (`Project_work_nodejs`), create a file named **`Dockerfile`** (NO extension):

```dockerfile
# Step 1: Choose base image (operating system + Node.js)
FROM node:18-alpine

# Step 2: Set working directory inside container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install --production

# Step 5: Copy entire project code
COPY . .

# Step 6: Expose port (tells Docker app runs on 3000)
EXPOSE 3000

# Step 7: Health check (checks if app is running)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Step 8: Start the application
CMD ["npm", "start"]
```

### Explanation Line by Line

```dockerfile
FROM node:18-alpine
# Downloads official Node.js v18 image from Docker Hub
# alpine = smallest Linux version (saves space)
# Size: ~200MB (vs 900MB without alpine)

WORKDIR /app
# Creates /app folder inside container
# All future commands run in /app
# Like: cd /app in terminal

COPY package*.json ./
# Copies package.json and package-lock.json from your PC to /app
# package*.json = both files (wildcard)

RUN npm install --production
# Installs dependencies inside container
# --production = only install production packages (not dev)

COPY . .
# Copies ALL your project files to /app
# First . = from your PC
# Second . = to /app in container

EXPOSE 3000
# Documents that app listens on port 3000
# Doesn't actually publish the port (done with -p flag at runtime)

HEALTHCHECK ...
# Checks if app is running every 30 seconds
# Helps orchestration tools know if container is healthy

CMD ["npm", "start"]
# Runs: npm start when container starts
# This is the default command
```

### Step 2: Create .dockerignore

Create a `.dockerignore` file (like `.gitignore`):

```
node_modules
npm-debug.log
.git
.gitignore
.env
.env.local
README.md
DEPLOYMENT.md
DOCKER_GUIDE.md
.DS_Store
.vscode
.idea
```

**Why?** Don't copy unnecessary files to Docker image = smaller image size = faster uploads

---

## 🔨 Build Docker Image

### What Happens When You Build?

```
Dockerfile
    ↓ (docker build command)
↓ Downloads Node.js base image (if not cached)
↓ Creates /app folder
↓ Copies package.json
↓ Runs npm install
↓ Copies all code
↓ Sets up health check
↓ Prepares to run npm start
↓ Docker Image Created! 📦
```

### Step 1: Navigate to Project

Open Command Prompt/PowerShell and go to your project:

```bash
cd c:\Users\SHUBHAM UGALE\Documents\ASEP\SY-Documents\SKILL\Project_work_nodejs

# Or on Mac/Linux
cd ~/Documents/ASEP/SY-Documents/SKILL/Project_work_nodejs
```

Verify Dockerfile exists:
```bash
# Windows PowerShell
Get-Item Dockerfile

# Mac/Linux
ls Dockerfile
```

### Step 2: Build the Image

```bash
docker build -t job-portal:latest .
```

**Explanation:**
- `docker build` = Build command
- `-t job-portal:latest` = Tag (name and version)
  - `job-portal` = Image name
  - `latest` = Version tag
- `.` = Use Dockerfile in current directory

### Step 3: Wait for Build

This takes 2-5 minutes first time:

```
Step 1/8 : FROM node:18-alpine
 ---> abc123def456 (downloading ~200MB)
Step 2/8 : WORKDIR /app
 ---> Running in xyz789
 ---> def456ghi789
Step 3/8 : COPY package*.json ./
 ---> Running in abc123
 ---> ghi789jkl012
Step 4/8 : RUN npm install --production
 ---> Running in def456
 (npm installing packages... 30-60 seconds)
 ---> Successfully installed
Step 5/8 : COPY . .
 ---> Running in ghi789
Step 6/8 : EXPOSE 3000
 ---> Running in jkl012
Step 7/8 : HEALTHCHECK ...
 ---> Running in mno345
Step 8/8 : CMD ["npm", "start"]
 ---> Running in pqr678
 ---> Successfully built abc123xyz789
 ---> Successfully tagged job-portal:latest
```

### Step 4: Verify Image Created

```bash
docker images
```

Output:
```
REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
job-portal    latest    abc123xyz789   2 minutes ago   345MB
node          18-alpine def456ghi789   2 weeks ago    180MB
```

✅ Image created successfully!

---

## 🚀 Run Docker Container

### What Happens When You Run?

```
Docker Image (blueprint)
    ↓ (docker run command)
Docker Container (running instance)
    ↓
App starts on port 3000
    ↓
Access at http://localhost:3000
```

### Step 1: Run the Container

```bash
docker run -p 3000:3000 \
  -e MONGODB_URI=mongodb://localhost:27017/job_portal \
  -e NODE_ENV=development \
  --name job-portal-container \
  job-portal:latest
```

**Explanation:**
- `docker run` = Run command
- `-p 3000:3000` = Port mapping (3000 on your PC → 3000 in container)
- `-e MONGODB_URI=...` = Environment variable
- `-e NODE_ENV=development` = Another environment variable
- `--name job-portal-container` = Give container a name
- `job-portal:latest` = Image to run

### Step 2: See Container Running

In another terminal:

```bash
docker ps
```

Output:
```
CONTAINER ID   IMAGE             COMMAND                 STATUS
abc123xyz789   job-portal:latest "npm start"     Up 2 minutes
```

### Step 3: Access Your App

Open browser and visit:
```
http://localhost:3000
```

✅ You should see your Job Portal app!

### Step 4: View Container Logs

```bash
# See what's happening in container
docker logs job-portal-container

# Follow logs in real-time
docker logs -f job-portal-container

# Last 20 lines
docker logs --tail 20 job-portal-container
```

### Step 5: Stop the Container

Press `Ctrl + C` in terminal, OR:

```bash
docker stop job-portal-container

# Verify it stopped
docker ps
# (should be empty)

# See all containers (including stopped)
docker ps -a
```

### Step 6: Restart Container

```bash
docker start job-portal-container

# Verify running
docker ps
```

### Step 7: Remove Container

```bash
docker rm job-portal-container

# Remove container and image
docker rmi job-portal:latest
```

---

## 🗂️ Docker Compose (Multi-Service)

### What is Docker Compose?

**Problem:** Running multiple services is complicated:
```bash
# Start MongoDB
mongod --dbpath ./data

# In another terminal, start app
docker run -p 3000:3000 job-portal:latest

# Complex!
```

**Solution:** Docker Compose does everything with one command!

### Step 1: Create docker-compose.yml

In project root, create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  # Node.js Application
  web:
    build: .
    # Build image from Dockerfile in current directory
    
    ports:
      - "3000:3000"
    # Port mapping: your_pc:container
    
    environment:
      - MONGODB_URI=mongodb://mongo:27017/job_portal
      # Connect to MongoDB service (not localhost, use service name)
      - NODE_ENV=development
      - PORT=3000
      - JWT_SECRET=dev_secret_key
      - SESSION_SECRET=dev_session_secret
    
    depends_on:
      - mongo
    # Start MongoDB first, then web
    
    volumes:
      - .:/app
      # Mount current directory to /app in container
      - /app/node_modules
      # Don't overwrite node_modules from container build
    
    networks:
      - job-network
    # Custom network for service communication

  # MongoDB Service
  mongo:
    image: mongo:latest
    # Use official MongoDB image from Docker Hub
    
    ports:
      - "27017:27017"
    # Port mapping for MongoDB
    
    volumes:
      - mongo_data:/data/db
    # Persist database data in named volume
    
    environment:
      - MONGO_INITDB_DATABASE=job_portal
    # Create database on startup
    
    networks:
      - job-network

# Persistent data storage
volumes:
  mongo_data:
    # MongoDB data persists even after container stops

# Network for containers to communicate
networks:
  job-network:
    driver: bridge
```

### Step 2: Update .env for Development

Create/update `.env`:

```env
MONGODB_URI=mongodb://mongo:27017/job_portal
NODE_ENV=development
PORT=3000
JWT_SECRET=your_dev_secret
SESSION_SECRET=your_session_secret
```

### Step 3: Start All Services

```bash
# Build and start
docker-compose up

# Build without cache (fresh install)
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f web
# or
docker-compose logs -f mongo
```

### Step 4: Access Services

```
App: http://localhost:3000
MongoDB: localhost:27017
```

### Step 5: Stop All Services

```bash
# Stop but keep containers
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop, remove containers AND volumes
docker-compose down -v
```

### Step 6: Useful Compose Commands

```bash
# View running services
docker-compose ps

# View logs
docker-compose logs

# Execute command in service
docker-compose exec web npm test

# Scale service to multiple instances
docker-compose up -d --scale web=3

# Restart service
docker-compose restart web
```

---

## 📦 Push to Docker Hub

### Why Push to Docker Hub?

- ☁️ Cloud backup of your image
- 🚀 Deploy to any platform
- 📤 Share with team
- 🔄 Version control for images

### Step 1: Create Docker Hub Account

1. Visit: https://hub.docker.com/signup
2. Create free account
3. Verify email

### Step 2: Login to Docker Hub

```bash
docker login

# Enter username and password
# Output: Login Successful
```

### Step 3: Tag Your Image

```bash
# Format: docker tag local:tag username/repo:tag

docker tag job-portal:latest your_username/job-portal:latest

# Example: if username is "shubham"
docker tag job-portal:latest shubham/job-portal:latest
```

### Step 4: Verify Tag

```bash
docker images

# Output:
REPOSITORY                 TAG       IMAGE ID
job-portal                 latest    abc123
shubham/job-portal         latest    abc123
# Same image, different tags!
```

### Step 5: Push to Hub

```bash
docker push shubham/job-portal:latest

# Output shows upload progress
# Pushing: 10%
# Pushing: 25%
# ... (takes 2-5 minutes)
# Successfully pushed shubham/job-portal:latest
```

### Step 6: Verify on Docker Hub

1. Login at https://hub.docker.com
2. Go to "Repositories"
3. See `job-portal` repository
4. See `latest` tag

### Step 7: Pull Image Anywhere

Now anyone can use your image:

```bash
docker pull shubham/job-portal:latest
docker run -p 3000:3000 shubham/job-portal:latest
```

---

## 🌐 Deploy to Cloud (Render Example)

### Step 1: Prepare for Cloud

Update Dockerfile to use production database:

```dockerfile
# ... existing Dockerfile ...

# Before deploying, change to:
ENV MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/job_portal
ENV NODE_ENV=production
```

### Step 2: Push Code to GitHub

```bash
git add .
git commit -m "Add Docker setup"
git push origin main
```

### Step 3: Deploy to Render with Docker

1. **Create Render Account**
   - Visit https://render.com
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" → Web Service
   - Connect GitHub repo

3. **Configure for Docker**
   ```
   Name: job-portal
   Environment: Docker
   Build Command: (leave empty, uses Dockerfile)
   Start Command: (leave empty, uses CMD from Dockerfile)
   Plan: Free
   ```

4. **Add Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/job_portal
   NODE_ENV=production
   JWT_SECRET=your_secret
   SESSION_SECRET=your_session_secret
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Render pulls from Docker Hub (if public)
   - Or builds Dockerfile directly
   - Wait 2-3 minutes
   - Get public URL!

---

## 🔍 Useful Docker Commands

### Image Management

```bash
# List images
docker images

# Remove image
docker rmi job-portal:latest

# Remove all unused images
docker image prune

# Search Docker Hub
docker search node

# Pull image from Hub
docker pull ubuntu:latest
```

### Container Management

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# View container logs
docker logs container_name

# Execute command in running container
docker exec -it container_name bash

# Copy files from container
docker cp container_name:/app/file.txt ./file.txt

# Stop container
docker stop container_name

# Remove container
docker rm container_name

# Restart container
docker restart container_name
```

### Debug & Inspect

```bash
# Enter container shell
docker exec -it job-portal-container sh

# View container details
docker inspect container_name

# View real-time stats
docker stats

# View image layers
docker history job-portal:latest
```

---

## 🐛 Troubleshooting

### Problem 1: Port Already in Use

**Error:** `Address already in use`

**Solutions:**
```bash
# Option 1: Use different port
docker run -p 3001:3000 job-portal:latest

# Option 2: Stop other container using port
docker ps  # Find the container
docker stop container_name

# Option 3: Find process using port
# Windows
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :3000
```

### Problem 2: Can't Connect to MongoDB

**Error:** `MongoError: connect ECONNREFUSED`

**Solutions:**
```bash
# Option 1: Check MongoDB is running
docker ps  # See if mongo container is running

# Option 2: Use correct connection string
# Wrong: mongodb://localhost:27017/job_portal
# Right: mongodb://mongo:27017/job_portal
# (mongo = service name in docker-compose)

# Option 3: Check network
docker network ls
docker network inspect job-network
```

### Problem 3: Container Exits Immediately

**Error:** Container stops right after starting

**Solutions:**
```bash
# Check logs
docker logs container_name

# Run with interactive terminal
docker run -it job-portal:latest sh

# Check Dockerfile CMD syntax
# Wrong: CMD npm start
# Right: CMD ["npm", "start"]
```

### Problem 4: Dependencies Not Installed

**Error:** `Cannot find module 'express'`

**Solutions:**
```bash
# Option 1: Rebuild without cache
docker build --no-cache -t job-portal:latest .

# Option 2: Check package.json copied
docker run -it job-portal:latest cat package.json

# Option 3: Check npm install ran
docker build -t job-portal:latest . --verbose
```

### Problem 5: Can't Access App

**Error:** `localhost:3000 refuses connection`

**Solutions:**
```bash
# Option 1: Verify port mapping
docker ps  # Check PORTS column

# Option 2: Check if container running
docker ps -a  # -a includes stopped

# Option 3: Check bind address
# Make sure app listens on 0.0.0.0, not 127.0.0.1
# In index.js:
// Wrong: app.listen(3000, 'localhost')
// Right: app.listen(3000, '0.0.0.0')

# Option 4: Check firewall
# Windows: Allow Docker through firewall
```

### Problem 6: Docker Build Slow

**Solutions:**
```bash
# Use .dockerignore to skip unnecessary files
# Use multi-stage build (advanced)
# Cache layers properly (don't copy code before dependencies)
```

---

## ✅ Complete Workflow Summary

### Local Development

```bash
# 1. Create Dockerfile and .dockerignore
# (Already done!)

# 2. Build image
docker build -t job-portal:latest .

# 3. Run container
docker run -p 3000:3000 job-portal:latest

# 4. Access app
# Open http://localhost:3000

# 5. Stop container
# Ctrl + C
```

### With Docker Compose

```bash
# 1. Create docker-compose.yml and .env
# (Already done!)

# 2. Start all services
docker-compose up

# 3. Access app
# Open http://localhost:3000

# 4. Stop all services
docker-compose down
```

### Push to Docker Hub

```bash
# 1. Login
docker login

# 2. Tag image
docker tag job-portal:latest username/job-portal:latest

# 3. Push
docker push username/job-portal:latest

# 4. Pull anywhere
docker pull username/job-portal:latest
```

### Deploy to Cloud

```bash
# 1. Push code to GitHub
git push origin main

# 2. Create account (Render/Railway/Fly)

# 3. Connect GitHub repo

# 4. Deploy (auto-builds from Dockerfile)

# 5. Get public URL
```

---

## 📊 Docker Image Size Optimization

### Before Optimization

```
Dockerfile (standard): ~900MB
- Node.js full image: 900MB
- node_modules: 500MB
```

### After Optimization

```
Dockerfile (alpine): ~345MB
Changes:
- FROM node:18-alpine (180MB vs 900MB)
- RUN npm install --production (only prod deps)
- .dockerignore (skip unnecessary files)
- Result: 345MB (62% smaller!) ✅
```

### Benefits

- ⚡ **Faster uploads** to Docker Hub
- ⚡ **Faster downloads** when deploying
- 💰 **Lower bandwidth** costs
- 🚀 **Quicker deployments**

---

## 🎓 Practice Exercises

Try these to master Docker:

```bash
# Exercise 1: Build and run
docker build -t my-app:v1 .
docker run -p 3000:3000 my-app:v1

# Exercise 2: Multiple tags
docker tag my-app:v1 my-app:latest
docker tag my-app:v1 my-app:prod

# Exercise 3: Stop and remove
docker stop container_id
docker rm container_id

# Exercise 4: View logs
docker logs -f container_id

# Exercise 5: Execute in container
docker exec -it container_id npm test

# Exercise 6: Push to Hub
docker tag my-app:v1 username/my-app:v1
docker push username/my-app:v1

# Exercise 7: Compose
docker-compose up -d
docker-compose ps
docker-compose logs -f
docker-compose down
```

---

## 🎯 Next Steps

After mastering Docker:

1. **Learn Kubernetes** - Orchestrate multiple containers
2. **GitHub Actions** - Auto-build on push
3. **Container Registry** - Private image storage
4. **Docker Networking** - Advanced networking
5. **Docker Volumes** - Data persistence patterns

---

## 📚 Quick Reference Card

```
┌─────────────────────────────────────────┐
│         DOCKER QUICK REFERENCE          │
├─────────────────────────────────────────┤
│ Build image:                            │
│ $ docker build -t name:tag .            │
│                                         │
│ Run container:                          │
│ $ docker run -p 3000:3000 name:tag      │
│                                         │
│ List images:                            │
│ $ docker images                         │
│                                         │
│ List containers:                        │
│ $ docker ps -a                          │
│                                         │
│ Stop container:                         │
│ $ docker stop container_id              │
│                                         │
│ View logs:                              │
│ $ docker logs -f container_id           │
│                                         │
│ Compose commands:                       │
│ $ docker-compose up -d                  │
│ $ docker-compose down                   │
│ $ docker-compose logs -f                │
│                                         │
│ Push to Hub:                            │
│ $ docker login                          │
│ $ docker push username/image:tag        │
└─────────────────────────────────────────┘
```

---

## 🎉 Congratulations!

You've learned Docker! Now you can:

✅ Build Docker images
✅ Run containers locally
✅ Use Docker Compose
✅ Push to Docker Hub
✅ Deploy to cloud platforms
✅ Troubleshoot common issues

**Next:** Deploy your Job Portal with Docker to Render or Railway!

---

**Last Updated**: February 1, 2026
**Difficulty**: Beginner to Intermediate
**Time to Master**: 2-4 hours
