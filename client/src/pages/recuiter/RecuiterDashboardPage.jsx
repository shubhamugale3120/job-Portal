import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
				<header className="jobs-browse-header">
					<h1 className="jobs-title">Recruiter Dashboard</h1>
					<p className="jobs-subtitle">Track your listings, monitor applications, and take action quickly.</p>
				</header>

				<section className="recruiter-stats-grid">
					<article className="recruiter-stat-card">
						<p>Total Jobs</p>
						<h3>{stats.totalJobs}</h3>
					</article>
					<article className="recruiter-stat-card">
						<p>Active Jobs</p>
						<h3>{stats.activeJobs}</h3>
					</article>
					<article className="recruiter-stat-card">
						<p>Total Applications</p>
						<h3>{stats.totalApplications}</h3>
					</article>
					<article className="recruiter-stat-card">
						<p>Pending Review</p>
						<h3>{stats.pendingApplications}</h3>
					</article>
				</section>

				<article className="job-card recruiter-quick-actions">
					<h2 className="job-card-title">Quick Actions</h2>
					<div className="job-card-actions">
						<Link className="btn-view" to="/recruiter/post-job">Post New Job</Link>
						<Link className="btn-apply" to="/recruiter/my-jobs">Manage My Jobs</Link>
					</div>
				</article>
			</div>
		</section>
	);
};

export default RecuiterDashboardPage;

