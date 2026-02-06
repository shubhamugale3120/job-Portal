const Application = require('../models/Application');

async function applyToJob(req, res) {
    try {
        const { resumeUrl, coverLetter } = req.body;
        
        // Validate required field
        if (!resumeUrl || !resumeUrl.trim()) {
            return res.status(400).json({ 
                success: false, 
                error: 'Resume URL is required' 
            });
        }
        
        // Check if student has already applied to this job (prevent duplicates)
        const existingApplication = await Application.findOne({
            jobId: req.params.jobId,
            studentId: req.user._id
        });
        
        if (existingApplication) {
            // Industry-standard: Return 409 Conflict status code for duplicate submission
            return res.status(409).json({ 
                success: false, 
                error: 'You have already applied to this job. Wait for the recruiter to review your application.' 
            });
        }
        
        // Create new application
        const application = await Application.create({
            jobId: req.params.jobId,
            studentId: req.user._id,
            resumeUrl: resumeUrl.trim(),
            coverLetter: coverLetter ? coverLetter.trim() : '',
            status: 'APPLIED'
        });
        
        return res.status(201).json({ 
            success: true, 
            message: 'Applied successfully! Check your applications page.',
            data: application
        });
    } catch (err) {
        console.error('Apply to job error:', err);
        return res.status(500).json({ 
            success: false, 
            error: err.message || 'Failed to apply. Please try again.' 
        });
    }
}

/**
 * Check if student has applied to a specific job
 * Purpose: Prevent duplicate applications in UI
 * Returns: { hasApplied: true/false, applicationStatus: 'APPLIED'/'SHORTLISTED'/etc }
 */
async function checkApplicationStatus(req, res) {
    try {
        const application = await Application.findOne({
            jobId: req.params.jobId,
            studentId: req.user._id
        });
        
        if (!application) {
            return res.json({
                success: true,
                hasApplied: false
            });
        }
        
        return res.json({
            success: true,
            hasApplied: true,
            status: application.status,
            appliedAt: application.appliedAt
        });
    } catch (err) {
        console.error('Error checking application status:', err);
        return res.status(500).json({
            success: false,
            error: 'Failed to check application status'
        });
    }
}

/**
 * Get student's applied jobs (for frontend to disable apply buttons)
 * Purpose: Quick lookup to show which jobs student has applied to
 */
async function getAppliedJobs(req, res) {
    try {
        const applications = await Application.find({ 
            studentId: req.user._id 
        }).select('jobId status createdAt').lean();
        
        const appliedJobs = applications.map(app => ({
            jobId: app.jobId.toString(),
            status: app.status,
            appliedAt: app.createdAt
        }));
        
        return res.json({
            success: true,
            data: appliedJobs
        });
    } catch (err) {
        console.error('Error fetching applied jobs:', err);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch applied jobs'
        });
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
    checkApplicationStatus,
    getAppliedJobs,
    getMyApplications,
    getApplicationsForJob,
    updateApplicationStatus,
};
