import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getApplicationsForJob, updateApplicationStatus } from '../../services/applicationService';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

const ApplicantsPage = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getApplicationsForJob(jobId);
      setApplications(response?.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.error?.message
        || err?.response?.data?.error
        || err?.response?.data?.message
        || 'Failed to load applicants'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const updateStatus = async (applicationId, status) => {
    try {
      await updateApplicationStatus(applicationId, status);
      setApplications((prev) => prev.map((app) => (app._id === applicationId ? { ...app, status } : app)));
    } catch (err) {
      window.alert(err?.response?.data?.error?.message || 'Failed to update status');
    }
  };

  if (loading) {
    return <Loader message="Loading applicants..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <section className="jobs-page">
      <div className="jobs-container">
        <header className="jobs-browse-header">
          <h1 className="jobs-title">Applicants</h1>
          <p className="jobs-subtitle">Review applications and move candidates through your hiring pipeline.</p>
        </header>

        {applications.length === 0 && <EmptyState message="No applicants yet for this job." />}

        {applications.map((app) => (
          <article className="job-card" key={app._id}>
            <div className="job-header">
              <h3 className="job-card-title">{app?.studentId?.name || 'Unknown Candidate'}</h3>
              <span className="job-status status-active">{(app.status || 'APPLIED').toUpperCase()}</span>
            </div>

            <div className="job-meta">
              <p className="meta-item">{app?.studentId?.email || 'No email available'}</p>
              <p className="meta-item">Applied: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A'}</p>
              <p className="meta-item">Job: {app?.jobId?.title || 'Untitled role'}</p>
            </div>

            <div className="job-card-actions">
              <button className="btn-view" type="button" onClick={() => updateStatus(app._id, 'REVIEWED')}>Review</button>
              <button className="btn-apply" type="button" onClick={() => updateStatus(app._id, 'HIRED')}>Hire</button>
              <button className="btn-danger-soft" type="button" onClick={() => updateStatus(app._id, 'REJECTED')}>Reject</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ApplicantsPage;
