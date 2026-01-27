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

module.exports = model('Job', jobSchema);