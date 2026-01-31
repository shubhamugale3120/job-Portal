const {Schema, model} = require('mongoose');

const jobSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    skills: {
        type: [String],
        required: true,
    },
    salary: {
        type: String,
        required: false,  // e.g., "5-10 LPA"
    },
    location: {
        type: String,
        required: true,
    },
    jobType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
        default: 'Full-time',
    },
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Student',  // Reference to recruiter (who is a Student with role='recruiter')
        required: true,
    },
    applicationCount: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['Active', 'Closed'],
        default: 'Active',
    }
}, { timestamps: true });

// Add indexes for better query performance
// Speeds up filtering and searching
jobSchema.index({ status: 1 });
jobSchema.index({ title: 'text', description: 'text' }); // Text search index
jobSchema.index({ location: 1 });
jobSchema.index({ jobType: 1 });
jobSchema.index({ skills: 1 });
jobSchema.index({ createdAt: -1 }); // For sorting by newest first
jobSchema.index({ postedBy: 1 }); // For finding recruiter's jobs

module.exports = model('Job', jobSchema);