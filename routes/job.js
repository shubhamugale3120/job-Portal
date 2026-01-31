const { Router } = require('express');
const { requireRole } = require('../middleware/authorization');
const { validateJob } = require('../middleware/validation');
const {
    listJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    getMyJobs,
    getMyApplications,
} = require('../controllers/jobController');

const router = Router();

// Recruiter: get own jobs (API endpoint for dashboard)
router.get('/my-jobs', requireRole('recruiter', 'admin'), getMyJobs);

// Recruiter: get applications for own jobs (API endpoint for dashboard)
router.get('/my-applications', requireRole('recruiter', 'admin'), getMyApplications);

// Public: list all active jobs
router.get('/', listJobs);

// Public: job details
router.get('/:id', getJobById);

// Recruiter/Admin: create job
router.post('/', requireRole('recruiter', 'admin'), validateJob, createJob);

// Recruiter/Admin: update job
router.patch('/:id', requireRole('recruiter', 'admin'), validateJob, updateJob);
router.post('/:id/update', requireRole('recruiter', 'admin'), validateJob, updateJob);

// Recruiter/Admin: delete job
router.delete('/:id', requireRole('recruiter', 'admin'), deleteJob);
router.post('/:id/delete', requireRole('recruiter', 'admin'), deleteJob);

module.exports = router;
