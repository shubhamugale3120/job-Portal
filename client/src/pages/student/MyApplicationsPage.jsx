import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyApplications } from '../../services/applicationService';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

const MyApplicationsPage = () => {
	const [applications, setApplications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchApplications = async () => {
			try {
				setLoading(true);
				setError('');
				const response = await getMyApplications();
				setApplications(response?.data || []);
			} catch (err) {
				setError(
					err?.response?.data?.error?.message
					|| err?.response?.data?.error
					|| err?.response?.data?.message
					|| 'Failed to load applications'
				);
			} finally {
				setLoading(false);
			}
		};

		fetchApplications();
	}, []);

	const getStatusClassName = (status) => {
		const normalized = String(status || 'APPLIED').toUpperCase();
		switch (normalized) {
			case 'REVIEWED':
				return 'status-reviewed';
			case 'SHORTLISTED':
				return 'status-shortlisted';
			case 'HIRED':
				return 'status-hired';
			case 'REJECTED':
				return 'status-rejected';
			default:
				return 'status-applied';
		}
	};

	return (
		<section className="jobs-page">
			<div className="jobs-container">
				<header className="jobs-browse-header">
					<h1 className="jobs-title">My Applications</h1>
					<p className="jobs-subtitle">Track each application and follow your progress from applied to final decision.</p>
				</header>

				{loading && <Loader message="Loading applications..." />}
				{error && !loading && <ErrorState message={error} />}
				{!loading && !error && applications.length === 0 && <EmptyState message="No applications yet." />}

				{!loading && !error && applications.map((application) => {
					const job = application.jobId || {};
					const status = (application.status || 'APPLIED').toUpperCase();
					const jobId = job._id || job.id;
					return (
						<article className="job-card" key={application._id}>
							<div className="job-header">
								<h3 className="job-card-title">{job.title || 'Job'}</h3>
								<span className={`application-status-badge ${getStatusClassName(status)}`}>{status}</span>
							</div>

							<div className="job-meta">
								<p className="meta-item">{job.location || 'Location not specified'}</p>
								<p className="meta-item">Type: {job.jobType || 'N/A'}</p>
								<p className="meta-item">Applied: {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'N/A'}</p>
							</div>

							<div className="job-card-actions">
								{jobId ? <Link className="btn-view" to={`/jobs/${jobId}`}>View Job</Link> : null}
								<Link className="btn-apply" to="/jobs">Browse More Jobs</Link>
							</div>
						</article>
					);
				})}
			</div>
		</section>
	);
};

export default MyApplicationsPage;

