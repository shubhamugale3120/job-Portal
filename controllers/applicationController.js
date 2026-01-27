const Application = require('../models/Application');

async function applyToJob(req, res) {
    try {
        const application = await Application.create({
            jobId: req.params.jobId,
            studentId: req.user._id,
            resumeUrl: req.body.resumeUrl, // Expecting a URL or uploaded path (use multer later)
            coverLetter: req.body.coverLetter,
        });
        return res.status(201).json(application);
    } catch (err) {
        return res.status(400).json({ error: err.message || 'Failed to apply' });
    }
}

async function getMyApplications(req, res) {
    try {
        const applications = await Application.find({ studentId: req.user._id })
            .populate('jobId') // Surface job details for student view
            .sort({ createdAt: -1 });
        return res.json(applications);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch applications' });
    }
}

async function getApplicationsForJob(req, res) {
    try {
        const applications = await Application.find({ jobId: req.params.jobId })
            .populate('studentId', '-password -salt') // Hide secrets when recruiters view applicants
            .sort({ createdAt: -1 });
        return res.json(applications);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch applicants' });
    }
}

async function updateApplicationStatus(req, res) {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }
        application.status = req.body.status || application.status;
        await application.save();
        return res.json(application);
    } catch (err) {
        return res.status(400).json({ error: err.message || 'Failed to update status' });
    }
}

module.exports = {
    applyToJob,
    getMyApplications,
    getApplicationsForJob,
    updateApplicationStatus,
};
