import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';

const RecuiterDashboardPage = () => {
	const [jobs, setJobs] = useState([]);
	const [applications, setApplications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchDashboard = async () => {
			try {
				setLoading(true);
				setError('');

				const [jobsResponse, applicationsResponse] = await Promise.all([
					api.get('/api/jobs/my-jobs'),
					api.get('/api/jobs/my-applications'),
				]);

				setJobs(jobsResponse?.data?.data || []);
				setApplications(applicationsResponse?.data?.data || []);
			} catch (err) {
				setError(
					err?.response?.data?.error?.message
					|| err?.response?.data?.error
					|| err?.response?.data?.message
					|| 'Failed to load recruiter dashboard'
				);
			} finally {
				setLoading(false);
			}
		};

		fetchDashboard();
	}, []);

	const stats = useMemo(() => {
		const totalJobs = jobs.length;
		const activeJobs = jobs.filter((job) => job.status === 'Active').length;
		const totalApplications = applications.length;
		const pendingApplications = applications.filter((app) => (app.status || '').toLowerCase() === 'applied').length;
		return { totalJobs, activeJobs, totalApplications, pendingApplications };
	}, [jobs, applications]);

	if (loading) {
		return <Loader message="Loading dashboard..." />;
	}

	if (error) {
		return <ErrorState message={error} />;
	}

	return (
		<section className="jobs-page">
			<div className="jobs-container">
				<h1 className="jobs-title">Recruiter Dashboard</h1>

				<article className="job-card">
					<h3 className="job-card-title">Total Jobs: {stats.totalJobs}</h3>
					<p className="job-card-meta">Active Jobs: {stats.activeJobs}</p>
					<p className="job-card-skills">Applications: {stats.totalApplications}</p>
					<p className="job-card-type">Pending Review: {stats.pendingApplications}</p>
				</article>
			</div>
		</section>
	);
};

export default RecuiterDashboardPage;

