const Job = require('../models/job');
const Application = require('../models/Application');

// Get recruiter's posted jobs (API endpoint for dashboard)
async function getMyJobs(req, res) {
    try {
        const jobs = await Job.find({ postedBy: req.user._id })
            .select('_id title description location jobType salary skills status createdAt applicationCount')
            .sort({ createdAt: -1 })
            .lean();

        return res.json({
            success: true,
            data: jobs
        });
    } catch (err) {
        console.error('Error fetching recruiter jobs:', err);
        return res.status(500).json({ success: false, error: 'Failed to fetch jobs' });
    }
}

// Get applications for recruiter's jobs (API endpoint for dashboard)
async function getMyApplications(req, res) {
    try {
        // Get all jobs posted by this recruiter
        const jobs = await Job.find({ postedBy: req.user._id }).select('_id');
        const jobIds = jobs.map(j => j._id);

        // Get applications for those jobs
        const applications = await Application.find({ jobId: { $in: jobIds } })
            .populate('studentId', 'name email')
            .populate('jobId', 'title location')
            .sort({ createdAt: -1 })
            .lean();

        const normalized = applications.map(app => ({
            ...app,
            status: (app.status || '').toLowerCase(),
            appliedAt: app.appliedAt || app.createdAt,
        }));

        return res.json({
            success: true,
            data: normalized
        });
    } catch (err) {
        console.error('Error fetching applications:', err);
        return res.status(500).json({ success: false, error: 'Failed to fetch applications' });
    }
}

// PAGINATION & SEARCH FUNCTIONALITY
// Why: Without pagination, loading 5000 jobs crashes the server
// Solution: Return only 10 jobs per page + allow filtering
async function listJobs(req, res) {
    try {
        // ====== PAGINATION SETUP ======
        // Page: which page user wants (1, 2, 3...)
        // Limit: how many jobs per page (default 20 for better UX)
        // skip: how many jobs to skip (page 2 = skip 20 jobs)
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100); // Max 100 to prevent abuse
        const skip = (page - 1) * limit;

        // ====== BUILD FILTER OBJECT ======
        // Start with status filter (only show Active jobs)
        const filter = { status: 'Active' };

        // SEARCH BY TITLE - if user searches "React Developer"
        // Example: GET /jobs?search=React
        if (req.query.search) {
            filter.title = { $regex: req.query.search, $options: 'i' }; // 'i' = case insensitive
        }

        // FILTER BY LOCATION - if user wants jobs in "Mumbai"
        // Example: GET /jobs?location=Mumbai
        if (req.query.location) {
            filter.location = { $regex: req.query.location, $options: 'i' };
        }

        // FILTER BY SKILLS - if user has "React" skill
        // Example: GET /jobs?skills=React
        // Note: $in finds if skill is in the array
        if (req.query.skills) {
            const skillsArray = req.query.skills.split(','); // Convert "React,Node.js" to array
            filter.skills = { $in: skillsArray };
        }

        // FILTER BY JOB TYPE - Full-time, Part-time, etc
        // Example: GET /jobs?jobType=Full-time
        if (req.query.jobType) {
            filter.jobType = req.query.jobType;
        }

        // FILTER BY SALARY RANGE - min and max salary
        // Example: GET /jobs?salaryMin=500000&salaryMax=1000000
        if (req.query.salaryMin || req.query.salaryMax) {
            filter.salary = {};
            if (req.query.salaryMin) filter.salary.$gte = req.query.salaryMin;
            if (req.query.salaryMax) filter.salary.$lte = req.query.salaryMax;
        }

        // ====== EXECUTE QUERY ======
        // 1. Find jobs matching filter
        // 2. Skip the first (page-1)*limit jobs
        // 3. Limit to only 'limit' number of jobs
        // 4. Sort by newest first
        // 5. Use lean() for faster read-only queries (removes Mongoose overhead)
        // 6. Select only needed fields to reduce data transfer
        // 7. Fetch limit+1 to determine hasNextPage without counting all
        const jobs = await Job.find(filter)
            .skip(skip)
            .limit(limit + 1) // Get one extra to check if more pages exist
            .sort({ createdAt: -1 })
            .select('_id title description location jobType salary skills createdAt status applicationCount')
            .lean(); // 50% faster for read-only data

        // Check if there are more pages
        const hasNextPage = jobs.length > limit;
        const jobsToReturn = hasNextPage ? jobs.slice(0, limit) : jobs;

        // ====== RETURN RESPONSE ======
        // Include pagination info so frontend can show "Page 1 of 5"
        return res.json({
            success: true,
            data: jobsToReturn,
            pagination: {
                currentPage: page,
                limit: limit,
                hasNextPage: hasNextPage,
                hasPrevPage: page > 1
            }
        });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch jobs' });
    }
}

async function getJobById(req, res) {
    try {
        const job = await Job.findById(req.params.id).lean();
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        return res.json(job);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch job' });
    }
}

async function createJob(req, res) {
    try {
        const job = await Job.create({
            ...req.body,
            postedBy: req.user._id, // Tie job to the recruiter creating it
        });
        return res.redirect('/recruiter/dashboard?success=Job posted successfully');
    } catch (err) {
        return res.redirect('/recruiter/post-job?error=' + encodeURIComponent(err.message || 'Failed to create job'));
    }
}

async function updateJob(req, res) {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.redirect('/recruiter/dashboard?error=' + encodeURIComponent('Job not found'));
        }

        // OWNERSHIP CHECK - Only owner or admin can edit
        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.redirect('/recruiter/dashboard?error=' + encodeURIComponent('You can only edit your own jobs'));
        }

        Object.assign(job, req.body);
        await job.save();
        return res.redirect('/recruiter/dashboard?success=Job updated successfully');
    } catch (err) {
        return res.redirect(`/recruiter/edit-job/${req.params.id}?error=` + encodeURIComponent(err.message || 'Failed to update job'));
    }
}

async function deleteJob(req, res) {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.redirect('/recruiter/dashboard?error=' + encodeURIComponent('Job not found'));
        }

        // OWNERSHIP CHECK - Only owner or admin can delete
        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.redirect('/recruiter/dashboard?error=' + encodeURIComponent('You can only delete your own jobs'));
        }
        await job.deleteOne();
        return res.redirect('/recruiter/dashboard?success=Job deleted successfully');
    } catch (err) {
        return res.redirect('/recruiter/dashboard?error=' + encodeURIComponent('Failed to delete job'));
    }
}

module.exports = {
    listJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    getMyJobs,
    getMyApplications,
};
