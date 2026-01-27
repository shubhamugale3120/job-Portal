const Job = require('../models/job');

async function listJobs(req, res) {
    try {
        const jobs = await Job.find({ status: 'Active' }).sort({ createdAt: -1 });
        return res.json(jobs);
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
        return res.status(201).json(job);
    } catch (err) {
        return res.status(400).json({ error: err.message || 'Failed to create job' });
    }
}

async function updateJob(req, res) {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        // Optional: enforce ownership check here if needed (only owner/admin can edit)
        Object.assign(job, req.body);
        await job.save();
        return res.json(job);
    } catch (err) {
        return res.status(400).json({ error: err.message || 'Failed to update job' });
    }
}

async function deleteJob(req, res) {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        await job.deleteOne();
        return res.json({ success: true });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to delete job' });
    }
}

module.exports = {
    listJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
};
