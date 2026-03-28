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
				<header className="jobs-browse-header">
					<h1 className="jobs-title">Post a New Job</h1>
					<p className="jobs-subtitle">Create a detailed listing to attract the right candidates faster.</p>
				</header>

				<article className="job-card recruiter-form-card">
					<form className="auth-form" onSubmit={onSubmit}>
						<div className="auth-field auth-field-stacked">
							<label htmlFor="job-title">Job Title</label>
							<input
								id="job-title"
								value={form.title}
								onChange={onChange('title')}
								placeholder="e.g., Senior React Developer"
								minLength={5}
								required
							/>
						</div>
						<div className="auth-field auth-field-stacked">
							<label htmlFor="job-description">Job Description</label>
							<textarea
								id="job-description"
								className="jobs-filter-input recruiter-textarea"
								value={form.description}
								onChange={onChange('description')}
								placeholder="Describe responsibilities, qualifications, and expectations"
								minLength={20}
								required
							/>
						</div>
						<div className="recruiter-form-grid">
							<div className="auth-field auth-field-stacked">
								<label htmlFor="job-location">Location</label>
								<input
									id="job-location"
									value={form.location}
									onChange={onChange('location')}
									placeholder="e.g., Pune"
									required
								/>
							</div>
							<div className="auth-field auth-field-stacked">
								<label htmlFor="job-salary">Salary</label>
								<input
									id="job-salary"
									value={form.salary}
									onChange={onChange('salary')}
									placeholder="e.g., 8-12 LPA"
								/>
							</div>
						</div>
						<div className="recruiter-form-grid">
							<div className="auth-field auth-field-stacked">
								<label htmlFor="job-skills">Skills</label>
								<input
									id="job-skills"
									value={form.skills}
									onChange={onChange('skills')}
									placeholder="React, Node.js, MongoDB"
									required
								/>
							</div>
							<div className="auth-field auth-field-stacked">
								<label htmlFor="job-type">Job Type</label>
								<select id="job-type" value={form.jobType} onChange={onChange('jobType')}>
									<option value="Full-time">Full-time</option>
									<option value="Part-time">Part-time</option>
									<option value="Internship">Internship</option>
									<option value="Contract">Contract</option>
								</select>
							</div>
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

