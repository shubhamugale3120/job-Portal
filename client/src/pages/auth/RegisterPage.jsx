import { useState } from "react";
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
            <div className="auth-card">
            <h2>Register</h2>
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-field">
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(event) => setName(event.target.value)} required />
                </div>
                <div className="auth-field">
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                </div>
                <div className="auth-field">
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                </div>
                <div className="auth-field">
                    <label>Role:</label>
                    <select value={role} onChange={(event) => setRole(event.target.value)}>
                        <option value="student">Student</option>
                        <option value="recruiter">Recruiter</option>
                    </select>
                </div>
                {error && <p className="auth-error">{error}</p>}
                <button className="auth-submit" type="submit" disabled={submitting}>
                    {submitting ? 'Creating account...' : 'Register'}
                </button>
            </form>
            </div>
        </section>
    );
};

export default RegisterPage;