const Job = require('../models/job');

// PAGINATION & SEARCH FUNCTIONALITY
// Why: Without pagination, loading 5000 jobs crashes the server
// Solution: Return only 10 jobs per page + allow filtering
async function listJobs(req, res) {
    try {
        // ====== PAGINATION SETUP ======
        // Page: which page user wants (1, 2, 3...)
        // Limit: how many jobs per page (default 10)
        // skip: how many jobs to skip (page 2 = skip 10 jobs)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
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
        const jobs = await Job.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        // ====== COUNT TOTAL JOBS ======
        // Why: Frontend needs to know how many pages exist
        // Example: 50 jobs total, 10 per page = 5 pages
        const totalJobs = await Job.countDocuments(filter);
        const totalPages = Math.ceil(totalJobs / limit);

        // ====== RETURN RESPONSE ======
        // Include pagination info so frontend can show "Page 1 of 5"
        return res.json({
            success: true,
            data: jobs,
            pagination: {
                currentPage: page,
                limit: limit,
                totalJobs: totalJobs,
                totalPages: totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch jobs' });
    }
}

async function getJobById(req, res) {
    try {
        const job = await Job.findById(req.params.id);
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
};
