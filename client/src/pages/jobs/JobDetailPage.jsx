import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

	return (
		<section className="jobs-page">
			<div className="jobs-container">
				<article className="job-card">
					<h1 className="job-card-title">{job.title}</h1>
					<p className="job-card-meta">{job.company || 'Company not specified'}</p>
					<p className="job-card-meta">{job.location || 'Location not specified'}</p>
					<p className="job-card-skills">{Array.isArray(job.skills) ? job.skills.join(', ') : ''}</p>
					<p className="job-card-type">{job.jobType || 'N/A'}</p>
					<p className="job-card-meta">{job.description}</p>
				</article>

				{user?.role === 'student' && (
					<article className="job-card">
						<h3 className="job-card-title">Apply to this Job</h3>
						<form className="auth-form" onSubmit={handleApply}>
							<div className="auth-field">
								<label>Resume URL:</label>
								<input
									type="url"
									value={resumeUrl}
									onChange={(event) => setResumeUrl(event.target.value)}
									placeholder="https://example.com/resume.pdf"
									required
								/>
							</div>
							<button className="auth-submit" type="submit" disabled={submitting}>
								{submitting ? 'Submitting...' : 'Apply'}
							</button>
						</form>
					</article>
				)}
			</div>
		</section>
	);
};

export default JobDetailPage;

