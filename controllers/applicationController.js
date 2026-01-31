const Application = require('../models/Application');

async function applyToJob(req, res) {
    try {
        const { resumeUrl, coverLetter } = req.body;
        
        // Validate required field
        if (!resumeUrl || !resumeUrl.trim()) {
            return res.redirect('/jobs/browse?error=' + encodeURIComponent('Resume URL is required'));
        }
        
        const application = await Application.create({
            jobId: req.params.jobId,
            studentId: req.user._id,
            resumeUrl: resumeUrl.trim(),
            coverLetter: coverLetter ? coverLetter.trim() : '',
        });
        
        return res.redirect('/student/my-applications?success=Applied successfully! Check your applications page.');
    } catch (err) {
        console.error('Apply to job error:', err);
        return res.redirect('/jobs/browse?error=' + encodeURIComponent(err.message || 'Failed to apply. Please try again.'));
    }
}

async function getMyApplications(req, res) {
    try {
        const applications = await Application.find({ studentId: req.user._id })
            .populate('jobId', 'title description location jobType salary skills createdAt') // Only needed fields
            .sort({ createdAt: -1 })
            .lean(); // Use lean() for faster read-only queries
        
        // Transform status to lowercase for consistent frontend handling
        const transformedApplications = applications.map(app => ({
            ...app,
            status: app.status.toLowerCase(),
            appliedAt: app.appliedAt || app.createdAt
        }));
        
        return res.json(transformedApplications);
    } catch (err) {
        console.error('Error fetching applications:', err);
        return res.status(500).json({ error: 'Failed to fetch applications' });
    }
}

async function getApplicationsForJob(req, res) {
    try {
        const applications = await Application.find({ jobId: req.params.jobId })
            .populate('studentId', 'name email') // Only get name and email, not password/salt
            .populate('jobId', 'title')
            .sort({ createdAt: -1 })
            .select('studentId jobId resumeUrl coverLetter status appliedAt')
            .lean(); // Use lean() for faster read-only queries
        return res.json(applications);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch applicants' });
    }
}

async function updateApplicationStatus(req, res) {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.redirect('/recruiter/dashboard?error=' + encodeURIComponent('Application not found'));
        }
        application.status = req.body.status || application.status;
        await application.save();
        // Redirect back to applicants page
        return res.redirect(`/recruiter/view-applicants/${application.jobId}?success=Application status updated to ${application.status}`);
    } catch (err) {
        return res.redirect('/recruiter/dashboard?error=' + encodeURIComponent(err.message || 'Failed to update status'));
    }
}

module.exports = {
    applyToJob,
    getMyApplications,
    getApplicationsForJob,
    updateApplicationStatus,
};
