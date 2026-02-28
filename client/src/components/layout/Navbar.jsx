import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="top-nav">
            <div className="top-nav-inner">
                <Link to="/" className="brand">JOB PORTAL</Link>

                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/jobs" className="nav-link">Browse Jobs</Link>

                    {!user && <Link to="/register" className="nav-link">Signup</Link>}
                    {!user && <Link to="/login" className="nav-link">Login</Link>}

                    {user?.role === 'student' && <Link to="/student/applications" className="nav-link">My Applications</Link>}
                    {(user?.role === 'recruiter' || user?.role === 'admin') && <Link to="/recruiter/post-job" className="nav-link">Post Job</Link>}
                    {(user?.role === 'recruiter' || user?.role === 'admin') && <Link to="/recruiter/my-jobs" className="nav-link">My Jobs</Link>}
                    {(user?.role === 'recruiter' || user?.role === 'admin') && <Link to="/recruiter/dashboard" className="nav-link">Dashboard</Link>}

                    {user && (
                        <button type="button" onClick={logout} className="nav-logout">
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;