const User = require('../models/user');
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
    updateProfile
};
