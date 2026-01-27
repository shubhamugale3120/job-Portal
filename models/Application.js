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
        enum: ['APPLIED', 'REVIEWED', 'REJECTED', 'HIRED'],
        default: 'APPLIED', // Tracks lifecycle of an application
    },
    appliedAt: {
        type: Date,
        default: Date.now, // Redundant with timestamps but kept for easy querying
    },
}, { timestamps: true });

module.exports = model('Application', applicationSchema);