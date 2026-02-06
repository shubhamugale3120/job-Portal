const User = require('../models/user');
const { StudentProfile, RecruiterProfile } = require('../models/profile');
const bcrypt = require('bcrypt');

// Get current user profile
async function getProfile(req, res) {
    try {
        const user = await User.findById(req.user._id).select('-password -salt');
        
        if (!user) {
            return res.redirect('/signin?error=' + encodeURIComponent('User not found'));
        }
        
        res.render('profile', { user });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.redirect('/?error=' + encodeURIComponent('Failed to load profile'));
    }
}

// Render edit profile page
async function renderEditProfile(req, res) {
    try {
        const user = await User.findById(req.user._id).select('-password -salt');
        
        if (!user) {
            return res.redirect('/signin?error=' + encodeURIComponent('User not found'));
        }
        
        // Render different edit pages based on role
        if (user.role === 'student') {
            res.render('student/edit-profile', { user });
        } else if (user.role === 'recruiter') {
            res.render('recruiter/edit-profile', { user });
        } else {
            res.render('edit-profile', { user });
        }
    } catch (error) {
        console.error('Error rendering edit profile:', error);
        res.redirect('/?error=' + encodeURIComponent('Failed to load profile'));
    }
}

// Update user profile
async function updateProfile(req, res) {
    try {
        console.log('Profile update request received:', req.body);
        console.log('User ID:', req.user._id);
        
        const { name, email, phone, whatsapp, bio, company, website, linkedIn, currentPassword, newPassword } = req.body;
        
        const user = await User.findById(req.user._id);
        
        if (!user) {
            console.error('User not found:', req.user._id);
            return res.redirect('/profile/edit?error=' + encodeURIComponent('User not found'));
        }
        
        console.log('User before update:', { name: user.name, email: user.email, phone: user.phone });
        
        // Update basic fields - always update if provided
        if (name && name.trim()) user.name = name.trim();
        if (email && email.trim()) user.email = email.trim();
        user.phone = phone || '';
        user.whatsapp = whatsapp || '';
        user.bio = bio || '';
        
        // Update recruiter-specific fields
        if (user.role === 'recruiter') {
            user.company = company || '';
            user.website = website || '';
            user.linkedIn = linkedIn || '';
        }
        
        console.log('User after update:', { name: user.name, email: user.email, phone: user.phone });
        
        // Handle password change
        if (newPassword && newPassword.trim()) {
            if (!currentPassword || !currentPassword.trim()) {
                return res.redirect('/profile/edit?error=' + encodeURIComponent('Please enter current password to change password'));
            }
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.redirect('/profile/edit?error=' + encodeURIComponent('Current password is incorrect'));
            }
            user.password = newPassword.trim();
            console.log('Password updated');
        }
        
        const savedUser = await user.save();
        console.log('Profile saved successfully:', { name: savedUser.name, email: savedUser.email, phone: savedUser.phone });
        
        // For students: Also create/update StudentProfile for AI recommendations
        // Why: StudentProfile contains skills and preferences needed for job recommendations
        if (user.role === 'student') {
            try {
                // Extract skills from bio (comma-separated)
                // Example: "Node.js, React, MongoDB" → ["Node.js", "React", "MongoDB"]
                const skillsArray = bio 
                    ? bio.split(',').map(s => s.trim()).filter(s => s && s.length > 0)
                    : [];
                
                console.log('Creating StudentProfile with skills:', skillsArray);
                
                // Create or update StudentProfile
                const studentProfile = await StudentProfile.findOneAndUpdate(
                    { userId: user._id },
                    {
                        userId: user._id,
                        skills: skillsArray.length > 0 ? skillsArray : ['unspecified'],
                        city: 'Not specified',
                        bio: bio || '',
                        phoneNumber: phone || '',
                        // Add default preferences for AI recommendations
                        preferences: {
                            preferredJobType: 'Full-time',
                            preferredLocation: 'Any',
                            expectedSalary: 0,
                            willingToRelocate: true,
                            remoteWorkPreference: 'flexible'
                        }
                    },
                    { upsert: true, new: true }
                );
                console.log('✅ StudentProfile created/updated:', {
                    id: studentProfile._id,
                    skills: studentProfile.skills,
                    userId: studentProfile.userId
                });
            } catch (profileError) {
                console.error('⚠️ StudentProfile error:', profileError.message);
                // Continue anyway - the user profile was still updated
            }
        }
        
        // Redirect to profile view page with success message
        const redirectUrl = user.role === 'student' ? '/profile/view' : '/profile/view';
        res.redirect(redirectUrl + '?success=' + encodeURIComponent('Profile updated successfully!'));
        
    } catch (error) {
        console.error('Error updating profile:', error.message);
        console.error('Full error:', error);
        
        if (error.code === 11000) {
            return res.redirect('/profile/edit?error=' + encodeURIComponent('Email already exists'));
        }
        
        res.redirect('/profile/edit?error=' + encodeURIComponent('Failed to update profile: ' + error.message));
    }
}

module.exports = {
    getProfile,
    renderEditProfile,
    updateProfile,
    // Debug function to check StudentProfile
    checkStudentProfile: async (req, res) => {
        try {
            if (!req.user) {
                return res.json({ error: 'Not authenticated' });
            }
            
            const studentProfile = await StudentProfile.findOne({ userId: req.user._id });
            const user = await User.findById(req.user._id);
            
            res.json({
                userId: req.user._id,
                userRole: user?.role,
                userBio: user?.bio,
                studentProfileExists: !!studentProfile,
                studentProfile: studentProfile ? {
                    id: studentProfile._id,
                    skills: studentProfile.skills,
                    bio: studentProfile.bio,
                    city: studentProfile.city
                } : null
            });
        } catch (error) {
            res.json({ error: error.message });
        }
    }
};
