import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../../services/jobService';

const PostJobPage = () => {
	const navigate = useNavigate();
	const [form, setForm] = useState({
		title: '',
		description: '',
		location: '',
		skills: '',
		salary: '',
		jobType: 'Full-time',
	});
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState('');

	const onChange = (field) => (event) => {
		setForm((prev) => ({ ...prev, [field]: event.target.value }));
	};

	const onSubmit = async (event) => {
		event.preventDefault();
		setError('');
		try {
			setSubmitting(true);
			await createJob({
				...form,
				skills: form.skills,
			});
			navigate('/recruiter/my-jobs', { replace: true });
		} catch (err) {
			const message = err?.response?.data?.error?.message
				|| err?.response?.data?.error
				|| err?.response?.data?.message
				|| 'Failed to post job';
			setError(message);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<section className="jobs-page">
			<div className="jobs-container">
				<h1 className="jobs-title">Post Job</h1>
				<article className="job-card">
					<form className="auth-form" onSubmit={onSubmit}>
						<div className="auth-field">
							<label>Title:</label>
							<input value={form.title} onChange={onChange('title')} minLength={5} required />
						</div>
						<div className="auth-field">
							<label>Description:</label>
							<input value={form.description} onChange={onChange('description')} minLength={20} required />
						</div>
						<div className="auth-field">
							<label>Location:</label>
							<input value={form.location} onChange={onChange('location')} required />
						</div>
						<div className="auth-field">
							<label>Skills:</label>
							<input value={form.skills} onChange={onChange('skills')} placeholder="React, Node.js, MongoDB" required />
						</div>
						<div className="auth-field">
							<label>Salary:</label>
							<input value={form.salary} onChange={onChange('salary')} placeholder="5-10 LPA" />
						</div>
						<div className="auth-field">
							<label>Type:</label>
							<select value={form.jobType} onChange={onChange('jobType')}>
								<option value="Full-time">Full-time</option>
								<option value="Part-time">Part-time</option>
								<option value="Internship">Internship</option>
								<option value="Contract">Contract</option>
							</select>
						</div>

						{error && <p className="auth-error">{error}</p>}

						<button className="auth-submit" type="submit" disabled={submitting}>
							{submitting ? 'Posting...' : 'Post Job'}
						</button>
					</form>
				</article>
			</div>
		</section>
	);
};

export default PostJobPage;

