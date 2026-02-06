const { Schema, model } = require('mongoose');

// Represents a student's application to a job posting
const applicationSchema = new Schema({
    jobId: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    resumeUrl: {
        type: String, // Store uploaded file path or URL
        required: true,
    },
    coverLetter: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: ['APPLIED', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'HIRED'],
        default: 'APPLIED', // Tracks lifecycle of an application
    },
    appliedAt: {
        type: Date,
        default: Date.now, // Redundant with timestamps but kept for easy querying
    },
}, { timestamps: true });

/**
 * Database Indexes for Performance Optimization
 * 
 * Why indexes matter:
 * - Without index: MongoDB scans ALL documents (O(n))
 * - With index: MongoDB uses B-tree lookup (O(log n))
 * - Result: 100x-1000x faster queries on large datasets
 * 
 * Index strategy:
 * 1. Index fields used in WHERE clauses
 * 2. Index fields used in JOIN/populate operations
 * 3. Index fields used for sorting
 */

// Compound index: Prevent duplicate applications
// Why: Student can't apply to same job twice
// How it works: Creates unique constraint on (studentId + jobId) pair
// Performance: O(log n) lookup instead of O(n) scan
applicationSchema.index(
    { studentId: 1, jobId: 1 },
    { 
        unique: true,
        name: 'student_job_unique_idx'
    }
);

// Index for student's application history
// Why: "My Applications" page queries by studentId
// Usage: Application.find({ studentId: userId })
// Performance: Instant lookup for student's applications
applicationSchema.index(
    { studentId: 1, createdAt: -1 },
    { name: 'student_applications_idx' }
);

// Index for recruiter viewing applicants
// Why: "View Applicants" page queries by jobId
// Usage: Application.find({ jobId: jobId })
// Performance: Fast retrieval of all applicants for a job
applicationSchema.index(
    { jobId: 1, status: 1 },
    { name: 'job_applicants_idx' }
);

// Index for status-based filtering
// Why: Filter applications by status (SHORTLISTED, HIRED, etc.)
// Usage: Application.find({ studentId: userId, status: 'SHORTLISTED' })
applicationSchema.index(
    { status: 1, appliedAt: -1 },
    { name: 'status_filter_idx' }
);

module.exports = model('Application', applicationSchema);