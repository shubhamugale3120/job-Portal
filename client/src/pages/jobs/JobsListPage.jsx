import { useJobs } from '../../hooks/useJobs';
import { useQuerySync } from '../../hooks/useQuerySync';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { JobFilters } from '../../components/jobs/JobFilters';
import { JobCard } from '../../components/jobs/JobCard';
import { Pagination } from '../../components/jobs/Pagination';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { applyToJob } from '../../services/applicationService';

const defaultJobsQuery = {
    page: '1',
    limit: '10',
    search: '',
    location: '',
    skills: '',
    jobType: '',
};

export function JobsListPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { query, updateQuery } = useQuerySync(defaultJobsQuery);

    const { jobs, pagination, loading, error } = useJobs(query);

    const userRole = user?.role || 'guest';

    const handleApply = async (jobId) => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.role !== 'student') {
            window.alert('Only students can apply to jobs.');
            return;
        }

        const resumeUrl = window.prompt('Enter resume URL to submit application:');
        if (!resumeUrl) {
            return;
        }

        try {
            const response = await applyToJob(jobId, { resumeUrl, coverLetter: '' });
            window.alert(response?.message || 'Applied successfully');
        } catch (err) {
            const message = err?.response?.data?.error?.message
                || err?.response?.data?.error
                || err?.response?.data?.message
                || 'Failed to apply';
            window.alert(message);
        }
    };

    const handleViewApplicants = (jobId) => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.role !== 'recruiter' && user.role !== 'admin') {
            window.alert('Only recruiters/admin can view applicants.');
            return;
        }

        navigate(`/recruiter/jobs/${jobId}/applicants`);
    };

    return (
        <section className="jobs-page">
            <div className="jobs-container">
            <h1 className="jobs-title">Jobs</h1>

            <JobFilters query={query} updateQuery={updateQuery} />

            {loading && <Loader message="Loading jobs..." />}
            {error && !loading && <ErrorState message={error} />}

            {!loading && !error && jobs.length === 0 && <EmptyState message="No jobs found for current filters." />}

            {!loading && !error && jobs.map((job) => (
                <JobCard
                    key={job._id || job.id}
                    job={job}
                    userRole={userRole}
                    onApply={handleApply}
                    onViewApplicants={handleViewApplicants}
                />
            ))}

            {!loading && !error && jobs.length > 0 && (
                <Pagination query={query} updateQuery={updateQuery} pagination={pagination} />
            )}
            </div>
        </section>
    );
}