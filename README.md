# Job Portal - Full Stack Application

A comprehensive job portal application built with **Node.js, Express.js, MongoDB, and EJS**. This platform connects job seekers with recruiters, enabling job searching, applications, and candidate management.

## 🎯 Project Overview

This is a full-featured job portal that allows:
- **Students/Job Seekers** to search, browse, and apply for jobs
- **Recruiters** to post jobs, manage applications, and review candidates
- **Admin** to manage users and monitor platform activity

The application features a modern, professional UI with real-time data loading and responsive design optimized for all devices.

---

## ✨ Features

### For Job Seekers (Students)
- ✅ User registration and authentication
- ✅ Browse and search job listings with filters
- ✅ Apply to jobs with resume and cover letter
- ✅ Track application status in real-time
- ✅ View application history and details
- ✅ Professional dashboard with stats and recent applications
- ✅ Profile management and resume upload

### For Recruiters
- ✅ Post and manage job listings
- ✅ View all applicants for posted jobs
- ✅ Review full application details (resume, cover letter, contact info)
- ✅ Update application status (Applied → Reviewed → Shortlisted → Hired/Rejected)
- ✅ Professional recruiter dashboard with analytics
- ✅ Manage job postings (edit, close, delete)
- ✅ Application analytics and tracking

### General Features
- ✅ Secure authentication with JWT tokens
- ✅ Role-based authorization (Student, Recruiter, Admin)
- ✅ Modern dark theme UI with gradient backgrounds
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Smooth animations and transitions
- ✅ Real-time data loading with AJAX
- ✅ Professional card-based layouts
- ✅ Status tracking with color-coded badges

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Node.js** | Server runtime |
| **Express.js** | Web framework and routing |
| **MongoDB** | Database |
| **Mongoose** | ODM (Object Document Mapper) |
| **EJS** | Template engine |
| **Bootstrap 5** | UI framework |
| **Bootstrap Icons** | Icon library |
| **CSS3** | Styling with gradients and animations |
| **JavaScript (ES6+)** | Client-side logic |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **MongoDB** (local or MongoDB Atlas cloud)

---

## 🚀 Installation & Setup

### Step 1: Clone or Extract the Project
```bash
cd Project_work_nodejs
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages from `package.json`:
- express
- mongoose
- dotenv
- bcryptjs
- jsonwebtoken
- express-session
- cookie-parser
- And more...

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/job_portal
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/job_portal

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# Session
SESSION_SECRET=your_session_secret_here
```

### Step 4: Start the Application

#### Development Mode
```bash
npm start
```

#### Watch Mode (Auto-reload on file changes)
```bash
npm run dev
```

The server will start on `http://localhost:3000`

---

## 📁 Project Structure

```
Project_work_nodejs/
├── index.js                      # Main application entry point
├── package.json                  # Dependencies and scripts
├── .env                         # Environment variables (create this)
│
├── controllers/                  # Business logic
│   ├── jobController.js         # Job CRUD operations
│   ├── applicationController.js # Application management
│   └── authController.js        # Authentication
│
├── middleware/                   # Custom middleware
│   ├── authentication.js        # Auth verification
│   └── authorization.js         # Role-based access control
│
├── models/                       # Database schemas
│   ├── user.js                  # User (Student/Recruiter) schema
│   ├── job.js                   # Job posting schema
│   ├── Application.js           # Application schema
│   └── profile.js               # Extended user profile
│
├── routes/                       # API routes
│   ├── user.js                  # User routes
│   ├── job.js                   # Job API routes
│   └── application.js           # Application API routes
│
├── views/                        # EJS templates
│   ├── partials/
│   │   ├── head.ejs            # HTML head section
│   │   ├── nav.ejs             # Navigation bar
│   │   └── script.ejs          # Common scripts
│   ├── student/
│   │   ├── dashboard.ejs       # Student dashboard
│   │   ├── browse-jobs.ejs     # Job listing page
│   │   └── my-applications.ejs # Applications tracker
│   ├── recruiter/
│   │   ├── dashboard.ejs       # Recruiter dashboard
│   │   ├── post-job.ejs        # Job posting form
│   │   ├── my-jobs.ejs         # Job management page
│   │   ├── applications.ejs    # Applications list
│   │   └── view-application.ejs # Application review page
│   ├── home.ejs                # Landing page
│   ├── signin.ejs              # Login page
│   └── signup.ejs              # Registration page
│
└── service/                      # Utility services
    └── authentication.js        # Auth helper functions
```

---

## 🔐 Authentication & Authorization

### Login URLs
- **Student Login**: `http://localhost:3000/signin`
- **Recruiter Login**: `http://localhost:3000/signin` (select recruiter role)

### Test Credentials
Create a test account via signup or use:
```
Student:
Email: student@example.com
Password: password123
Role: Student

Recruiter:
Email: recruiter@example.com
Password: password123
Role: Recruiter
```

---

## 🌐 Sample Application URLs

### Public Routes
| Route | Description |
|-------|-------------|
| `GET /` | Home/Landing page |
| `GET /signin` | Student/Recruiter login |
| `GET /signup` | User registration |

### Student Routes
| Route | Description |
|-------|-------------|
| `GET /student/dashboard` | Dashboard with stats and applications |
| `GET /student/browse-jobs` | Browse all available jobs |
| `GET /student/my-applications` | View own applications |
| `POST /applications/:jobId/apply` | Apply to a job |

### Recruiter Routes
| Route | Description |
|-------|-------------|
| `GET /recruiter/dashboard` | Recruiter dashboard with stats |
| `GET /recruiter/post-job` | Create new job posting |
| `GET /recruiter/my-jobs` | View all posted jobs |
| `GET /recruiter/applications` | View all applications |
| `GET /recruiter/view-application/:id` | Review application details |
| `POST /jobs` | Create job (API) |
| `PATCH /jobs/:id` | Update job (API) |
| `DELETE /jobs/:id` | Delete job (API) |

---

## 🔌 API Endpoints

### Jobs API
```
GET    /jobs                          # List all active jobs
GET    /jobs/:id                      # Get job details
GET    /jobs/my-jobs                  # Get recruiter's jobs (Recruiter only)
POST   /jobs                          # Create job (Recruiter only)
PATCH  /jobs/:id                      # Update job (Recruiter only)
DELETE /jobs/:id                      # Delete job (Recruiter only)
```

### Applications API
```
GET    /applications/me               # Get student's applications (Student only)
GET    /applications/job/:jobId       # Get job applicants (Recruiter only)
GET    /jobs/my-applications          # Get recruiter's applications (Recruiter only)
POST   /applications/:jobId/apply     # Apply to job (Student only)
PATCH  /applications/:id/status       # Update status (Recruiter only)
POST   /applications/:id/status       # Update status (Recruiter only)
```

---

## 💻 Usage Examples

### Example 1: Browse Jobs (Student)
1. Navigate to `http://localhost:3000/student/browse-jobs`
2. Search or filter jobs by location, job type, salary
3. Click on a job to view details
4. Click "Apply Now" to submit application

### Example 2: Post a Job (Recruiter)
1. Login as recruiter at `http://localhost:3000/signin`
2. Go to `http://localhost:3000/recruiter/post-job`
3. Fill in job details (title, description, skills, location, salary)
4. Click "Post Job"
5. View posted jobs at `http://localhost:3000/recruiter/my-jobs`

### Example 3: Review Applications (Recruiter)
1. Login as recruiter
2. Go to `http://localhost:3000/recruiter/applications`
3. Click "Review" on any application
4. View applicant details, resume, and cover letter
5. Update status: Mark as Reviewed → Shortlist → Hire/Reject

---

## 📊 Database Models

### User (Student/Recruiter)
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['student', 'recruiter', 'admin']),
  profile: ObjectId (ref: Profile),
  createdAt: Date,
  updatedAt: Date
}
```

### Job
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  skills: [String],
  salary: String,
  location: String,
  jobType: String (enum: ['Full-time', 'Part-time', 'Contract', 'Internship']),
  postedBy: ObjectId (ref: User),
  applicationCount: Number,
  status: String (enum: ['Active', 'Closed']),
  createdAt: Date,
  updatedAt: Date
}
```

### Application
```javascript
{
  _id: ObjectId,
  jobId: ObjectId (ref: Job),
  studentId: ObjectId (ref: User),
  resumeUrl: String,
  coverLetter: String,
  status: String (enum: ['APPLIED', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'HIRED']),
  appliedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎨 UI Features

### Dark Theme Design
- Professional gradient backgrounds
- Card-based responsive layouts
- Smooth animations and transitions
- Color-coded status badges
- Modern button styles with hover effects

### Status Badge Colors
- **Applied**: Blue (#667eea)
- **Under Review**: Orange (#f0ae4a)
- **Shortlisted**: Green (#38ef7d)
- **Hired**: Green (#38ef7d)
- **Rejected**: Red (#f5576c)

---

## 🐛 Troubleshooting

### MongoDB Connection Error
**Problem**: Cannot connect to MongoDB
**Solution**: 
- Ensure MongoDB is running
- Check MONGODB_URI in `.env` file
- For local: `mongodb://localhost:27017/job_portal`
- For Atlas: Verify connection string and IP whitelist

### Port Already in Use
**Problem**: `Error: listen EADDRINUSE :::3000`
**Solution**: 
```bash
# Change PORT in .env file
PORT=3001
# Then restart the server
npm start
```

### Module Not Found
**Problem**: `Cannot find module 'express'`
**Solution**: 
```bash
npm install
```

### EJS Template Not Found
**Problem**: `Error: ENOENT: no such file or directory`
**Solution**: Ensure views folder exists and file paths are correct

---

## 🔄 API Request Examples

### Create a Job (cURL)
```bash
curl -X POST http://localhost:3000/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Senior Developer",
    "description": "5+ years experience",
    "skills": ["Node.js", "MongoDB", "React"],
    "location": "Bangalore, India",
    "salary": "15-25 LPA",
    "jobType": "Full-time"
  }'
```

### Apply to Job (cURL)
```bash
curl -X POST http://localhost:3000/applications/JOB_ID/apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "resumeUrl": "https://example.com/resume.pdf",
    "coverLetter": "I am interested in this position..."
  }'
```

### Get All Jobs (cURL)
```bash
curl http://localhost:3000/jobs
```

---

## 📈 Performance Optimizations

- MongoDB indexes on frequently queried fields
- Lean queries for read-only operations
- Session-based authentication
- Client-side data caching
- Efficient DOM manipulation with vanilla JavaScript

---

## 🔒 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Protected API endpoints
- ✅ Session management with secure cookies
- ✅ Input validation (form and API)

---

## 📝 Future Enhancements

- [ ] Email notifications on application status changes
- [ ] Advanced job search and filtering
- [ ] Job recommendations based on profile
- [ ] Messaging system between recruiter and candidate
- [ ] Application analytics dashboard
- [ ] File upload for resume (instead of URL)
- [ ] Pagination for large datasets
- [ ] Admin panel for platform management
- [ ] Email verification during signup
- [ ] Google/LinkedIn OAuth integration

---

## 👨‍💼 For Recruiters Reviewing This Code

### Code Quality Highlights
✅ **Clean Architecture**: Separated concerns with controllers, models, and routes
✅ **RESTful APIs**: Proper HTTP methods and status codes
✅ **Error Handling**: Try-catch blocks and user-friendly error messages
✅ **Database Indexing**: Optimized queries with MongoDB indexes
✅ **Responsive Design**: Mobile-first CSS with flexbox
✅ **Modern UI**: Professional dark theme with gradients and animations
✅ **Role-Based Access**: Middleware for authorization checks

### Code Organization
- Routes organized by feature (jobs, applications, users)
- Controllers handle business logic separately from routes
- Middleware for cross-cutting concerns (auth, logging)
- Models define clear database schemas with validations

### Best Practices Demonstrated
- Async/await for clean asynchronous code
- Lean queries for performance
- Template inheritance with EJS partials
- Client-side form validation
- Consistent naming conventions
- Clear separation of concerns

---

## 📧 Contact & Support

For questions or issues, please:
1. Check the troubleshooting section
2. Review the code comments
3. Check MongoDB and Node.js documentation

---

## 📄 License

This project is open source and available for educational purposes.

---

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Guide](https://mongoosejs.com/)
- [EJS Template Engine](https://ejs.co/)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.0/)

---

**Last Updated**: February 1, 2026
**Version**: 1.0.0
**Status**: Production Ready ✅

---

Made with ❤️ for job seekers and recruiters
