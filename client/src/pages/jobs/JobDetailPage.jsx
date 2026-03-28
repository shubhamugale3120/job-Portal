import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { applyToJob } from '../../services/applicationService';
import { getJobById } from '../../services/jobService';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';

const JobDetailPage = () => {
	const { jobId } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();
	const [job, setJob] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [resumeUrl, setResumeUrl] = useState('');
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		let cancelled = false;

		const fetchJob = async () => {
			try {
				setLoading(true);
				setError('');
				const response = await getJobById(jobId);
				if (!cancelled) {
					setJob(response?.data || null);
				}
			} catch (err) {
				if (!cancelled) {
					setError(
						err?.response?.data?.error?.message
						|| err?.response?.data?.error
						|| err?.response?.data?.message
						|| 'Failed to load job details'
					);
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		};

		fetchJob();
		return () => {
			cancelled = true;
		};
	}, [jobId]);

	const handleApply = async (event) => {
		event.preventDefault();
		if (!user) {
			navigate('/login');
			return;
		}
		if (user.role !== 'student') {
			window.alert('Only students can apply to jobs.');
			return;
		}
		if (!resumeUrl.trim()) {
			window.alert('Please enter resume URL.');
			return;
		}

		try {
			setSubmitting(true);
			const response = await applyToJob(jobId, { resumeUrl: resumeUrl.trim(), coverLetter: '' });
			window.alert(response?.message || 'Applied successfully');
			setResumeUrl('');
		} catch (err) {
			const message = err?.response?.data?.error?.message
				|| err?.response?.data?.error
				|| err?.response?.data?.message
				|| 'Failed to apply';
			window.alert(message);
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return <Loader message="Loading job details..." />;
	}

	if (error) {
		return <ErrorState message={error} />;
	}

	if (!job) {
		return <ErrorState message="Job not found." />;
	}

	const skills = Array.isArray(job.skills) ? job.skills : [];
	const postedOn = job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently';
	const isClosed = String(job.status || '').toLowerCase() !== 'active';

	return (
		<section className="jobs-page">
			<div className="jobs-container">
				<header className="jobs-browse-header">
					<h1 className="jobs-title">Job Details</h1>
					<p className="jobs-subtitle">Review role requirements and apply directly from this page.</p>
				</header>

				<div className="job-detail-layout">
					<article className="job-card job-detail-card">
						<div className="job-header">
							<h2 className="job-card-title">{job.title}</h2>
							<span className={`job-status ${isClosed ? 'status-closed' : 'status-active'}`}>
								{job.status || 'Active'}
							</span>
						</div>

						<div className="job-meta">
							<div className="meta-item">{job.location || 'Location not specified'}</div>
							<div className="meta-item">{job.jobType || 'N/A'}</div>
							<div className="meta-item">Posted {postedOn}</div>
						</div>

						<div className="job-detail-section">
							<h3>About This Job</h3>
							<p className="job-description">{job.description || 'No description provided.'}</p>
						</div>

						{skills.length > 0 && (
							<div className="job-detail-section">
								<h3>Required Skills</h3>
								<div className="job-skills">
									{skills.map((skill) => (
										<span key={`${job._id}-${skill}`} className="skill-badge">{skill}</span>
									))}
								</div>
							</div>
						)}

						<div className="job-detail-footer">
							<div className="salary-badge">{job.salary || 'Salary not specified'}</div>
							<Link className="btn-view" to="/jobs">Back to Jobs</Link>
						</div>
					</article>

					{user?.role === 'student' && (
						<aside className="job-card job-apply-card">
							<h3>Apply for This Position</h3>
							<p>Add your resume link to submit your application.</p>
							<form className="auth-form" onSubmit={handleApply}>
								<div className="auth-field auth-field-stacked">
									<label htmlFor="resumeUrl">Resume URL</label>
									<input
										id="resumeUrl"
										type="url"
										value={resumeUrl}
										onChange={(event) => setResumeUrl(event.target.value)}
										placeholder="https://example.com/resume.pdf"
										required
									/>
								</div>
								<button className="auth-submit" type="submit" disabled={submitting || isClosed}>
									{submitting ? 'Submitting...' : isClosed ? 'Applications Closed' : 'Submit Application'}
								</button>
							</form>
						</aside>
					)}
				</div>
			</div>
		</section>
	);
};

export default JobDetailPage;

