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
            return res.status(403).json({ error: 'Unauthorized role' });
        }
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

async function updateMyProfile(req, res) {
    try {
        let profile;
        if (req.user.role === 'student') {
            profile = await StudentProfile.findOneAndUpdate(
                { userId: req.user._id },
                req.body,
                { new: true, upsert: true } // Create if doesn't exist
            );
        } else if (req.user.role === 'recruiter') {
            profile = await RecruiterProfile.findOneAndUpdate(
                { userId: req.user._id },
                req.body,
                { new: true, upsert: true }
            );
        } else {
            return res.status(403).json({ error: 'Unauthorized role' });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Server error' });
    }
}

module.exports = {
    getMyProfile,
    updateMyProfile,
};