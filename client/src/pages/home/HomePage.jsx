import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <section className="hero-section">
        <h1>Welcome to Job Portal</h1>
        <p>Your gateway to exciting career opportunities</p>
        <div className="cta-buttons">
          {!user && (
            <>
              <Link to="/jobs" className="btn-primary-hero">Browse Jobs</Link>
              <Link to="/register" className="btn-secondary-hero">Get Started</Link>
            </>
          )}
          {user?.role === 'student' && (
            <>
              <Link to="/jobs" className="btn-primary-hero">Browse Jobs</Link>
              <Link to="/student/applications" className="btn-secondary-hero">My Applications</Link>
            </>
          )}
          {(user?.role === 'recruiter' || user?.role === 'admin') && (
            <>
              <Link to="/recruiter/post-job" className="btn-primary-hero">Post Job</Link>
              <Link to="/recruiter/dashboard" className="btn-secondary-hero">Dashboard</Link>
            </>
          )}
        </div>
      </section>

      <section className="features-section">
        <div className="features-grid">
          <article className="feature-card">
            <div className="feature-card-image card1">🔎</div>
            <div className="feature-card-content">
              <h3>Find Your Dream Job</h3>
              <p>Explore opportunities by location, skills, and job type with fast filters and clear listings.</p>
              <Link to="/jobs">Explore Jobs →</Link>
            </div>
          </article>

          <article className="feature-card">
            <div className="feature-card-image card2">📈</div>
            <div className="feature-card-content">
              <h3>Advance Your Career</h3>
              <p>Build your profile, apply smartly, and track your applications in one dashboard.</p>
              <Link to="/jobs">Start Applying →</Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
