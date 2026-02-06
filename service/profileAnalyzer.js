/**
 * Profile Analysis Service
 * 
 * Purpose: Analyze user profiles and provide insights
 * 
 * Features:
 * - Calculate profile completeness score
 * - Suggest profile improvements
 * - Generate AI insights
 * 
 * Why: Helps users improve their profiles for better job matches
 */

/**
 * Calculate profile completeness score (0-100)
 * 
 * Why: Complete profiles get better recommendations
 * How: Weighted scoring based on important fields
 * 
 * @param {Object} profile - User profile object
 * @param {Object} user - User object (for basic info)
 * @returns {number} - Completeness score 0-100
 */
function calculateProfileCompleteness(profile, user = null) {
    let score = 0;
    
    // Weight distribution - total = 100
    const weights = {
        basicInfo: 20,      // Name, email (from user model)
        contact: 10,        // Phone, city
        bio: 10,            // Professional summary
        skills: 20,         // Skills array (most important for matching)
        experience: 15,     // Work experience
        education: 15,      // Educational background
        resume: 10          // Resume uploaded
    };

    // Basic info - assume present if user object exists
    // Why: User must have name/email to register
    if (user) {
        score += weights.basicInfo;
    }

    // Contact information
    if (profile.phoneNumber && profile.phoneNumber.trim().length > 0) {
        score += weights.contact * 0.5;  // 50% of contact weight
    }
    if (profile.city && profile.city.trim().length > 0) {
        score += weights.contact * 0.5;  // 50% of contact weight
    }

    // Professional bio/summary
    // Why minimum 50 chars: Ensures meaningful content
    if (profile.bio && profile.bio.length >= 50) {
        score += weights.bio;
    } else if (profile.bio && profile.bio.length > 0) {
        score += weights.bio * 0.5;  // Partial credit for short bio
    }

    // Skills - most important for job matching
    if (profile.skills && profile.skills.length > 0) {
        // Progressive scoring: more skills = higher score
        // 1-2 skills: 40%, 3-4 skills: 70%, 5+ skills: 100%
        const skillScore = Math.min(profile.skills.length / 5, 1);
        score += weights.skills * skillScore;
    }

    // Work experience
    if (profile.experience && profile.experience.length > 0) {
        // Check if experience has meaningful data
        const hasValidExperience = profile.experience.some(exp => 
            exp.jobTitle && exp.company
        );
        score += hasValidExperience ? weights.experience : weights.experience * 0.5;
    }

    // Education
    if (profile.education && profile.education.length > 0) {
        const hasValidEducation = profile.education.some(edu => 
            edu.degree && edu.college
        );
        score += hasValidEducation ? weights.education : weights.education * 0.5;
    }

    // Resume uploaded
    if (profile.resumeUrl && profile.resumeUrl.trim().length > 0) {
        score += weights.resume;
    }

    return Math.round(score);
}

/**
 * Get personalized suggestions for profile improvement
 * 
 * Why: Guide users to complete their profile
 * Impact: Better profiles = better job matches
 * 
 * @param {Object} profile - User profile
 * @returns {Array} - Array of suggestion objects with priority
 */
function getProfileSuggestions(profile) {
    const suggestions = [];

    // Critical suggestions (impact on recommendations)
    if (!profile.skills || profile.skills.length < 3) {
        suggestions.push({ 
            field: 'skills',
            title: 'Add Your Skills',
            message: 'Add at least 3 skills to get better job recommendations',
            impact: 'critical',
            priority: 1,
            icon: 'bi-code-slash'
        });
    }

    if (!profile.resumeUrl) {
        suggestions.push({ 
            field: 'resume',
            title: 'Upload Your Resume',
            message: 'Upload your resume to improve your chances',
            impact: 'critical',
            priority: 2,
            icon: 'bi-file-earmark-pdf'
        });
    }

    // High priority suggestions
    if (!profile.phoneNumber) {
        suggestions.push({ 
            field: 'phoneNumber',
            title: 'Add Contact Number',
            message: 'Add your phone number so recruiters can reach you',
            impact: 'high',
            priority: 3,
            icon: 'bi-telephone'
        });
    }

    if (!profile.bio || profile.bio.length < 50) {
        suggestions.push({ 
            field: 'bio',
            title: 'Write Professional Summary',
            message: 'Add a compelling bio (minimum 50 characters) to stand out',
            impact: 'high',
            priority: 4,
            icon: 'bi-person-lines-fill'
        });
    }

    if (!profile.experience || profile.experience.length === 0) {
        suggestions.push({ 
            field: 'experience',
            title: 'Add Work Experience',
            message: 'Add your work experience, internships, or projects',
            impact: 'high',
            priority: 5,
            icon: 'bi-briefcase'
        });
    }

    // Medium priority suggestions
    if (!profile.city) {
        suggestions.push({ 
            field: 'city',
            title: 'Add Your Location',
            message: 'Add your city to get location-based job recommendations',
            impact: 'medium',
            priority: 6,
            icon: 'bi-geo-alt'
        });
    }

    if (!profile.education || profile.education.length === 0) {
        suggestions.push({ 
            field: 'education',
            title: 'Add Education Details',
            message: 'Add your educational background',
            impact: 'medium',
            priority: 7,
            icon: 'bi-mortarboard'
        });
    }

    // Advanced suggestions (preferences for better matching)
    if (!profile.preferences?.preferredJobType) {
        suggestions.push({ 
            field: 'preferences.preferredJobType',
            title: 'Set Job Type Preference',
            message: 'Tell us if you prefer Full-time, Part-time, or Internship',
            impact: 'low',
            priority: 8,
            icon: 'bi-sliders'
        });
    }

    if (!profile.preferences?.expectedSalary || profile.preferences.expectedSalary === 0) {
        suggestions.push({ 
            field: 'preferences.expectedSalary',
            title: 'Set Salary Expectations',
            message: 'Add your minimum salary expectation',
            impact: 'low',
            priority: 9,
            icon: 'bi-cash-stack'
        });
    }

    return suggestions;
}

/**
 * Update AI insights for a profile
 * 
 * Purpose: Store calculated metrics for analytics
 * 
 * @param {Object} profile - Mongoose profile document
 * @param {Object} user - User document
 * @returns {Object} - Updated insights
 */
async function updateAIInsights(profile, user = null) {
    try {
        // Calculate completeness score
        const completeness = calculateProfileCompleteness(profile, user);
        
        // Initialize aiInsights if not exists
        if (!profile.aiInsights) {
            profile.aiInsights = {};
        }
        
        // Update insights
        profile.aiInsights.profileCompleteness = completeness;
        profile.aiInsights.lastAnalyzed = new Date();
        
        // Future: Add suggested skills based on job market analysis
        // For now, suggest popular skills if user has few skills
        if (profile.skills && profile.skills.length < 5) {
            profile.aiInsights.suggestedSkills = [
                'Communication',
                'Problem Solving',
                'Teamwork',
                'Time Management'
            ].filter(skill => 
                !profile.skills.some(s => s.toLowerCase() === skill.toLowerCase())
            );
        }
        
        await profile.save();
        
        return profile.aiInsights;
        
    } catch (error) {
        console.error('Error updating AI insights:', error);
        return null;
    }
}

module.exports = {
    calculateProfileCompleteness,
    getProfileSuggestions,
    updateAIInsights
};
