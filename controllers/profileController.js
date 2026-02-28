const { StudentProfile, RecruiterProfile } = require('../models/profile');

// Get own profile
async function getMyProfile(req, res) {
    try {
        let profile;
        if (req.user.role === 'student') {
            profile = await StudentProfile.findOne({ userId: req.user._id });
        } else if (req.user.role === 'recruiter') {
            profile = await RecruiterProfile.findOne({ userId: req.user._id });
        } else {
            return res.status(403).json({ 
                success: false,
                error: { code: 'FORBIDDEN', message: 'Unauthorized role' }
            });
        }
        if (!profile) {
            return res.status(404).json({ 
                success: false,
                error: { code: 'NOT_FOUND', message: 'Profile not found' }
            });
        }
        res.json({
            success: true,
            data: profile
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ 
            success: false,
            error: { code: 'SERVER_ERROR', message: 'Server error' }
        });
    }
}

async function updateMyProfile(req, res) {
    try {

        // Prepare update data
        const updateData = req.body;
        
        // Handle file uploads
        if (req.files) {
            if (req.files.resumeUrl) {
                updateData.resumeUrl = `/uploads/resumes/${req.files.resumeUrl[0].filename}`;
            }
            if (req.files.profilePicture) {
                updateData.profilePicture = `/uploads/images/${req.files.profilePicture[0].filename}`;
            }
            if (req.files.companyLogo) {
                updateData.companyLogo = `/uploads/images/${req.files.companyLogo[0].filename}`;
            }
        }
        let profile;
        if (req.user.role === 'student') {
            profile = await StudentProfile.findOneAndUpdate(
                { userId: req.user._id },
                updateData,
                { new: true, upsert: true } // Create if doesn't exist
            );
        } else if (req.user.role === 'recruiter') {
            profile = await RecruiterProfile.findOneAndUpdate(
                { userId: req.user._id },
                updateData,
                { new: true, upsert: true }
            );
        } else {
            return res.status(403).json({ 
                success: false,
                error: { code: 'FORBIDDEN', message: 'Unauthorized role' }
            });
        }
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: profile
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ 
            success: false,
            error: {
                code: 'UPDATE_ERROR',
                message: error.message || 'Server error'
            }
        });
    }
}

module.exports = {
    getMyProfile,
    updateMyProfile,
};