import { useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/authService';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            await register({ name, email, password, role });
            navigate('/login', { replace: true });
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'Registration failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="auth-page">
            <div className="auth-shell auth-shell-register">
                <aside className="auth-brand-panel">
                    <div className="auth-brand-chip">JOB PORTAL</div>
                    <h2>Build Your Career Story</h2>
                    <p>Join as a student or recruiter and unlock role-based dashboards, applications, and smart matching.</p>
                </aside>

                <div className="auth-card auth-card-branded">
                    <div className="auth-card-header">
                        <h2>Create Account</h2>
                        <p>Join our community and start your journey</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-field auth-field-stacked">
                            <label htmlFor="register-name">Full Name</label>
                            <input
                                id="register-name"
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                required
                            />
                        </div>
                        <div className="auth-field auth-field-stacked">
                            <label htmlFor="register-email">Email Address</label>
                            <input
                                id="register-email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </div>
                        <div className="auth-field auth-field-stacked">
                            <label htmlFor="register-password">Password</label>
                            <input
                                id="register-password"
                                type="password"
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                        </div>
                        <div className="auth-field auth-field-stacked">
                            <label htmlFor="register-role">I am a...</label>
                            <div className="auth-role-grid" role="radiogroup" aria-label="Select account role">
                                <button
                                    type="button"
                                    className={`auth-role-btn ${role === 'student' ? 'selected' : ''}`}
                                    onClick={() => setRole('student')}
                                    aria-pressed={role === 'student'}
                                >
                                    Student
                                </button>
                                <button
                                    type="button"
                                    className={`auth-role-btn ${role === 'recruiter' ? 'selected' : ''}`}
                                    onClick={() => setRole('recruiter')}
                                    aria-pressed={role === 'recruiter'}
                                >
                                    Recruiter
                                </button>
                            </div>
                            <select
                                id="register-role"
                                value={role}
                                onChange={(event) => setRole(event.target.value)}
                                className="auth-role-select-fallback"
                            >
                                <option value="student">Student</option>
                                <option value="recruiter">Recruiter</option>
                            </select>
                        </div>

                        {error && <p className="auth-error">{error}</p>}

                        <button className="auth-submit" type="submit" disabled={submitting}>
                            {submitting ? 'Creating account...' : 'Create Account'}
                        </button>

                        <p className="auth-alt-link">
                            Already have an account? <Link to="/login">Sign in</Link>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default RegisterPage;