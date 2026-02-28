export function JobFilters({ query, updateQuery }) {
    const handleChange = (field) => (event) => {
        updateQuery({ [field]: event.target.value, page: '1' });
    };

    return (
        <div className="jobs-filters">
            <input
                className="jobs-filter-input"
                type="text"
                placeholder="Search title"
                value={query.search || ''}
                onChange={handleChange('search')}
            />
            <input
                className="jobs-filter-input"
                type="text"
                placeholder="Location"
                value={query.location || ''}
                onChange={handleChange('location')}
            />
            <input
                className="jobs-filter-input"
                type="text"
                placeholder="Skills (React,Node.js)"
                value={query.skills || ''}
                onChange={handleChange('skills')}
            />
            <select className="jobs-filter-select" value={query.jobType || ''} onChange={handleChange('jobType')}>
                <option value="">All types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
            </select>
        </div>
    );
}