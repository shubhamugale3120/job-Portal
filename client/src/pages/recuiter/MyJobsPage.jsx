import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteJob, getMyJobs, updateJob } from '../../services/jobService';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

const MyJobsPage = () => {
	const navigate = useNavigate();
	const [jobs, setJobs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	const fetchJobs = async () => {
		try {
			setLoading(true);
			setError('');
			const response = await getMyJobs();
			setJobs(response?.data || []);
		} catch (err) {
			setError(
				err?.response?.data?.error?.message
				|| err?.response?.data?.error
				|| err?.response?.data?.message
				|| 'Failed to load jobs'
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchJobs();
	}, []);

	const handleDelete = async (jobId) => {
		if (!window.confirm('Delete this job?')) {
			return;
		}
		try {
			await deleteJob(jobId);
			setJobs((prev) => prev.filter((job) => (job._id || job.id) !== jobId));
		} catch (err) {
			window.alert(err?.response?.data?.error?.message || 'Failed to delete job');
		}
	};

	const handleToggleStatus = async (job) => {
		const nextStatus = job.status === 'Active' ? 'Closed' : 'Active';
		try {
			const response = await updateJob(job._id || job.id, { status: nextStatus });
			const updated = response?.data;
			setJobs((prev) => prev.map((item) => ((item._id || item.id) === (job._id || job.id) ? { ...item, ...updated, status: nextStatus } : item)));
		} catch (err) {
			window.alert(err?.response?.data?.error?.message || 'Failed to update job status');
		}
	};

	if (loading) {
		return <Loader message="Loading your jobs..." />;
	}

	if (error) {
		return <ErrorState message={error} />;
	}

	return (
		<section className="jobs-page">
			<div className="jobs-container">
				<h1 className="jobs-title">My Jobs</h1>
				{jobs.length === 0 && <EmptyState message="No jobs posted yet." />}

				{jobs.map((job) => {
					const jobId = job._id || job.id;
					return (
						<article className="job-card" key={jobId}>
							<h3 className="job-card-title">{job.title}</h3>
							<p className="job-card-meta">{job.location || 'Location not specified'}</p>
							<p className="job-card-skills">Status: {job.status || 'Active'}</p>
							<p className="job-card-type">Applications: {job.applicationCount || 0}</p>

							<div className="job-card-actions">
								<button type="button" onClick={() => navigate(`/recruiter/jobs/${jobId}/applicants`)}>
									View Applicants
								</button>
								<button type="button" onClick={() => handleToggleStatus(job)}>
									{job.status === 'Active' ? 'Close Job' : 'Reopen Job'}
								</button>
								<button type="button" onClick={() => handleDelete(jobId)}>
									Delete
								</button>
							</div>
						</article>
					);
				})}
			</div>
		</section>
	);
};

export default MyJobsPage;

