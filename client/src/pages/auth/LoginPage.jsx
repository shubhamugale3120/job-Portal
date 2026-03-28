import { useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";
import { login as loginRequest } from '../../services/authService';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const payload = await loginRequest({ email, password });
            const token = payload?.token;
            const user = payload?.user || payload?.data || null;

            if (!token) {
                throw new Error('Token missing in login response');
            }

            login(token, user);

            if (user?.role === 'recruiter') {
                navigate('/recruiter/dashboard', { replace: true });
            } else if (user?.role === 'admin') {
                navigate('/forbidden', { replace: true });
            } else {
                navigate('/jobs', { replace: true });
            }
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'Login failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="auth-page">
            <div className="auth-shell auth-shell-login">
                <aside className="auth-brand-panel">
                    <div className="auth-brand-chip">JOB PORTAL</div>
                    <h2>Welcome Back</h2>
                    <p>Sign in to continue managing applications, jobs, and recommendations from your dashboard.</p>
                </aside>

                <div className="auth-card auth-card-branded">
                    <div className="auth-card-header">
                        <h2>Sign In</h2>
                        <p>Access your account securely</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-field auth-field-stacked">
                            <label htmlFor="login-email">Email Address</label>
                            <input
                                id="login-email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </div>
                        <div className="auth-field auth-field-stacked">
                            <label htmlFor="login-password">Password</label>
                            <input
                                id="login-password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                        </div>

                        {error && <p className="auth-error">{error}</p>}

                        <button className="auth-submit" type="submit" disabled={submitting}>
                            {submitting ? 'Signing in...' : 'Sign In'}
                        </button>

                        <p className="auth-alt-link">
                            New here? <Link to="/register">Create an account</Link>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;