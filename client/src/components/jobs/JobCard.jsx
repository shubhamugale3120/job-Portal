import { Link } from 'react-router-dom';

export function JobCard({ job, userRole, onApply, onViewApplicants }) {
    const skills = Array.isArray(job.skills) ? job.skills : [];
    const jobId = job._id || job.id;
    const postedDate = job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently';
    const isClosed = String(job.status || '').toLowerCase() !== 'active';

    return (
        <article className="job-card">
            <div className="job-header">
                <h3 className="job-card-title">
                    <Link className="job-title-link" to={`/jobs/${jobId}`}>{job.title}</Link>
                </h3>
                <span className={`job-status ${isClosed ? 'status-closed' : 'status-active'}`}>
                    {job.status || 'Active'}
                </span>
            </div>

            <div className="job-meta">
                <div className="meta-item">{job.location || 'Location not specified'}</div>
                <div className="meta-item">{job.jobType || 'N/A'}</div>
                <div className="meta-item">Posted {postedDate}</div>
            </div>

            <p className="job-description">
                {(job.description || 'No description available').slice(0, 200)}
                {(job.description || '').length > 200 ? '...' : ''}
            </p>

            {skills.length > 0 && (
                <div className="job-skills">
                    {skills.map((skill) => (
                        <span key={`${jobId}-${skill}`} className="skill-badge">{skill}</span>
                    ))}
                </div>
            )}

            <div className="job-footer">
                <div className="salary-badge">{job.salary || 'Salary not specified'}</div>
                <div className="job-card-actions">
                    <Link className="btn-view" to={`/jobs/${jobId}`}>View Details</Link>

                    {userRole === 'student' && (
                        <button className="btn-apply" type="button" onClick={() => onApply?.(jobId)}>
                            Apply
                        </button>
                    )}

                    {userRole === 'recruiter' && (
                        <button className="btn-apply" type="button" onClick={() => onViewApplicants?.(jobId)}>
                            View Applicants
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}