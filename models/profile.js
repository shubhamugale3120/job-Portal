const { Schema, model } = require('mongoose');

const StudentProfileSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
        unique: true
    },

    // Personal Info
    phoneNumber: String,
    city: String,
    bio: String,
    profilePicture: String,

    // Professional
    skills: [String],
    experience: [
        {
            jobTitle: String,
            company: String,
            startDate: Date,
            endDate: Date,
            description: String
        }
    ],
    education: [
        {
            degree: String,
            college: String,
            field: String,
            graduationYear: Number
        }
    ],

    // Portfolio
    resumeUrl: String,
    portfolioUrl: String,
    links: [
        {
            title: String,
            url: String
        }
    ],

    // AI Recommendation Preferences
    // Why: These fields help recommendation algorithm match users with better jobs
    preferences: {
        // Preferred job location - used for location matching (10% weight in algorithm)
        preferredLocation: { type: String, default: '' },
        
        // Job type preference - Full-time, Part-time, Internship, Contract
        // Why: Ensures recommendations match user's availability and career stage
        preferredJobType: { 
            type: String, 
            enum: ['Full-time', 'Part-time', 'Internship', 'Contract', ''], 
            default: '' 
        },
        
        // Minimum salary expectation - filters out jobs below this threshold
        // Why: Don't waste user's time with jobs that don't meet compensation needs
        expectedSalary: { type: Number, default: 0 },
        
        // Willing to relocate for job
        // Why: Future feature - expand recommendations beyond current city
        willingToRelocate: { type: Boolean, default: false },
        
        // Remote work preference - Remote, Hybrid, On-site, Any
        // Why: Post-COVID, work location flexibility is important factor
        remoteWorkPreference: { 
            type: String, 
            enum: ['Remote', 'Hybrid', 'On-site', 'Any'], 
            default: 'Any' 
        }
    },

    // AI-Generated Insights (calculated by system, not user input)
    // Why: Track recommendation quality and profile completeness
    aiInsights: {
        // Profile completeness score (0-100)
        // Why: Incomplete profiles get worse recommendations
        // Calculated based on: skills, experience, education, resume
        profileCompleteness: { type: Number, default: 0 },
        
        // Average match score of recommended jobs
        // Why: Track if user is getting good recommendations
        recommendationScore: { type: Number, default: 0 },
        
        // AI-suggested skills to add based on job market analysis
        // Future feature: "Add these skills to improve your matches"
        suggestedSkills: [String],
        
        // Last time AI analysis was run
        // Why: Can refresh recommendations if profile hasn't been analyzed recently
        lastAnalyzed: Date
    }
}, { timestamps: true });

const RecruiterProfileSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
        unique: true
    },

    // Company Info
    companyName: String,
    companyWebsite: String,
    companyLogo: String,
    companyDescription: String,

    // Contact
    phoneNumber: String,
    city: String,

    // Recruiter Info
    designation: String,
    bio: String
}, { timestamps: true });

module.exports = {
    StudentProfile: model('StudentProfile', StudentProfileSchema),
    RecruiterProfile: model('RecruiterProfile', RecruiterProfileSchema)
};