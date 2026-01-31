const { Router } = require('express');
const { requireRole } = require('../middleware/authorization');
const {
    applyToJob,
    getMyApplications,
    getApplicationsForJob,
    updateApplicationStatus,
} = require('../controllers/applicationController');

const router = Router();

// Student: apply to a job
router.post('/:jobId/apply', requireRole('student'), applyToJob);

// Student: view own applications
router.get('/me', requireRole('student'), getMyApplications);

// Recruiter/Admin: view applicants for a job
router.get('/job/:jobId', requireRole('recruiter', 'admin'), getApplicationsForJob);

// Recruiter/Admin: update application status
router.patch('/:id/status', requireRole('recruiter', 'admin'), updateApplicationStatus);
router.post('/:id/status', requireRole('recruiter', 'admin'), updateApplicationStatus);

module.exports = router;
