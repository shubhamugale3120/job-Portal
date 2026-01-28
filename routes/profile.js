const {Router} = require('express');
const { requireRole } = require('../middleware/authorization');
const {
    getMyProfile,
    updateMyProfile,
} = require('../controllers/profileController');

const router = Router();

// Student: view own profile
router.get('/me', requireRole('student', 'recruiter'), getMyProfile);

// Student: update own profile
router.patch('/me', requireRole('student', 'recruiter'), updateMyProfile);

module.exports = router;