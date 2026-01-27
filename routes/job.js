const { Router } = require('express');
const { requireRole } = require('../middleware/authorization');
const {
    listJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
} = require('../controllers/jobController');

const router = Router();

// Public: list all active jobs
router.get('/', listJobs);

// Public: job details
router.get('/:id', getJobById);

// Recruiter/Admin: create job
router.post('/', requireRole('recruiter', 'admin'), createJob);

// Recruiter/Admin: update job
router.patch('/:id', requireRole('recruiter', 'admin'), updateJob);

// Recruiter/Admin: delete job
router.delete('/:id', requireRole('recruiter', 'admin'), deleteJob);

module.exports = router;
