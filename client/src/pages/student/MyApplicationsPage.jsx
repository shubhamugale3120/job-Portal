import { useEffect, useState } from 'react';
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

	return (
		<section className="jobs-page">
			<div className="jobs-container">
				<h1 className="jobs-title">My Applications</h1>

				{loading && <Loader message="Loading applications..." />}
				{error && !loading && <ErrorState message={error} />}
				{!loading && !error && applications.length === 0 && <EmptyState message="No applications yet." />}

				{!loading && !error && applications.map((application) => {
					const job = application.jobId || {};
					return (
						<article className="job-card" key={application._id}>
							<h3 className="job-card-title">{job.title || 'Job'}</h3>
							<p className="job-card-meta">{job.location || 'Location not specified'}</p>
							<p className="job-card-skills">Status: {(application.status || 'applied').toUpperCase()}</p>
							<p className="job-card-type">Applied: {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'N/A'}</p>
						</article>
					);
				})}
			</div>
		</section>
	);
};

export default MyApplicationsPage;

