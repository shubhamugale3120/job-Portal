import { Link } from 'react-router-dom';

export function JobCard({ job, userRole, onApply, onViewApplicants }) {
    const skills = Array.isArray(job.skills) ? job.skills.join(', ') : '';
    const jobId = job._id || job.id;

    return (
        <article className="job-card">
            <h3 className="job-card-title">
                <Link to={`/jobs/${jobId}`}>{job.title}</Link>
            </h3>
            <p className="job-card-meta">{job.company || 'Company not specified'}</p>
            <p className="job-card-meta">{job.location || 'Location not specified'}</p>
            {skills && <p className="job-card-skills">{skills}</p>}
            <p className="job-card-type">{job.jobType || 'N/A'}</p>

            {userRole === 'admin' && (
                <div className="job-card-actions">
                    <button type="button">Edit</button>
                    <button type="button">Delete</button>
                </div>
            )}

            {userRole === 'student' && (
                <div className="job-card-actions">
                    <button type="button" onClick={() => onApply?.(jobId)}>
                        Apply
                    </button>
                </div>
            )}

            {userRole === 'recruiter' && (
                <div className="job-card-actions">
                    <button type="button" onClick={() => onViewApplicants?.(jobId)}>
                        View Applicants
                    </button>
                </div>
            )}
        </article>
    );
}