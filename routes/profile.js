const {Router} = require('express');
const { requireRole } = require('../middleware/authorization');
const upload = require('../config/multer');
const {
    getMyProfile,
    updateMyProfile,
} = require('../controllers/profileController');

const router = Router();

// Student/Recruiter: view own profile
router.get('/me', requireRole('student', 'recruiter'), getMyProfile);

// Student/Recruiter: update profile with file uploads
// upload.fields allows multiple file uploads
router.patch('/me', 
    requireRole('student', 'recruiter'),
    upload.fields([
        { name: 'resumeUrl', maxCount: 1 },
        { name: 'profilePicture', maxCount: 1 },
        { name: 'companyLogo', maxCount: 1 }
    ]),
    updateMyProfile
);

module.exports = router;