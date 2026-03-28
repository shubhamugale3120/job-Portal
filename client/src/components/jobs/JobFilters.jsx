export function JobFilters({ query, updateQuery }) {
    const handleChange = (field) => (event) => {
        updateQuery({ [field]: event.target.value, page: '1' });
    };

    const clearFilters = () => {
        updateQuery({
            page: '1',
            search: '',
            location: '',
            skills: '',
            jobType: '',
            salaryMin: '',
            salaryMax: '',
        });
    };

    return (
        <div className="jobs-filters">
            <div className="jobs-filter-grid">
                <div className="jobs-filter-group">
                    <label htmlFor="filter-search">Job Title</label>
                    <input
                        id="filter-search"
                        className="jobs-filter-input"
                        type="text"
                        placeholder="e.g., React Developer"
                        value={query.search || ''}
                        onChange={handleChange('search')}
                    />
                </div>

                <div className="jobs-filter-group">
                    <label htmlFor="filter-location">Location</label>
                    <input
                        id="filter-location"
                        className="jobs-filter-input"
                        type="text"
                        placeholder="e.g., Mumbai"
                        value={query.location || ''}
                        onChange={handleChange('location')}
                    />
                </div>

                <div className="jobs-filter-group">
                    <label htmlFor="filter-jobtype">Job Type</label>
                    <select
                        id="filter-jobtype"
                        className="jobs-filter-select"
                        value={query.jobType || ''}
                        onChange={handleChange('jobType')}
                    >
                        <option value="">All Types</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                    </select>
                </div>

                <div className="jobs-filter-group">
                    <label htmlFor="filter-skills">Skills</label>
                    <input
                        id="filter-skills"
                        className="jobs-filter-input"
                        type="text"
                        placeholder="e.g., React, Node.js"
                        value={query.skills || ''}
                        onChange={handleChange('skills')}
                    />
                </div>

                <div className="jobs-filter-group">
                    <label htmlFor="filter-salary-min">Min Salary (LPA)</label>
                    <input
                        id="filter-salary-min"
                        className="jobs-filter-input"
                        type="number"
                        min="0"
                        placeholder="5"
                        value={query.salaryMin || ''}
                        onChange={handleChange('salaryMin')}
                    />
                </div>

                <div className="jobs-filter-group">
                    <label htmlFor="filter-salary-max">Max Salary (LPA)</label>
                    <input
                        id="filter-salary-max"
                        className="jobs-filter-input"
                        type="number"
                        min="0"
                        placeholder="15"
                        value={query.salaryMax || ''}
                        onChange={handleChange('salaryMax')}
                    />
                </div>
            </div>

            <div className="jobs-filter-actions">
                <button type="button" className="jobs-clear-btn" onClick={clearFilters}>
                    Clear Filters
                </button>
            </div>
        </div>
    );
}