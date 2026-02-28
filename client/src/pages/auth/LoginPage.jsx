import { useState } from "react";
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
            <div className="auth-card">
            <h2>Login</h2>
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-field">
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                </div>
                <div className="auth-field">
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                </div>
                {error && <p className="auth-error">{error}</p>}
                <button className="auth-submit" type="submit" disabled={submitting}>
                    {submitting ? 'Signing in...' : 'Login'}
                </button>
            </form>
            </div>
        </section>
    );
};

export default LoginPage;