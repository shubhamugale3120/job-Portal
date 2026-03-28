import { Link } from 'react-router-dom';

const ForbiddenPage = () => {
    return (
        <section className="jobs-page">
            <div className="jobs-container">
                <header className="jobs-browse-header">
                    <h1 className="jobs-title">403 Forbidden</h1>
                    <p className="jobs-subtitle">You do not have permission to access this page.</p>
                </header>

                <article className="job-card forbidden-card">
                    <p className="job-description">
                        Your account role does not have access to this section. Use the navigation below to return to
                        pages available to your account.
                    </p>
                    <div className="job-card-actions">
                        <Link className="btn-view" to="/">Go Home</Link>
                        <Link className="btn-apply" to="/jobs">Browse Jobs</Link>
                    </div>
                </article>
            </div>
        </section>
    );
};

export default ForbiddenPage;
