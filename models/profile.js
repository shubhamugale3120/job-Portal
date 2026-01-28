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
    ]
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